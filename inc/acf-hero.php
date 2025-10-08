<?php 
add_action('acf/init', function () {
  if (!function_exists('acf_add_local_field_group')) return;

  acf_add_local_field_group([
    'key' => 'group_68e4feebe7839',
    'title' => 'Hero',
    'fields' => [
      [
        'key' => 'field_68e51086079f8',
        'label' => 'Enable Hero',
        'name'  => 'enable_hero',
        'type'  => 'radio',
        'choices' => ['show' => 'Show','hide' => 'Hide'],
        'layout'  => 'vertical',
        'return_format' => 'value',
      ],
      [
        'key' => 'field_68e510003f553',
        'label' => 'Hero',
        'name'  => 'hero',
        'type'  => 'group',
        'conditional_logic' => [[['field' => 'field_68e51086079f8','operator' => '==','value' => 'show']]],
        'layout' => 'block',
        'sub_fields' => [
          ['key'=>'field_68e510303f554','label'=>'Title','name'=>'hero_title','type'=>'text'],
          ['key'=>'field_68e510423f555','label'=>'Content','name'=>'hero_content','type'=>'wysiwyg','tabs'=>'all','toolbar'=>'full','media_upload'=>1],
          ['key'=>'field_68e51058facb0','label'=>'Image','name'=>'hero_image','type'=>'image','return_format'=>'id','preview_size'=>'medium'],
        ],
      ],
    ],
    'location' => [[['param'=>'post_type','operator'=>'==','value'=>'page']]],
    'position' => 'normal',
    'style' => 'seamless',
    'label_placement' => 'top',
    'active' => true,
  ]);
});
