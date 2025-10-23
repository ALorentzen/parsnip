<?php get_header(); ?>

<main class="p-8">
  <?php if (have_posts()): ?>
    <?php while (have_posts()):
      the_post(); ?>
      <?php the_title("<h2>", "</h2>"); ?>
      <?php the_excerpt(); ?>
    <?php
    endwhile; ?>
  <?php else: ?>
    <p>No posts yet.</p>
  <?php endif; ?>
</main>

<?php get_footer(); ?>
