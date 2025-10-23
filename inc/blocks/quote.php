<?php
/*
 * Server-authoritative renderer for the quote block
 * ------------------------------------------------
 * - Editor UI lives in: blocks/quote/
 * - This file renders the frontend HTML so the site output is always
 *   deterministic (used to override core/quote via a render_block filter).
 * Keep JS for editor, PHP for frontend rendering. Small, clear separation.
 */
function parsnip_render_quote_block($attributes, $content)
{
  $quote = isset($attributes["quote"]) ? $attributes["quote"] : "";
  $reviewer = isset($attributes["reviewer"]) ? $attributes["reviewer"] : "";
  $year = isset($attributes["year"]) ? $attributes["year"] : "";

  ob_start();
  $is_empty = $quote === "" && $reviewer === "" && $year === "";
  ?>
    <blockquote class="relative max-w-2xl w-full mx-auto my-8 p-8 bg-white rounded-xl shadow border border-zinc-200">
        <p class="text-2xl font-serif mb-4"><?php echo esc_html($quote); ?></p>
        <span class="block text-xs text-zinc-400 mb-2"><?php echo $year
          ? esc_html($year)
          : '<span class="opacity-50">Year</span>'; ?></span>
        <footer class="block text-right text-sm text-zinc-500 font-medium mt-4"><?php echo $reviewer
          ? esc_html($reviewer)
          : '<span class="opacity-50">Reviewer</span>'; ?></footer>
    </blockquote>
    <?php /* Intentionally no visible debug output in production. */
  ?>
    <?php return ob_get_clean();
}

// Intercept rendering of core/quote blocks and render via our PHP callback.
add_filter(
  "render_block",
  function ($block_content, $block) {
    $name = isset($block["blockName"]) ? $block["blockName"] : "";
    if ($name !== "core/quote") {
      return $block_content;
    }
    $attrs = isset($block["attrs"]) ? $block["attrs"] : [];
    return parsnip_render_quote_block($attrs, $block_content);
  },
  10,
  2,
);
