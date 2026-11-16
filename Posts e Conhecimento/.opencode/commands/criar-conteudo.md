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
5. Para LinkedIn, crie somente um rascunho no diretorio `02-conteudos/02-rascunhos/linkedin/`. Nao agende, publique, envie ou conecte contas.
6. Para Medium, crie somente um rascunho no diretorio `02-conteudos/02-rascunhos/medium/`.
7. Para `Ambos`, salve um arquivo em cada diretorio de rascunhos. O texto de LinkedIn deve ser curto, especifico e com hook; o texto de Medium deve ser um artigo de 800 a 1.200 palavras, salvo quando a skill indicar que o material precisa ser dividido.
8. Preserve a origem das afirmacoes. Nao invente fatos, numeros, fontes, depoimentos ou resultados. Marque `claims_to_verify` quando uma afirmacao exigir verificacao.
9. Nao mova nada para `02-conteudos/04-publicados/` e nao execute qualquer acao externa sem aprovacao explicita posterior.

Ao final, informe os caminhos dos rascunhos criados, o canal escolhido e quaisquer afirmacoes pendentes de verificacao.
