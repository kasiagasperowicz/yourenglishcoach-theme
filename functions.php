<?php

function yec_theme_setup() {
  add_theme_support('custom-logo', [
    'height'      => 200,
    'width'       => 600,
    'flex-height' => true,
    'flex-width'  => true,
  ]);
}

add_action('after_setup_theme', 'yec_theme_setup');

function yec_enqueue_assets() {

  wp_enqueue_style(
    'yec-main-css',
    get_template_directory_uri() . '/dist/assets/main.css',
    [],
    filemtime(get_template_directory() . '/dist/assets/main.css')
  );

  wp_enqueue_script(
    'yec-main-js',
    get_template_directory_uri() . '/dist/js/main.js',
    [],
    filemtime(get_template_directory() . '/dist/js/main.js'),
    true
  );

}

add_action('wp_enqueue_scripts', 'yec_enqueue_assets');