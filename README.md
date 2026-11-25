# PostsAndContent

**Um workspace editorial para planejar, escrever, revisar e organizar conteúdo de Medium e LinkedIn com Codex e OpenCode.**

O repositório reúne instruções, skills, referências, rascunhos e mídias em um fluxo local. Codex e OpenCode compartilham o mesmo catálogo editorial e os mesmos arquivos; cada agente tem apenas a integração necessária para descobrir e usar esses recursos.

## O que este projeto oferece

- **Fluxo editorial com escolha de canal:** LinkedIn, Medium ou ambos, definidos antes da redação.
- **Skills reutilizáveis:** escrita online, LinkedIn, revisão, bilinguidade, rastreamento de mídia e workflows auxiliares.
- **Imagem editorial com GPT:** Codex gera as imagens originais de publicação e as salva junto aos assets do projeto. OpenCode pode revisá-las e referenciá-las.
- **Prévia para revisão:** geração de HTML com as versões completas de LinkedIn e Medium e seus recursos visuais.
- **Rastreabilidade:** fontes, afirmações pendentes e referências de mídia permanecem associadas aos rascunhos.
- **Aprovação humana:** publicar, agendar, fazer upload ou enviar conteúdo requer aprovação explícita.

Este é um repositório de conteúdo e instruções para agentes, não um aplicativo com servidor ou banco de dados.

## Começar

### Requisitos

- Git.
- Codex ou OpenCode.
- Para prévias editoriais: Python 3.9+ e Pandoc.
- Para geração de imagens: ferramenta GPT de geração de imagem disponível no runtime Codex.

Clone o repositório e abra a **raiz `PostsAndContent`** no agente:

```bash
gh repo clone Regimarcilio/PostsAndContent
cd PostsAndContent
```

Codex descobre as skills locais em `.agents/skills/`. Inicie uma nova sessão na raiz após clonar ou atualizar o repositório. Os launchers encaminham para os arquivos canônicos em `Posts e Conhecimento/01-skills/`; não é necessário duplicar as skills nem o perfil editorial.

OpenCode usa `.opencode/opencode.json` na raiz. Para começar uma criação no OpenCode, use `/criar-conteudo`. Para auditar referências de mídia, use `/listar-midias-sem-uso`.

Antes de produzir conteúdo, consulte [`AGENTS.md`](AGENTS.md), [`Posts e Conhecimento/AGENTS.md`](Posts%20e%20Conhecimento/AGENTS.md) e [`config.yml`](Posts%20e%20Conhecimento/config.yml).

## Fluxo editorial

1. Coloque fontes em `Posts e Conhecimento/00-inbox/` e ideias em `Posts e Conhecimento/02-conteudos/01-ideias/`.
2. Escolha `LinkedIn`, `Medium` ou `Ambos` quando o agente perguntar.
3. Consulte as fontes e skills relevantes; preserve a origem das afirmações.
4. Salve cada rascunho no diretório do canal em `Posts e Conhecimento/02-conteudos/02-rascunhos/`.
5. Quando o conteúdo precisar de uma imagem original, peça ao Codex para gerá-la com a ferramenta GPT e salvá-la em `Posts e Conhecimento/04-midias/<slug>/`.
6. Revise texto, fatos, links, direitos e mídias. Gere a prévia HTML quando houver artigo.
7. Mova conteúdo para `04-publicados/` somente após a aprovação humana e a publicação efetiva.

OpenCode pode criar e revisar os rascunhos, mas não gera uma imagem alternativa. Se a ferramenta de imagem GPT não estiver disponível no Codex, o fluxo informa a limitação e não troca de provedor.

## Integração dos agentes

| Agente | Integração | Uso |
|---|---|---|
| Codex | `AGENTS.md` e `.agents/skills/` na raiz | Descobre as skills e segue as instruções editoriais compartilhadas. |
| OpenCode | `.opencode/opencode.json` e `.opencode/commands/` na raiz | Carrega as mesmas fontes e oferece comandos para criação e auditoria de mídia. |

Os arquivos canônicos continuam em `Posts e Conhecimento/`. Os launchers do Codex só fazem a ponte para as skills existentes, preservando seus scripts, referências e assets. Consulte [`Posts e Conhecimento/MULTIPLATFORM-SETUP.md`](Posts%20e%20Conhecimento/MULTIPLATFORM-SETUP.md) para os detalhes de integração.

## Estrutura

```text
.
├── .agents/skills/                 # Launchers de skills descobertos pelo Codex
├── .opencode/                      # Configuração e comandos do OpenCode
├── Posts e Conhecimento/
│   ├── .online-writing/            # Perfil editorial do autor
│   ├── .opencode/                  # Fontes dos comandos e roteador editorial
│   ├── 00-inbox/                   # Materiais ainda não triados
│   ├── 01-skills/                  # Skills canônicas e componentes importados
│   ├── 02-conteudos/               # Ideias, rascunhos, revisão e publicados
│   ├── 03-referencias/             # Fontes e notas de apoio
│   ├── 04-midias/                  # Imagens, vídeos e outros assets
│   ├── 05-arquivo/                 # Materiais arquivados e ZIPs de origem
│   ├── 06-conhecimentos/           # Conhecimento reutilizável
│   ├── 07-dados/                   # Dados, métricas e importações
│   ├── work/                       # Artefatos operacionais e prévias
│   ├── AGENTS.md                   # Regras editoriais
│   ├── config.yml                  # Catálogo de skills, dados e fluxos
│   └── MULTIPLATFORM-SETUP.md      # Detalhes de Codex + OpenCode
└── THIRD-PARTY-NOTICES.md          # Origem e licenças dos componentes
```

## Conteúdo e licenças

As coleções de skills importadas permanecem em `Posts e Conhecimento/01-skills/` e conservam seus arquivos de origem. Consulte [`THIRD-PARTY-NOTICES.md`](THIRD-PARTY-NOTICES.md) e as licenças incluídas antes de modificar ou redistribuir qualquer componente. O repositório não declara uma licença agregada para todo o conteúdo, as skills e as mídias.

## Versão

A primeira versão multiplataforma está disponível como **v0.1.0**. Consulte as [notas da versão](https://github.com/Regimarcilio/PostsAndContent/releases/tag/v0.1.0).
