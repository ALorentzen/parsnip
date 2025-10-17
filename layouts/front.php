
    <main class="relative h-screen overflow-hidden">
      <section class="absolute inset-0 w-full h-screen z-0">
        <div class="js-hero-container w-full h-full">
        </div>
      </section>

      <section class="absolute inset-0 w-full h-screen z-10 pointer-events-none overflow-hidden">
        <div class="js-scroll w-full h-screen relative transition-all ease-in-out duration-300">
          <?php the_content(); ?>
        </div>
      </section>

      <div id="react-root" class="absolute top-0 w-full min-h-screen h-full flex justify-around z-20"></div>
    </main>

  <?php wp_reset_postdata(); ?>
