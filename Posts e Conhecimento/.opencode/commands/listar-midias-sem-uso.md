---
description: Audita referências de mídia nos drafts de Medium e LinkedIn e lista arquivos sem uso, sem removê-los.
---

Audite as referências de mídia do repositório editorial.

Antes de executar:

1. Leia `AGENTS.md`, `config.yml` e `01-skills/custom/media-reference-tracking/SKILL.md`.
2. Use `04-midias/` como raiz das mídias.
3. Se `$ARGUMENTS` informar arquivos, slugs ou canais, limite a análise a eles.
   Sem argumento, use todos os arquivos `.md` em:
   - `02-conteudos/02-rascunhos/medium/`
   - `02-conteudos/02-rascunhos/linkedin/`
   - `02-conteudos/04-publicados/medium/`
   - `02-conteudos/04-publicados/linkedin/`

Considere somente estes formatos publicáveis:

`.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.svg`, `.avif`, `.mp4`, `.webm`,
`.mov`, `.mp3` e `.wav`.

Para cada mídia:

1. procure referências por caminho relativo, nome de arquivo e links Markdown
   ou HTML nos drafts selecionados;
2. registre o canal e a linha da referência;
3. valide se o caminho apontado existe;
4. classifique como `Medium`, `LinkedIn`, `Ambos` ou `Sem uso`.

Entregue o resultado nesta estrutura:

```text
Mídias usadas no Medium:
- caminho — draft:linha

Mídias usadas no LinkedIn:
- caminho — draft:linha

Mídias usadas em ambos:
- caminho

Sem uso — candidatas à revisão:
- caminho

Referências quebradas:
- draft:linha — referência — motivo
```

Não delete, mova, renomeie ou altere qualquer mídia. A lista `Sem uso` é
somente uma lista de candidatas. Uma mídia antiga pode ter sido usada fora do
rastro local; confirme histórico e direitos antes de removê-la. Se houver
referências quebradas, informe-as mesmo que o nome do arquivo pareça correto.
