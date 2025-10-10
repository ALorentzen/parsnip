<!-- 
    Example of how to custom style header with tailwind: 

    get_header(null, [
       'header_class' => 'bg-neutral-900/80 backdrop-blur-2xl',
        'inner_class'  => 'max-w-[1440px] mx-auto px-4 lg:px-8',
    ]);
-->

<?php get_header(); ?>
<?php get_template_part("layouts/front"); ?>
<?php get_footer(); ?>
