<?php
$hero = [];
$show = false;

if (function_exists("get_field")) {
  $hero = get_field("hero") ?: [];
  $show = get_field("enable_hero") === "show";
}
?>

<main class="min-h-screen p-8">
<?php if ($show): ?>
  <?php get_template_part("template-parts/hero", null, ["hero" => $hero]); ?>
<?php else: ?>
  <h1 class="text-3xl font-bold"><?= esc_html(get_the_title()) ?></h1>
  <div id="react-root"></div>
<?php endif; ?>

</main>
