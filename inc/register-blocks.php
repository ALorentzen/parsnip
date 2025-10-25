<?php
add_action("init", function (): void {
  $paths = parsnip_get_theme_paths();
  $blocks_dir = $paths["dir"] . "/blocks";

  if (!is_dir($blocks_dir)) {
    return;
  }

  // Register shared editor style handle
  $css = $paths["dir"] . "/dist/theme.css";
  if (is_readable($css)) {
    wp_register_style(
      "parsnip-editor-style",
      $paths["uri"] . "/dist/theme.css",
      [],
      filemtime($css),
    );
    // Enqueue the shared editor style for the block editor so Tailwind
    // utilities and theme editor styles are available inside Gutenberg.
    $editor_styles[] = "parsnip-editor-style";
  }

  $vite = parsnip_get_vite_env();
  $theme_uri = $paths["uri"];
  $editor_scripts = [];
  $editor_styles = [];

  foreach (glob($blocks_dir . "/*", GLOB_ONLYDIR) as $source_dir) {
    $metadata_path = $source_dir . "/block.json";
    if (!is_readable($metadata_path)) {
      continue;
    }

    $metadata = json_decode(file_get_contents($metadata_path) ?: "", true);
    if (!is_array($metadata) || empty($metadata["name"])) {
      continue;
    }

    $handle = $metadata["editorScript"] ?? "";
    if (!is_string($handle) || $handle === "") {
      continue;
    }

    $slug = basename($source_dir);

    $asset_path = $source_dir . "/index.asset.php";
    $asset_data = is_readable($asset_path) ? include $asset_path : [];
    $dependencies = is_array($asset_data["dependencies"] ?? null)
      ? $asset_data["dependencies"]
      : [];
    $version = $asset_data["version"] ?? null;

    // Always use built files - simpler and more reliable
    $script_path = $paths["dir"] . "/dist/blocks/{$slug}/index.js";
    if (!is_readable($script_path)) {
      continue;
    }
    $script_url = $theme_uri . "/dist/blocks/{$slug}/index.js";
    $script_version = filemtime($script_path);
    wp_register_script($handle, $script_url, $dependencies, $script_version, true);
    wp_script_add_data($handle, "type", "module");
    $editor_scripts[] = $handle;

    $style_handles = [];
    foreach (["style.css" => "style", "editor.css" => "editor_style"] as $file => $property) {
      $style_handle = sanitize_key("{$handle}-{$property}");

      $style_path = $paths["dir"] . "/dist/blocks/{$slug}/{$file}";
      if (!is_readable($style_path)) {
        continue;
      }

      wp_register_style(
        $style_handle,
        $theme_uri . "/dist/blocks/{$slug}/{$file}",
        [],
        filemtime($style_path),
      );
      $style_handles[$property] = $style_handle;
      $editor_styles[] = $style_handle;
    }

    // If a server-side helper exists in inc/blocks/<slug>.php, require it and
    // register its render callback automatically. This centralizes block
    // registration so we don't need per-block special cases.
    $server_helper = $paths["dir"] . "/inc/blocks/{$slug}.php";
    $render_callback = null;
    if (is_readable($server_helper)) {
      require_once $server_helper;
      $candidate = "parsnip_render_{$slug}_block";
      if (function_exists($candidate)) {
        $render_callback = $candidate;
      }
    }

    $options = array_filter([
      "editor_script" => $handle,
      "style" => $style_handles["style"] ?? null,
      "editor_style" => $style_handles["editor_style"] ?? null,
    ]);
    if ($render_callback !== null) {
      $options["render_callback"] = $render_callback;
    }

    register_block_type_from_metadata($source_dir, $options);
  }

  if ($editor_scripts !== []) {
    add_action(
      "enqueue_block_editor_assets",
      static function () use ($editor_scripts, $editor_styles, $theme_uri): void {
        foreach (array_unique($editor_scripts) as $script_handle) {
          wp_enqueue_script($script_handle);
        }
        foreach (array_unique($editor_styles) as $style_handle) {
          wp_enqueue_style($style_handle);
        }

        // Debugging helper: attach an inline script to the first editor script
        // to log whether the theme editor CSS is present in the editor page.
        $first = array_values(array_unique($editor_scripts))[0] ?? null;
        if ($first !== null && is_string($first)) {
          $css_url = $theme_uri . "/dist/theme.css";
          $js =
            "(() => {\n" .
            "  try {\n" .
            "    const found = !!document.querySelector('link[href\\*=" .
            '\"/dist/theme.css\"' .
            "]');\n" .
            "    console.log('parsnip: editor CSS present?', found, 'css url:', '" .
            esc_js($css_url) .
            "');\n" .
            "    console.log('parsnip: stylesheets:', Array.from(document.styleSheets).map(s=>s.href).filter(Boolean));\n" .
            "  } catch (e) { console.log('parsnip: editor css check failed', e); }\n" .
            "})();";
          wp_add_inline_script($first, $js);
        }
      },
      1,
    );

    // Extra debug: ensure we log in the admin footer for block editor pages.
    // This helps verify the editor page is loading and whether stylesheets are present.
    add_action(
      "admin_print_footer_scripts",
      function (): void {
        if (!function_exists("get_current_screen")) {
          return;
        }
        $screen = get_current_screen();
        if (!$screen || !property_exists($screen, "is_block_editor") || !$screen->is_block_editor) {
          return;
        }

        // Print a tiny script that logs stylesheet URLs and a marker.
        echo "<script>console.log('parsnip: admin footer loaded'); try{console.log('parsnip: stylesheets', Array.from(document.styleSheets).map(s=>s.href).filter(Boolean));}catch(e){console.log('parsnip: footer log failed', e);} </script>";
      },
      999,
    );
  }
  // We rely on the render_block interception (inc/blocks/quote.php) to
  // render core/quote server-side. Avoid re-registering core blocks here to
  // prevent duplicate registration warnings. The theme-specific quote block
  // (if present) is registered above via register_block_type_from_metadata.
});
