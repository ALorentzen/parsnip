<!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo("charset"); ?>">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <?php wp_head(); ?>
</head>

<?php $adminOffset = is_admin_bar_showing() ? "top-0" : "top-0"; ?>
<body <?php body_class(["site", "bg-neutral-900 h-screen ", "dark", $adminOffset]); ?>>
<?php wp_body_open(); ?>

<?php get_template_part("template-parts/nav-primary"); ?>
