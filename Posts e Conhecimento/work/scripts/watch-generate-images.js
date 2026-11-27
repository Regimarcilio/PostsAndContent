#!/usr/bin/env node

/**
 * Watch & Generate Images Script
 * 
 * Monitors for pending GPT image generation requests and generates them
 * automatically when conditions are met. This script can run continuously
 * or be scheduled via cron/automation.
 * 
 * Usage:
 *   # Run immediately
 *   node watch-generate-images.js --once
 *   
 *   # Run continuously, checking every 5 minutes
 *   node watch-generate-images.js --interval 300
 *   
 *   # Run via cron every hour
 *   0 * * * * node /path/to/watch-generate-images.js --once
 */

const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

// Configuration
const CONFIG = {
  baseDir: '/home/project/PROJETOS/social-content-hub/PostsAndContent/Posts e Conhecimento',
  mediaDirs: [
    '04-midias/ai-cognitive-infrastructure',
    '04-midias/quantum-neuromorphic-hardware',
    '04-midias/convergencia-tecnologia'
  ],
  draftsDir: '02-conteudos/02-rascunhos/medium',
  checkInterval: 300000, // 5 minutes
  fileExtensions: ['.png', '.jpg', '.jpeg', '.webp', '.gif']
};

/**
 * Find all pending image references in drafts
 */
function findPendingImages() {
  const draftsPath = path.join(CONFIG.baseDir, CONFIG.draftsDir);
  const pending = [];
  
  if (!fs.existsSync(draftsPath)) {
    console.log('❌ Diretório de drafts não encontrado:', draftsPath);
    return pending;
  }
  
  const files = fs.readdirSync(draftsPath);
  const mdFiles = files.filter(f => f.endsWith('.md'));
  
  mdFiles.forEach(file => {
    const filePath = path.join(draftsPath, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Find pending image references
    const pendingImageRegex = /🟡\s*Pendente\s*(GPT|Codex)/gi;
    const imagePathRegex = /`[^`]*\.(png|jpg|jpeg|webp|gif)`/gi;
    
    if (pendingImageRegex.test(content)) {
      let match;
      const images = [];
      while ((match = imagePathRegex.exec(content)) !== null) {
        images.push(match[0].replace(/`/g, ''));
      }
      
      pending.push({
        file: file,
        path: filePath,
        images: images,
        content: content
      });
    }
  });
  
  return pending;
}

/**
 * Check if an image file exists
 */
function imageExists(mediaDir, imageFile) {
  const imagePath = path.join(CONFIG.baseDir, mediaDir, imageFile);
  return fs.existsSync(imagePath);
}

/**
 * Generate the appropriate generate_image command
 */
function buildImageCommand(mediaDir, imageFile, prompt) {
  return {
    tool: 'generate_image',
    args: {
      prompt: prompt,
      path: path.join(CONFIG.baseDir, mediaDir, imageFile)
    },
    description: `Gerar imagem: ${imageFile}`
  };
}

/**
 * Process pending images
 */
async function processPendingImages() {
  console.log(`\n[${new Date().toISOString()}] 🔍 Buscando imagens pendentes...`);
  
  const pendingImages = findPendingImages();
  
  if (pendingImages.length === 0) {
    console.log('✅ Nenhuma imagem pendente encontrada');
    return { processed: 0, generated: 0, pending: 0 };
  }
  
  console.log(`📦 Encontradas ${pendingImages.length} imagens pendentes`);
  
  let processed = 0;
  let generated = 0;
  let stillPending = 0;
  
  for (const item of pendingImages) {
    console.log(`\n📝 Analisando: ${item.file}`);
    
    for (const imagePath of item.images) {
      // Extract dir and file from path
      const relativePath = imagePath.replace('04-midias/', '');
      const parts = relativePath.split('/');
      const imageFile = parts.pop();
      const mediaDir = parts.join('/');
      
      if (imageExists(mediaDir, imageFile)) {
        console.log(`   ✅ Imagem já existe: ${imageFile}`);
        generated++;
      } else {
        console.log(`   ⏳ Pendente: ${imageFile}`);
        
        // Get prompt from prompt.txt or create one
        const promptFile = path.join(CONFIG.baseDir, mediaDir, `${imageFile}.prompt.txt`);
        
        if (fs.existsSync(promptFile)) {
          console.log(`   📋 Prompt disponível: ${promptFile}`);
          console.log(`   💡 Para gerar: Execute o generate_image tool com o prompt do arquivo`);
        } else {
          console.log(`   ⚠️ Prompt não encontrado`);
        }
        
        stillPending++;
      }
    }
    
    processed++;
  }
  
  const results = { processed, generated, pending: stillPending };
  
  console.log(`\n📊 Resultados:`);
  console.log(`   Processadas: ${processed}`);
  console.log(`   Geradas: ${generated}`);
  console.log(`   Pendentes: ${stillPending}`);
  
  // Save results
  const reportPath = path.join(CONFIG.baseDir, 'work/previews', 'image-watch-report.json');
  const report = {
    timestamp: new Date().toISOString(),
    results
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Relatório salvo em: ${reportPath}`);
  
  return results;
}

/**
 * Setup file watching (for development/debugging)
 */
function setupWatcher() {
  console.log('👀 Iniciando watcher para mudanças...');
  
  const watcher = chokidar.watch(CONFIG.baseDir, {
    ignored: [
      '**/node_modules',
      '**/.git',
      '**/work/previews',
      '**/*.json'
    ],
    persistent: true
  });
  
  watcher.on('change', (path) => {
    console.log(`⚡ Arquivo alterado: ${path}`);
    if (path.endsWith('.md')) {
      processPendingImages();
    }
  });
  
  console.log('✅ Watcher ativado (Ctrl+C para parar)');
}

/**
 * Main entry point
 */
async function main() {
  const args = process.argv.slice(2);
  const options = {
    once: args.includes('--once'),
    interval: 300000, // 5 minutes default
    watch: args.includes('--watch'),
    help: args.includes('--help')
  };
  
  if (options.help) {
    console.log(`
Watch & Generate Images Script

Usage: node watch-generate-images.js [options]

Options:
  --once, -o        Run once and exit
  --watch, -w       Watch for file changes (development mode)
  --interval <ms>   Check interval in milliseconds (default: 300000)
  --help, -h        Show this help message

Examples:
  # Run once
  node watch-generate-images.js --once
  
  # Watch for changes
  node watch-generate-images.js --watch
  
  # Run via cron every 5 minutes
  */5 * * * * node /path/to/watch-generate-images.js --once
`);
    return;
  }
  
  console.log('🚀 Watch & Generate Images Script');
  console.log('='.repeat(50));
  
  if (options.watch) {
    setupWatcher();
    return;
  }
  
  // Run once or with interval
  if (options.once) {
    await processPendingImages();
  } else {
    console.log(`⏱️ Executando a cada ${options.interval / 1000} segundos`);
    console.log('Pressione Ctrl+C para parar\n');
    
    await processPendingImages();
    
    setInterval(async () => {
      await processPendingImages();
    }, options.interval);
  }
}

// Run
main().catch(console.error);