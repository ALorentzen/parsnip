<?php
/**
 * Theme include index
 *
 * Purpose: provide a single, documented place to require theme "inc/" files in a
 * deterministic order. This keeps `functions.php` tidy and avoids implicit glob
 * includes that are hard to track.
 *
 * Loading order notes:
 *  - files in inc/blocks/ define server render callbacks and helpers used by
 *    block registration code
 *  - register-blocks.php registers block editor assets and block type metadata
 *  - filters.php contains content/post-rendering filters used site-wide
 */

$inc_dir = get_theme_file_path("inc");

// Render helpers and server-side block renderers
// Load individual server-side block helpers from inc/blocks/
$blocks_inc_dir = $inc_dir . "/blocks";
if (is_dir($blocks_inc_dir)) {
  foreach (glob($blocks_inc_dir . "/*.php") ?: [] as $file) {
    require_once $file;
  }
}

// Block registration and block editor assets
if (is_readable($inc_dir . "/register-blocks.php")) {
  require_once $inc_dir . "/register-blocks.php";
}

// Misc filters and content transforms
if (is_readable($inc_dir . "/filters.php")) {
  require_once $inc_dir . "/filters.php";
}

// Add future explicit includes here (do not use glob()).
