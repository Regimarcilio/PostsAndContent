---
description: Cria um conteudo editorial adaptado para LinkedIn, Medium ou ambos, sempre perguntando o canal antes de escrever.
---

Crie conteudo editorial a partir do pedido e dos materiais fornecidos em `$ARGUMENTS`.

Regras obrigatorias:

1. Antes de escrever, editar ou salvar qualquer conteudo, use a ferramenta de perguntas com esta pergunta exata: "Voce deseja criar para LinkedIn, Medium ou Ambos?"
2. Ofereca somente estas opcoes: `LinkedIn`, `Medium` e `Ambos`. Nao escolha um canal por inferencia e nao prossiga sem uma resposta explicita.
3. Leia `AGENTS.md`, `config.yml` e os materiais relevantes em `00-inbox/`, `02-conteudos/01-ideias/`, `03-referencias/`, `06-conhecimentos/` e `07-dados/` antes da redacao.
4. Carregue a skill local `editorial-channel-router` e, conforme a resposta, as skills de producao existentes:
   - `LinkedIn`: `linkedin-skill`.
   - `Medium`: `create-medium-post`.
   - `Ambos`: use as duas skills e produza duas adaptacoes nativas, nunca uma copia literal.
   - Em qualquer canal, carregue tambem `media-reference-tracking` quando houver
     imagens, videos, GIFs ou outros assets em `04-midias`.
5. Para LinkedIn, crie somente um rascunho no diretorio `02-conteudos/02-rascunhos/linkedin/`. Nao agende, publique, envie ou conecte contas.
6. Para Medium, crie somente um rascunho no diretorio `02-conteudos/02-rascunhos/medium/`. A etapa final prepara a adaptação de LinkedIn para a prévia.
7. Para `Ambos`, salve um arquivo em cada diretorio de rascunhos. O texto de LinkedIn deve ser curto, especifico e com hook; o texto de Medium deve ser um artigo de 800 a 1.200 palavras, salvo quando a skill indicar que o material precisa ser dividido.
8. Preserve a origem das afirmacoes. Nao invente fatos, numeros, fontes, depoimentos ou resultados. Marque `claims_to_verify` quando uma afirmacao exigir verificacao.
9. Nao mova nada para `02-conteudos/04-publicados/` e nao execute qualquer acao externa sem aprovacao explicita posterior.
10. Em cada pedido editorial, trate uma imagem original como entrega padrão. Assim que o ângulo e o conceito visual estiverem claros, priorize a geração com `01-skills/custom/publication-image-generation/SKILL.md` antes de finalizar os textos. No OpenCode, tente a ferramenta nativa `generate_image` com GPT Image 2 na mesma sessão; não simule uma chamada a outro agente nem troque de provedor. Se a ferramenta ou o modelo não estiver disponível, marque a imagem como pendente e informe a limitação.
11. Antes de concluir um draft com mídia, inclua a seção `Registro de mídias`
    com links relativos ao arquivo e confirme as referências com
    `.opencode/commands/listar-midias-sem-uso.md`.
12. Depois de revisar e salvar qualquer postagem ou edição, execute `01-skills/custom/editorial-preview/SKILL.md`. Para LinkedIn isolado, gere o dashboard com o post; para Medium ou Ambos, inclua também a adaptação e/ou artigo integral de cada canal. Abra o dashboard imediatamente pela ação de preview disponível no runtime. Se a imagem estiver pendente, mostre a pendência sem representá-la como asset existente.

Ao final, entregue sempre o link do dashboard HTML, os caminhos dos rascunhos criados, o canal escolhido e quaisquer afirmações ou imagens pendentes.
