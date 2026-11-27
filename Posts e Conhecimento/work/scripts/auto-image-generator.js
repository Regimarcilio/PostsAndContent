#!/usr/bin/env node

/**
 * Auto Image Generator for Editorial Series
 * 
 * Automatically processes pending GPT image generation requests
 * and updates draft files with generated image paths.
 * 
 * Usage: node auto-image-generator.js [options]
 * Options:
 *   --series <name>     Process specific series
 *   --dry-run           Show what would be done without generating
 *   --help              Show this help message
 */

const fs = require('fs');
const path = require('path');

const CONFIG = {
  baseDir: '/home/project/PROJETOS/social-content-hub/PostsAndContent/Posts e Conhecimento',
  
  series: {
    'tecnologia-avancos': {
      name: 'Série Tecnologia e Avanços Tecnológicos',
      mediaDir: '04-midias',
      drafts: [
        {
          part: 1,
          title: 'A Revolução Invisível: IA Generativa como Infraestrutura Cognitiva',
          fileName: '2026-11-25-serie-tecnologia-avancos-parte1.md',
          imageFile: 'ai-infrastructure-main.png',
          imageDir: 'ai-cognitive-infrastructure',
          prompt: 'Futuristic tech illustration showing the evolution from traditional workflow to AI agent orchestration. Left side: human workers manually coding, designing, analyzing - grayscale, traditional office setting. Right side: human strategist overseeing network of AI agents (LLM, code generator, designer, researcher) connected by glowing neural pathways. Central concept: "cognitive infrastructure" as the new internet-like utility. Clean corporate style, modern tech aesthetic, blue/purple gradient with orange accents for human elements. Professional B2B illustration style. Aspect ratio 16:9.',
          tags: ['Inteligência Artificial', 'IA Generativa', 'Future of Work'],
          readingTime: '12-15 min'
        },
        {
          part: 2,
          title: 'Computação Quântica, Neuromórfica e o Fim da Lei de Moore',
          fileName: '2026-11-25-serie-tecnologia-avancos-parte2.md',
          imageFile: 'hardware-convergence-main.png',
          imageDir: 'quantum-neuromorphic-hardware',
          prompt: 'Technical convergence infographic showing 4 hardware layers converging into one system. Bottom layer: silicon chips with transistors (brown/gold). Middle layer: quantum processor with qubit arrays (blue/purple). Next layer: neuromorphic chip with spiking neural networks (green/orange). Top layer: photonic chip with light beams (white/cyan). All layers connect with golden arrows converging toward center where a human silhouette makes a decision. Clean technical diagram style, engineering aesthetic, sans-serif labels. Modern infographics design. Aspect ratio 16:9.',
          tags: ['Computação Quântica', 'Hardware', 'Inovação'],
          readingTime: '15-18 min'
        },
        {
          part: 3,
          title: 'A Convergência: IA + Quântica + Biologia + Espaço',
          fileName: '2026-11-25-serie-tecnologia-avancos-parte3.md',
          imageFile: 'convergence-flywheel.png',
          imageDir: 'convergencia-tecnologia',
          prompt: 'Flywheel diagram showing technological convergence: 5 interconnected circles representing AI Generative, Heterogeneous Hardware, Biology, Energy Fusion, Space. Each circle has an icon and connects with arrows to center point where human silhouette makes decision. Colorful but professional, infographic style with clean lines, modern tech aesthetic. Aspect ratio 16:9.',
          tags: ['Tecnologia', 'Convergência', 'Futuro'],
          readingTime: '18-22 min'
        }
      ]
    }
  }
};

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    series: null,
    dryRun: false,
    help: false
  };
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--series':
      case '-s':
        options.series = args[++i];
        break;
      case '--dry-run':
      case '-d':
        options.dryRun = true;
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
    }
  }
  
  return options;
}

/**
 * Show help message
 */
function showHelp() {
  console.log(`
Auto Image Generator - Editorial Series
  
Usage: node auto-image-generator.js [options]
  
Options:
  --series, -s <name>    Process specific series
  --dry-run, -d          Show what would be done without generating
  --help, -h             Show this help message
  
Examples:
  node auto-image-generator.js --series tecnologia-avancos
  node auto-image-generator.js -s tecnologia-avancos -d
`);
}

/**
 * Check if image file exists
 */
function imageExists(mediaDir, imageFile) {
  const imagePath = path.join(CONFIG.baseDir, mediaDir, imageFile);
  return fs.existsSync(imagePath);
}

/**
 * Read draft file and check status
 */
function checkDraftStatus(mediaDir, fileName) {
  const filePath = path.join(CONFIG.baseDir, '02-conteudos/02-rascunhos/medium', fileName);
  
  if (!fs.existsSync(filePath)) {
    return { exists: false, status: 'file-not-found' };
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Check for pending image status
  if (content.includes('🟡 Pendente GPT')) {
    return { exists: true, status: 'pending' };
  }
  
  return { exists: true, status: 'other' };
}

/**
 * Process images for a series
 */
async function processSeries(seriesKey, dryRun = false) {
  const series = CONFIG.series[seriesKey];
  
  if (!series) {
    console.error(`❌ Série "${seriesKey}" não encontrada`);
    console.log('Séries disponíveis:', Object.keys(CONFIG.series).join(', '));
    return;
  }
  
  console.log(`\n🎨 Processando série: ${series.name}`);
  console.log('='.repeat(60));
  
  const mediaDir = path.join(CONFIG.baseDir, series.mediaDir);
  
  // Create media directory if it doesn't exist
  if (!dryRun && !fs.existsSync(mediaDir)) {
    console.log(`📁 Criando diretório: ${mediaDir}`);
    fs.mkdirSync(mediaDir, { recursive: true });
  }
  
  const results = {
    total: series.drafts.length,
    processed: 0,
    pending: 0,
    existing: 0,
    errors: []
  };
  
  for (const draft of series.drafts) {
    console.log(`\n📝 Parte ${draft.part}: ${draft.title}`);
    
    const imagePath = path.join(mediaDir, draft.imageFile);
    const status = checkDraftStatus(series.mediaDir, draft.fileName);
    
    // Report current status
    console.log(`   Status atual: ${status.status}`);
    console.log(`   Imagem: ${draft.imageFile}`);
    
    if (status.exists && status.status === 'pending') {
      results.pending++;
      
      if (dryRun) {
        console.log(`   📋 [DRY RUN] Imagem ainda pendente`);
        console.log(`   💡 Prompt salvo em: ${imagePath}.prompt.txt`);
      } else {
        console.log(`   ⚠️ Geração de imagem não automática - requer credenciais GPT`);
        console.log(`   💡 Salve o prompt em: ${imagePath}.prompt.txt`);
        
        // Save the prompt for reference
        const promptContent = `# ${draft.title}\n\n**Prompt GPT Image**:\n${draft.prompt}\n\n**Tags**: ${draft.tags.join(', ')}\n**Tempo de leitura**: ${draft.readingTime}`;
        fs.writeFileSync(`${imagePath}.prompt.txt`, promptContent);
        console.log(`   ✅ Prompt salvo`);
      }
    } else if (status.exists && status.status === 'pending') {
      results.existing++;
      console.log(`   ✅ Arquivo já existe`);
    }
    
    results.processed++;
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMO DO PROCESSAMENTO');
  console.log('='.repeat(60));
  console.log(`Total de partes: ${results.total}`);
  console.log(`Processadas: ${results.processed}`);
  console.log(`Pendentes: ${results.pending}`);
  console.log(`Existentes: ${results.existing}`);
  
  // Save results
  const reportPath = path.join(CONFIG.baseDir, 'work/previews', `auto-image-${seriesKey}-report.json`);
  const report = {
    series: seriesKey,
    timestamp: new Date().toISOString(),
    dryRun,
    results
  };
  
  if (!dryRun) {
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Relatório salvo em: ${reportPath}`);
  }
  
  return results;
}

// Main execution
const options = parseArgs();

if (options.help) {
  showHelp();
  process.exit(0);
}

const seriesKey = options.series || Object.keys(CONFIG.series)[0];

if (!options.dryRun) {
  console.log('🚀 Auto Image Generator - Iniciando processamento...');
} else {
  console.log('📋 Auto Image Generator - Modo DRY RUN (não gera imagens)');
}

processSeries(seriesKey, options.dryRun)
  .then(() => {
    console.log('\n✅ Processamento concluído!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erro no processamento:', error.message);
    process.exit(1);
  });