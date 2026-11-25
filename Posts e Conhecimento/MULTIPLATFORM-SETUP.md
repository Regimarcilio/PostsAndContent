# Integração Codex + OpenCode

## Raiz de trabalho

Abra a raiz do repositório `PostsAndContent` nos dois agentes. O conteúdo editorial
continua em `Posts e Conhecimento/`; seus caminhos e referências relativas não foram
movidos.

- Codex lê as regras de entrada em `AGENTS.md` na raiz do repositório e descobre
  skills em `.agents/skills/`.
- OpenCode lê `.opencode/opencode.json` na raiz, que carrega estas instruções e aponta para
  as skills e comandos canônicos em `Posts e Conhecimento/`.
- Os launchers do Codex contêm somente metadados e o caminho da skill original. Scripts,
  referências e assets continuam sendo lidos no diretório canônico.
- As skills importadas continuam somente leitura; atualize-as apenas quando a tarefa
  for explicitamente atualizar uma dependência.

## Descoberta pelo Codex

As skills do projeto estão em `.agents/skills/` na raiz do repositório. Depois de clonar
ou atualizar o projeto, abra uma nova sessão Codex na raiz para carregar as skills.
Os launchers cobrem as skills editoriais, a skill de LinkedIn, as skills auxiliares e
os workflows gerais incluídos pelas coleções de origem. A skill
`ndd-pulse-repository-router` não é exposta: ela aponta para um caminho de Windows e
trata de outro repositório.

## Uso pelo OpenCode

O adaptador de raiz aponta para `Posts e Conhecimento/.opencode/skills` e
`Posts e Conhecimento/01-skills`. Os comandos de raiz encaminham para os comandos
canônicos. Se OpenCode for iniciado diretamente dentro de `Posts e Conhecimento/`,
o adaptador local existente continua válido.

## Imagens

Codex é o agente responsável por criar imagens originais quando uma publicação precisa
de um asset novo. Use `publication-image-generation` e o gerador GPT disponível no
runtime Codex. Salve o candidato em `Posts e Conhecimento/04-midias/<slug>/`, registre
o caminho relativo no rascunho e revise a imagem antes de entregá-la.

OpenCode pode revisar e referenciar o arquivo compartilhado, mas não deve gerar uma
alternativa nem compor um novo asset. Ao usar a skill de LinkedIn, use seus passos de
texto, verificações e preview; encaminhe a criação de imagens estáticas ao Codex. Se a ferramenta de imagem GPT não estiver disponível no ambiente Codex,
informe a limitação; não troque de provedor, não use uma API key e não crie placeholder.
Gerar um arquivo local não aprova publicação, upload ou agendamento.

## Limites externos

O fluxo multiplataforma cria rascunhos e prévias locais. Upload, publicação,
agendamento, envio de arquivos a CDN ou qualquer outra ação externa exigem aprovação
explícita do usuário imediatamente antes da ação. A presença de scripts operacionais
nas coleções importadas não equivale a autorização.
