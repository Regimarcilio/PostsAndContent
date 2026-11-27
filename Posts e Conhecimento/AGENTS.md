# Instrucoes do repositorio

Este e um repositorio de conteudo editorial, com um painel local auxiliar em `../tools/editorial-dashboard/`. O objetivo e criar materiais para Medium e LinkedIn com OpenCode e Codex. O codigo do painel fica fora do workspace editorial; conteudos, regras, skills e midias canonicas permanecem aqui.

## Ordem de leitura

Antes de executar qualquer tarefa neste projeto:

1. Leia este arquivo.
2. Leia `config.yml` para descobrir caminhos, skills, conhecimentos, dados e fluxos ativos.
3. Leia o `SKILL.md` da skill aplicavel em `01-skills/`.
4. Consulte as fontes em `03-referencias/`, os conhecimentos em `06-conhecimentos/` e os dados em `07-dados/` quando forem relevantes.

Se houver conflito, a instrucao direta do usuario tem prioridade, seguida por este arquivo, `config.yml` e as instrucoes especificas da skill.

## Catalogo do projeto

`config.yml` e o catalogo extensivel do repositorio. Ele nao substitui o `SKILL.md` e nao e uma configuracao automatica do OpenCode ou do Codex. Use-o para registrar o que existe e como cada artefato deve ser usado.

Ao adicionar qualquer item novo, atualize o bloco correspondente em `config.yml`:

- Nova skill: `skills.custom`.
- Novo conhecimento: `knowledge.collections` ou `knowledge.custom`.
- Nova fonte de dados: `data.sources` ou `data.custom`.
- Novo canal: `channels`.
- Novo fluxo: `workflows.custom`.

## Regras de organizacao

- Materiais ainda nao triados ficam em `00-inbox/`.
- Skills importadas e customizadas ficam em `01-skills/`.
- Ideias novas ficam em `02-conteudos/01-ideias/`.
- Rascunhos de Medium ficam em `02-conteudos/02-rascunhos/medium/`.
- Rascunhos e planos de LinkedIn ficam em `02-conteudos/02-rascunhos/linkedin/`.
- Revisoes pendentes ficam em `02-conteudos/03-revisao/`.
- Publicacoes aprovadas ficam em `02-conteudos/04-publicados/medium/` ou `linkedin/`.
- Fontes e notas de apoio ficam em `03-referencias/`.
- Imagens, videos e outros arquivos de publicacao ficam em `04-midias/`.
- ZIPs e materiais obsoletos ficam em `05-arquivo/`.
- Conhecimento duravel, como conceitos, casos, experiencias e glossario, fica em `06-conhecimentos/`.
- Dados estruturados, historico, metricas e exportacoes ficam em `07-dados/`.
- Artefatos temporarios da skill de LinkedIn ficam em `work/`.
- O perfil editorial compartilhado pelas skills de escrita fica em `.online-writing/`.

Nao misture conteudo editorial com os arquivos-fonte de `01-skills/`.

## Como adicionar uma skill

1. Coloque a skill em `01-skills/<nome-da-skill>/` ou em `01-skills/custom/<nome-da-skill>/`.
2. Preserve o `SKILL.md`, os scripts e os caminhos relativos originais.
3. Registre a skill em `config.yml` com `id`, `path`, `entrypoint`, `purpose`, `channels` e `enabled`.
4. Indique os conhecimentos e dados que a skill pode ler em `inputs`.
5. Indique onde ela grava resultados em `outputs`.
6. Nunca copie uma skill para outra pasta apenas para facilitar o uso; registre o caminho original no catalogo.

Exemplo minimo:

```yaml
- id: minha-skill
  path: 01-skills/custom/minha-skill
  entrypoint: 01-skills/custom/minha-skill/SKILL.md
  purpose: Descrever quando esta skill deve ser usada.
  channels: [medium, linkedin]
  inputs: [knowledge.collections, data.sources]
  outputs: [02-conteudos/02-rascunhos]
  enabled: true
```

## Como adicionar conhecimento

- Use um arquivo Markdown por conceito, caso, projeto, experiencia ou termo em `06-conhecimentos/`.
- Registre a origem, a data de verificacao e o nivel de confianca quando o conhecimento vier de uma fonte externa.
- Use `03-referencias/` para a fonte completa e `06-conhecimentos/` para a sintese reutilizavel.
- Nao transforme uma opiniao em fato sem marcar explicitamente que e opiniao.
- Registre novas colecoes em `knowledge.collections` ou itens especiais em `knowledge.custom`.

## Como adicionar dados

- Use `07-dados/datasets/` para CSV, JSON, XLSX convertido ou outros conjuntos de dados.
- Use `07-dados/metricas/` para resultados e metricas de publicacoes.
- Use `07-dados/importados/` para exportacoes brutas que ainda nao foram tratadas.
- Registre cada fonte em `data.sources` com `id`, `path`, `kind`, `origin`, `last_verified` e `sensitivity`.
- Nao armazene tokens, senhas, cookies, chaves ou dados pessoais desnecessarios.
- Dados nao verificados nao devem sustentar numeros ou afirmacoes em um texto publicado.

## Fluxo editorial

1. Capture o material em `00-inbox/` ou a ideia em `02-conteudos/01-ideias/`.
2. Verifique fontes e registre a origem em `03-referencias/`.
3. Use as skills de descoberta de `01-skills/online-writing/skills/` para preencher `.online-writing/` com proposito, expertise, buckets e tonality.
4. Crie o rascunho no diretorio do canal correto.
5. Revise fatos, fontes, links, nomes, numeros, tom, direitos de uso e adequacao ao canal.
6. Mova para `02-conteudos/03-revisao/` quando precisar de aprovacao ou revisao humana.
7. Ao concluir qualquer edição ou postagem, execute `01-skills/custom/editorial-preview/SKILL.md`: use o rascunho de LinkedIn para entregas só de LinkedIn e os dois canais quando houver artigo. Gere o dashboard HTML com os textos completos por idioma e as mídias registradas; abra-o imediatamente pela ação de preview do runtime quando disponível e entregue o link local.
8. Mova somente conteudo aprovado para `02-conteudos/04-publicados/`.

## Geracao de imagens

- Toda edição ou postagem inclui como padrão uma imagem original gerada por GPT. Assim que o ângulo e o conceito visual estiverem definidos, priorize a geração antes de finalizar os textos dos canais.
- Use `01-skills/custom/publication-image-generation/SKILL.md` em cada pedido editorial. Para `Ambos`, reutilize a imagem nos dois canais quando ela atender aos formatos; gere uma composição adicional somente quando o uso exigir outro enquadramento.
- No OpenCode 2.2.1+, use a ferramenta `generate_image` com a conexão Codex e GPT Image 2 na mesma execução. No Codex, use a capacidade GPT de geração de imagem disponível no runtime.
- Salve o asset em `04-midias/<slug>/` e registre o caminho relativo em `Registro de mídias` de cada rascunho aplicável.
- OpenCode pode chamar o modelo GPT do Codex por `generate_image`; isso nao autoriza trocar de provedor nem usar chave de API. Ao usar `linkedin-skill`, use suas etapas de texto, verificacao e preview.
- Codex tambem nao deve usar os scripts locais de renderizacao de imagem da skill de LinkedIn como substitutos do gerador GPT.
- Se a ferramenta GPT não estiver disponível, tente a capacidade configurada do runtime, informe a limitação e marque a imagem como pendente; não troque silenciosamente de provedor.
- A geracao cria apenas assets locais de rascunho. Upload, agendamento e publicacao continuam exigindo aprovacao explicita.

## Seguranca editorial

- Nunca invente fatos, metricas, fontes, depoimentos ou resultados.
- Todo texto publicavel deve ser original: nao copie nem parafraseie de perto fontes, artigos, posts ou rascunhos de terceiros. Use fontes para verificar fatos e produza uma sintese com estrutura e linguagem proprias.
- Cite a origem das afirmacoes verificaveis junto ao trecho e em `03-referencias/`. Use citacoes literais apenas quando forem indispensaveis, com aspas e atribuicao explícita.
- Antes de aprovar um rascunho, confira se ha trechos ou estruturas distintivas reproduzidos das fontes consultadas ou de outros materiais do repositorio; reescreva-os e preserve a atribuicao dos fatos.
- Nao publique nem agende nada sem aprovacao explicita do usuario.
- Nao execute agendamento ou publicacao apenas porque um arquivo esta marcado como pronto.
- Nao salve tokens, senhas, cookies ou chaves em arquivos do repositorio.
- Ao reutilizar uma fonte, registre a origem em `03-referencias/`.
- Nao envie dados de `07-dados/` para uma ferramenta externa sem autorizacao explicita.
- Quando houver incerteza factual, marque a afirmacao como pendente e solicite verificacao.
