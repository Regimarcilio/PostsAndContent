🇧🇷 Português

# Quando uma consulta correta faz trabalho demais

*Como telemetria, cardinalidade e dados normalizados ajudaram a reduzir o custo de uma leitura sem mudar a regra de negócio.*

Uma consulta pode retornar exatamente os contratos esperados e ainda assim estar fazendo o banco trabalhar muito mais do que deveria.

Isso acontece quando duas coleções relacionadas são carregadas ao mesmo tempo. Se um contrato possui vários serviços e várias empresas associadas, uma combinação relacional pode repetir cada serviço para cada empresa. O resultado continua semanticamente correto depois da materialização, mas o banco precisa produzir e transportar muitas linhas intermediárias.

O problema não era a regra de elegibilidade. Era a forma como a pergunta estava sendo traduzida para SQL.

## O primeiro passo foi parar de adivinhar

A investigação começou com telemetria, não com uma alteração no código.

Em uma aplicação distribuída, uma requisição ou mensagem atravessa várias camadas. O rastreamento distribuído registra essa passagem como spans: pequenos intervalos que mostram onde o tempo foi gasto. Quando o banco de dados também aparece nesses spans, fica possível separar o tempo de processamento da aplicação do tempo de execução das consultas.

Em vez de procurar “a consulta lenta” olhando apenas para o código, a equipe filtrou os spans de banco acima de um limiar operacional e comparou os cenários mais frequentes. A telemetria apontou quais leituras mereciam investigação; ela não foi usada para concluir sozinha qual era a correção.

Depois, cada consulta foi analisada com três perguntas:

1. Qual SQL o ORM estava gerando?
2. Quantas linhas o banco precisava produzir antes da materialização?
3. Quais filtros estavam impedindo uma busca mais direta?

Essa sequência é importante. Duração é um sinal. O plano, a cardinalidade e os dados envolvidos explicam o sinal.

## O problema estava na combinação, não na coleção isolada

Carregar uma coleção relacionada não é necessariamente caro. O risco aparece quando duas coleções são incluídas na mesma consulta raiz.

Considere uma forma simplificada:

```text
contrato
├── serviços
└── empresas associadas
```

Se o contrato possui `S` serviços e `E` empresas, uma junção pode produzir até `S × E` combinações intermediárias para aquele contrato. A aplicação pode reconstruir as duas coleções depois, mas o banco já pagou o custo de gerar as combinações.

Esse é um problema de cardinalidade intermediária. Não significa que existam mais serviços ou empresas no domínio. Significa que a representação da leitura repete dados para carregar duas dimensões independentes no mesmo resultado.

A consulta também pode parecer aceitável em um cenário pequeno. O comportamento muda quando uma das coleções cresce. Por isso, testar apenas com poucos registros não protege contra o caso que realmente pressiona o banco.

## A solução foi separar o carregamento

Quando duas coleções independentes precisam ser carregadas, `AsSplitQuery()` permite que o ORM emita consultas separadas em vez de construir uma única combinação entre elas.

A forma conceitual passa a ser:

```text
consulta raiz       → contratos elegíveis
consulta de serviços → serviços dos contratos encontrados
consulta de empresas → empresas dos contratos encontrados
```

O objetivo não é reduzir o número de objetos que a aplicação precisa receber. O objetivo é impedir que o banco crie linhas duplicadas apenas para transportar essas relações.

Essa mudança exige um cuidado: nem todo `Include` precisa ser dividido. Um fluxo que carrega somente uma coleção não tem a mesma multiplicação entre coleções. Aplicar a opção indiscriminadamente aumenta a complexidade sem evidência de benefício.

O critério deve ser a forma do resultado SQL, não a presença da palavra “coleção” no código.

## A comparação de texto também estava no lugar errado

Outro ponto apareceu nos filtros de uma unidade de produto. A consulta aplicava uma transformação de maiúsculas sobre a coluna e sobre o parâmetro para aceitar diferenças de capitalização.

Essa estratégia resolve uma inconsistência de dados durante a leitura, mas coloca uma função sobre a coluna filtrada. Dependendo do banco e dos índices disponíveis, isso pode impedir uma busca tão direta quanto uma igualdade simples.

A correção não foi simplesmente remover a transformação. Primeiro, a entrada passou a ser normalizada no limite de escrita e os dados persistidos passaram a seguir a mesma convenção. Só então a leitura pôde comparar:

```text
coluna_normalizada = valor_normalizado
```

A distinção é importante. Remover `UPPER` ou `ToUpper` sem garantir a consistência dos dados apenas troca um custo de consulta por uma falha de correlação. A otimização depende da combinação entre contrato de escrita e contrato de leitura.

## Menos concorrência também pode significar mais estabilidade

Mesmo depois de corrigir a forma das consultas, havia uma segunda dimensão: quantas mensagens podiam executar simultaneamente.

Uma concorrência alta aumenta o throughput potencial, mas também multiplica consultas, conexões, CPU, I/O e memória usados ao mesmo tempo. Quando cada mensagem precisa localizar contratos e relações, o banco pode receber uma onda de leituras caras.

Por isso, o limite de prefetch e de mensagens concorrentes foi reduzido para um valor controlado. A decisão não foi apresentada como “quanto menor, melhor”. Foi um ajuste operacional para equilibrar vazão e pressão no banco, com observação de backlog, latência, conexões e recursos.

Esse tipo de ajuste deve ser medido como controle de fluxo, não como otimização isolada da consulta. Uma consulta melhor executada em cinquenta mensagens simultâneas ainda pode saturar o banco.

## O que precisava continuar igual

O objetivo não era mudar quais contratos eram elegíveis. Os filtros de tenant, status, método de verificação, unidade de produto e empresa associada continuaram fazendo parte da correlação.

Também era necessário preservar os eventos e os fluxos de processamento. A mudança deveria alterar o trabalho intermediário da leitura, não o significado do resultado.

As validações, portanto, precisaram verificar duas coisas ao mesmo tempo:

- a consulta não produzia mais a combinação desnecessária entre coleções;
- os mesmos contratos e relações continuavam sendo retornados nos cenários funcionais.

Performance sem equivalência funcional é apenas uma regressão rápida.

## A regra prática

Há três perguntas reutilizáveis neste tipo de investigação:

1. A telemetria mostra onde o tempo está sendo gasto?
2. A cardinalidade do SQL corresponde ao que a aplicação realmente precisa?
3. Os dados estão normalizados antes da consulta, permitindo filtros diretos?

Quando a resposta é não, a solução pode envolver mais do que um índice. Pode ser necessário mudar a forma de carregar relações, alinhar a normalização com a fronteira de escrita e limitar a concorrência para que o banco consiga absorver o fluxo.

O ganho mais seguro não é prometer uma porcentagem universal de latência. É remover trabalho que nunca foi necessário: linhas intermediárias duplicadas, transformações repetidas sobre colunas e consultas concorrentes demais para a capacidade observada.

É assim que uma consulta correta deixa de ser apenas correta e passa a ser proporcional à pergunta que precisa responder.

*Nota de origem: este texto foi elaborado a partir de uma experiência técnica interna anonimizada. Nomes, métricas e detalhes proprietários foram omitidos; os mecanismos descritos são apresentados como práticas generalizáveis.*

----------------------------

🇺🇸 English

# When a Correct Query Does Too Much Work

*How telemetry, cardinality, and normalized data helped reduce the cost of a read without changing the business rule.*

A query can return exactly the expected contracts and still make the database work far harder than necessary.

This happens when two related collections are loaded at the same time. If a contract has several services and several associated companies, a relational join can repeat every service for every company. The final result may still be semantically correct after materialization, but the database has already generated and transported many intermediate rows.

The problem was not the eligibility rule. It was the way the question had been translated into SQL.

## The first step was to stop guessing

The investigation started with telemetry, not a code change.

In a distributed application, a request or message crosses multiple layers. Distributed tracing records that journey as spans: small intervals that show where time was spent. When database operations appear in those spans, it becomes possible to separate application processing time from query execution time.

Instead of looking only at code and searching for “the slow query,” the team filtered database spans above an operational threshold and compared the most relevant scenarios. Telemetry identified which reads deserved investigation; it did not, by itself, prove what the fix should be.

Each query was then examined through three questions:

1. What SQL was the ORM generating?
2. How many rows did the database have to produce before materialization?
3. Which filters were preventing a more direct lookup?

That sequence matters. Duration is a signal. The plan, cardinality, and data explain the signal.

## The problem was the combination, not either collection alone

Loading one related collection is not automatically expensive. The risk appears when two collections are included in the same root query.

Consider a simplified shape:

```text
contract
├── services
└── associated companies
```

If the contract has `S` services and `E` companies, a join can produce up to `S × E` intermediate combinations for that contract. The application may reconstruct the two collections afterward, but the database has already paid the cost of generating those combinations.

This is an intermediate-cardinality problem. It does not mean the domain contains more services or companies. It means the read representation repeats data in order to carry two independent dimensions in one result.

The query may look acceptable with a small dataset. Its behavior changes when one collection grows. That is why a test with only a few related records does not protect the case that actually puts pressure on the database.

## The fix was to split the loading

When two independent collections need to be loaded, `AsSplitQuery()` allows the ORM to issue separate queries instead of building one combination between them.

Conceptually, the shape becomes:

```text
root query          → eligible contracts
services query      → services for the selected contracts
companies query     → companies for the selected contracts
```

The goal is not to reduce the number of objects the application needs to receive. The goal is to prevent the database from creating duplicate rows merely to transport those relationships.

This change requires judgment: not every `Include` needs to be split. A flow that loads only one collection does not have the same cross-collection multiplication. Applying the option indiscriminately adds complexity without evidence of benefit.

The criterion should be the shape of the generated SQL, not merely the presence of the word “collection” in the code.

## Text comparison was also happening in the wrong place

Another issue appeared in filters for a product-unit value. The query applied an uppercase transformation to both the column and the parameter so that different capitalization would still match.

That strategy handles inconsistent data at read time, but it places a function on the filtered column. Depending on the database and available indexes, this can prevent a lookup as direct as a simple equality comparison.

The fix was not simply to remove the transformation. The input was first normalized at the write boundary, and persisted data was brought under the same convention. Only then could the read path compare:

```text
normalized_column = normalized_value
```

The distinction matters. Removing `UPPER` or `ToUpper` without guaranteeing data consistency merely swaps a query cost for a correlation failure. The optimization depends on the write contract and the read contract agreeing.

## Less concurrency can also mean more stability

Even after changing the query shape, there was a second dimension: how many messages could run at the same time.

High concurrency increases potential throughput, but it also multiplies simultaneous queries, connections, CPU, I/O, and memory usage. When every message has to locate contracts and relationships, the database can receive a wave of expensive reads.

The prefetch and concurrent-message limits were therefore reduced to a controlled value. The decision was not “the lower, the better.” It was an operational adjustment to balance throughput and database pressure while observing backlog, latency, connections, and resource usage.

This kind of change should be measured as flow control, not as an isolated query optimization. A better query can still saturate the database when executed by too many messages at once.

## What had to remain unchanged

The goal was not to change which contracts were eligible. Tenant, status, verification-method, product-unit, and associated-company criteria remained part of the correlation.

Processing events and downstream flows also had to remain intact. The change was expected to alter the intermediate work of the read, not the meaning of its result.

Validation therefore had to check both sides:

- the query no longer produced the unnecessary cross-product between collections;
- the same contracts and relationships were still returned in functional scenarios.

Performance without functional equivalence is simply a fast regression.

## The practical rule

Three questions can be reused in this kind of investigation:

1. Does telemetry show where time is being spent?
2. Does SQL cardinality match what the application actually needs?
3. Is data normalized before the query, allowing direct filters?

When the answer is no, the solution may require more than an index. It may involve changing how relationships are loaded, aligning normalization with the write boundary, and limiting concurrency so the database can absorb the workload.

The safest gain is not a universal latency percentage. It is removing work that was never necessary: duplicated intermediate rows, repeated transformations over filtered columns, and more concurrent queries than the observed capacity could sustain.

That is how a correct query becomes not only correct, but proportional to the question it needs to answer.

*Source note: this article was based on an anonymized internal technical experience. Names, metrics, and proprietary details were omitted; the mechanisms are presented as generalizable practices.*

## Publication Notes

- Claims are limited to the technical mechanisms and observed investigation logic; no universal latency or throughput result is asserted.
