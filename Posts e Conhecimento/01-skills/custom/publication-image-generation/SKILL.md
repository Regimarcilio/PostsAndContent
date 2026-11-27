---
name: publication-image-generation
description: Use for every Medium or LinkedIn editorial request; prioritize an original GPT-generated image and track it in the channel drafts.
---

# Publication image generation

Codex owns the image model and visual quality. In OpenCode 2.2.1 or later, use
OpenCode's native `generate_image` tool with the user's Codex sign-in and the
configured `openai/gpt-image-2` model. This is the automatic handoff path: do not
ask the user to move the brief to another session. In a Codex session, use its
built-in GPT image generation capability directly.

## Workflow

1. Read the project `AGENTS.md`, `config.yml`, the source material, and
   `04-midias/` assets for the same topic. Identify the central angle and audience
   before drafting the image brief.
2. Treat one original image as a standard deliverable for every editorial
   request. Build the visual concept as soon as the angle is clear and generate
   the image before polishing the final channel drafts. Create one new original
   image for each editorial concept. For LinkedIn and Medium versions of the
   same concept, reuse that image when it fits both placements. An explicit
   text-only request overrides this default.
3. Build the image brief from the publication's actual topic, audience, channel,
   visual hierarchy, aspect ratio, and intended placement. Do not add factual
   claims, logos, signatures, or legible text unless the user requests them and
   the source material supports them. For animated assets, follow
   `animated-content-us-english`.
4. Attempt generation with the GPT image tool. In OpenCode, confirm that
   `generate_image` is available and select the configured GPT Image 2 model. If
   the capability is unavailable, report the runtime limitation and mark the
   image as pending while completing the text and dashboard without implying an
   image exists. Do not call an API, use Midjourney, fabricate a placeholder,
   or silently switch providers.
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
