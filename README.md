# PostsAndContent

**Um workspace editorial para planejar, escrever, revisar e organizar conteúdo de Medium e LinkedIn com Codex e OpenCode.**

O repositório reúne instruções, skills, referências, rascunhos e mídias em um fluxo local. Codex e OpenCode compartilham o mesmo catálogo editorial e os mesmos arquivos; cada agente tem apenas a integração necessária para descobrir e usar esses recursos.

## O que este projeto oferece

- **Fluxo editorial com escolha de canal:** LinkedIn, Medium ou ambos, definidos antes da redação.
- **Skills reutilizáveis:** escrita online, LinkedIn, revisão, bilinguidade, rastreamento de mídia e workflows auxiliares.
- **Imagem editorial prioritária:** cada pedido de edição ou postagem começa o desenvolvimento de uma imagem original com GPT assim que o ângulo está definido.
- **Dashboard de revisão:** após concluir textos, idiomas e mídia, o fluxo gera e abre imediatamente o HTML com os detalhes completos de postagem.
- **Rastreabilidade:** fontes, afirmações pendentes e referências de mídia permanecem associadas aos rascunhos.
- **Aprovação humana:** publicar, agendar, fazer upload ou enviar conteúdo requer aprovação explícita.

O conteúdo editorial continua em `Posts e Conhecimento/`. O repositório também inclui um painel local auxiliar para criar pedidos pelo celular, processá-los no PC e revisar os arquivos antes de qualquer envio externo.

## Começar

### Requisitos

- Git.
- Codex ou OpenCode.
- Para o painel móvel: Python 3.10+, Tailscale no PC e no celular, e OpenCode autenticado no PC.
- Para prévias editoriais: Python 3.9+ e Pandoc.
- Para geração automática no OpenCode: versão 2.2.1+, conexão Codex e ferramenta experimental `generate_image` disponível.

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
4. Assim que o ângulo estiver definido, priorize uma imagem GPT original para cada edição/post e salve em `Posts e Conhecimento/04-midias/<slug>/`.
5. Finalize e salve os rascunhos de cada canal, registrando a mídia e os detalhes de postagem.
6. Com a edição completa, gere e abra imediatamente o dashboard HTML; no CLI ou quando não houver ação de abertura, retorne o caminho e informe que o arquivo não foi aberto.
7. Mova conteúdo para `04-publicados/` somente após a aprovação humana e a publicação efetiva.

Em versões antigas do OpenCode (como 1.19.5), `generate_image` não está disponível. Atualize para 2.2.1 ou mais recente e conecte a conta Codex; sem isso, o fluxo informa a limitação e não troca de provedor.

## Painel móvel via Tailscale

O painel em [`tools/editorial-dashboard/`](tools/editorial-dashboard/README.md)
aceita pedidos de edição ou documentação, mantém uma fila local em SQLite e
executa o worker OpenCode no PC. O celular acessa a página por um endereço HTTPS
privado do Tailscale Serve; instale e conecte o Tailscale também no celular.
O serviço escuta em localhost e valida sua identidade Tailscale. A aprovação no
painel não publica conteúdo nem faz commit ou push.

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
├── tools/editorial-dashboard/      # Painel móvel, fila local e worker OpenCode
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
