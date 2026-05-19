<?php

function yec_theme_setup() {
  add_theme_support('title-tag');
  add_theme_support('custom-logo', [
    'height'      => 120,
    'width'       => 120,
    'flex-height' => false,
    'flex-width'  => false,
  ]);

  register_nav_menus([
    'primary' => __('Menu glowne', 'yourenglishcoachtheme'),
  ]);
}

add_action('after_setup_theme', 'yec_theme_setup');

function yec_enqueue_assets() {
  $css_file = get_template_directory() . '/dist/assets/main.css';
  $js_file  = get_template_directory() . '/dist/js/main.js';

  wp_enqueue_style(
    'yec-font-lato',
    'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap',
    [],
    null
  );

  if (file_exists($css_file)) {
    wp_enqueue_style(
      'yec-main-css',
      get_template_directory_uri() . '/dist/assets/main.css',
      ['yec-font-lato'],
      filemtime($css_file)
    );
  }

  if (file_exists($js_file)) {
    wp_enqueue_script(
      'yec-main-js',
      get_template_directory_uri() . '/dist/js/main.js',
      [],
      filemtime($js_file),
      true
    );
  }

}

add_action('wp_enqueue_scripts', 'yec_enqueue_assets');

function yec_resource_hints($urls, $relation_type) {
  if ('preconnect' === $relation_type) {
    $urls[] = 'https://fonts.googleapis.com';
    $urls[] = [
      'href'        => 'https://fonts.gstatic.com',
      'crossorigin' => 'anonymous',
    ];
  }

  return $urls;
}

add_filter('wp_resource_hints', 'yec_resource_hints', 10, 2);