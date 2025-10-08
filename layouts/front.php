<?php get_header(); ?>
<?php $show = get_field('enable_hero') === 'show';
$hero = get_field('hero') ?: []; ?>

<main class="min-h-screen  bg-[url('../public/images/parsnip.png')] bg-cover">
  <?php if ($show) {
    get_template_part('template-parts/hero', null, ['hero' => $hero]);
  } ?>

  <div id="react-root"></div>

</main>
<?php get_footer(); ?>