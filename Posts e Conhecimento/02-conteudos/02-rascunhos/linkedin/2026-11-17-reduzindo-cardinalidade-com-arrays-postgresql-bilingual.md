🇧🇷 Português

Uma tabela de consumo pode ficar grande sem que a chave de negócio mude muito.

O motivo era a repetição: a mesma combinação de cliente, produto, recurso e tipo aparecia novamente a cada dia.

A tabela respondia bem à escrita diária, mas o faturamento precisava consultar meses — ou pequenas janelas entre datas. O resultado era uma leitura carregando a granularidade errada para a pergunta.

A abordagem foi compactar o eixo do tempo sem apagar a leitura diária:

- uma linha por chave e mês;
- um array PostgreSQL `numeric[31]` para os valores diários;
- agregados para soma, máximo e última leitura;
- índices relacionais para localizar a chave;
- leitura do array apenas quando o período fosse parcial.

O detalhe mais importante não foi usar arrays. Foi definir a semântica:

`NULL` significa ausência de leitura. Zero continua sendo um valor válido.

Meses completos usam os agregados. Períodos com corte usam somente as posições necessárias do array. E a compactação não promete reconstruir eventos individuais que deixaram de existir como linhas.

Escrevi no Medium sobre essa abordagem, os trade-offs e o portão de validação necessário antes de trocar a tabela bruta pela mensal.

#PostgreSQL #DataModeling #SoftwareArchitecture

----------------------------

🇺🇸 English

A consumption table can become large even when its business key barely changes.

The reason was repetition: the same combination of customer, product, resource, and type appeared again every day.

The table was good at recording daily writes, but billing needed to query months—or small windows between dates. The read path was carrying the wrong granularity for the question it had to answer.

The approach compacted the time axis without removing daily readings:

- one row per key and month;
- a PostgreSQL `numeric[31]` array for daily values;
- aggregates for sum, maximum, and last reading;
- relational indexes to locate the key;
- array reads only when the period was partial.

The most important detail was not using arrays. It was defining the semantics:

`NULL` means no reading. Zero remains a valid value.

Full months use the aggregates. Cutoff periods use only the required array positions. And compaction does not promise to reconstruct individual events that no longer exist as rows.

I wrote a longer Medium article about the approach, the trade-offs, and the validation gate required before switching from the raw table to the monthly representation.

#PostgreSQL #DataModeling #SoftwareArchitecture

## Registro de mídias (nota interna — não publicar)

| Mídia | Uso no post | Referência relativa ao draft |
|---|---|---|
| `monthly-array-cardinality-infographic.png` | Imagem principal | [abrir mídia](../../../04-midias/monthly-array-cardinality/monthly-array-cardinality-infographic.png) |
| `rows-to-array.gif` | Animação de apoio | [abrir mídia](../../../04-midias/monthly-array-cardinality/rows-to-array.gif) |
