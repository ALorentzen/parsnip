<?php

/**
 * Theme bootstrap (parsnip)
 */

if (file_exists(__DIR__ . '/vendor/autoload.php')) require __DIR__ . '/vendor/autoload.php';

add_action('wp_enqueue_scripts', function () {
  if (is_admin()) return;

  $dir = get_template_directory();
  $uri = get_template_directory_uri();

  // Tailwind CSS (built by CLI to dist/theme.css)
  $css = $dir . '/dist/theme.css';
  if (is_readable($css)) {
    wp_enqueue_style('parsnip-css', $uri . '/dist/theme.css', [], filemtime($css));
  }

  $is_dev = defined('WP_DEBUG') && WP_DEBUG;

  // Vite dev
  if ($is_dev) {
    foreach (
      [
        ['vite-client', 'https://localhost:5173/@vite/client'],
        ['parsnip-main', 'https://localhost:5173/assets/js/main.tsx']
      ] as [$h, $src]
    ) {
      wp_enqueue_script($h, $src, [], null, true);
      wp_script_add_data($h, 'type', 'module');
    }
    return;
  }

  // Vite prod (manifest)
  $manifest = $dir . '/dist/.vite/manifest.json';
  if (is_readable($manifest)) {
    $m = json_decode(file_get_contents($manifest), true) ?: [];
    $entry = 'assets/js/main.tsx';
    $file  = $m[$entry]['file'] ?? null;
    $csses = $m[$entry]['css']  ?? [];
    if ($file) {
      wp_enqueue_script('parsnip-main', $uri . '/dist/' . ltrim($file, '/'), [], null, true);
      wp_script_add_data('parsnip-main', 'type', 'module');
    }
    foreach ($csses as $i => $rel) {
      wp_enqueue_style('parsnip-vite-css-' . $i, $uri . '/dist/' . ltrim($rel, '/'), [], null);
    }
  }
});

/** 2) ACF Local JSON */
add_filter('acf/settings/save_json', function () {
  return get_template_directory() . '/acf-json';
});
add_filter('acf/settings/load_json', function ($paths) {
  $paths[] = get_template_directory() . '/acf-json';
  return $paths;
});

/** 3) Keep ACF metabox under block editor (stable POST pipeline) */
add_filter('acf/settings/remove_wp_meta_box', '__return_false');

/** 4) Debug hooks (only when WP_DEBUG) */
if (defined('WP_DEBUG') && WP_DEBUG) {
  add_action('acf/save_post', function ($post_id) {
    if (get_post_type($post_id) !== 'page') return;
    error_log('ACF_SAVE post=' . $post_id . ' has_acf=' . (isset($_POST['acf']) ? 'yes' : 'no'));
    if (isset($_POST['acf'])) error_log('ACF_KEYS ' . implode(',', array_keys($_POST['acf'])));
  }, 5);

  add_filter('acf/load_value', function ($value, $post_id, $field) {
    if (get_post_type($post_id) === 'page' && isset($field['name']) && str_starts_with($field['name'], 'hero_')) {
      $v = is_scalar($value) ? $value : wp_json_encode($value);
      error_log('ACF LOAD ' . $post_id . ' ' . $field['name'] . ' => ' . $v);
    }
    return $value;
  }, 20, 3);
}
add_filter('use_block_editor_for_post_type', fn($u, $t) => $t === 'page' ? false : $u, 10, 2);
add_filter('use_block_editor_for_post', '__return_false');
add_filter('use_block_editor_for_post_type', '__return_false', 10, 2);
remove_all_filters('acf/settings/save_json');
remove_all_filters('acf/settings/load_json');

add_action('after_setup_theme', function () {
  register_nav_menus(['primary' => __('Main Navigation', 'parsnip')]);
});