# Painel editorial móvel

Painel local para enviar pedidos editoriais ou de documentação pelo navegador,
acompanhar uma fila SQLite e revisar os arquivos produzidos pelo OpenCode.
O servidor escuta somente em `127.0.0.1`; Tailscale Serve disponibiliza o painel
privadamente aos dispositivos autorizados no tailnet.

## Requisitos

- Python 3.10+ (biblioteca padrão; sem `pip install`).
- OpenCode instalado e autenticado no mesmo usuário que executará o serviço.
- Tailscale no PC e no celular, conectado à mesma conta/tailnet.
- HTTPS habilitado no tailnet para usar Tailscale Serve.

## Iniciar

No PC autenticado no Tailscale, na raiz do repositório. Se a conta não for
detectada automaticamente, defina o login da sua conta no ambiente do processo:

```bash
export EDITORIAL_ALLOWED_TAILSCALE_USER="seu-login-da-conta-tailscale"
python3 tools/editorial-dashboard/server.py
```

Em outro terminal do PC:

```bash
tailscale serve 8787
```

O Tailscale imprime o endereço HTTPS privado. Abra esse endereço no navegador do
celular com o Tailscale conectado. O painel valida o cabeçalho de identidade
`Tailscale-User-Login` e exige correspondência com a conta autorizada; o backend
permanece ligado a localhost.

## Como funciona

- O formulário aceita `Edição` ou `Documentação`. Edições pedem escolha entre
  LinkedIn, Medium e Ambos.
- Os pedidos ficam em `.state/jobs.sqlite3` e são processados um por vez pelo
  worker. Por padrão (COM `EDITORIAL_CONTENT_PROTO=1`), pedidos editoriais usam
  o fluxo `tools/content-proto` (API Anthropic → rascunho + status.json). Com
  `EDITORIAL_CONTENT_PROTO=0`, volta ao worker `opencode run --auto --model
  omniroute/Project-Free` (imagem GPT Image 2). Variáveis:
  - `ANTHROPIC_API_KEY` — habilita chamada real; ausente = dry-run (pendente)
  - `EDITORIAL_OPENCODE_MODEL` — modelo do modo opencode
- Os rascunhos, assets e documentos são escritos no working tree do repositório.
- A página atualiza a fila a cada cinco segundos, mostra os arquivos alterados,
  incorpora imagens, abre prévias HTML em um iframe isolado e mostra a evolução
  por fases ao selecionar um pedido.
- `Aprovar entrega` registra a revisão humana. Não faz commit, push, publicação,
  agendamento nem envio externo.
- `Pedir ajustes` reenvia o pedido ao worker com o feedback e orienta a revisão
  dos arquivos existentes.
- Tarefas com falha podem ser reenfileiradas manualmente; uma tentativa pode já
  ter produzido arquivos ou consumido créditos.
- Se o serviço reiniciar durante uma tarefa, ela fica como `interrupted` para
  evitar repetir automaticamente geração de imagem que possa consumir créditos.

O banco local e os caches Python são ignorados pelo Git. Nenhuma chave de API deve
ser inserida no formulário ou salva neste diretório.
