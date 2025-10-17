<?php

function gutenberg_order_filter($content)
{
  // Safety check - if no content, return as-is
  if (empty($content)) {
    return $content;
  }

  // Safety check - if not a string, return as-is
  if (!is_string($content)) {
    return $content;
  }

  $blocks = parse_blocks($content);

  // Safety check - if parsing failed, return original
  if (!is_array($blocks)) {
    return $content;
  }

  $blocks = array_filter($blocks, function ($block) {
    return !empty($block["blockName"]);
  });

  $blocks = array_values($blocks);

  // If no blocks found, return original content
  if (empty($blocks)) {
    return $content;
  }

  $new_content = "";
  foreach ($blocks as $block) {
    $rendered = render_block($block);
    if ($rendered) {
      $new_content .= $rendered;
    }
  }

  // If rendering failed, return original
  if (empty($new_content)) {
    return $content;
  }

  return $new_content;
}
