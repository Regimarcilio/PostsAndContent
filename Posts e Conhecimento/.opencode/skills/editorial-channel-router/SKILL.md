---
name: editorial-channel-router
description: Use when creating or adapting editorial content in this repository; always asks whether the target is LinkedIn, Medium, or both before drafting or saving anything.
---

# Editorial Channel Router

Esta skill coordena a criacao de conteudo no repositorio editorial. Ela nao substitui as skills de producao importadas em `01-skills/`; decide o canal, aplica as restricoes do canal e encaminha o trabalho para a skill adequada.

## Gate obrigatorio de canal

Antes de escrever, editar ou salvar qualquer conteudo, use a ferramenta de perguntas e faca esta pergunta exata:

> Voce deseja criar para LinkedIn, Medium ou Ambos?

Ofereca somente estas opcoes:

- `LinkedIn`
- `Medium`
- `Ambos`

Nao inferir a resposta a partir do pedido. Se o usuario nao escolher uma opcao, pare no gate e faca a pergunta novamente em vez de criar um rascunho.

## Preparacao comum

Depois da escolha:

1. Leia `AGENTS.md` e `config.yml`.
2. Consulte apenas as fontes relevantes em `00-inbox/`, `02-conteudos/01-ideias/`, `03-referencias/`, `06-conhecimentos/` e `07-dados/`.
3. Leia o perfil em `.online-writing/` quando existir.
4. Preserve a proveniencia das fontes e separe fatos, opinioes e afirmacoes pendentes.
5. Use nomes em lowercase-kebab-case e siga o padrao de nomes registrado em `config.yml`.

## Roteamento

### LinkedIn

Carregue `01-skills/linkedin/skills/linkedin-skill/SKILL.md`.

Para criacao de rascunho, aplique principalmente:

- um hook especifico nas primeiras linhas;
- linguagem em primeira pessoa quando sustentada pelo material;
- paragrafos curtos, sem broetry;
- no maximo tres hashtags e nenhuma chamada artificial para engajamento;
- limite de 3.000 caracteres, salvo instrucoes mais restritivas da skill;
- nenhuma publicacao, programacao ou conexao externa.

Salve o resultado em `02-conteudos/02-rascunhos/linkedin/`. Artefatos operacionais da skill podem permanecer em `work/`.

### Medium

Carregue `01-skills/online-writing/skills/create-medium-post/SKILL.md`.

Salve o artigo em `02-conteudos/02-rascunhos/medium/`, mantendo o alvo de 800 a 1.200 palavras para o corpo quando o material comportar esse formato. Nao fabrique fontes ou metadados de publicacao.

### Ambos

Use as duas skills, tratando o material como uma fonte comum e os canais como entregas diferentes:

- o rascunho de LinkedIn deve priorizar hook, especificidade e leitura no feed;
- o artigo de Medium deve priorizar promessa, contexto, estrutura e profundidade;
- nao copie o texto de um canal para o outro;
- salve cada entrega no diretorio correspondente;
- se o material for insuficiente para uma das entregas, sinalize a limitacao em vez de preencher com invencoes.

## Conclusão de artigo

Após salvar o artigo de Medium, execute `01-skills/custom/editorial-preview/SKILL.md` e devolva o HTML com os dois canais. Se a escolha foi só Medium, prepare a versão complementar de LinkedIn em `work/previews/` para revisão.

## Limites de acao

Esta skill cria rascunhos. Nunca publica, agenda, envia, move para `02-conteudos/04-publicados/` ou usa credenciais sem aprovacao explicita do usuario.
