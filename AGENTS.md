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

When a publication needs an image, Codex owns image generation through the GPT
image-generation capability available in its runtime. Use the
`publication-image-generation` skill, save image candidates under
`Posts e Conhecimento/04-midias/<slug>/`, and reference them in the draft's
`Registro de mídias`. Use GPT for all new publication artwork, regardless of
channel; do not substitute another provider or a script-based image generator.
If the image tool is unavailable, report that limitation.

Image generation creates a local draft asset only. Never publish, schedule,
upload, or send content externally without explicit user approval.

The unrelated `ndd-pulse-repository-router` skill is intentionally not exposed
as a project skill: it depends on a machine-specific path and concerns a
different repository.
