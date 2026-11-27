# Protótipo Claude — geração de rascunho editorial (OPÇÃO 1)

Isolado em `tools/claude-proto/`. Não altera skills, dashboard ou fluxos existentes. Fluxo: brief → Claude (Anthropic API) → GPT Image 2 via runtime OpenCode/Codex → artefatos em `Posts e Conhecimento/04-midias/<slug>/` + rascunho com `Registro de mídias`.

## Pré-requisitos

- Node.js 20+
- Rede para `npm install` (somente modo com API)
- `opencode` no `PATH` com modelo `openai/gpt-image-2` configurado (somente geração real de imagem)
- ComfyUI **não** é instalado nem usado neste protótipo (fallback planejado)

## Instalação

```bash
cd /home/project/PROJETOS/social-content-hub/PostsAndContent/tools/claude-proto
npm install
```

## Variáveis de ambiente

Copie `.env.example` para `.env` (nunca commite `.env`):

- `ANTHROPIC_API_KEY` — obrigatório somente para chamada real; ausente ou `--dry-run` gera `.prompt.txt` + draft marcado `PENDENTE API`, sem falhar
- `ANTHROPIC_MODEL` — padrão `claude-opus-5-5`

## Uso

```bash
node generate-draft.mjs --brief "Benefícios práticos de filas de trabalho assíncronas" --slug proto-claude-001 --canal ambos --dry-run
node generate-draft.mjs --brief "..." --slug meu-post --canal linkedin|medium|ambos
```

Saídas:

- `Posts e Conhecimento/04-midias/<slug>/<slug>.prompt.txt`
- `Posts e Conhecimento/04-midias/<slug>/status.json`
- `Posts e Conhecimento/02-conteudos/02-rascunhos/<canal>/<slug>.md` com seção `Registro de mídias`

Status da imagem: `ok` somente se um PNG real for gerado; caso contrário `pendente` + motivo. O protótipo nunca inventa PNG nem placeholder falso.
