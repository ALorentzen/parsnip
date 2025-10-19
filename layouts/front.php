
    <main class="relative h-screen overflow-hidden">
      <section class="absolute inset-0 w-full h-screen z-[4000]">
        <div class="js-hero-container w-full h-full">
        </div>
      </section>

      <section class="absolute inset-0 w-full h-screen z-[5000] overflow-hidden">
        <div class="js-scroll w-full h-screen fixed top-0 right-0 transition-all ease-in-out duration-300">
          <?php the_content(); ?>
        </div>
      </section>

      <div id="react-root" class="absolute top-0 w-full min-h-screen h-full flex justify-around z-[3000]"></div>
    </main>

  <?php wp_reset_postdata(); ?>
