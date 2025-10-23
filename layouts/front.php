
    <main class="relative">
  <section class="inset-0 w-full z-4000">
        <div class="js-hero-container w-full h-full">
        </div>
      </section>

  <section class="relative inset-0 w-full z-5000">
          <?php the_content(); ?>
      </section>

  <div id="react-root" class="top-0 w-full h-full flex justify-around z-3000"></div>
    </main>

  <?php wp_reset_postdata(); ?>
