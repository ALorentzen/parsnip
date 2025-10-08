<?php
$h       = is_array($args['hero'] ?? null) ? $args['hero'] : [];
$title   = ($h['hero_title'] ?? '') ?: get_the_title();
$content = $h['hero_content'] ?? '';
$img_id  = (int)($h['hero_image'] ?? 0);
$src     = $img_id ? wp_get_attachment_image_url($img_id, 'full') : '';
?>

<section class="min-h-screen h-full relative text-white">
  <?php if ($src): ?>
    <div class="relative inset-0 bg-cover bg-center" style="background-image:url('<?= esc_url($src) ?>')"></div>
    <div class="absolute inset-0 bg-black/40"></div>
  <?php endif; ?>
  <div class="absolute bottom-0 -translate-y-20 translate-x-12 y-12 max-w-5xl mx-auto">
    <h1 class="text-9xl font-bold"><?= esc_html($title) ?></h1>
    <?php if ($content): ?>
      <div class="mt-4 prose prose-invert"><?= wp_kses_post($content) ?></div>
    <?php endif; ?>
  </div>

</section>