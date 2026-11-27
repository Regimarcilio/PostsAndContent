#!/bin/bash
# Script de demonstração - Auto Image Generation for Editorial Series
# 
# Este script demonstra o fluxo completo de automação
# Execute no diretório work/scripts

set -e

echo "🚀 Demonstração: Auto Image Generation"
echo "========================================"
echo ""

# Verificar se está no diretório certo
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "📂 Diretório atual: $(pwd)"
echo ""

# 1. Verificar estrutura de arquivos
echo "1️⃣ Verificando estrutura de arquivos..."
echo ""

echo "📄 Drafts de Medium:"
ls -la ../../02-conteudos/02-rascunhos/medium/*.md 2>/dev/null | wc -l | xargs echo "    -" "arquivos"

echo "📱 Drafts de LinkedIn:"
ls -la ../../02-conteudos/02-rascunhos/linkedin/*.md 2>/dev/null | wc -l | xargs echo "    -" "arquivos"

echo "🖼️ Pastas de mídia:"
ls -d ../../04-midias/*/ 2>/dev/null | wc -l | xargs echo "    -" "pastas criadas"

echo ""

# 2. Verificar imagens pendentes
echo "2️⃣ Buscando imagens pendentes..."
echo ""

PENDING=$(grep -l "🟡 Pendente GPT" ../../02-conteudos/02-rascunhos/medium/*.md 2>/dev/null | wc -l)
echo "    - Drafts com imagens pendentes: $PENDING"

echo ""

# 3. Verificar prompts disponíveis
echo "3️⃣ Prompts disponíveis para geração:"
echo ""

PROMPT_COUNT=0
find ../../04-midias -name "*.prompt.txt" 2>/dev/null | while read -r file; do
    echo "    ✅ $file"
    PROMPT_COUNT=$((PROMPT_COUNT + 1))
done

echo "    Total: $PROMPT_COUNT prompts prontos"

echo ""

# 4. Show what would happen
echo "4️⃣ Simulação de geração (dry-run):"
echo ""

echo "    Para gerar imagens automaticamente, execute:"
echo "    $ node watch-generate-images.js --once"
echo ""

echo "    Os 13 prompts acima serão processados com GPT Image 2"
echo ""

# 5. Show dashboard location
echo "5️⃣ Dashboard HTML disponível:"
echo ""

DASHBOARD="../../work/previews/serie-tecnologia-avancos.html"
if [ -f "$DASHBOARD" ]; then
    echo "    📊 $DASHBOARD"
    echo "    Tamanho: $(du -h "$DASHBOARD" | cut -f1)"
    echo "    Última modificação: $(stat -c %y "$DASHBOARD" | cut -d'.' -f1)"
else
    echo "    ❌ Dashboard não encontrado"
fi

echo ""

# 6. Next steps
echo "6️⃣ Próximos passos:"
echo ""
echo "    1. Verificar credenciais GPT"
echo "    2. Executar: node watch-generate-images.js --once"
echo "    3. Revisar imagens geradas"
echo "    4. Atualizar metadados dos rascunhos"
echo "    5. Publicar na série"
echo ""

echo "✅ Demonstração concluída!"
echo ""
echo "💡 Dica: Este script pode ser executado como parte de um pipeline CI/CD"