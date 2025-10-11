<?php

// Ensure ACF JSON directory exists so local field groups can be stored in Git.
add_action("init", function () {
  $json_dir = get_stylesheet_directory() . "/_acf-json";
  if (!is_dir($json_dir)) {
    wp_mkdir_p($json_dir);
  }
});

// Save ACF field groups to the theme-local JSON folder.
add_filter("acf/settings/save_json", function () {
  return get_stylesheet_directory() . "/_acf-json";
});

// Also load ACF field groups from the same folder.
add_filter("acf/settings/load_json", function ($paths) {
  $paths[] = get_stylesheet_directory() . "/_acf-json";
  return array_unique(array_filter($paths));
});

// Front-end asset loader: prefer Vite dev server, otherwise fall back to built files.
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

  $site_url = home_url("/");
  $site_host = parse_url($site_url, PHP_URL_HOST) ?: "localhost";
  $site_scheme = parse_url($site_url, PHP_URL_SCHEME) ?: "http";

  $dev_protocol = strtolower(getenv("VITE_DEV_PROTOCOL") ?: $site_scheme);
  $dev_protocol = $dev_protocol === "http" ? "http" : "https";

  $dev_host = getenv("VITE_DEV_HOST") ?: $site_host;
  $dev_port = (int) (getenv("VITE_DEV_PORT") ?: 5173);

  $default_port = $dev_protocol === "https" ? 443 : 80;
  $port_segment = $dev_port === $default_port ? "" : ":" . $dev_port;
  $dev_origin = sprintf("%s://%s%s", $dev_protocol, $dev_host, $port_segment);

  $theme_path = parse_url($uri, PHP_URL_PATH) ?: "/wp-content/themes/parsnip";
  $theme_path = rtrim($theme_path, "/");

  $dev_up = false;
  foreach (array_unique([$dev_host, "127.0.0.1", "localhost"]) as $probe_host) {
    $socket = @fsockopen($probe_host, $dev_port, $errno, $errstr, 0.05);
    if ($socket) {
      fclose($socket);
      $dev_up = true;
      break;
    }
  }

  if ($dev_up) {
    $refresh_src = esc_url_raw($dev_origin . $theme_path . "/@react-refresh");
    $client_src = esc_url_raw($dev_origin . $theme_path . "/@vite/client");
    $entry_src = esc_url_raw($dev_origin . $theme_path . "/assets/js/main.tsx");

    $print_module = static function (string $src): void {
      if (function_exists("wp_print_script_tag")) {
        echo wp_print_script_tag([
          "type" => "module",
          "src" => $src,
          "crossorigin" => "anonymous",
        ]);
      } else {
        printf('<script type="module" src="%s" crossorigin="anonymous"></script>', esc_url($src));
      }
      echo "\n";
    };

    add_action(
      "wp_footer",
      static function () use ($refresh_src, $client_src, $entry_src, $print_module): void {
        $preamble = <<<JS
        import RefreshRuntime from "{$refresh_src}";
        RefreshRuntime.injectIntoGlobalHook(window);
        window.\$RefreshReg\$ = () => {};
        window.\$RefreshSig\$ = () => (type) => type;
        window.__vite_plugin_react_preamble_installed__ = true;
        JS;
        if (function_exists("wp_print_inline_script_tag")) {
          echo wp_print_inline_script_tag($preamble, ["type" => "module"]);
        } else {
          printf('<script type="module">%s</script>', $preamble);
        }
        echo "\n";

        $print_module($client_src);
        $print_module($entry_src);
      },
      0,
    );

    return;
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

// Force production bundle to load as an ES module.
add_filter(
  "script_loader_tag",
  function ($tag, $handle, $src) {
    if (in_array($handle, ["parsnip"], true) && strpos($tag, "type=") === false) {
      $tag = str_replace("<script ", '<script type="module" ', $tag);
    }
    return $tag;
  },
  10,
  3,
);
