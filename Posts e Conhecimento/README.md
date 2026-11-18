# Repositorio de Conteudo

Repositorio pessoal para criar, revisar e publicar conteudo no Medium e no LinkedIn usando OpenCode, Codex e as skills em `01-skills/`.

## Estrutura

```text
.
|-- .online-writing/                 # Perfil editorial gerado pelas skills de escrita
|-- .opencode/                       # Configuracao local, command e skill de roteamento
|   |-- commands/criar-conteudo.md
|   `-- skills/editorial-channel-router/SKILL.md
|-- 00-inbox/                        # Materiais ainda nao triados
|-- 01-skills/
|   |-- online-writing/              # Pipeline de escrita e Medium
|   |-- linkedin/                    # Criacao, revisao e agendamento de LinkedIn
|   `-- agent-skills/                # Workflows gerais para agentes
|-- 02-conteudos/
|   |-- 01-ideias/
|   |-- 02-rascunhos/medium/
|   |-- 02-rascunhos/linkedin/
|   |-- 03-revisao/
|   `-- 04-publicados/{medium,linkedin}/
|-- 03-referencias/                  # Fontes, notas e materiais de apoio
|-- 04-midias/                       # Imagens, videos e arquivos para publicacao
|-- 05-arquivo/zip-originais/        # ZIPs originais preservados
|-- 06-conhecimentos/                 # Conhecimento duravel e reutilizavel
|-- 07-dados/                        # Datasets, metricas e importacoes
|-- config.yml                       # Catalogo extensivel do repositorio
`-- work/                             # Artefatos operacionais da skill de LinkedIn
```

## Fluxo recomendado

1. Coloque fontes novas em `00-inbox/` e ideias em `02-conteudos/01-ideias/`.
2. Use as skills de descoberta de `01-skills/online-writing/skills/` para preencher `.online-writing/` com proposito, expertise, buckets e tonality.
3. Salve rascunhos longos em `02-conteudos/02-rascunhos/medium/`.
4. Salve rascunhos curtos e planos editoriais em `02-conteudos/02-rascunhos/linkedin/`.
5. Use `work/` para voz, planos, previews, requests e logs gerados pela skill de LinkedIn.
6. Mova somente conteudo aprovado para `02-conteudos/04-publicados/`.
7. Registre novas skills, conhecimentos e dados em `config.yml`.

## Skills instaladas

- Medium e escrita online: `01-skills/online-writing/`
- LinkedIn: `01-skills/linkedin/skills/linkedin-skill/`
- Workflows auxiliares: `01-skills/agent-skills/`

## Command local

Use `/criar-conteudo` para iniciar uma criacao. O fluxo pergunta obrigatoriamente se o destino e `LinkedIn`, `Medium` ou `Ambos` antes de escrever ou salvar qualquer rascunho.

Ao concluir um artigo, o fluxo entrega uma prévia HTML em `work/previews/` com o post integral de LinkedIn e o artigo integral de Medium. Quando houver duas versões, cada canal tem seu próprio seletor de idioma. A [skill de prévia](01-skills/custom/editorial-preview/SKILL.md) descreve o comando de geração.

Consulte o `SKILL.md` relevante antes de executar um fluxo. Os arquivos dentro de `01-skills/` sao fontes importadas e devem ser tratados como somente leitura, salvo quando a intencao for atualizar a skill.
