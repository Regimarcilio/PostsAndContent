---
name: linkedin-character-limit
description: Use when creating, revising, checking, or preparing LinkedIn content; enforce LinkedIn's 3,000-character hard limit and report exact counts.
---

# LinkedIn Character Limit

Esta skill aplica o limite de texto do LinkedIn a todo conteúdo destinado a esse canal.

## Regra principal

- O limite máximo é de **3.000 caracteres por postagem**.
- Conte espaços, quebras de linha, emojis, hashtags, links e pontuação.
- Conte apenas o texto que será publicado; exclua notas internas, instruções de mídia e metadados editoriais.
- Uma versão que ultrapasse 3.000 caracteres deve ser reduzida antes de ser salva como pronta para publicação.

## Conteúdo bilíngue

- Se português e inglês forem publicados em postagens separadas, cada bloco deve ter no máximo 3.000 caracteres.
- Se as duas versões forem publicadas juntas em uma única postagem, o bloco público completo — incluindo bandeiras e separador — deve ter no máximo 3.000 caracteres.
- Informe sempre a contagem de cada idioma e, quando aplicável, a contagem do bloco bilíngue completo.

## Como reduzir

Ao ultrapassar o limite:

1. Preserve o hook, o problema, a prática recomendada e a conclusão.
2. Remova repetições, qualificadores e explicações secundárias.
3. Converta listas longas em frases compactas quando isso melhorar a leitura.
4. Preserve fatos, números, fontes, links e ressalvas necessárias.
5. Corte por parágrafos completos ou reescreva a passagem; não termine uma frase no meio.
6. Refaça a contagem depois da redução.

Não invente uma afirmação para preencher espaço e não elimine uma ressalva factual apenas para atingir o limite.

## Saída de verificação

Antes de entregar um rascunho de LinkedIn, informe:

```text
LinkedIn character check: PASS
PT-BR: [n] / 3000
English: [n] / 3000
Combined bilingual block: [n] / 3000
```

O campo `Combined bilingual block` só é obrigatório quando o conteúdo puder ser publicado com os dois idiomas na mesma postagem.

## Controle de qualidade

Uma postagem só pode ser marcada como `approved` ou `published` depois de passar nessa verificação. Se o conteúdo ainda exceder o limite, marque-o como `draft` ou `review` e indique quanto precisa ser reduzido.
