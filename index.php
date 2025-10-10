<?php get_header(); ?>
<main class="min-h-screen p-8">
  <?php if (have_posts()):
    while (have_posts()):
      the_post();
      the_title("<h2>", "</h2>");
      the_excerpt();
    endwhile;
  else:
     ?>
    <p>No posts yet.</p>
  <?php
  endif; ?>
</main>
<?php get_footer(); ?>
