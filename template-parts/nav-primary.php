<?php
$locations = get_nav_menu_locations();
$menu_id = isset($locations["primary"]) ? (int) $locations["primary"] : 0;

if (!$menu_id) {
  foreach (wp_get_nav_menus() as $menu) {
    if ($menu instanceof \WP_Term && $menu->count > 0) {
      $menu_id = (int) $menu->term_id;
      break;
    }
  }
}

$items = $menu_id ? wp_get_nav_menu_items($menu_id) : [];

$items = array_values(
  array_filter(
    $items,
    static fn($item) => $item instanceof \WP_Post && (int) $item->menu_item_parent === 0,
  ),
);

usort($items, static fn($a, $b) => (int) $a->menu_order <=> (int) $b->menu_order);
?>

<nav class="absolute z-6000 w-full flex justify-between items-center text-white px-4 lg:px-8 bg-neutral-900/80 backdrop-blur-2xl mt-0">
  <a href="/" aria-label="Home">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor" stroke="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" class="h-12 w-auto text-white" role="img" aria-label="Parsnip">
      <title>Parsnip</title>
      <path d="M32 8v6" />
      <path d="M32 8c4-3 9-3 12 0-3 1.8-6 3.8-8.5 5" />
      <path d="M32 8c-4-3-9-3-12 0 3 1.8 6 3.8 8.5 5" />
      <path d="M32 14 C44 14 49 19 47 28 C45 40 36 50 32 56 C28 50 19 40 17 28 C15 19 20 14 32 14 Z" />
      <line x1="28" y1="31" x2="36" y2="31" />
      <line x1="26" y1="36" x2="38" y2="36" />
      <line x1="28" y1="41" x2="36" y2="41" />
    </svg>
  </a>

  <div
    class="lg:hidden flex w-12 h-12 items-center justify-center cursor-pointer"
    data-react="hamburger"
    data-target="#mobile-menu"
    data-class="lg:hidden flex w-12 h-12 z-[2000] items-center justify-center cursor-pointer">
    <!-- Hamburger placeholder until React loads -->
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
    </svg>
  </div>

  <!-- Desktop -->
  <ul class="hidden lg:flex gap-12">
    <?php foreach ($items as $item): ?>
      <li class="group">
        <a class="text-2xl" href="<?= esc_url($item->url) ?>"><?= esc_html($item->title) ?></a>
        <hr class="w-0 group-hover:w-[80%] h-0 group-hover-h-2 transition-all ease-in-out">
      </li>
    <?php endforeach; ?>
  </ul>
</nav>

<!-- Mobile overlay (outside nav) -->
<section
  id="mobile-menu"
  class="fixed inset-0 z-5000 hidden lg:hidden items-center justify-center bg-neutral-900/80 backdrop-blur-2xl pt-24">
  <ul class="flex flex-col gap-8 text-4xl text-white">
    <?php foreach ($items as $item): ?>
      <li><a class="block px-3 py-2" href="<?= esc_url($item->url) ?>"><?= esc_html(
  $item->title,
) ?></a></li>
    <?php endforeach; ?>
  </ul>
</section>
