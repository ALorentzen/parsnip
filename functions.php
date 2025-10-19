<?php

// Disable WordPress autosave functionality completely
add_action("wp_print_scripts", function () {
  wp_deregister_script("autosave");
});

add_action("admin_init", function () {
  wp_deregister_script("autosave");
});

add_action("admin_print_scripts", function () {
  wp_deregister_script("autosave");
});

add_action("admin_enqueue_scripts", function () {
  wp_deregister_script("autosave");
});

// More aggressive autosave disabling
add_action("wp_print_scripts", function () {
  wp_deregister_script("autosave");
});

// Remove autosave entirely
remove_action("wp_ajax_heartbeat", "wp_ajax_heartbeat", 1);

// Disable autosave notifications via CSS and fix editor overflow
add_action("admin_head", function () {
  echo '<style>
    /* Hide autosave notifications */
    .components-notice-list .components-notice:has([data-id*="autosave"]),
    .components-notice-list .components-notice:has([href*="autosave"]),
    .components-notice[aria-label*="autosave"],
    .components-notice:has(.components-notice__content[href*="autosave"]),
    .editor-post-save-draft,
    .components-notice:has(a[href*="revision"]) {
      display: none !important;
    }
    
    /* Fix editor horizontal scroll - simple and direct */
    .block-editor-writing-flow {
      overflow-x: hidden !important;
    }
    
    .wp-block {
      max-width: 100% !important;
      box-sizing: border-box !important;
    }
    
    .wp-block-image img {
      max-width: 100% !important;
      height: auto !important;
    }
  </style>';
});

// Disable autosave via JavaScript - fixed version
add_action("admin_footer", function () {
  echo '<script type="text/javascript">
    jQuery(document).ready(function($) {
      // Disable autosave completely (with proper checks)
      if (typeof wp !== "undefined" && wp.autosave) {
        if (wp.autosave.server && typeof wp.autosave.server.suspend === "function") {
          wp.autosave.server.suspend();
        }
        if (wp.autosave.local && typeof wp.autosave.local.suspend === "function") {
          wp.autosave.local.suspend();
        }
      }
      
      // Remove autosave intervals
      if (typeof autosaveL10n !== "undefined") {
        autosaveL10n.autosaveInterval = 0;
      }
      
      // Clear any existing autosave timers
      if (typeof window.autosaveDelayPreview !== "undefined") {
        clearTimeout(window.autosaveDelayPreview);
      }
      
      // Hide autosave notices continuously
      setInterval(function() {
        $(".components-notice").each(function() {
          var noticeText = $(this).text().toLowerCase();
          if (noticeText.includes("autosave") || noticeText.includes("more recent") || $(this).find("a[href*=\"autosave\"]").length) {
            $(this).hide();
          }
        });
      }, 100);
      
      // Disable heartbeat properly (if it exists)
      if (typeof wp !== "undefined" && wp.heartbeat && typeof wp.heartbeat.stop === "function") {
        wp.heartbeat.stop();
      }
    });
  </script>';
});

// Theme bootstrap: supports, menus, and shared includes.
add_action("after_setup_theme", function (): void {
  add_theme_support("title-tag");
  add_theme_support("post-thumbnails");
  add_theme_support("html5", [
    "comment-form",
    "comment-list",
    "gallery",
    "caption",
    "style",
    "script",
  ]);

  register_nav_menus([
    "primary" => __("Primary Menu", "parsnip"),
  ]);

  $inc_dir = get_template_directory() . "/inc";
  if (!is_dir($inc_dir)) {
    return;
  }
  foreach (glob($inc_dir . "/*.php") ?: [] as $file) {
    require_once $file;
  }
});

function parsnip_get_theme_paths(): array
{
  static $paths = null;
  if ($paths !== null) {
    return $paths;
  }

  $dir = get_theme_file_path();
  $uri = get_stylesheet_directory_uri();
  $path = parse_url($uri, PHP_URL_PATH) ?: "/wp-content/themes/parsnip";

  $paths = [
    "dir" => $dir,
    "uri" => $uri,
    "path" => rtrim($path, "/"),
  ];

  return $paths;
}

function parsnip_get_vite_env(): array
{
  static $env = null;
  if ($env !== null) {
    return $env;
  }

  $paths = parsnip_get_theme_paths();

  $site_url = home_url("/");
  $site_host = parse_url($site_url, PHP_URL_HOST) ?: "localhost";
  $site_scheme = parse_url($site_url, PHP_URL_SCHEME) ?: "http";

  $dev_protocol = strtolower(getenv("VITE_DEV_PROTOCOL") ?: $site_scheme);
  $dev_protocol = $dev_protocol === "http" ? "http" : "https";

  $dev_host = getenv("VITE_DEV_HOST") ?: "parsnip.test";
  $dev_port = (int) (getenv("VITE_DEV_PORT") ?: 5173);

  $default_port = $dev_protocol === "https" ? 443 : 80;
  $port_segment = $dev_port === $default_port ? "" : ":" . $dev_port;
  $origin = sprintf("%s://%s%s", $dev_protocol, $dev_host, $port_segment);

  $is_up = false;
  foreach (array_unique([$dev_host, "127.0.0.1", "localhost"]) as $probe_host) {
    $socket = @fsockopen($probe_host, $dev_port, $errno, $errstr, 0.05);
    if ($socket) {
      fclose($socket);
      $is_up = true;
      break;
    }
  }

  // Debug logging
  error_log(
    "VITE DEV SERVER CHECK: host={$dev_host}, port={$dev_port}, is_up=" . ($is_up ? "YES" : "NO"),
  );

  $env = [
    "protocol" => $dev_protocol,
    "host" => $dev_host,
    "port" => $dev_port,
    "origin" => $origin,
    "theme_path" => $paths["path"],
    "is_up" => $is_up,
  ];

  return $env;
}

function parsnip_get_vite_manifest(): array
{
  static $manifest = null;
  if ($manifest !== null) {
    return $manifest;
  }

  $paths = parsnip_get_theme_paths();
  $manifest_path = $paths["dir"] . "/dist/.vite/manifest.json";

  if (!is_readable($manifest_path)) {
    $manifest = [];
    return $manifest;
  }

  $contents = file_get_contents($manifest_path);
  $data = $contents !== false ? json_decode($contents, true) : null;
  $manifest = is_array($data) ? $data : [];

  return $manifest;
}

require_once get_theme_file_path("inc/blocks.php");

// Load gallery controls in block editor
add_action("enqueue_block_editor_assets", function () {
  $paths = parsnip_get_theme_paths();
  $vite = parsnip_get_vite_env();

  if ($vite["is_up"]) {
    // Dev mode - load from Vite dev server
    $entry_src = esc_url_raw($vite["origin"] . $vite["theme_path"] . "/assets/js/editor.tsx");
    wp_enqueue_script(
      "parsnip-editor",
      $entry_src,
      ["wp-element", "wp-blocks", "wp-hooks", "wp-compose", "wp-block-editor", "wp-components"],
      null,
      true,
    );
    wp_script_add_data("parsnip-editor", "type", "module");
  } else {
    // Production - load from built files
    $plain = $paths["dir"] . "/dist/assets/editor.js";
    if (is_readable($plain)) {
      wp_enqueue_script(
        "parsnip-editor",
        $paths["uri"] . "/dist/assets/editor.js",
        ["wp-element", "wp-blocks", "wp-hooks", "wp-compose", "wp-block-editor", "wp-components"],
        filemtime($plain),
        true,
      );
      wp_script_add_data("parsnip-editor", "type", "module");
    }
  }
});

// Front-end asset loader: prefer Vite dev server, otherwise fall back to built files.
add_action("wp_enqueue_scripts", function () {
  if (is_admin()) {
    return;
  }

  $paths = parsnip_get_theme_paths();

  // Tailwind (CLI output)
  $css = $paths["dir"] . "/dist/theme.css";
  if (is_readable($css)) {
    wp_enqueue_style("parsnip-css", $paths["uri"] . "/dist/theme.css", [], filemtime($css));
  }

  $vite = parsnip_get_vite_env();

  if ($vite["is_up"]) {
    wp_enqueue_script("wp-element");
    $refresh_src = esc_url_raw($vite["origin"] . $vite["theme_path"] . "/@react-refresh");
    $client_src = esc_url_raw($vite["origin"] . $vite["theme_path"] . "/@vite/client");
    $entry_src = esc_url_raw($vite["origin"] . $vite["theme_path"] . "/assets/js/main.tsx");

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
  $manifest = parsnip_get_vite_manifest();
  $entry = "assets/js/main.tsx";
  if (!empty($manifest[$entry]["file"])) {
    $file = ltrim($manifest[$entry]["file"], "/");
    $path = $paths["dir"] . "/dist/" . $file;
    if (is_readable($path)) {
      wp_enqueue_script(
        "parsnip",
        $paths["uri"] . "/dist/" . $file,
        ["wp-element"],
        filemtime($path),
        true,
      );
      wp_script_add_data("parsnip", "type", "module");
    }
    foreach ($manifest[$entry]["css"] ?? [] as $i => $rel) {
      $rel = ltrim($rel, "/");
      $cpath = $paths["dir"] . "/dist/" . $rel;
      if (!is_readable($cpath)) {
        continue;
      }
      wp_enqueue_style("parsnip-vite-$i", $paths["uri"] . "/dist/" . $rel, [], filemtime($cpath));
    }
    return;
  }

  // Fallback
  $plain = $paths["dir"] . "/dist/assets/main.js";
  if (is_readable($plain)) {
    wp_enqueue_script(
      "parsnip",
      $paths["uri"] . "/dist/assets/main.js",
      ["wp-element"],
      filemtime($plain),
      true,
    );
    wp_script_add_data("parsnip", "type", "module");
  }
});

// Force production bundle to load as an ES module.
add_filter(
  "script_loader_tag",
  function ($tag, $handle, $src) {
    if (in_array($handle, ["parsnip", "parsnip-editor"], true) && strpos($tag, "type=") === false) {
      $tag = str_replace("<script ", '<script type="module" ', $tag);
    }
    return $tag;
  },
  10,
  3,
);
require_once get_theme_file_path("inc/filters.php");
add_filter("the_content", "gutenberg_order_filter");
