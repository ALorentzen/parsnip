<?php
// Dynamic render callback for the quote block
function parsnip_render_quote_block($attributes, $content)
{
  $quote = isset($attributes["quote"]) ? $attributes["quote"] : "";
  $reviewer = isset($attributes["reviewer"]) ? $attributes["reviewer"] : "";
  $year = isset($attributes["year"]) ? $attributes["year"] : "";

  // Debug: log attributes to PHP error log so we can confirm what's passed
  if (function_exists("error_log")) {
    error_log("parsnip_render_quote_block attributes: " . print_r($attributes, true));
  }

  ob_start();
  // If no attributes were passed, render a visible debug placeholder so we can see it in the page
  $is_empty = $quote === "" && $reviewer === "" && $year === "";
  ?>
    <blockquote class="relative max-w-2xl w-fit mx-auto my-8 p-8 bg-white rounded-xl shadow border border-zinc-200">
        <p class="text-2xl font-serif mb-4"><?php echo esc_html($quote); ?></p>
        <span class="block text-xs text-zinc-400 mb-2"><?php echo $year
          ? esc_html($year)
          : '<span class="opacity-50">Year</span>'; ?></span>
        <footer class="block text-right text-sm text-zinc-500 font-medium mt-4"><?php echo $reviewer
          ? esc_html($reviewer)
          : '<span class="opacity-50">Reviewer</span>'; ?></footer>
    </blockquote>
    <?php if ($is_empty): ?>
    <div style="border:2px dashed red;padding:8px;margin:8px 0;color:#900;background:#fff">parsnip debug: no attributes passed to PHP render. Attributes: <pre><?php echo esc_html(
      json_encode($attributes),
    ); ?></pre></div>
    <?php endif; ?>
    <?php return ob_get_clean();
}

// Intercept rendering of core/quote blocks and render via our PHP callback.
// This avoids re-registering core/quote and the associated warning.
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
