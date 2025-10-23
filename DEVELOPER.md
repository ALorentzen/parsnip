Developer Quickstart — parsnip theme
===================================

1) Key folders
- `blocks/` — block source (JS/TS). Each block in `blocks/<slug>/`.
- `inc/blocks/` — server-side render callbacks (one file per block).
- `inc/register-blocks.php` — registers block editor assets and metadata.

2) Common actions
- Build assets: `pnpm build` (creates `dist/` files used in production).
- Add a block: create `blocks/<slug>/block.json` and editor code, then build.
- Add server render: create `inc/blocks/<slug>.php` and implement
  `parsnip_render_<slug>_block($attrs, $content)`.

3) Keep it simple
- Editor UI belongs in `blocks/`.
- Frontend HTML can be server-rendered in `inc/blocks/` when you need
  deterministic output.

4) If unsure
- Leave files where they are. Ask for a small change and I’ll make it.
