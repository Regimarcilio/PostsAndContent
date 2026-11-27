🇧🇷 Português

# O futuro da engenharia de software e a computação quântica

*O que muda — e o que não muda — na forma de escrever, testar e entregar software quando os quânticos entram no cotidiano do desenvolvedor.*

A computação quântica está deixando os laboratórios de física para aparecer nos roadmaps de engenharia de software. Para quem escreve código, o ponto não é aprender a construir um processador quântico, mas entender como um novo modelo de computação redefine abstrações, complexidade e prazos de entrega.

Nesta edição, olho para o futuro próximo da engenharia de software sob a perspectiva da computação quântica: o que já existe, o que é promessa, onde estão os pontos de atrito e quais habilidades importam nos próximos anos.

## O que é computação quântica, na prática

Um computador clássico processa bits: 0 ou 1. Um computador quântico processa qubits, que podem existir em superposição de estados e se entrelaçar uns com os outros. Isso permite que certos algoritmos explorem múltiplos caminhos ao mesmo tempo, em vez de testá-los sequencialmente.

Não é um “computador clássico mais rápido”. É um modelo diferente, vantajoso para um conjunto específico de problemas:

- Busca não estruturada (algoritmo de Grover): aceleração quadrática sobre buscas clássicas.
- Fatoração de inteiros grandes e logaritmos discretos (algoritmo de Shor): quebra de criptografas assimétricas amplamente usadas hoje (RSA, ECC).
- Simulação de sistemas quânticos: química, materiais e fármacos, onde a modelagem clássica escala mal.
- Otimização combinatória: logística, finanças e aprendizado de máquina em casos restritos.

A maioria dos problemas do dia a dia de um desenvolvedor — CRUD, APIs, interfaces, lógica de negócio — continuará sendo resolvida melhor por computação clássica. A quântica será um acelerador especializado, não um substituto geral.

## Onde a engenharia de software entra

Engenharia de software não se resume a escrever código. Ela abrange requisitos, arquitetura, testes, deploy, observabilidade, manutenção e evolução de sistemas. A computação quântica afeta quase todas essas camadas.

### 1. Novos paradigmas de programação

Programar para quânticos exige pensamento diferente de programação imperativa ou orientada a objetos. Linguagens como Q#, Qiskit (Python), Cirq (Google) e Silq introduzem conceitos como:

- Circuitos quânticos como unidade de computação.
- Portas quânticas (Hadamard, CNOT, T, etc.) em vez de instruções de CPU.
- Medição colapsando o estado do qubit.
- Correção de erros quânticos como preocupação de arquitetura, não apenas de runtime.

O desenvolvedor precisa aprender a pensar em probabilidades e amplitudes, não apenas em fluxos determinísticos. Isso muda o contrato entre “escrevi o código” e “obtive o resultado esperado”.

### 2. Computação híbrida como modelo dominante

No futuro próximo, sistemas quânticos funcionarão como aceleradores ligados a computadores clássicos. O fluxo típico será:

1. O computador clássico prepara os dados e subdivide o problema.
2. Envia a parte adequada para o processador quântico via nuvem.
3. Recebe o resultado probabilístico.
4. Pós-processa, valida e integra de volta ao sistema clássico.

Isso significa que engenheiros de software precisarão projetar arquiteturas híbridas, gerenciar filas de jobs quânticos, lidar com latência de rede entre clássico e quântico e tratar resultados não determinísticos.

### 3. Criptografia e segurança: o ponto de ruptura mais imediato

O impacto mais concreto e próximo da computação quântica na engenharia de software não é performance: é segurança. Se um computador quântico tolerante a falhas e com número suficiente de qubits lógicos se tornar viável, algoritmos como RSA e ECC podem ser quebrados por Shor.

A resposta da engenharia de software já está em andamento:

- Criptografia pós-quântica (PQC): algoritmos resistentes a ataques quânticos, padronizados pelo NIST.
- Migração de bibliotecas, TLS, assinaturas digitais e chaves armazenadas.
- Agilidade criptográfica: sistemas projetados para trocar algoritmos sem reescrever a aplicação.

Para equipes de software, isso significa revisar dependências, atualizar suites criptográficas e planejar rotação de chaves antes que a ameaça se concretize.

### 4. Testes e qualidade de software

Programas quânticos são difíceis de depurar. Medir um qubit destrói sua superposição, então não se pode “inspecionar” o estado intermediário como se faz com um debugger clássico.

Isso impulsiona:

- Testes baseados em propriedades e invariantes, em vez de apenas exemplos.
- Simuladores quânticos clássicos para validação em pequena escala antes de rodar em hardware real.
- Verificação formal como prática mais comum, dado o custo de execução em hardware quântico.
- Observabilidade adaptada a resultados probabilísticos e taxas de erro.

### 5. Complexidade de algoritmos e decisão de uso

Engenheiros precisarão decidir quando um problema vale uma solução quântica. Nem todo problema de otimização se beneficia. A análise de complexidade clássica (Big O) continua valiosa, mas agora convive com classes de complexidade quântica (BQP, por exemplo).

A habilidade chave será discernir: “este problema é intratável classicamente e adequado a um algoritmo quântico conhecido?” Se a resposta for não, a computação clássica continua sendo a escolha certa.

## Desafios que ainda não estão resolvidos

- **Decoerência e ruído:** qubits perdem seu estado rapidamente. Computadores quânticos atuais são ruidosos (era NISQ — Noisy Intermediate-Scale Quantum). Erros precisam de correção, que consome muitos qubits físicos por qubit lógico.
- **Escalabilidade:** poucos qubits lógicos estáveis hoje; milhões podem ser necessários para aplicações úteis em larga escala.
- **Falta de abstrações maduras:** ainda não temos o equivalente quântico de sistemas operacionais, gerenciadores de pacote ou frameworks web consolidados.
- **Escassez de profissionais:** pouca interseção entre conhecimento de física quântica e engenharia de software de produção.

## O que muda para o engenheiro de software nos próximos anos

| Área | Hoje | Futuro próximo com quântica |
|------|------|-----------------------------|
| Paradigma | Imperativo, orientado a objetos, funcional | Circuitos quânticos + híbrido clássico-quântico |
| Segurança | RSA, ECC, AES simétrica | Criptografia pós-quântica, agilidade criptográfica |
| Testes | Debuggers, unit tests, integração | Simuladores quânticos, testes por propriedades, verificação formal |
| Arquitetura | Monolíticos, microsserviços, serverless | Aceleradores quânticos via nuvem, filas de jobs híbridos |
| Habilidades | Estruturas de dados, algoritmos clássicos, cloud | Algoritmos quânticos, correção de erros, complexidade quântica |

O que não muda: escrever código legível, testável, mantível e seguro continua sendo o coração da engenharia de software. A quântica adiciona camadas, não substitui os fundamentos.

## Recomendações para equipes

1. Comece pela segurança: avalie exposição a RSA/ECC e planeje migração para algoritmos pós-quânticos.
2. Invista em alfabetização quântica para o time, sem exigir que todos se tornem físicos.
3. Experimente com simuladores e APIs de nuvem quântica (IBM Qiskit, Amazon Braket, Azure Quantum) em problemas de nicho, não no core do produto.
4. Mantenha abstrações fortes no código clássico para facilitar a troca ou adição de aceleradores quânticos no futuro.
5. Acompanhe padrões emergentes (NIST PQC, ISO/IEC para quântica) e atualize dependências regularmente.

## Conclusão

A computação quântica não vai substituir a engenharia de software clássica. Ela vai se tornar um acelerador especializado para problemas específicos — criptografia, simulação, otimização — enquanto a maior parte do software continua rodando em hardware clássico.

O futuro pertence aos engenheiros que sabem usar a ferramenta certa para o problema certo. Quem entender os limites e as possibilidades da computação quântica estará melhor preparado para projetar sistemas que integram ambos os mundos.

---

*Esta edição é uma síntese editorial baseada em conceitos públicos de computação quântica e engenharia de software. As projeções sobre prazos e viabilidade de hardware quântico são especulativas e devem ser verificadas conforme o setor avança.*

## Publication Notes

- Claims are limited to publicly known concepts of quantum computing and software engineering; specific timelines for fault-tolerant quantum hardware are marked as speculative.
- No proprietary or unpublished technical data is used.

--------------------------

🇺🇸 English

# The future of software engineering and quantum computing

*What changes — and what does not — in how we write, test, and ship software when quantum computers enter the developer’s daily routine.*

Quantum computing is leaving physics labs and appearing on software-engineering roadmaps. For those who write code, the point is not to learn how to build a quantum processor, but to understand how a new computing model redefines abstractions, complexity, and delivery timelines.

In this edition, I look at the near future of software engineering through the lens of quantum computing: what already exists, what is promise, where the friction points are, and which skills matter over the next few years.

## What quantum computing means in practice

A classical computer processes bits: 0 or 1. A quantum computer processes qubits, which can exist in a superposition of states and become entangled with each other. This allows certain algorithms to explore multiple paths at once, rather than testing them sequentially.

It is not a “faster classical computer.” It is a different model, advantageous for a specific set of problems:

- Unstructured search (Grover’s algorithm): quadratic speedup over classical search.
- Factoring large integers and discrete logarithms (Shor’s algorithm): breaking widely used asymmetric cryptography today (RSA, ECC).
- Simulating quantum systems: chemistry, materials, and pharmaceuticals, where classical modeling scales poorly.
- Combinatorial optimization: logistics, finance, and machine learning in restricted cases.

Most day-to-day developer problems — CRUD, APIs, interfaces, business logic — will continue to be better solved by classical computing. Quantum will be a specialized accelerator, not a general replacement.

## Where software engineering enters

Software engineering is not just writing code. It covers requirements, architecture, testing, deployment, observability, maintenance, and system evolution. Quantum computing affects nearly all these layers.

### 1. New programming paradigms

Programming for quantum computers requires thinking differently from imperative or object-oriented programming. Languages such as Q#, Qiskit (Python), Cirq (Google), and Silq introduce concepts like:

- Quantum circuits as the unit of computation.
- Quantum gates (Hadamard, CNOT, T, etc.) instead of CPU instructions.
- Measurement collapsing the qubit state.
- Quantum error correction as an architectural concern, not just a runtime one.

The developer must learn to think in probabilities and amplitudes, not just deterministic flows. This changes the contract between “I wrote the code” and “I got the expected result.”

### 2. Hybrid computing as the dominant model

In the near future, quantum systems will act as accelerators connected to classical computers. The typical flow will be:

1. The classical computer prepares data and subdivides the problem.
2. Sends the appropriate part to the quantum processor via the cloud.
3. Receives the probabilistic result.
4. Post-processes, validates, and integrates it back into the classical system.

This means software engineers will need to design hybrid architectures, manage quantum job queues, handle network latency between classical and quantum systems, and deal with non-deterministic results.

### 3. Cryptography and security: the most immediate breaking point

The most concrete and near-term impact of quantum computing on software engineering is not performance: it is security. If a fault-tolerant quantum computer with enough logical qubits becomes viable, algorithms like RSA and ECC can be broken by Shor’s algorithm.

The response from software engineering is already underway:

- Post-quantum cryptography (PQC): algorithms resistant to quantum attacks, standardized by NIST.
- Migration of libraries, TLS, digital signatures, and stored keys.
- Cryptographic agility: systems designed to swap algorithms without rewriting the application.

For software teams, this means reviewing dependencies, updating cryptographic suites, and planning key rotation before the threat materializes.

### 4. Testing and software quality

Quantum programs are hard to debug. Measuring a qubit destroys its superposition, so you cannot “inspect” intermediate state like you do with a classical debugger.

This drives:

- Property-based and invariant testing, not just examples.
- Classical quantum simulators for validation at small scale before running on real hardware.
- Formal verification as a more common practice, given the cost of execution on quantum hardware.
- Observability adapted to probabilistic results and error rates.

### 5. Algorithm complexity and the decision to use quantum

Engineers will need to decide when a problem is worth a quantum solution. Not every optimization problem benefits. Classical complexity analysis (Big O) remains valuable, but now coexists with quantum complexity classes (BQP, for example).

The key skill is discernment: “Is this problem intractable classically and suitable for a known quantum algorithm?” If the answer is no, classical computing remains the right choice.

## Challenges still unresolved

- **Decoherence and noise:** qubits lose their state quickly. Current quantum computers are noisy (NISQ era — Noisy Intermediate-Scale Quantum). Errors need correction, which consumes many physical qubits per logical qubit.
- **Scalability:** few stable logical qubits today; millions may be needed for useful large-scale applications.
- **Lack of mature abstractions:** we still do not have the quantum equivalent of operating systems, package managers, or consolidated web frameworks.
- **Talent shortage:** little intersection between quantum physics knowledge and production software engineering.

## What changes for the software engineer in the coming years

| Area | Today | Near future with quantum |
|------|-------|--------------------------|
| Paradigm | Imperative, object-oriented, functional | Quantum circuits + hybrid classical-quantum |
| Security | RSA, ECC, symmetric AES | Post-quantum cryptography, cryptographic agility |
| Testing | Debuggers, unit tests, integration | Quantum simulators, property-based testing, formal verification |
| Architecture | Monoliths, microservices, serverless | Quantum accelerators via cloud, hybrid job queues |
| Skills | Data structures, classical algorithms, cloud | Quantum algorithms, error correction, quantum complexity |

What does not change: writing readable, testable, maintainable, and secure code remains the core of software engineering. Quantum adds layers, it does not replace the fundamentals.

## Recommendations for teams

1. Start with security: assess exposure to RSA/ECC and plan migration to post-quantum algorithms.
2. Invest in quantum literacy for the team, without requiring everyone to become a physicist.
3. Experiment with simulators and cloud quantum APIs (IBM Qiskit, Amazon Braket, Azure Quantum) in niche problems, not in the product core.
4. Keep strong abstractions in classical code to make it easier to swap or add quantum accelerators in the future.
5. Follow emerging standards (NIST PQC, ISO/IEC for quantum) and update dependencies regularly.

## Conclusion

Quantum computing will not replace classical software engineering. It will become a specialized accelerator for specific problems — cryptography, simulation, optimization — while most software continues to run on classical hardware.

The future belongs to engineers who know how to use the right tool for the right problem. Those who understand the limits and possibilities of quantum computing will be better prepared to design systems that integrate both worlds.

---

*This edition is an editorial synthesis based on public concepts of quantum computing and software engineering. Projections on timelines and viability of quantum hardware are speculative and should be verified as the field advances.*

## Publication Notes

- Claims are limited to publicly known concepts of quantum computing and software engineering; specific timelines for fault-tolerant quantum hardware are marked as speculative.
- No proprietary or unpublished technical data is used.
