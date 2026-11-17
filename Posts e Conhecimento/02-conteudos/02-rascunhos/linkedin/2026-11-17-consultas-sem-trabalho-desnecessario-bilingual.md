🇧🇷 Português

Uma consulta pode retornar exatamente os dados corretos e ainda assim fazer o banco trabalhar demais.

O problema aparece quando duas coleções relacionadas são carregadas na mesma consulta. Se um contrato possui vários serviços e várias empresas associadas, a junção pode repetir cada serviço para cada empresa:

`serviços × empresas = linhas intermediárias`

A aplicação pode reconstruir as coleções depois, mas o banco já pagou o custo de gerar e transportar essas combinações.

A investigação começou com telemetria. Rastreamento distribuído mostrou quais spans de banco ultrapassavam o limiar observado. Depois, a análise do SQL gerado, da cardinalidade e dos filtros revelou que o problema estava na forma da leitura, não na regra de elegibilidade.

A correção combinou três decisões:

- usar `AsSplitQuery()` quando duas coleções independentes precisavam ser carregadas;
- normalizar os valores na escrita e comparar diretamente a coluna já normalizada, sem aplicar `UPPER`/`ToUpper` sobre o campo filtrado;
- reduzir a concorrência de mensagens para equilibrar vazão, conexões, CPU, I/O e pressão no banco.

O detalhe importante é que remover a transformação da consulta só é seguro quando a escrita garante a mesma convenção. Caso contrário, a otimização pode virar falha de correlação.

Também não basta medir apenas a duração. É preciso observar o SQL, as linhas intermediárias, o plano, os buffers e o comportamento sob concorrência.

O resultado mais seguro de afirmar não é uma porcentagem universal de latência. É a remoção de trabalho desnecessário: combinações duplicadas, transformações repetidas e consultas simultâneas demais para a capacidade observada.

Escrevi no Medium sobre essa abordagem, os trade-offs e a validação necessária para melhorar a forma da consulta sem mudar o significado do resultado.

Nota: este relato é baseado em uma experiência técnica anonimizada; detalhes proprietários foram omitidos.

#Performance #Database #SoftwareArchitecture

----------------------------

🇺🇸 English

A query can return exactly the right data and still make the database do too much work.

The problem appears when two related collections are loaded in the same query. If a contract has several services and several associated companies, the join can repeat every service for every company:

`services × companies = intermediate rows`

The application may rebuild the collections afterward, but the database has already paid the cost of generating and transporting those combinations.

The investigation started with telemetry. Distributed tracing showed which database spans exceeded the observed threshold. Then, analysis of the generated SQL, cardinality, and filters revealed that the problem was in the read shape—not in the eligibility rule.

The fix combined three decisions:

- use `AsSplitQuery()` when two independent collections must be loaded;
- normalize values at write time and compare the already-normalized column directly, without applying `UPPER`/`ToUpper` to the filtered field;
- reduce message concurrency to balance throughput, connections, CPU, I/O, and database pressure.

The important detail is that removing the query transformation is safe only when the write path guarantees the same convention. Otherwise, the optimization can become a correlation failure.

Measuring duration alone is not enough. The SQL, intermediate rows, plan, buffers, and behavior under concurrency also need to be observed.

The safest result to claim is not a universal latency percentage. It is the removal of unnecessary work: duplicated combinations, repeated transformations, and more simultaneous queries than the observed capacity could sustain.

I wrote a longer Medium article about the approach, the trade-offs, and the validation required to improve query shape without changing the meaning of the result.

Note: this account is based on an anonymized technical experience; proprietary details were omitted.

#Performance #Database #SoftwareArchitecture

## Publication Notes

- Each language block is intended to be published separately.
