# PostsAndContent

Repositório editorial para criar, revisar e organizar conteúdo de Medium e
LinkedIn. O conteúdo e as regras canônicas ficam em [`Posts e Conhecimento/`](Posts%20e%20Conhecimento/README.md).

## Codex e OpenCode

Abra a raiz deste repositório nos dois agentes. Codex descobre as skills locais
em `.agents/skills/`; os arquivos nessa pasta encaminham para as skills
canônicas em `Posts e Conhecimento/01-skills/`. OpenCode usa
`.opencode/opencode.json` na raiz e aponta para as mesmas instruções, skills e
comandos. Nenhuma cópia do perfil editorial ou dos rascunhos é necessária.

Antes de criar conteúdo, leia `Posts e Conhecimento/AGENTS.md` e
`Posts e Conhecimento/config.yml`. O fluxo pergunta se o destino é LinkedIn,
Medium ou ambos, cria rascunhos e prepara uma prévia. Publicação e agendamento
continuam sujeitos à aprovação explícita.

Quando uma publicação precisar de imagem, Codex é responsável por gerá-la com
a ferramenta de imagem GPT disponível no seu runtime. O arquivo fica em
`Posts e Conhecimento/04-midias/<slug>/` e é ligado ao rascunho pelo registro de
mídias. O OpenCode pode revisar e usar o asset, mas não gera uma alternativa.

As coleções em `01-skills/` são componentes importados. Consulte as licenças e
atribuições de cada coleção antes de redistribuí-las.
Veja [`THIRD-PARTY-NOTICES.md`](THIRD-PARTY-NOTICES.md) para a origem dos conjuntos
incluídos e os limites de licença conhecidos.
