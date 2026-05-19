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
  $layout = isset($attributes['layout']) ? sanitize_key($attributes['layout']) : 'text-first';
  $layout = in_array($layout, ['text-first', 'image-first'], true) ? $layout : 'text-first';

  ob_start();
  ?>
  <section class="yec-editable-section yec-editable-section--<?php echo esc_attr($layout); ?>" aria-label="Sekcja hero">
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

    <?php if ($image_url) : ?>
      <div class="yec-editable-section__media">
        <img class="yec-editable-section__image" src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr($image_alt); ?>">
      </div>
    <?php endif; ?>
  </section>
  <?php

  return ob_get_clean();
}

function yec_render_image_text_section_block($attributes) {
  $eyebrow    = isset($attributes['eyebrow']) ? sanitize_text_field($attributes['eyebrow']) : '';
  $title      = isset($attributes['title']) ? sanitize_text_field($attributes['title']) : '';
  $content    = isset($attributes['contentText']) ? wp_kses_post($attributes['contentText']) : '';
  $cta_text   = isset($attributes['ctaText']) ? sanitize_text_field($attributes['ctaText']) : '';
  $cta_url    = isset($attributes['ctaUrl']) ? esc_url($attributes['ctaUrl']) : '';
  $image_url  = isset($attributes['imageUrl']) ? esc_url($attributes['imageUrl']) : '';
  $image_alt  = isset($attributes['imageAlt']) ? sanitize_text_field($attributes['imageAlt']) : '';
  $layout     = isset($attributes['layout']) ? sanitize_key($attributes['layout']) : 'image-left';
  $layout     = in_array($layout, ['image-left', 'image-right'], true) ? $layout : 'image-left';

  ob_start();
  ?>
  <section class="yec-image-text-section yec-image-text-section--<?php echo esc_attr($layout); ?>" aria-label="Sekcja obraz i tekst">
    <?php if ($image_url) : ?>
      <div class="yec-image-text-section__media">
        <img class="yec-image-text-section__image" src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr($image_alt); ?>">
      </div>
    <?php endif; ?>

    <div class="yec-image-text-section__content">
      <?php if ($eyebrow) : ?>
        <p class="yec-image-text-section__eyebrow"><?php echo esc_html($eyebrow); ?></p>
      <?php endif; ?>

      <?php if ($title) : ?>
        <h2 class="yec-image-text-section__title"><?php echo esc_html($title); ?></h2>
      <?php endif; ?>

      <?php if ($content) : ?>
        <p class="yec-image-text-section__text"><?php echo wp_kses_post($content); ?></p>
      <?php endif; ?>

      <?php if ($cta_text && $cta_url) : ?>
        <a class="yec-cta__button" href="<?php echo esc_url($cta_url); ?>"><?php echo esc_html($cta_text); ?></a>
      <?php endif; ?>
    </div>
  </section>
  <?php

  return ob_get_clean();
}

function yec_render_benefits_section_block($attributes) {
  $eyebrow  = isset($attributes['eyebrow']) ? sanitize_text_field($attributes['eyebrow']) : '';
  $title    = isset($attributes['title']) ? sanitize_text_field($attributes['title']) : '';
  $subtitle = isset($attributes['subtitle']) ? wp_kses_post($attributes['subtitle']) : '';

  $cards = [
    [
      'icon'  => isset($attributes['item1Icon']) ? sanitize_text_field($attributes['item1Icon']) : '',
      'title' => isset($attributes['item1Title']) ? sanitize_text_field($attributes['item1Title']) : '',
    ],
    [
      'icon'  => isset($attributes['item2Icon']) ? sanitize_text_field($attributes['item2Icon']) : '',
      'title' => isset($attributes['item2Title']) ? sanitize_text_field($attributes['item2Title']) : '',
    ],
    [
      'icon'  => isset($attributes['item3Icon']) ? sanitize_text_field($attributes['item3Icon']) : '',
      'title' => isset($attributes['item3Title']) ? sanitize_text_field($attributes['item3Title']) : '',
    ],
    [
      'icon'  => isset($attributes['item4Icon']) ? sanitize_text_field($attributes['item4Icon']) : '',
      'title' => isset($attributes['item4Title']) ? sanitize_text_field($attributes['item4Title']) : '',
    ],
  ];

  ob_start();
  ?>
  <section class="yec-benefits-section" aria-label="Co zyskujesz">
    <div class="yec-benefits-section__header">
      <?php if ($eyebrow) : ?>
        <p class="yec-benefits-section__eyebrow"><?php echo esc_html($eyebrow); ?></p>
      <?php endif; ?>

      <?php if ($title) : ?>
        <h2 class="yec-benefits-section__title"><?php echo esc_html($title); ?></h2>
      <?php endif; ?>

      <?php if ($subtitle) : ?>
        <p class="yec-benefits-section__subtitle"><?php echo wp_kses_post($subtitle); ?></p>
      <?php endif; ?>
    </div>

    <div class="yec-benefits-section__grid">
      <?php foreach ($cards as $card) : ?>
        <?php if (!$card['icon'] && !$card['title']) {
          continue;
        } ?>
        <article class="yec-benefits-section__card">
          <?php if ($card['icon']) : ?>
            <span class="yec-benefits-section__icon" aria-hidden="true"><?php echo esc_html($card['icon']); ?></span>
          <?php endif; ?>
          <?php if ($card['title']) : ?>
            <h3 class="yec-benefits-section__card-title"><?php echo esc_html($card['title']); ?></h3>
          <?php endif; ?>
        </article>
      <?php endforeach; ?>
    </div>
  </section>
  <?php

  return ob_get_clean();
}

function yec_register_custom_blocks() {
  $editor_script_path = get_template_directory() . '/assets/js/hero-section-block.js';
  $image_text_script_path = get_template_directory() . '/assets/js/image-text-section-block.js';
  $benefits_script_path = get_template_directory() . '/assets/js/benefits-section-block.js';

  if (!file_exists($editor_script_path)) {
    return;
  }

  if (!file_exists($image_text_script_path)) {
    return;
  }

  if (!file_exists($benefits_script_path)) {
    return;
  }

  wp_register_script(
    'yec-hero-section-block',
    get_template_directory_uri() . '/assets/js/hero-section-block.js',
    ['wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n'],
    filemtime($editor_script_path),
    true
  );

  wp_register_script(
    'yec-image-text-section-block',
    get_template_directory_uri() . '/assets/js/image-text-section-block.js',
    ['wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n'],
    filemtime($image_text_script_path),
    true
  );

  wp_register_script(
    'yec-benefits-section-block',
    get_template_directory_uri() . '/assets/js/benefits-section-block.js',
    ['wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n'],
    filemtime($benefits_script_path),
    true
  );

  register_block_type('yec/hero-section', [
    'editor_script'   => 'yec-hero-section-block',
    'render_callback' => 'yec_render_hero_section_block',
    'attributes'      => [
      'eyebrow' => [
        'type'    => 'string',
        'default' => 'Angielski dla doroslych i mlodziezy',
      ],
      'title' => [
        'type'    => 'string',
        'default' => 'Mow po angielsku pewnie i swobodnie',
      ],
      'subtitle' => [
        'type'    => 'string',
        'default' => 'Indywidualne lekcje online, ktore pomoga Ci w pracy, na egzaminie i w codziennej komunikacji.',
      ],
      'ctaText' => [
        'type'    => 'string',
        'default' => 'Umow konsultacje',
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
      'layout' => [
        'type'    => 'string',
        'default' => 'text-first',
      ],
    ],
  ]);

  register_block_type('yec/image-text-section', [
    'editor_script'   => 'yec-image-text-section-block',
    'render_callback' => 'yec_render_image_text_section_block',
    'attributes'      => [
      'eyebrow' => [
        'type'    => 'string',
        'default' => 'Poznajmy sie',
      ],
      'title' => [
        'type'    => 'string',
        'default' => 'Angielski dopasowany do Twoich celow',
      ],
      'contentText' => [
        'type'    => 'string',
        'default' => 'Pomagam doroslym i mlodziezy rozwijac swobode mowienia, slownictwo i pewnosc siebie.',
      ],
      'ctaText' => [
        'type'    => 'string',
        'default' => 'Sprawdz oferte',
      ],
      'ctaUrl' => [
        'type'    => 'string',
        'default' => '/oferta',
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
      'layout' => [
        'type'    => 'string',
        'default' => 'image-left',
      ],
    ],
  ]);

  register_block_type('yec/benefits-section', [
    'editor_script'   => 'yec-benefits-section-block',
    'render_callback' => 'yec_render_benefits_section_block',
    'attributes'      => [
      'eyebrow' => [
        'type'    => 'string',
        'default' => 'Co zyskujesz',
      ],
      'title' => [
        'type'    => 'string',
        'default' => 'Dlaczego warto uczyc sie ze mna',
      ],
      'subtitle' => [
        'type'    => 'string',
        'default' => 'Skupiamy sie na praktycznych efektach, ktore wykorzystasz od razu.',
      ],
      'item1Icon' => [
        'type'    => 'string',
        'default' => '🎯',
      ],
      'item1Title' => [
        'type'    => 'string',
        'default' => 'Plan nauki dopasowany do Ciebie',
      ],
      'item2Icon' => [
        'type'    => 'string',
        'default' => '🗣️',
      ],
      'item2Title' => [
        'type'    => 'string',
        'default' => 'Wieksza swoboda w mowieniu',
      ],
      'item3Icon' => [
        'type'    => 'string',
        'default' => '📈',
      ],
      'item3Title' => [
        'type'    => 'string',
        'default' => 'Widoczne postepy tydzien po tygodniu',
      ],
      'item4Icon' => [
        'type'    => 'string',
        'default' => '💼',
      ],
      'item4Title' => [
        'type'    => 'string',
        'default' => 'Przygotowanie do pracy i egzaminow',
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