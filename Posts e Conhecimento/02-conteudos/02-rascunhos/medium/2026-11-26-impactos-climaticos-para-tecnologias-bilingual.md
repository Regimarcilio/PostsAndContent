🇧🇷 Português

# A pegada climática digital: o que os números mostram — e o que deixam de fora

*A expansão digital depende de eletricidade, equipamentos e cadeias de suprimento. Entender essas partes separadamente ajuda equipes de tecnologia a reduzir impacto sem transformar estimativas diferentes em um único número enganoso.*

Um serviço digital chega à tela depois de decisões tomadas em vários outros lugares: compra de equipamentos, escolha de energia, arquitetura de software e frequência de processamento. Como essas etapas ficam distantes da experiência do usuário, é fácil resumir seus efeitos em uma única cifra. Só que uma cifra sem fronteiras bem definidas pode esconder tanto o que foi medido quanto o que ficou de fora.

Isso não significa que todo uso digital tenha o mesmo impacto ou que a tecnologia deva parar de crescer. Significa que a conversa precisa começar com perguntas melhores: estamos falando de eletricidade ou de emissões? De um data center ou de toda a cadeia de produtos digitais? De uma medição observada ou de uma projeção? Sem essas distinções, comparações viram manchetes fáceis e decisões ruins.

## O que os números de eletricidade mostram

Data centers consumiram quase 500 terawatt-horas de eletricidade em 2025. A Agência Internacional de Energia (IEA) estima que o consumo cresceu 17% naquele ano e projeta aproximadamente 950 TWh em 2030, algo perto de 3% da eletricidade mundial. A projeção depende de como demanda, eficiência e capacidade instalada vão evoluir; não é uma medição do futuro. ([IEA, Key Questions on Energy and AI](https://www.iea.org/reports/key-questions-on-energy-and-ai/executive-summary))

Esses valores descrevem eletricidade consumida. Eles não dizem, sozinhos, quantas emissões foram produzidas. Um quilowatt-hora pode estar associado a intensidades de carbono diferentes conforme a matriz elétrica, a região e o horário. Por isso, comparar dois serviços apenas pelo volume de eletricidade, sem olhar como e onde essa energia foi gerada, deixa uma parte importante da história de fora.

Também é importante manter o recorte correto: data centers não são sinônimo de todo o setor de tecnologia. Redes de telecomunicação, dispositivos, fabricação de componentes, edifícios e serviços digitais entram em inventários diferentes. Uma estimativa que soma alguns desses elementos não pode ser comparada automaticamente com outra que usa fronteiras menores. Essas distinções de fronteira explicam por que diferentes estudos chegam a resultados variados, de 0,8% a 4% da participação total das TIC nas emissões globais, conforme observado pela ITU.

## Por que não existe um número único para "as emissões da tecnologia"

A União Internacional de Telecomunicações (ITU) observa que as estimativas para a participação das Tecnologias da Informação e Comunicação nas emissões globais variam de 0,8% a 4%. A amplitude reflete diferenças de método e de fronteira: quais atividades entram na conta, em que período são medidas e como se atribui a eletricidade. A faixa é um aviso para interpretar estimativas, não um intervalo que autorize escolher qualquer número como definitivo. ([ITU, Digital technologies and climate change](https://www.itu.int/en/ITU-D/Environment/Pages/climate-change.aspx))

Um dado mais delimitado ajuda a mostrar a diferença. Em 2024, 200 empresas digitais avaliadas pela ITU e pela World Benchmarking Alliance reportaram 301 milhões de toneladas de CO₂ equivalente em emissões operacionais dos Escopos 1 e 2. A ITU compara esse total a 0,8% das emissões globais relacionadas à energia. Apenas 47% dessas empresas reportaram todas as atividades relevantes do Escopo 3. Portanto, esse levantamento descreve o que as empresas participantes reportaram dentro de determinados escopos; não é uma contabilidade completa de toda a economia digital. ([ITU, Greening digital companies](https://www.itu.int/en/mediacentre/Pages/PR-2026-09-02-greening-digital-companies.aspx))

Essa distinção muda a forma de agir. Escopos operacionais ajudam a olhar consumo direto e energia comprada. O ciclo de vida também envolve fabricação, transporte e descarte de equipamentos, além de outras atividades da cadeia. Se uma organização mede apenas a operação dos servidores, pode deixar fora fatores relevantes para seus produtos e compras. Se soma categorias incompatíveis, pode contar impactos duas vezes ou comparar coisas diferentes. Essas diferenças de escopo explicam por que estimativas variam de 0,8% a 4% — o intervalo reflete desde apenas energia operacional até inclusões de ciclo de vida completo.

## O que equipes de produto e engenharia conseguem mudar

Uma equipe de software não controla a matriz elétrica de um país nem todas as etapas da fabricação de um servidor. Ainda assim, controla decisões que alteram a quantidade de computação necessária e a forma como essa infraestrutura é usada. O primeiro passo é medir o sistema que a equipe realmente opera: consumo, uso de CPU e memória, armazenamento, tráfego, chamadas a modelos e comportamento em períodos de pico.

Com uma linha de base, fica mais fácil encontrar trabalho que não entrega valor proporcional ao custo: tarefas repetidas, retenção de dados sem propósito claro, consultas desnecessárias, imagens maiores do que o uso exige ou processos executados com frequência excessiva. Cache pode evitar recomputações; processamento em lote pode reduzir chamadas repetidas; modelos menores podem atender tarefas simples quando a qualidade continua suficiente. Cada escolha precisa ser medida no contexto do produto, porque uma otimização local pode deslocar o trabalho para outro componente.

O objetivo não é tratar menos computação como uma vitória automática. É ligar o custo técnico ao resultado que o usuário recebe. Uma funcionalidade que consome mais recursos pode ser justificável se resolver um problema real; uma tarefa automatizada sem utilidade continua sendo desperdício mesmo quando roda em infraestrutura eficiente.

## Compras, operação e vida útil

As decisões organizacionais também importam. Ao escolher fornecedores, vale pedir limites e métodos usados nos inventários, dados sobre energia e emissões, e informação suficiente para comparar serviços equivalentes. Declarações genéricas de “energia verde” não substituem uma métrica clara nem revelam, por si só, toda a pegada do produto.

Para equipamentos, vida útil, reparabilidade e destino no fim do uso merecem entrar na decisão de compra. Trocar hardware por rotina, sem necessidade demonstrada, pode aumentar a demanda por fabricação e descarte. Estender a vida de um dispositivo também não é uma regra absoluta: segurança, manutenção e eficiência operacional podem justificar uma substituição. O ponto é decidir com critérios observáveis, não por impulso nem por uma única métrica.

## Uma internet mais responsável exige melhores perguntas

O futuro digital não será sustentável apenas porque um data center usa menos energia por operação. A demanda total também importa, assim como a origem da eletricidade, a fabricação dos equipamentos e a utilidade dos serviços. Uma medição útil separa consumo de emissões, explicita o que entrou na conta e acompanha mudanças ao longo do tempo.

Para quem desenvolve, isso transforma sustentabilidade em parte do trabalho de engenharia: observar, comparar alternativas, explicar limites e revisar decisões. Para organizações, significa exigir dados comparáveis e prolongar o uso de recursos quando fizer sentido. O progresso aparece quando a tecnologia entrega valor com custos conhecidos.

---

🇺🇸 English

# Reading the Climate Footprint of Digital Services Without Flattening the Numbers

*Digital growth depends on electricity, equipment, and supply chains. Separating those pieces helps technology teams reduce impact without turning unlike estimates into one misleading headline.*

A digital service reaches a screen after decisions made in many other places: equipment procurement, power choices, software architecture, and processing frequency. Because those steps are far from the user experience, it is tempting to compress their effects into one figure. But a number without clear boundaries can hide both what was measured and what was left out.

That does not mean every digital action has the same footprint or that technology should stop growing. It means the conversation needs better questions: Are we discussing electricity or emissions? One data center or the full digital supply chain? An observed measurement or a forecast? Without those distinctions, comparisons become easy headlines and poor decision tools.

## What electricity figures tell us

Data centers consumed nearly 500 terawatt-hours of electricity in 2025. The International Energy Agency (IEA) estimates consumption grew by 17% that year and projects roughly 950 TWh in 2030, close to 3% of global electricity use. That projection depends on how demand, efficiency, and installed capacity evolve; it is not a measurement of the future. ([IEA, Key Questions on Energy and AI](https://www.iea.org/reports/key-questions-on-energy-and-ai/executive-summary))

These figures describe electricity consumed. On their own, they do not tell us how many emissions were produced. A kilowatt-hour can be associated with different carbon intensities depending on the power mix, region, and time of use. Comparing two services by electricity volume alone, without asking where and how that energy was generated, leaves a central part of the story out.

The boundary matters too: data centers are not the whole technology sector. Telecommunications networks, devices, component manufacturing, buildings, and digital services appear in different inventories. An estimate that includes some of those activities cannot be compared automatically with another that uses a narrower boundary.

## Why there is no single number for technology emissions

The International Telecommunication Union (ITU) says estimates of information and communication technology’s share of global emissions range from 0.8% to 4%. The spread reflects differences in methods and boundaries: which activities are counted, which period is measured, and how electricity is attributed. The range is a warning about interpreting estimates, not permission to treat any one figure as definitive. ([ITU, Digital technologies and climate change](https://www.itu.int/en/ITU-D/Environment/Pages/climate-change.aspx))

A more specific data point shows why the distinction matters. In 2024, The ITU and World Benchmarking Alliance report found that 200 assessed digital companies reported 301 million tonnes of carbon dioxide equivalent in operational Scope 1 and 2 emissions to the ITU. The organization compares that total with 0.8% of global energy-related emissions. Only 47% of those companies reported all relevant Scope 3 activities. The survey therefore describes what participating companies reported within particular scopes; it is not a complete accounting of the entire digital economy. ([ITU, Greening digital companies](https://www.itu.int/en/mediacentre/Pages/PR-2026-09-02-greening-digital-companies.aspx))

That distinction changes what organizations should measure. Operational scopes help track direct emissions and purchased energy. A life-cycle view also includes manufacturing, transportation, and equipment disposal, along with other supply-chain activities. If a company measures only server operations, it may leave relevant parts of its products and procurement out. If it adds incompatible categories, it may double-count impacts or compare unlike things.

## What product and engineering teams can change

A software team does not control a country’s power mix or every stage in server manufacturing. It does control decisions that affect how much computing is needed and how infrastructure is used. Start with a baseline for the system the team actually operates: energy use, CPU and memory, storage, traffic, model calls, and peak behavior.

With a baseline, it becomes easier to find work that delivers little value for its cost: repeated tasks, data kept without a clear purpose, unnecessary queries, images larger than the experience requires, or processes running too often. Caching can avoid recomputation; batching can reduce repeated calls; smaller models may handle simple tasks when quality remains adequate. Each choice should be measured in the product context because a local optimization can shift work to another component.

The goal is not to treat less computing as an automatic win. It is to connect technical cost to the outcome a user receives. A resource-intensive feature may be justified if it solves a real problem; an automated task with no practical value remains wasteful even on efficient infrastructure. Architecture reviews and quality criteria help prevent cost reduction from becoming an abstract target.

## Procurement, operations, and useful life

Organizational decisions matter as well. When selecting providers, ask for the boundaries and methods behind their inventories, information about energy and emissions, and enough detail to compare equivalent services. A broad claim about “green energy” does not replace a clear metric or reveal the full footprint of a product by itself.

For equipment, useful life, repairability, and end-of-life handling belong in procurement decisions. Replacing hardware on a routine schedule without a demonstrated need can increase demand for manufacturing and disposal. Extending a device’s life is not an absolute rule either: security, maintenance, and operational efficiency may justify replacement. The point is to decide using observable criteria, rather than impulse or one metric alone.

## A more responsible internet starts with better questions

The digital future will not become sustainable simply because a data center uses less energy per operation. Total demand matters too, as do electricity sources, equipment manufacturing, and the usefulness of services. A useful measurement separates electricity from emissions, states what is included, and tracks changes over time.

For developers, this makes sustainability part of engineering: observe, compare options, explain limits, and revisit decisions. For organizations, it means asking for comparable data and keeping resources in service when that makes sense. Progress comes when technology delivers value at known costs — and teams can show where those costs come from.

---

## Registro de mídias

| Mídia | Uso neste canal | Referência |
|---|---|---|
| Imagem de capa (não gerada) | Pendente: OpenCode não disponibilizou `openai/gpt-image-2`; nenhuma arte foi criada | [brief e prompt para teste](../../../04-midias/impactos-climaticos-para-tecnologias/pending-image.md) |

## Notas editoriais

- Corpo Medium: PT-BR 1,084 palavras; English 963 palavras.
- Fontes: links inline para IEA e ITU; as estimativas têm escopos diferentes e não devem ser somadas.
- Originalidade: texto escrito como síntese própria; sem citações literais de fontes.
