#!/usr/bin/env node
// Worker da fila local (RF-012): consome jobs/*.json, idempotente por slug,
// chama generate-draft.mjs como subprocesso, agrega resultado em results/.
// Nunca publica, agenda ou envia nada externo.
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../..');
const editorial = path.join(repo, 'Posts e Conhecimento');
const queueDir = path.join(here, 'queue', 'jobs');
const resultsDir = path.join(here, 'queue', 'results');
const force = process.argv.includes('--force');

const hash = (s) => crypto.createHash('sha256').update(s, 'utf8').digest('hex').slice(0, 16);

async function main() {
  await fs.mkdir(resultsDir, { recursive: true });
  const files = (await fs.readdir(queueDir).catch(() => [])).filter(f => f.endsWith('.json') && !f.startsWith('_'));
  if (!files.length) { console.log('Fila vazia: nenhum job em queue/jobs/*.json'); return; }
  for (const file of files) {
    const jobPath = path.join(queueDir, file);
    const job = JSON.parse(await fs.readFile(jobPath, 'utf8'));
    const { slug, brief, canal = 'ambos', dryRun = true } = job;
    if (!slug || !brief) { console.error(`Job inválido ${file}: requer slug + brief`); continue; }
    const briefHash = hash(`${brief}|${canal}`);
    const statusPath = path.join(editorial, '04-midias', slug, 'status.json');
    const resultPath = path.join(resultsDir, `${slug}.result.json`);
    if (!force) {
      try {
        const prev = JSON.parse(await fs.readFile(statusPath, 'utf8'));
        if (prev.briefHash === briefHash) {
          console.log(`[${slug}] idempotente: mesmo brief-hash, pulando (use --force para refazer)`);
          await fs.writeFile(resultPath, JSON.stringify({ slug, skipped: true, briefHash, at: new Date().toISOString() }, null, 2) + '\n');
          continue;
        }
      } catch { /* sem status anterior: prossegue */ }
    }
    const args = ['generate-draft.mjs', '--brief', brief, '--slug', slug, '--canal', canal];
    if (dryRun || !process.env.ANTHROPIC_API_KEY) args.push('--dry-run');
    const started = Date.now();
    const r = spawnSync('node', args, { cwd: here, encoding: 'utf8', timeout: 120000 });
    const latency = Date.now() - started;
    let status = null;
    try { status = JSON.parse(await fs.readFile(statusPath, 'utf8')); } catch {}
    const result = {
      slug, briefHash, canal, dryRun: args.includes('--dry-run'),
      exitCode: r.status, latency_ms: latency,
      stdout_tail: (r.stdout || '').slice(-2000), stderr_tail: (r.stderr || '').slice(-2000),
      status, at: new Date().toISOString(),
    };
    await fs.writeFile(resultPath, JSON.stringify(result, null, 2) + '\n');
    console.log(`[${slug}] exit=${r.status} lat=${latency}ms status=${status?.imagem?.status ?? '?'}`);
  }
}
main().catch(e => { console.error(e.message); process.exitCode = 1; });
