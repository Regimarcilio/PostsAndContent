🇧🇷 Português

Em uma cadeia de processamento com 16 etapas, o risco mais caro não é a quantidade de regras.

É o service central precisar conhecer a sequência inteira: handlers, ordem, exceções e critérios de interrupção.

Uma boa prática é aplicar Chain of Responsibility e separar a composição:

- Preparação: o service organiza o contexto inicial.
- Pré-cálculo: a chain executa validações e sincronização.
- Cálculo comum: concentra criação, dados, persistência e publicação.
- Chains específicas: escolhem o fluxo de cada tipo de contrato.

Cada handler cuida da própria regra. A chain cuida da composição e da ordem.

Adicionar uma regra passa a ser uma decisão de posição na cadeia, não mais um bloco acoplado ao service central.

A ordem também é uma decisão arquitetural. A validação específica pode acontecer depois do carregamento de verificações, serviços e documentos, quando a sincronização depende desses dados. A geração específica pode entrar logo após a criação da invoice, antes do processamento de faixas.

Assim, cada tipo de contrato executa somente seus handlers. Falhas interrompem as etapas seguintes; short-circuits continuam válidos.

O contrato deve preservar o contexto, os short-circuits e a interrupção após falhas. Persistência e publicação continuam condicionais; o estado mutável fica isolado por processamento.

Fluxos longos não precisam esconder complexidade. Devem deixar claro quem executa, ordena e encerra o caminho.

----------------------------

🇺🇸 English

In a 16-stage processing chain, the most expensive risk is not the number of rules.

It is the central service having to know the entire sequence: handlers, ordering, exceptions and stopping conditions.

A good practice is to use Chain of Responsibility and separate composition:

- Preparation: the service builds the initial context.
- Pre-calculation: the chain runs validations and synchronization.
- Common calculation: handles creation, data, persistence and publication.
- Type-specific chains: select the flow for each contract type.

Each handler owns its rule. The chain owns composition and ordering.

Adding a rule becomes a decision about its position in the chain, not another block coupled to the central service.

Ordering is also an architectural decision. Type-specific validation can run after checks, services and documents are loaded when synchronization depends on that data. Specialized generation can be inserted immediately after invoice creation, before range processing.

Each contract type runs only its own handlers. Failures stop later stages; short-circuits remain valid.

The contract should preserve context, short-circuits and interruption after failure. Persistence and publication stay conditional; mutable state remains isolated per run.

Long flows need not hide complexity. They should make clear who executes, orders and ends the path.
