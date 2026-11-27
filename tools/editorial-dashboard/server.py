#!/usr/bin/env python3
"""Private, single-machine request queue for the editorial workspace."""

from __future__ import annotations

import json
import mimetypes
import os
import re
import shutil
import sqlite3
import subprocess
import threading
import time
import uuid
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parents[2]
STATIC = Path(__file__).resolve().parent / "static"
STATE = Path(__file__).resolve().parent / ".state"
DB_PATH = STATE / "jobs.sqlite3"
HOST = "127.0.0.1"
PORT = int(os.environ.get("EDITORIAL_DASHBOARD_PORT", "8787"))
def resolve_allowed_user() -> str:
    configured = os.environ.get("EDITORIAL_ALLOWED_TAILSCALE_USER", "").strip().casefold()
    if configured:
        return configured
    try:
        result = subprocess.run(
            ["tailscale", "status", "--json"], capture_output=True, text=True,
            timeout=5, check=True,
        )
        status = json.loads(result.stdout)
        self_info = status.get("Self", {})
        user_id = str(self_info.get("UserID", ""))
        profiles = status.get("UserProfiles") or status.get("User") or {}
        profile = profiles.get(user_id, {}) if isinstance(profiles, dict) else {}
        login = profile.get("LoginName", "") if isinstance(profile, dict) else ""
        login = login or self_info.get("UserLogin", "") or self_info.get("LoginName", "")
        return str(login).strip().casefold()
    except (OSError, subprocess.SubprocessError, json.JSONDecodeError):
        return ""


ALLOWED_USER = resolve_allowed_user()
MAX_BODY = 32_000
MAX_RUN_SECONDS = int(os.environ.get("EDITORIAL_JOB_TIMEOUT_SECONDS", "2700"))
OPENCODE_MODEL = os.environ.get("EDITORIAL_OPENCODE_MODEL", "omniroute/Project-Free").strip()
worker_stop = threading.Event()

STATUSES = {
    "queued": "Na fila",
    "running": "Em produção",
    "awaiting_review": "Aguardando sua aprovação",
    "approved": "Aprovado para revisão final",
    "failed": "Falhou",
    "interrupted": "Interrompido",
}
TASK_TYPES = {"editorial", "documentation"}
CHANNELS = {"LinkedIn", "Medium", "Ambos"}
ARTIFACT_EXTENSIONS = {
    ".md", ".html", ".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg",
    ".json", ".yml", ".yaml", ".txt", ".pdf", ".css", ".js", ".py",
}


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def connect_db() -> sqlite3.Connection:
    STATE.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(DB_PATH, timeout=10)
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA busy_timeout = 10000")
    return db


def initialize_db() -> None:
    with connect_db() as db:
        db.execute("PRAGMA journal_mode = WAL")
        db.execute(
            """CREATE TABLE IF NOT EXISTS jobs (
                id TEXT PRIMARY KEY,
                request_key TEXT UNIQUE,
                task_type TEXT NOT NULL,
                title TEXT NOT NULL,
                channel TEXT NOT NULL DEFAULT '',
                details TEXT NOT NULL DEFAULT '',
                status TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                started_ns INTEGER,
                run_count INTEGER NOT NULL DEFAULT 0,
                revision_notes TEXT NOT NULL DEFAULT '[]',
                output TEXT NOT NULL DEFAULT '',
                error TEXT NOT NULL DEFAULT '',
                artifacts TEXT NOT NULL DEFAULT '[]'
            )"""
        )
        columns = {row[1] for row in db.execute("PRAGMA table_info(jobs)")}
        if "request_key" not in columns:
            db.execute("ALTER TABLE jobs ADD COLUMN request_key TEXT")
            db.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_jobs_request_key ON jobs(request_key)")
        # An interrupted run may have already generated assets; never retry it silently.
        db.execute(
            "UPDATE jobs SET status='interrupted', updated_at=? WHERE status='running'",
            (now_iso(),),
        )


def get_job(job_id: str) -> sqlite3.Row | None:
    with connect_db() as db:
        return db.execute("SELECT * FROM jobs WHERE id=?", (job_id,)).fetchone()


def serialize_job(row: sqlite3.Row) -> dict:
    item = dict(row)
    item["status_label"] = STATUSES.get(item["status"], item["status"])
    item["revision_notes"] = json.loads(item["revision_notes"])
    item["artifacts"] = json.loads(item["artifacts"])
    progress = progress_for(item)
    item["progress_phase"] = progress[0]
    item["progress_percent"] = progress[1]
    for index, artifact in enumerate(item["artifacts"]):
        artifact["url"] = f"/api/jobs/{item['id']}/files/{index}"
    return item


def progress_for(job: dict) -> tuple[int, int]:
    phases_count = 4 if job["task_type"] == "documentation" else 5
    status = job["status"]
    if status == "running":
        artifacts = changed_artifacts(int(job.get("started_ns") or 0))
        paths = [artifact["path"].casefold() for artifact in artifacts]
        if job["task_type"] == "documentation":
            phase = 2 if paths else 1
            return phase, 55 if paths else 25
        has_draft = any("/02-rascunhos/" in path for path in paths)
        has_preview = any("/work/previews/" in path and path.endswith(".html") for path in paths)
        if has_preview:
            return 3, 76
        if has_draft:
            return 2, 54
        return 1, 25
    if status == "queued":
        return 0, 6
    if status == "awaiting_review":
        return phases_count - 2, 82
    if status == "approved":
        return phases_count - 1, 100
    if status in {"failed", "interrupted"}:
        return 1, 25
    return 0, 0


def add_job(request_key: str, task_type: str, title: str, channel: str, details: str) -> str:
    job_id = uuid.uuid4().hex[:12]
    stamp = now_iso()
    with connect_db() as db:
        db.execute(
            """INSERT OR IGNORE INTO jobs (id, request_key, task_type, title,
               channel, details, status, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, 'queued', ?, ?)""",
            (job_id, request_key, task_type, title, channel, details, stamp, stamp),
        )
        row = db.execute("SELECT id FROM jobs WHERE request_key=?", (request_key,)).fetchone()
        return row["id"]


def update_job(job_id: str, **values) -> None:
    values["updated_at"] = now_iso()
    assignments = ", ".join(f"{key}=?" for key in values)
    with connect_db() as db:
        db.execute(
            f"UPDATE jobs SET {assignments} WHERE id=?",
            (*values.values(), job_id),
        )


def prompt_for(row: sqlite3.Row) -> str:
    notes = json.loads(row["revision_notes"])
    revision_text = "\n".join(
        f"- Revisão {i + 1}: {note}" for i, note in enumerate(notes)
    )
    if row["task_type"] == "documentation":
        workflow = """Trate isto como uma tarefa de documentação e manutenção do projeto.
Leia as instruções do repositório e do espaço editorial antes de editar. Gere ou
atualize a documentação padrão necessária e mantenha as adaptações do Codex e do
OpenCode coerentes com uma fonte canônica. Registre os fluxos e configurações
relevantes, sem copiar regras divergentes para vários lugares. Faça as mudanças
no working tree e termine listando os caminhos alterados, o motivo de cada mudança
e as verificações realmente executadas. Não faça commit, push, publicação,
agendamento nem envio externo."""
    else:
        workflow = f"""Trate isto como um novo pedido editorial para o canal {row['channel']}.
Leia AGENTS.md, config.yml e as skills editoriais aplicáveis. Siga o fluxo do
projeto para pesquisa, texto, imagem, registro de mídia e dashboard HTML. Crie
somente rascunhos locais. Não publique, agende, envie, faça commit nem push.
Para a imagem, invoque explicitamente a ferramenta nativa `generate_image` com
`openai/gpt-image-2`, conforme a skill e a configuração do projeto. Se a
ferramenta ou o modelo não estiver disponível, não substitua o provedor nem
simule um asset: registre a mensagem exata de erro, mantenha a imagem como
pendente e continue os demais materiais.
Todo texto publicável deve ser original: não copie nem parafraseie de perto fontes,
artigos, posts ou rascunhos de terceiros. Verifique fatos com fontes, escreva uma
síntese com estrutura e linguagem próprias e cite a origem junto às afirmações.
Use citações literais apenas quando forem indispensáveis, com aspas e atribuição.
Informe no final os caminhos de todos os rascunhos, da imagem (ou explique por que
ficou pendente) e do dashboard, além de qualquer revisão factual necessária."""
    revision_instruction = ""
    if notes:
        revision_instruction = (
            "O pedido já foi trabalhado. Revise os arquivos existentes e faça ajustes neles; "
            "não crie cópias desnecessárias. Feedback recebido:\n" + revision_text
        )
    elif int(row["run_count"] or 0) > 1:
        revision_instruction = (
            "Esta é uma nova tentativa após uma execução interrompida ou com erro. "
            "Inspecione os arquivos relacionados a este pedido antes de agir, preserve "
            "o trabalho válido, complete o que estiver faltando e atualize os arquivos "
            "existentes em vez de criar cópias."
        )
    return f"""Execute este pedido no repositório atual.

Tipo: {row['task_type']}
Pedido: {row['title']}
Canal: {row['channel'] or 'não aplicável'}
Detalhes fornecidos pelo usuário:
{row['details'] or '(nenhum detalhe adicional)'}

Instruções do fluxo:
{workflow}

{revision_instruction}
"""


def changed_artifacts(started_ns: int) -> list[dict]:
    ignored = {".git", "node_modules", ".state", "__pycache__"}
    artifacts = []
    for directory, subdirs, filenames in os.walk(ROOT):
        current = Path(directory)
        subdirs[:] = [name for name in subdirs if name not in ignored]
        if current == Path(__file__).resolve().parent:
            subdirs[:] = []
            continue
        for filename in filenames:
            path = current / filename
            if path.suffix.lower() not in ARTIFACT_EXTENSIONS:
                continue
            try:
                stat = path.stat()
                if stat.st_mtime_ns < started_ns or not path.is_file():
                    continue
                relative = path.relative_to(ROOT).as_posix()
                artifacts.append({
                    "path": relative,
                    "name": path.name,
                    "size": stat.st_size,
                    "kind": path.suffix.lower().lstrip("."),
                })
            except (OSError, ValueError):
                continue
    return sorted(artifacts, key=lambda item: item["path"].casefold())


def next_job() -> sqlite3.Row | None:
    with connect_db() as db:
        db.execute("BEGIN IMMEDIATE")
        row = db.execute(
            "SELECT * FROM jobs WHERE status='queued' ORDER BY created_at LIMIT 1"
        ).fetchone()
        if row:
            started_ns = time.time_ns()
            db.execute(
                "UPDATE jobs SET status='running', started_ns=?, run_count=run_count+1, updated_at=? WHERE id=?",
                (started_ns, now_iso(), row["id"]),
            )
            row = db.execute("SELECT * FROM jobs WHERE id=?", (row["id"],)).fetchone()
        db.commit()
        return row


def run_worker() -> None:
    while not worker_stop.is_set():
        row = next_job()
        if row is None:
            worker_stop.wait(2)
            continue
        if not shutil.which("opencode"):
            update_job(row["id"], status="failed", error="Não encontrei `opencode` no PATH deste serviço.")
            continue
        try:
            result = subprocess.run(
                ["opencode", "run", "--auto", "--model", OPENCODE_MODEL, prompt_for(row)],
                cwd=ROOT,
                capture_output=True,
                text=True,
                timeout=MAX_RUN_SECONDS,
                check=False,
            )
            output = (result.stdout + ("\n" + result.stderr if result.stderr else ""))[-100_000:]
            artifacts = changed_artifacts(row["started_ns"] or 0)
            if result.returncode == 0:
                update_job(
                    row["id"], status="awaiting_review", output=output,
                    error="", artifacts=json.dumps(artifacts, ensure_ascii=False),
                )
            else:
                tail = next((line.strip() for line in reversed(output.splitlines()) if line.strip()), "")
                tail = re.sub(r"\x1b\[[0-?]*[ -/]*[@-~]", "", tail)[-300:]
                update_job(
                    row["id"], status="failed", output=output,
                    error=f"OpenCode terminou com código {result.returncode}. {tail}".strip(),
                    artifacts=json.dumps(artifacts, ensure_ascii=False),
                )
        except subprocess.TimeoutExpired as exc:
            output = exc.stdout or ""
            if isinstance(output, bytes):
                output = output.decode("utf-8", errors="replace")
            update_job(row["id"], status="failed", output=output[-100_000:], error="Tempo limite de execução excedido.")
        except Exception as exc:  # Keep one failed task from killing the queue worker.
            update_job(row["id"], status="failed", error=f"{type(exc).__name__}: {exc}")


def identity_error(handler: BaseHTTPRequestHandler) -> tuple[int, str] | None:
    if not ALLOWED_USER:
        return 503, "Configure EDITORIAL_ALLOWED_TAILSCALE_USER antes de iniciar o painel."
    user = handler.headers.get("Tailscale-User-Login", "").strip().casefold()
    if not user:
        return 401, "Acesse o painel pelo endereço Tailscale Serve."
    if user != ALLOWED_USER:
        return 403, "Esta conta Tailscale não está autorizada para o painel."
    return None


class Handler(BaseHTTPRequestHandler):
    server_version = "EditorialDashboard/1.0"

    def log_message(self, fmt, *args):
        print(f"[{now_iso()}] {self.address_string()} {fmt % args}")

    def send_bytes(self, status: int, body: bytes, content_type: str) -> None:
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-src 'self'; object-src 'none'; base-uri 'none'")
        self.end_headers()
        self.wfile.write(body)

    def send_json(self, status: int, payload: dict) -> None:
        self.send_bytes(status, json.dumps(payload, ensure_ascii=False).encode(), "application/json; charset=utf-8")

    def read_json(self) -> dict:
        length = int(self.headers.get("Content-Length", "0"))
        if length <= 0 or length > MAX_BODY:
            raise ValueError("O corpo da solicitação está vazio ou é grande demais.")
        payload = json.loads(self.rfile.read(length))
        if not isinstance(payload, dict):
            raise ValueError("Envie um objeto JSON.")
        return payload

    def do_GET(self):
        path = unquote(urlparse(self.path).path)
        if path == "/favicon.ico":
            return self.send_bytes(204, b"", "image/x-icon")
        auth_error = identity_error(self)
        if auth_error:
            return self.send_json(auth_error[0], {"error": auth_error[1]})
        if path == "/" or path == "/index.html":
            return self.send_bytes(200, (STATIC / "index.html").read_bytes(), "text/html; charset=utf-8")
        if path == "/app.js":
            return self.send_bytes(200, (STATIC / "app.js").read_bytes(), "text/javascript; charset=utf-8")
        if path == "/api/jobs":
            with connect_db() as db:
                rows = db.execute("SELECT * FROM jobs ORDER BY created_at DESC LIMIT 100").fetchall()
            return self.send_json(200, {"jobs": [serialize_job(row) for row in rows]})
        if path.startswith("/api/jobs/") and "/files/" in path:
            return self.serve_artifact(path)
        if path.startswith("/api/jobs/"):
            job_id = path.rsplit("/", 1)[-1]
            row = get_job(job_id)
            return self.send_json(200, {"job": serialize_job(row)}) if row else self.send_json(404, {"error": "Pedido não encontrado."})
        return self.send_json(404, {"error": "Rota não encontrada."})

    def serve_artifact(self, path: str) -> None:
        parts = path.strip("/").split("/")
        try:
            job_id, index = parts[2], int(parts[4])
            row = get_job(job_id)
            artifacts = json.loads(row["artifacts"]) if row else []
            target = (ROOT / Path(artifacts[index]["path"])).resolve(strict=True)
            target.relative_to(ROOT)
        except (IndexError, ValueError, TypeError, OSError):
            return self.send_json(404, {"error": "Arquivo não encontrado para este pedido."})
        if not target.is_file():
            return self.send_json(404, {"error": "Arquivo não encontrado."})
        mime = mimetypes.guess_type(target.name)[0] or "application/octet-stream"
        body = target.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", mime)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Cache-Control", "no-store")
        if mime == "text/html":
            self.send_header("Content-Security-Policy", "sandbox allow-scripts; default-src 'none'; img-src data: blob:; media-src data: blob:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; font-src data:")
        else:
            self.send_header("Content-Security-Policy", "default-src 'none'; sandbox")
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        auth_error = identity_error(self)
        if auth_error:
            return self.send_json(auth_error[0], {"error": auth_error[1]})
        if self.headers.get("Content-Type", "").split(";", 1)[0].strip().casefold() != "application/json":
            return self.send_json(415, {"error": "Use application/json."})
        origin = self.headers.get("Origin", "")
        if origin and urlparse(origin).netloc.casefold() != self.headers.get("Host", "").casefold():
            return self.send_json(403, {"error": "Origem da solicitação não permitida."})
        path = unquote(urlparse(self.path).path)
        try:
            payload = self.read_json()
        except (ValueError, json.JSONDecodeError) as exc:
            return self.send_json(400, {"error": str(exc)})
        if path == "/api/jobs":
            return self.create_job(payload)
        if path.startswith("/api/jobs/") and path.endswith("/action"):
            return self.job_action(path.split("/")[3], payload)
        return self.send_json(404, {"error": "Rota não encontrada."})

    def create_job(self, payload: dict) -> None:
        task_type = str(payload.get("task_type", "")).strip()
        title = str(payload.get("title", "")).strip()
        channel = str(payload.get("channel", "")).strip()
        details = str(payload.get("details", "")).strip()
        if task_type not in TASK_TYPES:
            return self.send_json(400, {"error": "Escolha edição ou documentação."})
        if not title or len(title) > 240 or len(details) > 10_000:
            return self.send_json(400, {"error": "Informe um título (até 240 caracteres); detalhes têm limite de 10.000 caracteres."})
        if task_type == "editorial" and channel not in CHANNELS:
            return self.send_json(400, {"error": "Escolha LinkedIn, Medium ou Ambos."})
        if task_type == "documentation":
            channel = ""
        request_key = str(payload.get("request_key", "")).strip()
        if not request_key or len(request_key) > 80:
            return self.send_json(400, {"error": "Identificador do pedido inválido. Atualize a página e tente novamente."})
        job_id = add_job(request_key, task_type, title, channel, details)
        return self.send_json(201, {"job": serialize_job(get_job(job_id))})

    def job_action(self, job_id: str, payload: dict) -> None:
        row = get_job(job_id)
        if not row:
            return self.send_json(404, {"error": "Pedido não encontrado."})
        if row["status"] != "awaiting_review":
            if payload.get("action") == "retry" and row["status"] in {"failed", "interrupted"}:
                update_job(job_id, status="queued", error="", output="")
                return self.send_json(200, {"job": serialize_job(get_job(job_id))})
            return self.send_json(409, {"error": "Este pedido não permite essa ação agora."})
        action = payload.get("action")
        if action == "approve":
            update_job(job_id, status="approved")
        elif action == "request_changes":
            feedback = str(payload.get("feedback", "")).strip()
            if not feedback or len(feedback) > 10_000:
                return self.send_json(400, {"error": "Descreva os ajustes (até 10.000 caracteres)."})
            notes = json.loads(row["revision_notes"])
            notes.append(feedback)
            update_job(job_id, status="queued", revision_notes=json.dumps(notes, ensure_ascii=False), error="")
        else:
            return self.send_json(400, {"error": "Ação inválida."})
        return self.send_json(200, {"job": serialize_job(get_job(job_id))})

    def do_HEAD(self):
        self.send_response(405)
        self.end_headers()


def main() -> None:
    initialize_db()
    if not ALLOWED_USER:
        raise SystemExit(
            "Não consegui identificar a conta Tailscale deste PC. Configure "
            "EDITORIAL_ALLOWED_TAILSCALE_USER com o login da conta para autorizar o painel."
        )
    worker = threading.Thread(target=run_worker, name="editorial-worker", daemon=True)
    worker.start()
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    server.daemon_threads = True
    print(f"Painel local: http://{HOST}:{PORT} (acesse por Tailscale Serve)")
    print("A aprovação só muda o status do pedido; não publica nem envia conteúdo.")
    try:
        server.serve_forever(poll_interval=0.5)
    except KeyboardInterrupt:
        pass
    finally:
        worker_stop.set()
        server.server_close()


if __name__ == "__main__":
    main()
