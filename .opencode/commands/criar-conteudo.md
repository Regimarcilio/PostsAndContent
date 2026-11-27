---
description: Cria rascunhos editoriais no projeto PostsAndContent usando as regras compartilhadas.
---

Leia e siga o comando canônico `Posts e Conhecimento/.opencode/commands/criar-conteudo.md`.

Trate todos os caminhos relativos definidos pelo comando como relativos a
`Posts e Conhecimento/`. Leia também o `AGENTS.md` e `config.yml` desse diretório.
Antes de escrever ou salvar, pergunte exatamente: "Voce deseja criar para LinkedIn,
Medium ou Ambos?" e aceite somente essas três opções.

Em cada pedido editorial, priorize uma imagem GPT original assim que o ângulo e o
conceito visual estiverem definidos, antes de finalizar os textos dos canais. O
OpenCode deve tentar a ferramenta nativa `generate_image`, configurada para GPT Image
2 e autenticada pela conexão Codex do usuário. Salve o asset em `04-midias/<slug>/`
e registre-o no rascunho. Depois de conceber a edição completa, gere o dashboard HTML
pela skill `editorial-preview` e abra-o imediatamente na visualização de navegador do
OpenCode Desktop quando disponível. Retorne o dashboard e os caminhos dos rascunhos.
Se a ferramenta ou o modelo não estiver disponível, marque a imagem como pendente,
informe o bloqueio e não use API key, outro provedor ou placeholder como substituto.
Não publique, agende nem envie conteúdo.
