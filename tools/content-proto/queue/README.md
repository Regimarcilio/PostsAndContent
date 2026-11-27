# Fila local do protótipo (RF-012)

Jobs em `queue/jobs/*.json` (exceto os que começam com `_`). Formato:

```json
{
  "slug": "meu-post",
  "brief": "Brief editorial completo",
  "canal": "linkedin|medium|ambos",
  "dryRun": true
}
```

## Enfileirar
Crie um arquivo `queue/jobs/<slug>.json` seguindo o formato acima.

## Rodar
```bash
node queue-worker.mjs            # processa todos os jobs
node queue-worker.mjs --force    # refaz mesmo com brief-hash igual
```

## Resultados
`queue/results/<slug>.result.json` agrega tokens, custo, latência e status da imagem.

## Idempotência
Se `Posts e Conhecimento/04-midias/<slug>/status.json` tiver o mesmo `briefHash`, o job é pulado (a menos que `--force`).

## Segurança
O worker nunca publica, agenda, envia ou commita nada. Somente gera rascunhos e pendências.
```