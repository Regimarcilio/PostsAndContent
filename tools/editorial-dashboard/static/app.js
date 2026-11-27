const form = document.querySelector("#requestForm");
const taskType = document.querySelector("#taskType");
const titleInput = document.querySelector("#title");
const detailsInput = document.querySelector("#details");
const jobsNode = document.querySelector("#jobs");
const detailNode = document.querySelector("#detail");
const noticeNode = document.querySelector("#formNotice");
let selectedId = "";
let jobs = [];
let requestKey = crypto.randomUUID();
const jobCards = new Map();
let detailKey = "";
let detailProgressKey = "";

const typeNames = { editorial: "Edição", documentation: "Documentação" };

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function setText(node, value) {
  if (node.textContent !== value) node.textContent = value;
}

function dateLabel(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? value : date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

async function api(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    cache: "no-store",
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `Falha ao acessar o serviço (${response.status}).`);
  return payload;
}

function updateFormMode() {
  const documentation = taskType.value === "documentation";
  document.querySelector("#channelField").classList.toggle("hidden", documentation);
  document.querySelector("#titleLabel").textContent = documentation ? "O que precisa ser documentado ou atualizado?" : "Assunto da publicação";
  document.querySelector("#detailsLabel").textContent = documentation ? "Padrões, agentes e arquivos envolvidos" : "Referências e orientações";
  titleInput.placeholder = documentation
    ? "Ex.: documentar o fluxo de revisão e atualizar as instruções dos agentes"
    : "Ex.: agentes de IA no desenvolvimento de software";
  detailsInput.placeholder = documentation
    ? "Descreva os documentos esperados e quais adaptações do Codex/OpenCode devem ser sincronizadas."
    : "Inclua fontes, público, objetivo, pontos que quer abordar ou arquivos já existentes.";
}

function renderJobs() {
  if (!jobs.length) {
    if (!jobsNode.querySelector(".empty")) {
      jobsNode.replaceChildren(el("div", "empty", "Ainda não há pedidos. Envie o primeiro acima."));
    }
    jobCards.clear();
    detailKey = "";
    detailProgressKey = "";
    detailNode.classList.add("hidden");
    return;
  }
  jobsNode.querySelector(".empty")?.remove();
  const visibleIds = new Set(jobs.map((job) => job.id));
  for (const [id, card] of jobCards) {
    if (!visibleIds.has(id)) {
      card.remove();
      jobCards.delete(id);
    }
  }

  for (const job of jobs) {
    let button = jobCards.get(job.id);
    if (!button) {
      button = el("button", "job-card");
      button.type = "button";
      const title = el("span", "job-title");
      const titleText = el("span", "");
      const badge = el("span", "badge");
      title.append(titleText, badge);
      const meta = el("span", "job-meta");
      const type = el("span", "");
      const channel = el("span", "");
      const updated = el("span", "");
      meta.append(type, channel, updated);
      button.append(title, meta);
      button._jobCardParts = { titleText, badge, type, channel, updated };
      button.addEventListener("click", () => {
        selectedId = job.id;
        renderJobs();
      });
      jobCards.set(job.id, button);
      jobsNode.append(button);
    }
    const parts = button._jobCardParts;
    setText(parts.titleText, job.title);
    const badgeClass = `badge ${job.status}`;
    if (parts.badge.className !== badgeClass) parts.badge.className = badgeClass;
    setText(parts.badge, job.status_label);
    setText(parts.type, typeNames[job.task_type] || job.task_type);
    setText(parts.channel, job.channel ? `· ${job.channel}` : "");
    setText(parts.updated, `· ${dateLabel(job.updated_at)}`);
    button.classList.toggle("selected", job.id === selectedId || (!selectedId && job.id === jobs[0].id));
  }
  const selected = jobs.find((job) => job.id === selectedId) || jobs[0];
  selectedId = selected.id;
  const nextDetailKey = JSON.stringify([
    selected.id, selected.status, selected.status_label, selected.details,
    selected.error, selected.artifacts, selected.output,
  ]);
  const nextProgressKey = JSON.stringify([
    selected.progress_phase, selected.progress_percent, selected.status,
  ]);
  if (nextDetailKey !== detailKey) {
    renderDetail(selected);
    detailKey = nextDetailKey;
    detailProgressKey = nextProgressKey;
  } else if (nextProgressKey !== detailProgressKey) {
    detailNode.querySelector(".phase-progress")?.replaceWith(renderProgress(selected));
    detailProgressKey = nextProgressKey;
  }
}

function renderArtifact(job, artifact, index) {
  const card = el("div", "artifact");
  const url = `/api/jobs/${job.id}/files/${index}`;
  card.append(el("div", "artifact-title", artifact.name));
  card.append(el("div", "artifact-path", artifact.path));
  if (["png", "jpg", "jpeg", "webp", "gif", "svg"].includes(artifact.kind)) {
    const image = document.createElement("img");
    image.src = url;
    image.alt = artifact.name;
    image.loading = "lazy";
    card.append(image);
  } else if (artifact.kind === "html") {
    const frame = document.createElement("iframe");
    frame.src = url;
    frame.title = `Prévia: ${artifact.name}`;
    frame.setAttribute("sandbox", "allow-scripts");
    card.append(frame);
  }
  const link = el("a", "", "Abrir arquivo");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  card.append(link);
  return card;
}

function renderProgress(job) {
  const phases = job.task_type === "documentation"
    ? ["Pedido recebido", "Documentação", "Revisão", "Aprovação"]
    : ["Pedido recebido", "Pesquisa e texto", "Imagem e materiais", "Revisão", "Aprovação"];
  const phaseByStatus = {
    queued: 0,
    running: 1,
    awaiting_review: phases.length - 2,
    approved: phases.length - 1,
    failed: 1,
    interrupted: 1,
  };
  const current = job.progress_phase ?? phaseByStatus[job.status] ?? 0;
  const failed = job.status === "failed" || job.status === "interrupted";
  const percent = job.progress_percent ?? (job.status === "approved" ? 100
    : job.status === "awaiting_review" ? 82
      : job.status === "running" ? 32
        : job.status === "queued" ? 6
          : Math.round((current / (phases.length - 1)) * 100));
  const section = el("section", "phase-progress");
  section.setAttribute("aria-label", "Progresso por fase");
  section.append(el("div", "phase-heading", "Progresso por fase"));
  const track = el("div", "progress-track");
  track.setAttribute("role", "progressbar");
  track.setAttribute("aria-label", "Progresso do pedido");
  track.setAttribute("aria-valuemin", "0");
  track.setAttribute("aria-valuemax", "100");
  track.setAttribute("aria-valuenow", String(percent));
  const fill = el("span", `progress-fill${failed ? " failed" : ""}`);
  fill.style.width = `${percent}%`;
  track.append(fill);
  section.append(track);
  const list = el("ol", "phase-list");
  list.style.gridTemplateColumns = `repeat(${phases.length}, minmax(0, 1fr))`;
  phases.forEach((phase, index) => {
    const state = failed && index === current ? "failed"
      : index < current || job.status === "approved" ? "done"
        : index === current ? "current" : "upcoming";
    const item = el("li", `phase-step ${state}`);
    item.append(el("span", "phase-dot", state === "done" ? "✓" : state === "failed" ? "!" : String(index + 1)));
    item.append(el("span", "phase-name", phase));
    list.append(item);
  });
  section.append(list);
  const descriptions = {
    queued: "O pedido está aguardando o computador.",
    running: "O worker está produzindo os materiais. Esta fase inclui texto e imagem.",
    awaiting_review: "Materiais prontos para revisão; a imagem foi gerada ou marcada como pendente.",
    approved: "Revisão aprovada no painel.",
    failed: "A execução parou nesta fase. Veja o erro e tente novamente quando estiver pronto.",
    interrupted: "A execução foi interrompida nesta fase.",
  };
  section.append(el("p", "phase-caption", descriptions[job.status] || ""));
  return section;
}

function renderDetail(job) {
  if (!job) return detailNode.classList.add("hidden");
  detailNode.classList.remove("hidden");
  detailNode.replaceChildren();
  detailNode.append(el("h3", "", job.title));
  detailNode.append(el("div", "job-meta", `${typeNames[job.task_type] || job.task_type}${job.channel ? ` · ${job.channel}` : ""} · ${job.status_label}`));
  detailNode.append(renderProgress(job));
  if (job.details) detailNode.append(el("p", "", job.details));
  if (job.error) detailNode.append(el("p", "notice error", job.error));

  if (job.status === "awaiting_review") {
    const actions = el("div", "detail-actions");
    const approve = el("button", "primary", "Aprovar entrega");
    approve.type = "button";
    approve.addEventListener("click", () => sendAction(job.id, { action: "approve" }));
    const revise = el("button", "secondary", "Pedir ajustes");
    revise.type = "button";
    revise.addEventListener("click", () => {
      document.querySelector("#revisionBox")?.classList.toggle("hidden");
    });
    actions.append(approve, revise);
    detailNode.append(actions);
    const revision = el("div", "field hidden");
    revision.id = "revisionBox";
    const label = el("label", "", "Quais ajustes você quer?");
    const textarea = el("textarea");
    textarea.maxLength = 10_000;
    textarea.id = "revisionText";
    const send = el("button", "secondary", "Enviar ajustes e continuar");
    send.type = "button";
    send.addEventListener("click", () => sendAction(job.id, { action: "request_changes", feedback: textarea.value }));
    revision.append(label, textarea, send);
    detailNode.append(revision);
    detailNode.append(el("div", "approval-note", "A aprovação registra sua revisão. Não publica, envia, faz commit ou push."));
  } else if (job.status === "failed" || job.status === "interrupted") {
    const retry = el("button", "secondary", "Tentar novamente");
    retry.type = "button";
    retry.addEventListener("click", () => {
      if (window.confirm("A tentativa pode ter produzido arquivos ou consumido créditos antes de falhar. Quer reenfileirar o pedido?")) {
        sendAction(job.id, { action: "retry" });
      }
    });
    detailNode.append(retry, el("div", "approval-note", "O retry usa o pedido original e o modelo configurado no worker."));
  } else if (job.status === "approved") {
    detailNode.append(el("div", "approval-note", "Aprovado no painel. Publicação, agendamento e envio continuam separados."));
  } else if (job.status === "running" || job.status === "queued") {
    detailNode.append(el("div", "approval-note", "A fila atualiza automaticamente enquanto o PC trabalha."));
  }

  if (job.artifacts.length) {
    detailNode.append(el("h3", "", "Arquivos desta tarefa"));
    const list = el("div", "artifact-list");
    job.artifacts.forEach((artifact, index) => list.append(renderArtifact(job, artifact, index)));
    detailNode.append(list);
  } else if (job.status === "awaiting_review") {
    detailNode.append(el("p", "approval-note", "OpenCode terminou, mas não detectei arquivos novos ou alterados nesta execução. Confira o resumo abaixo."));
  }

  if (job.output) {
    const disclosure = document.createElement("details");
    const summary = el("summary", "", "Resumo da execução do OpenCode");
    const output = el("pre", "output", job.output);
    disclosure.append(summary, output);
    detailNode.append(disclosure);
  }
}

async function refresh() {
  const feedbackDraft = document.querySelector("#revisionText")?.value;
  const revisionBoxOpen = document.querySelector("#revisionBox") && !document.querySelector("#revisionBox").classList.contains("hidden");
  try {
    const payload = await api("/api/jobs");
    jobs = payload.jobs;
    renderJobs();
    const textarea = document.querySelector("#revisionText");
    const revisionBox = document.querySelector("#revisionBox");
    if (textarea && feedbackDraft !== undefined) textarea.value = feedbackDraft;
    if (revisionBox && revisionBoxOpen) revisionBox.classList.remove("hidden");
  } catch (error) {
    jobsNode.replaceChildren(el("div", "empty", error.message));
  }
}

async function sendAction(id, body) {
  try {
    await api(`/api/jobs/${id}/action`, { method: "POST", body: JSON.stringify(body) });
    await refresh();
  } catch (error) {
    window.alert(error.message);
  }
}

taskType.addEventListener("change", updateFormMode);
document.querySelector("#refreshButton").addEventListener("click", refresh);
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  noticeNode.className = "notice";
  noticeNode.textContent = "Adicionando à fila…";
  const payload = {
    task_type: taskType.value,
    request_key: requestKey,
    title: titleInput.value.trim(),
    channel: document.querySelector("input[name=channel]:checked")?.value || "",
    details: detailsInput.value.trim(),
  };
  try {
    const result = await api("/api/jobs", { method: "POST", body: JSON.stringify(payload) });
    selectedId = result.job.id;
    requestKey = crypto.randomUUID();
    form.reset();
    taskType.value = "editorial";
    updateFormMode();
    noticeNode.textContent = "Pedido recebido. O PC vai iniciar o processamento.";
    await refresh();
  } catch (error) {
    noticeNode.className = "notice error";
    noticeNode.textContent = error.message;
  }
});

updateFormMode();
refresh();
window.setInterval(refresh, 5000);
