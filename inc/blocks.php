<?php
add_action("init", function (): void {
  $paths = parsnip_get_theme_paths();
  $blocks_dir = $paths["dir"] . "/blocks";

  if (!is_dir($blocks_dir)) {
    return;
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

    if ($vite["is_up"]) {
      $script_url = $vite["origin"] . $vite["theme_path"] . "/blocks/{$slug}/index.tsx";
      wp_register_script($handle, $script_url, $dependencies, $version, true);
    } else {
      $script_path = $paths["dir"] . "/dist/blocks/{$slug}/index.js";
      if (!is_readable($script_path)) {
        continue;
      }
      $script_url = $theme_uri . "/dist/blocks/{$slug}/index.js";
      $script_version = filemtime($script_path);
      wp_register_script($handle, $script_url, $dependencies, $script_version, true);
    }
    wp_script_add_data($handle, "type", "module");
    $editor_scripts[] = $handle;

    $style_handles = [];
    foreach (["style.css" => "style", "editor.css" => "editor_style"] as $file => $property) {
      $style_handle = sanitize_key("{$handle}-{$property}");

      if ($vite["is_up"]) {
        $style_url = $vite["origin"] . $vite["theme_path"] . "/blocks/{$slug}/{$file}";
        wp_register_style($style_handle, $style_url, [], null);
        $style_handles[$property] = $style_handle;
        $editor_styles[] = $style_handle;
        continue;
      }

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

    register_block_type_from_metadata(
      $source_dir,
      array_filter([
        "editor_script" => $handle,
        "style" => $style_handles["style"] ?? null,
        "editor_style" => $style_handles["editor_style"] ?? null,
      ]),
    );
  }

  if ($editor_scripts !== []) {
    add_action(
      "enqueue_block_editor_assets",
      static function () use ($editor_scripts, $editor_styles): void {
        foreach (array_unique($editor_scripts) as $script_handle) {
          wp_enqueue_script($script_handle);
        }
        foreach (array_unique($editor_styles) as $style_handle) {
          wp_enqueue_style($style_handle);
        }
      },
      1,
    );
  }
});
