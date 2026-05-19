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

function yec_render_hero_section_block($attributes) {
  $eyebrow  = isset($attributes['eyebrow']) ? sanitize_text_field($attributes['eyebrow']) : '';
  $title    = isset($attributes['title']) ? sanitize_text_field($attributes['title']) : '';
  $subtitle = isset($attributes['subtitle']) ? wp_kses_post($attributes['subtitle']) : '';
  $cta_text = isset($attributes['ctaText']) ? sanitize_text_field($attributes['ctaText']) : '';
  $cta_url  = isset($attributes['ctaUrl']) ? esc_url($attributes['ctaUrl']) : '';
  $image_url = isset($attributes['imageUrl']) ? esc_url($attributes['imageUrl']) : '';
  $image_alt = isset($attributes['imageAlt']) ? sanitize_text_field($attributes['imageAlt']) : '';

  ob_start();
  ?>
  <section class="yec-editable-section" aria-label="Sekcja hero">
    <div class="yec-editable-section__content">
      <?php if ($eyebrow) : ?>
        <p class="yec-editable-section__eyebrow"><?php echo esc_html($eyebrow); ?></p>
      <?php endif; ?>

      <?php if ($title) : ?>
        <h1 class="yec-editable-section__title"><?php echo esc_html($title); ?></h1>
      <?php endif; ?>

      <?php if ($subtitle) : ?>
        <p class="yec-editable-section__subtitle"><?php echo wp_kses_post($subtitle); ?></p>
      <?php endif; ?>

      <?php if ($cta_text && $cta_url) : ?>
        <a class="yec-cta__button" href="<?php echo esc_url($cta_url); ?>"><?php echo esc_html($cta_text); ?></a>
      <?php endif; ?>
    </div>

    <div class="yec-editable-section__media">
      <?php if ($image_url) : ?>
        <img class="yec-editable-section__image" src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr($image_alt); ?>">
      <?php endif; ?>
    </div>
  </section>
  <?php

  return ob_get_clean();
}

function yec_register_custom_blocks() {
  $editor_script_path = get_template_directory() . '/assets/js/hero-section-block.js';

  if (!file_exists($editor_script_path)) {
    return;
  }

  wp_register_script(
    'yec-hero-section-block',
    get_template_directory_uri() . '/assets/js/hero-section-block.js',
    ['wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n'],
    filemtime($editor_script_path),
    true
  );

  register_block_type('yec/hero-section', [
    'editor_script'   => 'yec-hero-section-block',
    'render_callback' => 'yec_render_hero_section_block',
    'attributes'      => [
      'eyebrow' => [
        'type'    => 'string',
        'default' => 'Eyebrow',
      ],
      'title' => [
        'type'    => 'string',
        'default' => 'Tytul sekcji',
      ],
      'subtitle' => [
        'type'    => 'string',
        'default' => 'Krotki opis sekcji.',
      ],
      'ctaText' => [
        'type'    => 'string',
        'default' => 'Skontaktuj sie',
      ],
      'ctaUrl' => [
        'type'    => 'string',
        'default' => '/kontakt',
      ],
      'imageUrl' => [
        'type'    => 'string',
        'default' => '',
      ],
      'imageId' => [
        'type' => 'number',
      ],
      'imageAlt' => [
        'type'    => 'string',
        'default' => '',
      ],
    ],
  ]);
}

add_action('init', 'yec_register_custom_blocks');

function yec_set_static_front_page() {
  $front_page = get_page_by_path('strona-glowna');

  if (!$front_page instanceof WP_Post) {
    return;
  }

  update_option('show_on_front', 'page');
  update_option('page_on_front', (int) $front_page->ID);
}

add_action('after_switch_theme', 'yec_set_static_front_page');