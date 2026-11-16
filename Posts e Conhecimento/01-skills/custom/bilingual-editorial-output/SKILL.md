---
name: bilingual-editorial-output
description: Use when creating editorial content in this repository; produce the complete pt-BR version followed by a native English adaptation in the required bilingual format.
---

# Bilingual Editorial Output

Esta skill define a embalagem bilíngue padrão para conteúdos editoriais. Ela complementa a skill de produção do canal; não substitui `editorial-channel-router`, `linkedin-skill` ou as skills de Medium.

## Quando usar

Use esta skill sempre que um conteúdo editorial for criado neste repositório, salvo instrução explícita do usuário para produzir apenas um idioma.

O fluxo continua sendo:

1. `editorial-channel-router` confirma o canal.
2. A skill de produção do canal cria o conteúdo-base.
3. Esta skill gera a versão em inglês e organiza as duas versões no mesmo arquivo.

## Formato obrigatório

A saída deve seguir esta ordem e estes marcadores:

```markdown
🇧🇷 Português

[conteúdo completo em português]

----------------------------

🇺🇸 English

[English version]
```

O conteúdo em português vem primeiro. A versão em inglês vem depois do separador, sem introdução adicional entre os blocos.

## Regras de adaptação

- Preserve a mesma ideia central, fatos, números, fontes, links, ressalvas e chamada para ação nas duas versões.
- Escreva a versão em inglês como adaptação editorial nativa, não como tradução palavra por palavra.
- Preserve identificadores técnicos, nomes de APIs, nomes de padrões, código e comandos quando a precisão exigir.
- Traduza títulos, subtítulos, listas, chamadas e hashtags quando houver equivalente natural para o público em inglês.
- Mantenha a mesma estrutura argumentativa e o mesmo nível de detalhe nos dois idiomas.
- Não acrescente exemplos, resultados, fontes, métricas ou opiniões que não existam na versão em português.
- Quando uma afirmação estiver pendente de verificação, marque a pendência nas duas versões ou em uma nota interna compartilhada.
- Não misture parágrafos em inglês dentro do bloco em português nem o contrário.

## Regras por canal

### LinkedIn

- O hook deve funcionar de forma independente em cada idioma.
- Verifique o limite de 3.000 caracteres por versão, sem contar o bloco do outro idioma e as notas internas.
- Não copie hashtags ou construções que soem artificiais no inglês.
- Se o arquivo for usado para publicação, selecione e publique apenas um bloco por vez; o separador é uma organização editorial, não parte do post.

### Medium

- Cada versão deve ser um artigo completo e legível de forma independente.
- Aplique o alvo de palavras da skill de Medium a cada idioma, quando essa skill exigir contagem por versão.
- Mantenha imagens, links e notas de publicação alinhados entre as duas versões.

## Controle de qualidade

Antes de salvar, confirme:

1. O bloco pt-BR está completo.
2. O bloco English está completo e não é um resumo.
3. Os dois blocos seguem a mesma estrutura e preservam as afirmações.
4. O separador é exatamente `----------------------------`.
5. Nenhum dado, fonte, número ou resultado foi inventado na adaptação.
6. As restrições do canal foram verificadas por idioma.
