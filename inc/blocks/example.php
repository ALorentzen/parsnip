<?php
/**
 * Example server-side render callback template
 *
 * Copy this file to `inc/blocks/<slug>.php` and adapt the function name and
 * markup when you need a server-side render callback for a block.
 *
 * Two options to wire this up:
 * 1) In `register-blocks.php`, when calling register_block_type_from_metadata(),
 *    include `"render_callback" => "parsnip_render_example_block"` in the
 *    options array for that block.
 * 2) Use a `render_block` filter to intercept rendering for a core block (the
 *    pattern used for the quote block in this theme).
 */

function parsnip_render_example_block($attributes, $content)
{
  $text = isset($attributes["text"]) ? $attributes["text"] : "";

  ob_start();
  ?>
  <div class="parsnip-example bg-white p-4 rounded shadow">
    <div class="text-sm text-zinc-500">Example server-rendered block</div>
    <div class="mt-2 text-base font-medium"><?php echo esc_html($text); ?></div>
  </div>
  <?php return ob_get_clean();
}
