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

/**
 * Add column span classes to gallery images based on user settings
 */
add_filter(
  "render_block",
  function ($block_content, $block) {
    if ($block["blockName"] !== "core/gallery") {
      return $block_content;
    }

    $image_sizes = $block["attrs"]["imageSizes"] ?? [];

    if (empty($image_sizes)) {
      return $block_content;
    }

    // Parse the HTML and add col-span-X classes to each figure based on its image ID
    $dom = new DOMDocument();
    @$dom->loadHTML(
      '<?xml encoding="UTF-8">' . $block_content,
      LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD,
    );

    $figures = $dom->getElementsByTagName("figure");

    foreach ($figures as $figure) {
      $imgs = $figure->getElementsByTagName("img");
      if ($imgs->length === 0) {
        continue;
      }

      $img = $imgs->item(0);
      $img_id = $img->getAttribute("data-id");

      // Try to extract ID from class if data-id not present
      if (!$img_id) {
        $classes = $img->getAttribute("class");
        if (preg_match("/wp-image-(\d+)/", $classes, $matches)) {
          $img_id = $matches[1];
        }
      }

      if ($img_id && isset($image_sizes[$img_id])) {
        $col_span = (int) $image_sizes[$img_id];
        // Ensure col span is between 1-3
        $col_span = max(1, min(3, $col_span));
        $existing_class = $figure->getAttribute("class");
        $figure->setAttribute("class", trim($existing_class . " col-span-" . $col_span));
      }
    }

    return $dom->saveHTML();
  },
  10,
  2,
);
