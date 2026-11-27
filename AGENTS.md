# Repository entry point

The editorial project lives in `Posts e Conhecimento/`. Treat that directory as
the editorial workspace and read its `AGENTS.md` and `config.yml` before doing
editorial work. Keep content paths relative to that directory and preserve the
existing folder structure.

This repository supports Codex and OpenCode. The canonical editorial rules,
skills, content, references, and media remain under `Posts e Conhecimento/`.
Codex launchers in `.agents/skills/` point to those canonical skill files;
follow the source file and resolve its supporting files relative to its own
directory. OpenCode uses the root `.opencode/opencode.json` adapter and the
same canonical sources.

For every editorial post or edition, prioritize one original GPT-generated
image as a standard deliverable, regardless of channel. Once the angle and
visual concept are clear, use the `publication-image-generation` skill before
finishing the channel drafts. Save the asset under
`Posts e Conhecimento/04-midias/<slug>/` and reference it in each applicable
draft's `Registro de mídias`. Reuse the same image across channels when it fits.
Use GPT for all new publication artwork; do not substitute another provider or
a script-based image generator. If the image tool is unavailable, attempt the
configured runtime capability, report the limitation, and mark the image as
pending.

After the complete edition is ready—including its image or an explicit pending
status, channel drafts, language versions, and posting details—generate the
editorial HTML dashboard and open it immediately with the runtime's file-preview
action when available. If the runtime cannot open local files, return the
dashboard link and state that it was generated but not opened.

Image generation creates a local draft asset only. Never publish, schedule,
upload, or send content externally without explicit user approval.

The unrelated `ndd-pulse-repository-router` skill is intentionally not exposed
as a project skill: it depends on a machine-specific path and concerns a
different repository.

## Mobile editorial dashboard

The local request and review service lives in `tools/editorial-dashboard/`;
its instructions are in that directory's `README.md`. Keep the editorial source
of truth under `Posts e Conhecimento/` and the dashboard implementation separate.
The service binds to localhost and is reached remotely through private Tailscale
Serve. Preserve its identity check and do not expose the OpenCode server/API
directly to the phone or public internet. The worker may write drafts and
documentation into this repository, but approval in the dashboard does not
authorize publishing, scheduling, external sending, commit, or push.
