# Auto-Image Generator - Série Tecnologia e Avanços

## 🎯 Propósito

Script de automação para gerar imagens pendentes de forma programática quando houver disponibilidade de credenciais para o gerador de imagens GPT.

## 🚀 Como Usar

```bash
cd "/home/project/PROJETOS/social-content-hub/PostsAndContent/Posts e Conhecimento/work/scripts"
node process-pending-images.js
```

## 📋 Processos Automatizados

Este script automatiza:

1. **Detecção de pendências**: Identifica todos os arquivos marcados como "Pendente GPT"
2. **Leitura de prompts**: Extrai prompts detalhados de cada imagem
3. **Geração em lote**: Processa todas as imagens pendentes
4. **Atualização de metadados**: Atualiza arquivos de rascunho com caminhos corretos
5. **Relatório de status**: Gera relatório JSON com resultados

## 🔧 Configuração

As configurações estão no objeto `CONFIG` do script:

```javascript
const CONFIG = {
  baseDir: '/home/project/PROJETOS/social-content-hub/PostsAndContent/Posts e Conhecimento',
  mediaDirs: {
    serie1: '04-midias/ai-cognitive-infrastructure',
    serie2: '04-midias/quantum-neuromorphic-hardware',
    serie3: '04-midias/convergencia-tecnologia'
  },
  pendingImages: [ ... ]
}
```

## 📁 Estrutura de Arquivos Gerados

```
04-midias/
├── ai-cognitive-infrastructure/
│   ├── ai-infrastructure-main.png
│   └── ai-infrastructure-main.png.prompt.txt
├── quantum-neuromorphic-hardware/
│   ├── hardware-convergence-main.png
│   └── hardware-convergence-main.png.prompt.txt
└── convergencia-tecnologia/
    ├── convergence-flywheel.png
    └── convergence-flywheel.png.prompt.txt
```

## ⚙️ Integração com OpenCode/Codex

Para integração automática com o sistema de comandos do OpenCode:

```bash
# Adicionar ao PATH
export PATH="$PATH:/home/project/PROJETOS/social-content-hub/PostsAndContent/Posts e Conhecimento/work/scripts"

# Executar via comando
auto-image-generator --series tecnologia-avancos
```

## 📊 Saída Esperada

```json
{
  "total": 3,
  "processed": 3,
  "failed": 0,
  "generated": [
    {
      "id": "serie-1-parte1",
      "file": "ai-infrastructure-main.png",
      "status": "generated",
      "path": "/full/path/to/generated/image.png"
    },
    ...
  ],
  "errors": []
}
```

## ✨ Recursos

- ✅ Processamento em lote
- ✅ Verificação de existência prévia
- ✅ Salvamento de prompts para referência
- ✅ Relatório detalhado em JSON
- ✅ Tratamento de erros robusto
- ✅ Compatibilidade com Node.js

## 📝 Notas Importantes

1. O script requer Node.js 14+
2. Para geração real, os credenciais GPT precisam estar configurados
3. Imágenes não sobrescrevem arquivos existentes
4. Prompts são salvos como arquivos .txt para referência

## 🔄 Atualização Automática

Para monitorar e processar automaticamente novas pendências:

```bash
# Monitorar a cada 5 minutos
watch -n 300 'node process-pending-images.js'
```