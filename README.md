Parsnip theme — quick map

- Source: `blocks/` — editor code, one folder per block (block.json + editor TSX).
- Server renderers: `inc/blocks/` — PHP render callbacks (one file per block).
- Registration: `inc/register-blocks.php` (assets + register_block_type_from_metadata).
- Build: `pnpm build` (creates `dist/` used by the theme).
- Dev: edit `blocks/` files, run `pnpm build`, then refresh WP editor.

If you want to change frontend HTML for a block, edit `inc/blocks/<slug>.php`.
If you want to change editor UI, edit `blocks/<slug>/`.

That's it. No long manuals — open the two folders above and start.
