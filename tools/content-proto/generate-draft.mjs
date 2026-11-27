#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { performance } from 'node:perf_hooks';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../..');
const editorial = path.join(repo, 'Posts e Conhecimento');
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-5-5';
const rates = { input: 4, output: 20 };
function args(argv) {
  const opts = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--dry-run') { opts.dryRun = true; continue; }
    if (!['--brief', '--slug', '--canal'].includes(argv[i]) || !argv[i + 1]) throw Error(`Argumento inválido: ${argv[i]}`);
    opts[argv[i].slice(2)] = argv[++i];
  }
  if (!opts.brief || !opts.slug || !opts.canal) throw Error('Uso: node generate-draft.mjs --brief "..." --slug slug --canal linkedin|medium|ambos [--dry-run]');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(opts.slug)) throw Error('slug deve conter apenas letras minúsculas, números e hífens.');
  if (!['linkedin', 'medium', 'ambos'].includes(opts.canal)) throw Error('--canal deve ser linkedin, medium ou ambos.');
  return opts;
}
function parseOutput(text, brief) {
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '');
  const tryParse = (s) => { try { return JSON.parse(s); } catch { return null; } };
  let parsed = tryParse(cleaned);
  if (!parsed) {
    const m = cleaned.match(/\{[\s\S]*\}/);
    if (m) parsed = tryParse(m[0]);
  }
  if (parsed && ['brief_refinado', 'prompt_imagem', 'conteudo'].every(k => typeof parsed[k] === 'string' && parsed[k].trim())) return parsed;
  return { brief_refinado: brief, prompt_imagem: `Direção visual editorial original para: ${brief}. Formato adaptável, sem texto legível, logotipos ou alegações não verificadas.`, conteudo: cleaned };
}
async function main() {
  const opt = args(process.argv.slice(2));
  const targets = opt.canal === 'ambos' ? ['linkedin', 'medium'] : [opt.canal];
  const mediaDir = path.join(editorial, '04-midias', opt.slug);
  await fs.mkdir(mediaDir, { recursive: true });
  const promptPath = path.join(mediaDir, `${opt.slug}.prompt.txt`);
  const statusPath = path.join(mediaDir, 'status.json');
  const crypto = await import('node:crypto');
const status = { slug: opt.slug, briefHash: crypto.default.createHash('sha256').update(`${opt.brief}|${opt.canal}`, 'utf8').digest('hex').slice(0, 16), arquivos_gerados: [], modelo: null, tokens: { entrada: 0, saida: 0 }, custo_estimado_usd: 0, latencia_ms: 0, imagem: { status: 'pendente', motivo: '' } };
  const started = performance.now();
  let output;
  if (!process.env.ANTHROPIC_API_KEY || opt.dryRun) {
    if (!opt.dryRun && !process.env.ANTHROPIC_API_KEY) status.imagem.motivo = 'PENDENTE API: ANTHROPIC_API_KEY ausente; use --dry-run para modo explícito.';
    else status.imagem.motivo = 'PENDENTE API: execução solicitada em --dry-run; chamada à Anthropic não realizada.';
    output = { brief_refinado: opt.brief, prompt_imagem: `Direção visual editorial original para: ${opt.brief}. Formato adaptável a ${targets.join(' e ')}. Sem texto legível, logotipos ou alegações factuais não verificadas.`, conteudo: `# ${opt.brief}\n\nRascunho pendente de geração pela API Anthropic. Revise e complete antes de publicar.` };
  } else {
    let Anthropic = null;
    try {
      ({ default: Anthropic } = await import('@anthropic-ai/sdk'));
    } catch {
      status.imagem.motivo = 'PENDENTE API: pacote @anthropic-ai/sdk não instalado; rode npm install em tools/content-proto ou use --dry-run.';
      output = { brief_refinado: opt.brief, prompt_imagem: `Direção visual editorial original para: ${opt.brief}. Formato adaptável a ${targets.join(' e ')}. Sem texto legível, logotipos ou alegações factuais não verificadas.`, conteudo: `# ${opt.brief}\n\nRascunho pendente de geração pela API Anthropic. Revise e complete antes de publicar.` };
    }
    if (output === undefined) {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: MODEL, max_tokens: 16000,
      system: [{ type: 'text', text: 'Você é editor de conteúdo técnico em pt-BR. Retorne apenas JSON válido com brief_refinado (string), prompt_imagem (string, direção visual detalhada, sem texto, logos ou claims não documentados) e conteudo (string, rascunho editorial genuíno, sem inventar fatos ou fontes). Adapte conteúdo aos canais solicitados, marque lacunas de evidência, inclua Registro de mídias no final.' , cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: `Canais: ${targets.join(', ')}\nSlug: ${opt.slug}\nBrief: ${opt.brief}` }],
    });
    status.modelo = response.model;
    status.tokens = { entrada: response.usage.input_tokens, saida: response.usage.output_tokens };
    status.custo_estimado_usd = Number(((status.tokens.entrada * rates.input + status.tokens.saida * rates.output) / 1_000_000).toFixed(6));
    output = parseOutput(response.content.filter(b => b.type === 'text').map(b => b.text).join('\n'), opt.brief);
    const opencode = spawnSync('opencode', ['--version'], { encoding: 'utf8', timeout: 3000 });
    status.imagem.motivo = opencode.status === 0
      ? 'PENDENTE: runtime OpenCode detectado, mas sua ferramenta generate_image não está acessível a este processo CLI; nenhum asset foi inventado.'
      : 'PENDENTE: ferramenta de geração GPT Image 2 não acessível neste processo; nenhum asset foi inventado.';
    }
  }
  status.latencia_ms = Math.round(performance.now() - started);
  await fs.writeFile(promptPath, `Brief refinado: ${output.brief_refinado}\n\nPrompt de imagem:\n${output.prompt_imagem}\n`, { flag: 'wx' }).catch(async e => { if (e.code !== 'EEXIST') throw e; await fs.writeFile(promptPath, `Brief refinado: ${output.brief_refinado}\n\nPrompt de imagem:\n${output.prompt_imagem}\n`); });
  status.arquivos_gerados.push(path.relative(editorial, promptPath));
  for (const channel of targets) {
    const draftDir = path.join(editorial, '02-conteudos', '02-rascunhos', channel);
    await fs.mkdir(draftDir, { recursive: true });
    const draftPath = path.join(draftDir, `${opt.slug}.md`);
    const mediaLink = (name) => '`' + '../../../../04-midias/' + opt.slug + '/' + name + '`';
    const draft = [
      '# ' + output.brief_refinado,
      '',
      output.conteudo,
      '',
      '## Registro de mídias',
      '',
      '- Imagem: ' + mediaLink(opt.slug + '.png') + ' (PENDENTE: ' + status.imagem.motivo + ')',
      '- Prompt: ' + mediaLink(opt.slug + '.prompt.txt'),
      '',
    ].join('\n');
    await fs.writeFile(draftPath, draft);
    status.arquivos_gerados.push(path.relative(editorial, draftPath));
  }
  // Preview completo para celular: HTML com imagem + texto do rascunho.
  const previewPath = path.join(mediaDir, `${opt.slug}.preview.html`);
  const previewHtml = `<!doctype html><html lang=pt-BR><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>${opt.slug}</title><style>body{font-family:system-ui,sans-serif;max-width:720px;margin:0 auto;padding:16px;background:#f3f6fa;color:#172234}img{width:100%;border-radius:12px}pre{white-space:pre-wrap;background:#fff;padding:16px;border-radius:12px;border:1px solid #dce3eb}h1{font-size:20px}</style></head><body><h1>${opt.slug}</h1><img src="./${opt.slug}.png" alt="imagem do post" onerror="this.style.display='none'"><pre>${output.conteudo.replace(/</g,'&lt;')}</pre></body></html>`;
  await fs.writeFile(previewPath, previewHtml);
  status.arquivos_gerados.push(path.relative(editorial, previewPath));
  status.arquivos_gerados.push(path.relative(editorial, statusPath));
  await fs.writeFile(statusPath, `${JSON.stringify(status, null, 2)}\n`);
  console.log(JSON.stringify(status, null, 2));
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
