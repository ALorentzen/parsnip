<?php
add_action("init", function (): void {
  $base = get_theme_file_path("dist/blocks");
  if (!is_dir($base)) {
    return;
  }
  foreach (glob($base . "/*", GLOB_ONLYDIR) as $dir) {
    if (is_file($dir . "/block.json")) {
      register_block_type_from_metadata($dir);
    }
  }
});
