"""Render a local, self-contained editorial preview from reviewed Markdown drafts."""

import argparse
import base64
from functools import lru_cache
from hashlib import sha256
from html import escape
import json
from pathlib import Path
from string import Template
import subprocess
import sys
from tempfile import NamedTemporaryFile
import unicodedata
from urllib.parse import unquote, urlsplit

SKILL = Path(__file__).resolve().parents[1]
ROOT = SKILL.parents[2]
MEDIA = ROOT / "04-midias"
LANGUAGES = {"pt-BR": "Português", "en-US": "US English"}
MARKERS = {"🇧🇷 Português": "pt-BR", "🇺🇸 English": "en-US"}
NOTES = ("publication notes", "notas de publicacao", "notas internas", "registro de midias")
MEDIA_FORMATS = {
    ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
    ".webp": "image/webp", ".gif": "image/gif", ".svg": "image/svg+xml",
    ".avif": "image/avif", ".mp4": "video/mp4", ".webm": "video/webm",
    ".mov": "video/quicktime", ".mp3": "audio/mpeg", ".wav": "audio/wav",
}


def pandoc(source, input_format, output_format):
    return subprocess.run(
        ["pandoc", "--from", input_format, "--to", output_format, "--wrap=none"],
        input=source, capture_output=True, text=True, encoding="utf-8", check=True,
    ).stdout


def nodes(items):
    if isinstance(items, dict):
        yield items
        yield from nodes(items.get("c"))
    elif isinstance(items, list):
        for item in items:
            yield from nodes(item)


def plain(items):
    parts = []
    for node in nodes(items):
        if node["t"] in ("Str", "MetaString"):
            parts.append(node["c"])
        elif node["t"] == "Code":
            parts.append(node["c"][1])
        elif node["t"] in ("Space", "SoftBreak", "LineBreak"):
            parts.append(" ")
    return "".join(parts)


def normalized(value):
    return "".join(
        char for char in unicodedata.normalize("NFKD", value.casefold())
        if not unicodedata.combining(char)
    )


def split_draft(blocks, default_language):
    versions = {}
    media_tables = []
    language = default_language
    internal = False
    media_register = False

    for index, block in enumerate(blocks):
        kind = block["t"]
        content = block.get("c")
        label = plain(content).strip() if kind in ("Para", "Plain", "Header") else ""
        if label in MARKERS:
            language = MARKERS[label]
            internal = media_register = False
            continue
        if kind == "HorizontalRule" and index + 1 < len(blocks):
            following = blocks[index + 1]
            if following["t"] in ("Para", "Plain", "Header") and plain(following["c"]).strip() in MARKERS:
                continue
        if kind == "Header" and normalized(label).startswith(NOTES):
            internal = True
            media_register = normalized(label).startswith("registro de midias")
            continue
        if internal:
            if media_register and kind == "Table":
                media_tables.append(block)
            continue
        versions.setdefault(language, []).append(block)
    return versions, media_tables


@lru_cache(maxsize=None)
def data_uri(path, mime):
    return f"data:{mime};base64,{base64.b64encode(path.read_bytes()).decode('ascii')}"


def media_html(target, label, draft, warnings):
    url = urlsplit(target)
    path = (draft.parent / unquote(url.path)).resolve()
    mime = MEDIA_FORMATS.get(path.suffix.lower())
    label = escape(label or path.name)
    if url.scheme or url.netloc or not mime or not path.is_relative_to(MEDIA) or not path.is_file():
        warnings.add(f"{draft.name}: mídia indisponível no HTML ({target})")
        return f'<span class="missing-media">Mídia indisponível · {label}</span>'
    src = data_uri(path, mime)
    kind = mime.split("/")[0]
    if kind == "image":
        return f'<img src="{src}" alt="{label}">'
    return f'<{kind} controls preload="metadata" src="{src}" aria-label="{label}"></{kind}>'


def linkedin_attachments(tables, inline_targets, draft, warnings):
    attachments = []
    seen = set(inline_targets)
    for table in tables:
        for body in table["c"][4]:
            for _, cells in body[3]:
                label = plain(cells[1][-1]) if len(cells) >= 3 else ""
                usage = normalized(label)
                if any(word in usage for word in ("opcional", "optional", "alternativ")):
                    continue
                for node in nodes(cells[-1][-1]):
                    if node["t"] == "Link":
                        target = node["c"][-1][0]
                        if target not in seen:
                            seen.add(target)
                            attachments.append(media_html(target, label, draft, warnings))
    return "".join(attachments)


def render_channel(channel, draft, default_language, author, warnings):
    document = json.loads(pandoc(draft.read_text(encoding="utf-8-sig"), "markdown-raw_html-raw_tex-smart", "json"))
    metadata = document["meta"]
    versions, tables = split_draft(document["blocks"], default_language)
    if not versions:
        raise ValueError(f"Rascunho vazio: {draft}")
    preview_title = ""
    panels = []
    buttons = []
    byline = author or plain(metadata.get("author"))
    for index, (language, blocks) in enumerate(versions.items()):
        heading = ""
        if channel == "medium":
            title = plain(metadata.get("title"))
            if blocks[0]["t"] == "Header" and blocks[0]["c"][0] == 1:
                title = plain(blocks.pop(0)["c"][2])
            title = title or ("Artigo em revisão" if language == "pt-BR" else "Article draft")
            preview_title = preview_title or title
            subtitle = plain(metadata.get("subtitle"))
            if blocks and blocks[0]["t"] == "Para":
                inlines = blocks[0]["c"]
                if len(inlines) == 1 and inlines[0]["t"] == "Emph":
                    subtitle = plain(blocks.pop(0)["c"])
            heading = f'<h3 class="article-title">{escape(title)}</h3>'
            if subtitle:
                heading += f'<p class="subtitle">{escape(subtitle)}</p>'
        inline_targets = []
        for node in list(nodes(blocks)):
            if node["t"] == "Image":
                _, alt, (target, _) = node["c"]
                inline_targets.append(target)
                node.update(t="RawInline", c=["html", media_html(target, plain(alt), draft, warnings)])
            elif node["t"] == "Link":
                target = node["c"][-1][0]
                if urlsplit(target).scheme not in ("http", "https", "mailto") and not target.startswith("#"):
                    node.update(t="Span", c=node["c"][:2])
        article = pandoc(json.dumps({**document, "meta": {}, "blocks": blocks}), "json", "html5")
        attachments = linkedin_attachments(tables, inline_targets, draft, warnings) if channel == "linkedin" else ""
        hidden = "" if index == 0 else " hidden"
        pressed = "true" if index == 0 else "false"
        panel_id = f"{channel}-{language}"
        buttons.append(
            f'<button type="button" aria-pressed="{pressed}" aria-controls="{panel_id}">{LANGUAGES[language]}</button>'
        )
        profile = ""
        if channel == "linkedin":
            name = byline or ("Seu perfil" if language == "pt-BR" else "Your profile")
            profile = f'<div class="profile">{escape(name)}</div>'
        elif byline:
            profile = f'<div class="byline">{escape(byline)}</div>'
        panels.append(
            f'<article class="{channel}-panel" id="{panel_id}" lang="{language}"{hidden}>'
            f'{heading}{profile}<div class="copy">{article}</div>{attachments}</article>'
        )
    brand = "LinkedIn" if channel == "linkedin" else "Medium"
    controls = ""
    if len(buttons) > 1:
        controls = f'<div class="languages" role="group" aria-label="Idioma">{"".join(buttons)}</div>'
    return preview_title, (
        f'<section id="{channel}" class="channel"><h2>{brand}</h2>'
        f'{controls}{"".join(panels)}</section>'
    )


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--linkedin", type=Path)
    parser.add_argument("--medium", type=Path)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--title")
    parser.add_argument("--author")
    parser.add_argument("--language", choices=LANGUAGES, default="pt-BR", help="Idioma de Markdown sem marcadores.")
    args = parser.parse_args()
    if not args.linkedin and not args.medium:
        parser.error("Informe --linkedin, --medium ou ambos.")
    if args.output.suffix.lower() != ".html":
        parser.error("--output deve apontar para um arquivo .html.")

    title = args.title
    links, sections = [], []
    warnings = set()
    try:
        for channel, draft, label in (("linkedin", args.linkedin, "LinkedIn"), ("medium", args.medium, "Medium")):
            if draft:
                inferred_title, section = render_channel(channel, draft, args.language, args.author, warnings)
                title = title or inferred_title
                links.append(f'<a href="#{channel}">{label}</a>')
                sections.append(section)
        assets = SKILL / "assets"
        template = Template((assets / "preview.html").read_text(encoding="utf-8"))
        script = (assets / "languages.js").read_text(encoding="utf-8")
        script_hash = base64.b64encode(sha256(script.encode("utf-8")).digest()).decode("ascii")
        page = template.substitute(
            title=escape(title or "Prévia editorial"),
            navigation="".join(links),
            sections="".join(sections),
            language_script=script,
            script_hash=script_hash,
        )
        args.output.parent.mkdir(parents=True, exist_ok=True)
        with NamedTemporaryFile(mode="w", encoding="utf-8", dir=args.output.parent, delete=False) as temporary:
            temporary.write(page)
        Path(temporary.name).replace(args.output)
    except subprocess.CalledProcessError as error:
        parser.exit(1, error.stderr)
    except FileNotFoundError as error:
        parser.exit(1, "Pandoc não está instalado.\n" if error.filename == "pandoc" else f"{error}\n")
    except (OSError, ValueError) as error:
        parser.exit(1, f"{error}\n")
    for warning in sorted(warnings):
        print(f"Aviso: {warning}", file=sys.stderr)
    print(args.output)


if __name__ == "__main__":
    main()
