---
name: media-reference-tracking
description: Use when assigning, reviewing, or auditing media references in Medium and LinkedIn drafts; keep relative-path traceability and identify media that are unused by either channel without deleting files.
---

# Media Reference Tracking

Esta skill mantém o vínculo entre arquivos de mídia em `04-midias/` e os
rascunhos editoriais de Medium e LinkedIn.

## Objetivo

Para cada mídia publicável, tornar possível responder:

- ela é usada no Medium?
- ela é usada no LinkedIn?
- ela é usada nos dois canais?
- ela não está referenciada em nenhum dos dois?

A skill apenas registra e audita referências. Ela **não remove**, move,
renomeia ou sobrescreve mídias automaticamente.

## Escopo

Considere como mídia publicável os arquivos com estas extensões:

`.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.svg`, `.avif`, `.mp4`, `.webm`,
`.mov`, `.mp3` e `.wav`.

Ignore documentos auxiliares como `README.md`, `palette.md`, arquivos de
configuração e pastas ocultas.

Por padrão, audite conteúdo editorial em rascunho e publicado:

- `02-conteudos/02-rascunhos/medium/**/*.md`
- `02-conteudos/02-rascunhos/linkedin/**/*.md`
- `02-conteudos/04-publicados/medium/**/*.md`
- `02-conteudos/04-publicados/linkedin/**/*.md`

Quando o usuário fornecer arquivos, slugs ou canais específicos, audite somente
o escopo informado. Use um escopo de drafts quando a pergunta for apenas sobre
um conteúdo ainda não publicado.

## Formato obrigatório da referência

Cada draft que usar ou recomendar mídia deve ter uma seção interna de
rastreabilidade, preferencialmente ao final do próprio arquivo:

```markdown
## Registro de mídias

| Mídia | Uso neste canal | Referência |
|---|---|---|
| `arquivo.png` | imagem principal | [abrir mídia](../../../04-midias/pasta/arquivo.png) |
```

O caminho deve ser relativo ao arquivo do draft, não absoluto e não baseado na
máquina do autor. O nome do arquivo e o caminho no link devem identificar a
mesma mídia.

Para conteúdo bilíngue, mantenha um único registro interno compartilhado entre
as versões pt-BR e English. Não duplique a seção dentro dos dois blocos
publicáveis. A seção é nota editorial e não faz parte do texto enviado ao
canal.

Não é necessário criar um arquivo separado em `03-referencias/` para registrar
o uso de uma mídia. A referência inline no próprio post/artigo é a fonte de
rastreabilidade para esta auditoria. Arquivos de `03-referencias/` podem
documentar a origem editorial, mas não substituem o registro de mídia no draft.

## Convenções de uso

- Medium pode registrar hero, infográficos, diagramas e GIFs usados ou
  recomendados para o artigo.
- LinkedIn deve registrar somente as mídias selecionadas para aquele post,
  considerando o formato final que será publicado.
- Conteúdo publicado também deve preservar o registro quando a mídia puder ser
  rastreada depois da publicação.
- Se uma mídia foi criada para os dois canais, ela deve aparecer nos dois
  registros.
- Se uma mídia é apenas uma alternativa, marque o uso como `opcional` em vez
  de apresentá-la como utilizada.
- Não declare uma mídia como usada apenas porque ela está na mesma pasta do
  conteúdo.
- Não inclua `README.md`, `palette.md` ou arquivos de especificação visual como
  mídia publicável.

## Auditoria

Ao auditar, para cada mídia:

1. normalize o caminho com separadores `/`;
2. procure o caminho relativo, o nome do arquivo, referências Markdown/HTML e
   registros na seção `## Registro de mídias` dos próprios drafts;
3. não trate um arquivo separado em `03-referencias/` como evidência de uso da
   mídia;
4. elimine falsos positivos causados por menções em comentários de ferramenta
   ou por arquivos que não sejam os drafts selecionados;
5. registre o canal em que a referência foi encontrada;
6. informe linha(s) de referência quando possível;
7. classifique o resultado como `Medium`, `LinkedIn`, `Ambos` ou `Sem uso`.

O resultado deve separar:

- mídias usadas no Medium;
- mídias usadas no LinkedIn;
- mídias usadas em ambos;
- candidatas sem referência;
- referências quebradas, quando o draft aponta para um caminho inexistente.

Uma mídia `Sem uso` é apenas candidata à revisão ou remoção. Qualquer exclusão
exige confirmação explícita do usuário e uma checagem de direitos, histórico e
dependências.

## Controle de qualidade

Antes de concluir:

- confirme que cada referência aponta para um arquivo existente;
- confirme que o arquivo referenciado está dentro de `04-midias/`;
- confirme que a classificação de canal deriva de referências encontradas, não
  de suposições;
- não altere o texto público do conteúdo ao inserir ou corrigir o registro;
- informe arquivos alterados e a lista final de mídias usadas e sem uso.
