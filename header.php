<!doctype html>
<html <?php language_attributes(); ?>>

<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <?php wp_head(); ?>
</head>
<?php get_template_part('template-parts/nav-primary'); ?>

<body <?php body_class(); ?>><?php wp_body_open(); ?>