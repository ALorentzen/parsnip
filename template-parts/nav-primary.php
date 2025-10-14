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

<nav class="fixed w-full flex justify-between items-center text-white z-[6000] px-4 lg:px-8 bg-neutral-900/80 backdrop-blur-2xl">
  <a href="/" data-react="sitelogo" aria-label="Home"></a>

  <div
    class="lg:hidden block w-12 h-12"
    data-react="hamburger"
    data-target="#mobile-menu"
    data-class="lg:hidden block w-12 h-12">
  </div>

  <!-- Desktop -->
  <ul class="hidden lg:flex gap-12 text-white">
    <?php foreach ($items as $item): ?>
      <li class="group">
        <a class="px-3 py-2" href="<?= esc_url($item->url) ?>"><?= esc_html($item->title) ?></a>
        <hr class="w-0 group-hover:w-[80%] h-0 group-hover-h-2 transition-all ease-in-out">
      </li>
    <?php endforeach; ?>
  </ul>
</nav>

<!-- Mobile overlay (outside nav) -->
<section
  id="mobile-menu"
  class="fixed inset-0 z-[5000] hidden lg:hidden items-center justify-center bg-neutral-900/80 backdrop-blur-2xl pt-24">
  <ul class="flex flex-col gap-8 text-4xl text-white">
    <?php foreach ($items as $item): ?>
      <li><a class="block px-3 py-2" href="<?= esc_url($item->url) ?>"><?= esc_html(
  $item->title,
) ?></a></li>
    <?php endforeach; ?>
  </ul>
</section>
