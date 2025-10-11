<?php
add_action("wp_enqueue_scripts", function () {
  if (is_admin()) {
    return;
  }

  $dir = get_theme_file_path();
  $uri = get_stylesheet_directory_uri();

  // Tailwind (CLI output)
  $css = $dir . "/dist/theme.css";
  if (is_readable($css)) {
    wp_enqueue_style("parsnip-css", $uri . "/dist/theme.css", [], filemtime($css));
  }

  // Dev: Vite on plain HTTP localhost:5173
  $dev_origin = "http://localhost:5173";
  $s = @fsockopen("127.0.0.1", 5173, $e, $m, 0.05);
  if ($s) {
    fclose($s);
    wp_enqueue_script("vite-client", $dev_origin . "/@vite/client", [], null, true);
    wp_script_add_data("vite-client", "type", "module");

    wp_enqueue_script("parsnip-dev", $dev_origin . "/assets/js/main.tsx", [], null, true);
    wp_script_add_data("parsnip-dev", "type", "module");
    return; // stop here in dev
  }

  // Prod: manifest
  $manifest = $dir . "/dist/.vite/manifest.json";
  if (is_readable($manifest)) {
    $m = json_decode(file_get_contents($manifest), true) ?: [];
    $entry = "assets/js/main.tsx";

    if (!empty($m[$entry]["file"])) {
      $file = ltrim($m[$entry]["file"], "/");
      $path = $dir . "/dist/" . $file;
      wp_enqueue_script(
        "parsnip",
        $uri . "/dist/" . $file,
        [],
        file_exists($path) ? filemtime($path) : null,
        true,
      );
      wp_script_add_data("parsnip", "type", "module");
    }
    foreach ($m[$entry]["css"] ?? [] as $i => $rel) {
      $rel = ltrim($rel, "/");
      $cpath = $dir . "/dist/" . $rel;
      wp_enqueue_style(
        "parsnip-vite-$i",
        $uri . "/dist/" . $rel,
        [],
        file_exists($cpath) ? filemtime($cpath) : null,
      );
    }
    return;
  }

  // Fallback
  $plain = $dir . "/dist/assets/main.js";
  if (is_readable($plain)) {
    wp_enqueue_script("parsnip", $uri . "/dist/assets/main.js", [], filemtime($plain), true);
    wp_script_add_data("parsnip", "type", "module");
  }
});
