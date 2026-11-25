---
name: ndd-pulse-repository-router
description: Use when a task concerns NDD Pulse, Pulse, Billing, legacy licensing, or legacy licenses; route the work to the canonical local NDD Pulse repository before inspecting or changing code.
metadata:
  opencode/autoinvoke: false
---

# NDD Pulse Repository Router

Esta skill define o repositório local de referência para tarefas relacionadas ao NDD Pulse.

## Gatilhos

Use esta skill quando o pedido mencionar, no contexto de código, produto ou arquitetura:

- `NDD Pulse`;
- `Pulse`;
- `Billing`;
- `licenças legadas`;
- `legacy licenses`;
- `legacy licensing`.

Se `Billing` aparecer sem contexto suficiente, confirme se o assunto é o módulo de Billing do NDD Pulse antes de modificar arquivos.

## Repositório canônico

Use este diretório como raiz de trabalho:

```text
C:\Users\jeferson.berlim\source\repos\ndp-darklaunch
```

Antes de analisar ou editar código:

1. Confirme que o diretório existe.
2. Leia os arquivos de instrução do repositório-alvo, como `AGENTS.md`, `CLAUDE.md` ou equivalentes.
3. Consulte a documentação e os testes relevantes do repositório-alvo.
4. Se a sessão estiver em outro diretório, mude o diretório de trabalho para o repositório-alvo antes de executar comandos de código.

## Regras de roteamento

- Trate o caminho acima como a fonte local de verdade para o NDD Pulse.
- Mantenha alterações de código dentro do repositório-alvo.
- Preserve as instruções e convenções do repositório-alvo; elas têm prioridade sobre exemplos genéricos desta skill.
- Verifique o estado atual antes de editar e preserve mudanças pré-existentes.
- Se o caminho não existir ou estiver indisponível, informe o bloqueio e peça um caminho atualizado; não substitua por um repositório parecido.
- Se o pedido for editorial sobre esse produto, use o repositório-alvo apenas como fonte técnica e siga as regras editoriais do repositório atual. Para conteúdo público, não exponha o caminho local, nomes internos, credenciais ou identificadores do repositório.

## Critério de conclusão

O roteamento está concluído quando o agente:

1. confirmou a existência do repositório canônico;
2. leu as instruções locais aplicáveis;
3. está trabalhando no diretório correto ou declarou claramente por que não conseguiu chegar a ele;
4. informou qualquer ambiguidade entre Pulse, Billing e licenças legadas antes de alterar código.
