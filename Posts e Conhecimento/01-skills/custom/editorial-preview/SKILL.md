---
name: editorial-preview
description: Gere e abra imediatamente o dashboard HTML após finalizar qualquer edição ou postagem, mostrando os textos completos dos canais, idiomas e mídias registradas.
---

# Dashboard editorial de LinkedIn e Medium

Execute esta etapa depois de salvar e revisar a edição completa — textos dos canais e idiomas, imagem ou estado pendente explícito, e detalhes de postagem — antes de responder ao usuário. Esta etapa é padrão para qualquer entrega editorial. Para atualizar o dashboard, gere novamente o HTML a partir dos arquivos atuais.

## Prepare os rascunhos

- Quando a escolha for **Ambos**, use o artigo e o post correspondentes dos diretórios de rascunhos.
- Quando a escolha for **Medium**, use o artigo salvo e escreva uma adaptação para o feed do LinkedIn em `work/previews/<data>-<slug>-linkedin.md`, de modo que os dois canais possam ser revisados no mesmo HTML. Aplique as regras editoriais do LinkedIn, incluindo o limite de 3.000 caracteres por idioma. Use a mesma base factual do artigo e respeite os idiomas solicitados.
- Quando a escolha for **LinkedIn** e a entrega contiver apenas um post, a etapa de artigo não é acionada. Para uma prévia avulsa do post, o renderizador também aceita apenas `--linkedin`.
- Quando a entrega for somente para LinkedIn, gere o dashboard com `--linkedin`. Para Medium, inclua o artigo e a adaptação de LinkedIn; para Ambos, use os dois rascunhos salvos.
- Use os marcadores da skill `bilingual-editorial-output` para versões bilíngues. Em um rascunho somente em inglês sem marcadores, informe `--language en-US`. Mantenha as notas editoriais ao final, sob títulos como `Publication Notes`, `Notas de publicação` ou `Registro de mídias`.
- No Medium, use referências Markdown inline para a capa e as demais mídias. No LinkedIn, use referências inline ou selecione os anexos no `Registro de mídias`. Marque alternativas como opcionais. A prévia incorpora arquivos locais de `04-midias/` e avisa quando algum arquivo referenciado está indisponível. Confirme que o dashboard mostra os textos completos, títulos, subtítulos, idiomas e imagem aplicada ao canal.

## Gere, abra e entregue o dashboard

Na raiz editorial, com Python 3.9+ e Pandoc disponíveis, execute:

```bash
python 01-skills/custom/editorial-preview/scripts/render.py \
  --linkedin "caminho/do/post.md" \
  --medium "caminho/do/artigo.md" \
  --output "work/previews/AAAA-MM-DD-slug-linkedin-medium.html"
```

Use `--title` ou `--author` se precisar informar o título da prévia ou identificar a autoria confirmada. Quando o comando `python` apontar para outra versão, use `python3`.

Confira se cada canal mostra o texto integral e se os seletores alternam os idiomas de forma independente. Verifique títulos, subtítulos, ordem das seções, links e mídias. Corrija referências quebradas ou informe as pendências na entrega. As notas editoriais e o registro de mídias ficam nos arquivos fonte.

Assim que o HTML for gerado, abra-o imediatamente no painel de navegador/preview
do workspace usando a ação de arquivo disponível no runtime (por exemplo,
`openFile`). Aguarde a abertura e confira a renderização antes de responder. Se
estiver no CLI ou o runtime não oferecer ação para abrir arquivos locais, entregue
o caminho clicável do dashboard e informe que ele foi gerado, mas não aberto.

Entregue o dashboard HTML como arquivo ou link clicável junto aos caminhos dos rascunhos e às pendências de verificação. A prévia funciona localmente, com as mídias incorporadas, e faz parte da revisão editorial antes de qualquer ação de publicação.
