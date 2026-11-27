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

## Painel móvel e fila local

O painel compartilhado fica em `../tools/editorial-dashboard/` e é descrito no
`README.md` da própria ferramenta. Codex e OpenCode herdam suas regras pela
instrução de entrada `AGENTS.md`; o painel usa OpenCode como worker para pedidos
de edição ou documentação. A fila SQLite e os pedidos ficam no PC. A página só
é servida pela rede privada do Tailscale e registra arquivos para aprovação;
aprovar não publica, não envia e não faz commit/push.

## Imagem e prévia automáticas

O adaptador raiz configura `experimental.image_generate.model` como
`openai/gpt-image-2`. Em cada pedido editorial, a imagem é prioridade assim que
o ângulo e o conceito visual estiverem definidos. No OpenCode 2.2.1 ou superior,
conecte a conta Codex em `/connect`; o comando `/criar-conteudo` tenta chamar
`generate_image`, salva a arte em `Posts e Conhecimento/04-midias/<slug>/` e
registra o caminho nos rascunhos. Depois de completar a edição, gera e abre
imediatamente o dashboard HTML com textos, idiomas e mídias. No OpenCode Desktop,
a skill abre o arquivo na visualização do workspace. No CLI, retorna o caminho
local clicável.

A geração de imagem é experimental e depende do runtime/modelo estar disponível.
Se `generate_image` não aparecer ou a autenticação Codex não fornecer GPT Image 2,
marque a imagem como pendente, informe o bloqueio e não use chave de API, outro
provedor ou placeholder. OpenCode 1.x, incluindo 1.19.5, não oferece essa
integração; atualize para 2.2.1+ antes de esperar o fluxo totalmente automático.
Gerar arquivos locais não aprova publicação, upload ou agendamento.

## Limites externos

O fluxo multiplataforma cria rascunhos e prévias locais. Upload, publicação,
agendamento, envio de arquivos a CDN ou qualquer outra ação externa exigem aprovação
explícita do usuário imediatamente antes da ação. A presença de scripts operacionais
nas coleções importadas não equivale a autorização.
