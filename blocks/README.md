Blocks: edit under `blocks/<slug>/` (editor) or `inc/blocks/<slug>.php` (server render).

Example `block.json` (minimal):

{
  "apiVersion": 2,
  "name": "theme/quote",
  "title": "Quote",
  "category": "theme",
  "editorScript": "theme-quote-editor",
  "attributes": {
    "quote": { "type": "string" },
    "reviewer": { "type": "string" },
    "year": { "type": "string" }
  }
}

If you use a server render callback, the `inc/register-blocks.php` loader will
include `"render_callback" => "parsnip_render_<slug>_block"` when registering
the block if present.
