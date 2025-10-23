<?php
$hero = is_array($args["hero"] ?? null) ? $args["hero"] : [];

$title = trim((string) ($hero["hero_title"] ?? ""));
if ($title === "") {
  $title = get_the_title();
}

$content = (string) ($hero["hero_content"] ?? "");
if ($content === "" && function_exists("get_field")) {
  $content = (string) (get_field("hero_content") ?: "");
}

$img_id = (int) ($hero["hero_image"] ?? 0);
$src = $img_id ? wp_get_attachment_image_url($img_id, "full") : "";
?>

<section class="fixed w-full h-screen lg:h-full overflow-y-scroll no-scrollbar text-white p-0">

  <?php if ($src): ?>
    <div class="relative lg:inset-0 bg-cover bg-center h-full w-full" style="background-image:url('<?= esc_url(
      $src,
    ) ?>')"></div>
    <div class="relative lg:inset-0 bg-black/40"></div>
  <?php endif; ?>
  <div class="relative lg:bottom-12 -translate-y-40 lg:-translate-y-20 px-4 lg:translate-x-12 lg:py-12 max-w-5xl mx-auto">
    <h1 class="text-6xl lg:text-9xl font-bold"><?= esc_html($title) ?></h1>
    <?php if ($content): ?>
      <div class="mt-4 prose prose-invert"><?= wp_kses_post($content) ?></div>
    <?php endif; ?>
  </div>
</section>
