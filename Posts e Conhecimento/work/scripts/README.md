# Scripts de Automação Editorial

Automação para geração de imagens, verificação de status e processamento de conteúdo editoriais.

## 🚀 Começando

Instale as dependências:

```bash
cd work/scripts
npm install
```

## 📋 Scripts Disponíveis

| Script | Descrição | Uso |
|--------|-----------|-----|
| `auto-image-generator.js` | Gera imagens GPT automaticamente | `node auto-image-generator.js [opções]` |
| `watch-generate-images.js` | Monitora mudanças e gera imagens | `node watch-generate-images.js [opções]` |
| `process-pending-images.js` | Processador legacy de imagens pendentes | `node process-pending-images.js` |

## ⚙️ Opções de Automação

### Auto Image Generator

Processa imagens pendentes e atualiza arquivos:

```bash
# Processar série específica
npm run generate

# Verificar o que seria processado (dry run)
npm run check

# Mostrar ajuda
npm run help
```

Opções disponíveis:
- `--series, -s <name>` - Processar série específica
- `--dry-run, -d` - Mostrar o que seria feito
- `--help, -h` - Mostrar ajuda

### Watch & Generate Images

Monitora mudanças em arquivos e processa automaticamente:

```bash
# Executar uma vez
node watch-generate-images.js --once

# Monitorar continuamente (check a cada 5 min)
npm run interval

# Watch para desenvolvimento
npm run watch
```

## 📊 Fluxo Automático de Imagens

### Como Funciona

1. **Detecção**: Script varre rascunhos em busca de status "Pendente GPT"
2. **Validação**: Verifica se imagem já existe no diretório
3. **Geração**: Chama `generate_image` com prompt apropriado
4. **Atualização**: Atualiza arquivos de rascunho com caminho da imagem
5. **Relatório**: Gera log JSON com resultados

### Diretórios Processados

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

## 🔧 Configuração

As configurações estão no objeto `CONFIG` de cada script:

```javascript
const CONFIG = {
  baseDir: '/caminho/para/o/projeto',
  mediaDirs: ['04-midias/...'],
  draftsDir: '02-conteudos/02-rascunhos/medium',
  checkInterval: 300000, // 5 minutos em ms
  fileExtensions: ['.png', '.jpg', '.jpeg', '.webp', '.gif']
};
```

## 📝 Cron Jobs Sugeridos

Adicione ao seu crontab (`crontab -e`) para automação:

```bash
# Verificar imagens pendentes a cada hora
0 * * * * cd /caminho/para/scripts && node watch-generate-images.js --once

# Verificar a cada 5 minutos (mais agressivo)
*/5 * * * * cd /caminho/para/scripts && node watch-generate-images.js --once

# Gerar imagens quando o sistema estiver inativo (2h da manhã)
0 2 * * * cd /caminho/para/scripts && node auto-image-generator.js --series tecnologia-avancos
```

## 🛠️ Integração com OpenCode/Codex

Para integração com os comandos do OpenCode:

```bash
# Usar como comando personalizado
opencode -c "node work/scripts/auto-image-generator.js --series tecnologia-avancos"
```

Ou chame a skill `publication-image-generation` normalmente - ela detectará automaticamente os pendentes.

## 📊 Relatórios Gerados

Os scripts geram relatórios em JSON:

- `work/previews/image-watch-report.json` - Status de monitoramento
- `work/previews/auto-image-<series>-report.json` - Relatório de processamento
- `work/previews/series-completion-report.md` - Status geral da série

## ⚠️ Limitações Conhecidas

1. **Credenciais GPT**: A geração requer acesso ao modelo GPT Image 2
2. **Formato de imagem**: Pode demorar alguns segundos por imagem
3. **Rate limiting**: Evite chamadas muito frequentes

## 🔄 Atualizações Recomendadas

- [x] Processamento em lote implementado
- [x] Detecção automática de pendências
- [x] Geração de relatórios JSON
- [ ] Integração com sistema de notificações
- [ ] Rate limiting configurável
- [ ] Suporte a múltiplos provedores de imagem

## 📚 Documentação Adicional

- [SKILL.md](../custom/publication-image-generation/SKILL.md) - Documentação da skill oficial
- [auto-image-generator.md](./auto-image-generator.md) - Guia detalhado
- [series-completion-report.md](../previews/series-completion-report.md) - Status atual

## 💡 Dicas

1. **Para desenvolvimento**: Use `--watch` para monitorar em tempo real
2. **Para produção**: Use `--once` com cron ou timer
3. **Para debug**: Use `--dry-run` para ver o que seria processado

## 🆘 Suporte

Se encontrar problemas:

1. Verifique se as credenciais GPT estão configuradas
2. Execute `npm run check` para diagnosticar
3. Consulte o log em `work/previews/`