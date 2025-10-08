<?php
$nav = get_nav_menu_locations();
$menu_id = $nav['primary'] ?? 0;
$items = $menu_id ? wp_get_nav_menu_items($menu_id) : [];
?>

<nav class="absolute w-full flex justify-between items-center bg-gradient to-b from-neutral-800 to-transparent text-white text-2xl z-[5000]">
    <section>
        <a href="/">
            <?php get_template_part('template-parts/svg/parsnip-logo'); ?>
        </a>
    </section>
    <ul class="flex gap-12 z-1000">
        <?php foreach ($items as $item): ?>
            <li class="flex flex-col gap-1 group w-full">
                <a href="<?= esc_url($item->url) ?>" class="w-full group-hover:transition-all ease-in-out decoration-0 group-hover:decoration-2">
                    <?= esc_html($item->title) ?>
                    <hr class="w-0 h-0 group-hover:w-full group-hover:h-full transition-all ease-in-out border-t-2">
                </a>
            </li>
        <?php endforeach; ?>
        <li>
            <a href="<?= esc_url(site_url('/')) ?>" class="text-pink-400"></a>
        </li>
    </ul>
</nav>