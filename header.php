<!doctype html>
<html <?php language_attributes(); ?>>

<head>
  <meta charset="<?php bloginfo("charset"); ?>">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <?php wp_head(); ?>
</head>
<?php $isAdminOpen = is_admin_bar_showing() ? "top-8" : "top-0"; ?>

<body <?php body_class([
  "site",
  "bg-neutral-900",
  "dark",
  is_admin_bar_showing() ? "top-8" : "top-0",
]); ?>>
  <?php wp_body_open(); ?>
  <?php get_template_part("template-parts/nav-primary"); ?>
