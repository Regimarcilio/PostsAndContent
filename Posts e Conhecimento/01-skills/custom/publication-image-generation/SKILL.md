---
name: publication-image-generation
description: Use when a Medium or LinkedIn draft needs an original image; generate the asset with the GPT image-generation capability available in Codex and track it in the editorial draft.
---

# Publication image generation

Codex owns generation of original publication images in this project. Use the
GPT image-generation tool available in the active Codex runtime. OpenCode may
review and reference the resulting asset but must not generate, render, or
compose a replacement. The LinkedIn skill may still be used for copy, checks,
and previews; route static image creation to this skill.

## Workflow

1. Read the project `AGENTS.md`, `config.yml`, the relevant draft, its source
   material, and `04-midias/` assets for the same topic.
2. Decide whether the publication needs a new image. Reuse an appropriate,
   rights-cleared existing asset when one already fits; do not create redundant
   variants. If no image is needed, say so and continue without one.
3. Build the image brief from the publication's actual topic, audience, channel,
   visual hierarchy, aspect ratio, and intended placement. Do not add factual
   claims, logos, signatures, or legible text unless the user requests them and
   the source material supports them. For animated assets, follow
   `animated-content-us-english`.
4. Generate with the GPT image tool. If that capability is unavailable in the
   current Codex runtime, stop and report the limitation. Do not call an API,
   use Midjourney, fabricate a placeholder, or silently switch providers.
   Do not use the LinkedIn skill's local image-rendering scripts as a substitute
   for GPT-generated publication artwork.
5. Save the generated result under
   `04-midias/<publication-slug>/`, using a descriptive lowercase kebab-case
   filename and a suitable raster format. Preserve the original generated
   asset; do not overwrite an existing file. If the tool cannot save directly,
   use its supported file-output mechanism and confirm the resulting path.
6. Review the image against the brief for visible errors, unintended text,
   misleading visuals, and suitability for the channel. If it needs correction,
   regenerate and keep only the selected candidate in the publication folder.
7. Add the relative file link and intended use to the draft's `## Registro de
   mídias` section. Keep notes outside the publishable text and run the media
   reference audit command.
8. Include the image path and any unresolved visual or factual concern in the
   handoff. The asset remains a draft until the user approves it.

## Boundaries

- This skill creates local draft assets only. It never uploads, publishes,
  schedules, or sends them to an external service.
- Do not claim that an image depicts a real event, person, product, or measured
  result unless that depiction is grounded in supplied source material.
- Do not save generated media outside `04-midias/` unless the user requests a
  different destination.
- Do not expose credentials or route image generation through an API key.
