<?php

// Composer (optional)
if (file_exists(__DIR__ . "/vendor/autoload.php")) {
  require __DIR__ . "/vendor/autoload.php";
}

/** Menus */
add_action("after_setup_theme", function () {
  register_nav_menus(["primary" => __("Main Navigation", "parsnip")]);
});

/** ACF Local JSON */
add_filter("acf/settings/save_json", fn() => get_theme_file_path("acf-json"));
add_filter("acf/settings/load_json", function ($paths) {
  $paths[] = get_theme_file_path("acf-json");
  return $paths;
});

/** Assets: HTTPS Vite dev (HMR) or dist build; Tailwind CLI CSS */
add_action("wp_enqueue_scripts", function () {
  if (is_admin()) {
    return;
  }

  $dir = get_theme_file_path();
  $uri = get_stylesheet_directory_uri();

  // Tailwind CSS written by CLI -> dist/theme.css
  $css = $dir . "/dist/theme.css";
  if (file_exists($css)) {
    wp_enqueue_style("parsnip-css", $uri . "/dist/theme.css", [], filemtime($css));
  }

  // Dev: Vite HMR over HTTPS (configurable via VITE_DEV_URL)
  $siteUrl = home_url("/");
  $siteParts = parse_url($siteUrl) ?: [];
  $siteScheme = $siteParts["scheme"] ?? "http";
  $siteHost = $siteParts["host"] ?? "localhost";
  $devPortEnv = getenv("VITE_DEV_PORT");
  $defaultPort = $devPortEnv !== false ? (int) $devPortEnv : 5173;
  $defaultDevUrl = sprintf(
    "%s://%s:%d",
    $siteScheme === "https" ? "https" : "http",
    $siteHost,
    $defaultPort,
  );
  $devUrl = getenv("VITE_DEV_URL") ?: $defaultDevUrl;
  $devParts = parse_url($devUrl) ?: [];
  $devScheme = $devParts["scheme"] ?? "http";
  $devHost = $devParts["host"] ?? "localhost";
  $devPort = (int) ($devParts["port"] ?? ($devScheme === "https" ? 443 : 80));
  $devOrigin = rtrim(
    sprintf("%s://%s%s", $devScheme, $devHost, $devPort ? ":" . $devPort : ""),
    "/",
  );
  $devUp = static function (string $host, int $port): bool {
    foreach ([$host, "127.0.0.1", "localhost"] as $h) {
      $sock = @fsockopen($h, $port, $errNo, $errStr, 0.05);
      if ($sock) {
        fclose($sock);
        return true;
      }
    }
    return false;
  };

  if ($devUp($devHost, $devPort)) {
    $printModule = static function (string $src): void {
      $escaped = esc_url($src);
      if (function_exists("wp_print_script_tag")) {
        echo wp_print_script_tag([
          "type" => "module",
          "src" => $escaped,
          "crossorigin" => "anonymous",
        ]);
      } else {
        printf('<script type="module" src="%s" crossorigin="anonymous"></script>', $escaped);
      }
    };

    $printInlineModule = static function (string $code): void {
      if (function_exists("wp_print_inline_script_tag")) {
        echo wp_print_inline_script_tag($code, ["type" => "module"]);
      } else {
        printf('<script type="module">%s</script>', $code);
      }
    };

    $refreshTemplate = <<<'JS'
    import RefreshRuntime from "%s";
    RefreshRuntime.injectIntoGlobalHook(window);
    window.$RefreshReg$ = () => {};
    window.$RefreshSig$ = () => (type) => type;
    window.__vite_plugin_react_preamble_installed__ = true;
    JS;

    add_action(
      "wp_footer",
      static function () use (
        $devOrigin,
        $printModule,
        $printInlineModule,
        $refreshTemplate,
      ): void {
        $refreshPreamble = sprintf($refreshTemplate, esc_url($devOrigin . "/@react-refresh"));
        $printInlineModule($refreshPreamble);
        $printModule($devOrigin . "/@vite/client");
        $printModule($devOrigin . "/assets/js/main.tsx");
        echo "\n";
      },
      0,
    );
    return;
  }

  // Prod: Vite manifest
  $manifest = $dir . "/dist/.vite/manifest.json";
  if (file_exists($manifest)) {
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
    if (!empty($m[$entry]["css"]) && is_array($m[$entry]["css"])) {
      foreach ($m[$entry]["css"] as $i => $rel) {
        $rel = ltrim($rel, "/");
        $cpath = $dir . "/dist/" . $rel;
        wp_enqueue_style(
          "parsnip-vite-$i",
          $uri . "/dist/" . $rel,
          [],
          file_exists($cpath) ? filemtime($cpath) : null,
        );
      }
    }
    return;
  }

  // Fallback: plain dist assets
  $plain = $dir . "/dist/assets/main.js";
  if (file_exists($plain)) {
    wp_enqueue_script("parsnip", $uri . "/dist/assets/main.js", [], filemtime($plain), true);
    wp_script_add_data("parsnip", "type", "module");
  }
});

/** Force type="module" on our handles (extra safety) */
add_filter(
  "script_loader_tag",
  function ($tag, $handle, $src) {
    if (in_array($handle, ["vite-client", "parsnip-dev", "parsnip"], true)) {
      if (strpos($tag, "type=") === false) {
        $tag = str_replace("<script ", '<script type="module" ', $tag);
      }
    }
    return $tag;
  },
  10,
  3,
);
