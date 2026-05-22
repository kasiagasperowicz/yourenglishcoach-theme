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

function yec_allow_svg_upload($mimes) {
  $mimes['svg'] = 'image/svg+xml';
  return $mimes;
}

add_filter('upload_mimes', 'yec_allow_svg_upload');

function yec_render_hero_section_block($attributes) {
  $eyebrow  = isset($attributes['eyebrow']) ? sanitize_text_field($attributes['eyebrow']) : '';
  $title    = isset($attributes['title']) ? sanitize_text_field($attributes['title']) : '';
  $title_size = isset($attributes['titleSize']) ? sanitize_key((string) $attributes['titleSize']) : 'medium';
  $title_size = in_array($title_size, ['large', 'medium', 'small'], true) ? $title_size : 'medium';
  $subtitle = isset($attributes['subtitle']) ? wp_kses_post($attributes['subtitle']) : '';
  $cta_text = isset($attributes['ctaText']) ? sanitize_text_field($attributes['ctaText']) : '';
  $cta_url  = isset($attributes['ctaUrl']) ? esc_url($attributes['ctaUrl']) : '';
  $image_url = isset($attributes['imageUrl']) ? esc_url($attributes['imageUrl']) : '';
  $image_alt = isset($attributes['imageAlt']) ? sanitize_text_field($attributes['imageAlt']) : '';
  $layout = isset($attributes['layout']) ? sanitize_key($attributes['layout']) : 'text-first';
  $layout = in_array($layout, ['text-first', 'image-first'], true) ? $layout : 'text-first';

  ob_start();
  ?>
  <section class="yec-editable-section yec-editable-section--<?php echo esc_attr($layout); ?> yec-editable-section--title-<?php echo esc_attr($title_size); ?>" aria-label="Sekcja hero">
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
  $title_size = isset($attributes['titleSize']) ? sanitize_key((string) $attributes['titleSize']) : 'medium';
  $title_size = in_array($title_size, ['large', 'medium', 'small'], true) ? $title_size : 'medium';
  $content    = isset($attributes['contentText']) ? wp_kses_post($attributes['contentText']) : '';
  $cta_text   = isset($attributes['ctaText']) ? sanitize_text_field($attributes['ctaText']) : '';
  $cta_url    = isset($attributes['ctaUrl']) ? esc_url($attributes['ctaUrl']) : '';
  $image_url  = isset($attributes['imageUrl']) ? esc_url($attributes['imageUrl']) : '';
  $image_alt  = isset($attributes['imageAlt']) ? sanitize_text_field($attributes['imageAlt']) : '';
  $layout     = isset($attributes['layout']) ? sanitize_key($attributes['layout']) : 'image-left';
  $layout     = in_array($layout, ['image-left', 'image-right'], true) ? $layout : 'image-left';

  ob_start();
  ?>
  <section class="yec-image-text-section yec-image-text-section--<?php echo esc_attr($layout); ?> yec-image-text-section--title-<?php echo esc_attr($title_size); ?>" aria-label="Sekcja obraz i tekst">
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
  $title_size = isset($attributes['titleSize']) ? sanitize_key((string) $attributes['titleSize']) : 'medium';
  $title_size = in_array($title_size, ['large', 'medium', 'small'], true) ? $title_size : 'medium';
  $subtitle = isset($attributes['subtitle']) ? wp_kses_post($attributes['subtitle']) : '';
  $has_background = !empty($attributes['hasBackground']);
  $background_color = isset($attributes['backgroundColor']) ? sanitize_hex_color($attributes['backgroundColor']) : '';
  $section_class = 'yec-benefits-section yec-benefits-section--title-' . $title_size . ($has_background ? ' yec-benefits-section--with-bg' : '');
  $section_style = '';

  if ($has_background && $background_color) {
    $section_style = '--yec-benefits-bg:' . $background_color . ';';
  }

  $cards = [
    [
      'icon'  => isset($attributes['item1Icon']) ? sanitize_text_field($attributes['item1Icon']) : '',
      'icon_image' => isset($attributes['item1IconImageUrl']) ? esc_url($attributes['item1IconImageUrl']) : '',
      'icon_alt' => isset($attributes['item1IconImageAlt']) ? sanitize_text_field($attributes['item1IconImageAlt']) : '',
      'title' => isset($attributes['item1Title']) ? sanitize_text_field($attributes['item1Title']) : '',
    ],
    [
      'icon'  => isset($attributes['item2Icon']) ? sanitize_text_field($attributes['item2Icon']) : '',
      'icon_image' => isset($attributes['item2IconImageUrl']) ? esc_url($attributes['item2IconImageUrl']) : '',
      'icon_alt' => isset($attributes['item2IconImageAlt']) ? sanitize_text_field($attributes['item2IconImageAlt']) : '',
      'title' => isset($attributes['item2Title']) ? sanitize_text_field($attributes['item2Title']) : '',
    ],
    [
      'icon'  => isset($attributes['item3Icon']) ? sanitize_text_field($attributes['item3Icon']) : '',
      'icon_image' => isset($attributes['item3IconImageUrl']) ? esc_url($attributes['item3IconImageUrl']) : '',
      'icon_alt' => isset($attributes['item3IconImageAlt']) ? sanitize_text_field($attributes['item3IconImageAlt']) : '',
      'title' => isset($attributes['item3Title']) ? sanitize_text_field($attributes['item3Title']) : '',
    ],
    [
      'icon'  => isset($attributes['item4Icon']) ? sanitize_text_field($attributes['item4Icon']) : '',
      'icon_image' => isset($attributes['item4IconImageUrl']) ? esc_url($attributes['item4IconImageUrl']) : '',
      'icon_alt' => isset($attributes['item4IconImageAlt']) ? sanitize_text_field($attributes['item4IconImageAlt']) : '',
      'title' => isset($attributes['item4Title']) ? sanitize_text_field($attributes['item4Title']) : '',
    ],
  ];

  ob_start();
  ?>
  <section class="<?php echo esc_attr($section_class); ?>"<?php echo $section_style ? ' style="' . esc_attr($section_style) . '"' : ''; ?> aria-label="Co zyskujesz">
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
          <?php if ($card['icon_image']) : ?>
            <span class="yec-benefits-section__icon">
              <img class="yec-benefits-section__icon-image" src="<?php echo esc_url($card['icon_image']); ?>" alt="<?php echo esc_attr($card['icon_alt']); ?>">
            </span>
          <?php elseif ($card['icon']) : ?>
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

function yec_render_google_reviews_block($attributes) {
  $google_reviews_url = 'https://www.google.com/search?sca_esv=78843e6f5da49b15&hl=pl-PL&sxsrf=ANbL-n4lRVg8a2Xuepq-7_LrQCoUlgoZhw:1779277099623&q=monika+ra%C5%BAniewska+-+your+english+coach+pozna%C5%84+opinie&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOT3MlEa_UxfvZNqakWrtPKV9WiC7rZ1BvPHw2VXhsgHsHIlVBelYZKx_DIUBceaSS9Qie64%3D&uds=ALYpb_msCbf7eOd7scXyYS6_3dkBohr0WYMWeEBCRCBE_88Ir_8L3k54yrEZSe370VSNb7o7w8J9wMw_9YpB55Lg1-K2t45bPeJYdZzUUVE5bEQ2eLvftOz6QxB44CUUiyz12P-3hyp0iI8r0PaRyHEjpnRToigJBQ&sa=X&ved=2ahUKEwiXpuvb48eUAxUdORAIHTQeODAQ3PALegQIOxAF&biw=1710&bih=995&dpr=1';
  $section_title = isset($attributes['sectionTitle']) ? sanitize_text_field((string) $attributes['sectionTitle']) : '';
  $title_size = isset($attributes['titleSize']) ? sanitize_key((string) $attributes['titleSize']) : 'medium';
  $title_size = in_array($title_size, ['large', 'medium', 'small'], true) ? $title_size : 'medium';
  $has_background = !empty($attributes['hasBackground']);
  $background_color = isset($attributes['backgroundColor']) ? sanitize_hex_color($attributes['backgroundColor']) : '';
  $background_image_url = isset($attributes['backgroundImageUrl']) ? esc_url_raw((string) $attributes['backgroundImageUrl']) : '';
  $section_class = 'yec-google-reviews yec-google-reviews--title-' . $title_size . ($has_background ? ' yec-google-reviews--with-bg' : '');
  $section_style = '';
  $style_parts = [];

  if ($has_background && $background_color) {
    $style_parts[] = '--yec-google-reviews-bg-color:' . $background_color;
  }

  if ($has_background && $background_image_url) {
    $style_parts[] = '--yec-google-reviews-bg-image:url(' . $background_image_url . ')';
  }

  if (!empty($style_parts)) {
    $section_style = implode(';', $style_parts) . ';';
  }

  $cards = isset($attributes['cards']) && is_array($attributes['cards']) ? $attributes['cards'] : [];

  $cards = array_values(array_filter($cards, function ($card) {
    if (!is_array($card)) {
      return false;
    }

    $text = isset($card['text']) ? trim((string) $card['text']) : '';
    return '' !== $text;
  }));

  if (empty($cards)) {
    return '';
  }

  ob_start();
  ?>
  <section class="<?php echo esc_attr($section_class); ?>"<?php echo $section_style ? ' style="' . esc_attr($section_style) . '"' : ''; ?> aria-label="Opinie Google">
    <?php if ($section_title) : ?>
      <h2 class="yec-google-reviews__section-title"><?php echo esc_html($section_title); ?></h2>
    <?php endif; ?>
    <div class="yec-google-reviews__viewport-wrap">
      <div class="yec-google-reviews__viewport">
        <div class="yec-google-reviews__track" data-cards="<?php echo esc_attr((string) count($cards)); ?>">
          <?php foreach ($cards as $card) : ?>
            <?php
            $photo_url = isset($card['photoUrl']) ? esc_url((string) $card['photoUrl']) : '';
            $photo_alt = isset($card['photoAlt']) ? sanitize_text_field((string) $card['photoAlt']) : '';
            $stars_raw = isset($card['stars']) ? (int) $card['stars'] : 5;
            $stars = max(1, min(5, $stars_raw));
            $text = isset($card['text']) ? wp_kses_post((string) $card['text']) : '';
            $author = isset($card['author']) ? sanitize_text_field((string) $card['author']) : '';
            $card_review_url = isset($card['reviewUrl']) ? esc_url((string) $card['reviewUrl']) : '';
            $card_link = $card_review_url ? $card_review_url : $google_reviews_url;
            ?>
            <a class="yec-google-reviews__card" href="<?php echo esc_url($card_link); ?>" target="_blank" rel="noopener noreferrer">
              <div class="yec-google-reviews__meta">
                <span class="yec-google-reviews__avatar">
                  <?php if ($photo_url) : ?>
                    <img src="<?php echo esc_url($photo_url); ?>" alt="<?php echo esc_attr($photo_alt); ?>">
                  <?php endif; ?>
                </span>
                <span class="yec-google-reviews__stars" aria-label="<?php echo esc_attr($stars); ?> na 5 gwiazdek">
                  <?php for ($i = 1; $i <= 5; $i++) : ?>
                    <span class="yec-google-reviews__star<?php echo $i <= $stars ? ' is-filled' : ''; ?>">★</span>
                  <?php endfor; ?>
                </span>
              </div>
              <p class="yec-google-reviews__text"><?php echo wp_kses_post($text); ?></p>
              <?php if ($author) : ?>
                <p class="yec-google-reviews__author"><?php echo esc_html($author); ?></p>
              <?php endif; ?>
            </a>
          <?php endforeach; ?>
        </div>
      </div>

      <?php if (count($cards) > 3) : ?>
        <div class="yec-google-reviews__controls" aria-hidden="true">
          <button type="button" class="yec-google-reviews__btn yec-google-reviews__btn--prev" data-direction="prev">‹</button>
          <button type="button" class="yec-google-reviews__btn yec-google-reviews__btn--next" data-direction="next">›</button>
        </div>
      <?php endif; ?>
    </div>
  </section>
  <?php

  return ob_get_clean();
}

function yec_render_parallax_image_block($attributes) {
  $image_url = isset($attributes['imageUrl']) ? esc_url((string) $attributes['imageUrl']) : '';
  $image_alt = isset($attributes['imageAlt']) ? sanitize_text_field((string) $attributes['imageAlt']) : '';
  $parallax_enabled = !isset($attributes['parallaxEnabled']) || !empty($attributes['parallaxEnabled']);
  $parallax_strength = isset($attributes['parallaxStrength']) ? (int) $attributes['parallaxStrength'] : 48;
  $parallax_strength = max(0, min(120, $parallax_strength));

  if (!$image_url) {
    return '';
  }

  ob_start();
  ?>
  <section class="yec-parallax-image<?php echo $parallax_enabled ? ' is-parallax-enabled' : ''; ?>" data-parallax-enabled="<?php echo $parallax_enabled ? '1' : '0'; ?>" data-parallax-strength="<?php echo esc_attr((string) $parallax_strength); ?>" aria-label="Sekcja obraz parallax">
    <div class="yec-parallax-image__media">
      <img class="yec-parallax-image__img" src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr($image_alt); ?>">
    </div>
  </section>
  <?php

  return ob_get_clean();
}

function yec_render_about_me_section_block($attributes) {
  $eyebrow = isset($attributes['eyebrow']) ? sanitize_text_field((string) $attributes['eyebrow']) : '';
  $title = isset($attributes['title']) ? sanitize_text_field((string) $attributes['title']) : '';
  $title_size = isset($attributes['titleSize']) ? sanitize_key((string) $attributes['titleSize']) : 'medium';
  $title_size = in_array($title_size, ['large', 'medium', 'small'], true) ? $title_size : 'medium';
  $content = isset($attributes['contentText']) ? wp_kses_post((string) $attributes['contentText']) : '';
  $cta_text = isset($attributes['ctaText']) ? sanitize_text_field((string) $attributes['ctaText']) : '';
  $cta_url = isset($attributes['ctaUrl']) ? esc_url((string) $attributes['ctaUrl']) : '';

  ob_start();
  ?>
  <section class="yec-about-me-section yec-about-me-section--title-<?php echo esc_attr($title_size); ?>" aria-label="Poznaj mnie blizej">
    <div class="yec-about-me-section__left">
      <?php if ($eyebrow) : ?>
        <p class="yec-about-me-section__eyebrow"><?php echo esc_html($eyebrow); ?></p>
      <?php endif; ?>

      <?php if ($title) : ?>
        <h2 class="yec-about-me-section__title"><?php echo esc_html($title); ?></h2>
      <?php endif; ?>
    </div>

    <div class="yec-about-me-section__right">
      <?php if ($content) : ?>
        <p class="yec-about-me-section__text"><?php echo wp_kses_post($content); ?></p>
      <?php endif; ?>

      <?php if ($cta_text && $cta_url) : ?>
        <a class="yec-cta__button" href="<?php echo esc_url($cta_url); ?>"><?php echo esc_html($cta_text); ?></a>
      <?php endif; ?>
    </div>
  </section>
  <?php

  return ob_get_clean();
}

function yec_render_learning_options_section_block($attributes) {
  $section_title = isset($attributes['sectionTitle']) ? sanitize_text_field((string) $attributes['sectionTitle']) : '';
  $title_size = isset($attributes['titleSize']) ? sanitize_key((string) $attributes['titleSize']) : 'medium';
  $title_size = in_array($title_size, ['large', 'medium', 'small'], true) ? $title_size : 'medium';

  $cards = [
    [
      'title' => isset($attributes['card1Title']) ? sanitize_text_field((string) $attributes['card1Title']) : '',
      'text' => isset($attributes['card1Text']) ? wp_kses_post((string) $attributes['card1Text']) : '',
      'image_url' => isset($attributes['card1ImageUrl']) ? esc_url((string) $attributes['card1ImageUrl']) : '',
      'image_alt' => isset($attributes['card1ImageAlt']) ? sanitize_text_field((string) $attributes['card1ImageAlt']) : '',
    ],
    [
      'title' => isset($attributes['card2Title']) ? sanitize_text_field((string) $attributes['card2Title']) : '',
      'text' => isset($attributes['card2Text']) ? wp_kses_post((string) $attributes['card2Text']) : '',
      'image_url' => isset($attributes['card2ImageUrl']) ? esc_url((string) $attributes['card2ImageUrl']) : '',
      'image_alt' => isset($attributes['card2ImageAlt']) ? sanitize_text_field((string) $attributes['card2ImageAlt']) : '',
    ],
    [
      'title' => isset($attributes['card3Title']) ? sanitize_text_field((string) $attributes['card3Title']) : '',
      'text' => isset($attributes['card3Text']) ? wp_kses_post((string) $attributes['card3Text']) : '',
      'image_url' => isset($attributes['card3ImageUrl']) ? esc_url((string) $attributes['card3ImageUrl']) : '',
      'image_alt' => isset($attributes['card3ImageAlt']) ? sanitize_text_field((string) $attributes['card3ImageAlt']) : '',
    ],
  ];

  ob_start();
  ?>
  <section class="yec-learning-section yec-learning-section--title-<?php echo esc_attr($title_size); ?>" aria-label="Jak mozesz uczyc sie ze mna">
    <?php if ($section_title) : ?>
      <h2 class="yec-learning-section__title"><?php echo esc_html($section_title); ?></h2>
    <?php endif; ?>

    <div class="yec-learning-section__grid">
      <?php foreach ($cards as $card) : ?>
        <?php if (!$card['title'] && !$card['text'] && !$card['image_url']) {
          continue;
        } ?>
        <article class="yec-learning-section__card">
          <?php if ($card['title']) : ?>
            <h3 class="yec-learning-section__card-title"><?php echo esc_html($card['title']); ?></h3>
          <?php endif; ?>

          <?php if ($card['text']) : ?>
            <p class="yec-learning-section__card-text"><?php echo wp_kses_post($card['text']); ?></p>
          <?php endif; ?>

          <?php if ($card['image_url']) : ?>
            <div class="yec-learning-section__media">
              <img class="yec-learning-section__image" src="<?php echo esc_url($card['image_url']); ?>" alt="<?php echo esc_attr($card['image_alt']); ?>">
            </div>
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
  $google_reviews_script_path = get_template_directory() . '/assets/js/google-reviews-block.js';
  $parallax_image_script_path = get_template_directory() . '/assets/js/parallax-image-block.js';
  $about_me_script_path = get_template_directory() . '/assets/js/about-me-section-block.js';
  $learning_options_script_path = get_template_directory() . '/assets/js/learning-options-section-block.js';

  if (!file_exists($editor_script_path)) {
    return;
  }

  if (!file_exists($image_text_script_path)) {
    return;
  }

  if (!file_exists($benefits_script_path)) {
    return;
  }

  if (!file_exists($google_reviews_script_path)) {
    return;
  }

  if (!file_exists($parallax_image_script_path)) {
    return;
  }

  if (!file_exists($about_me_script_path)) {
    return;
  }

  if (!file_exists($learning_options_script_path)) {
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

  wp_register_script(
    'yec-google-reviews-block',
    get_template_directory_uri() . '/assets/js/google-reviews-block.js',
    ['wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n'],
    filemtime($google_reviews_script_path),
    true
  );

  wp_register_script(
    'yec-parallax-image-block',
    get_template_directory_uri() . '/assets/js/parallax-image-block.js',
    ['wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n'],
    filemtime($parallax_image_script_path),
    true
  );

  wp_register_script(
    'yec-about-me-section-block',
    get_template_directory_uri() . '/assets/js/about-me-section-block.js',
    ['wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n'],
    filemtime($about_me_script_path),
    true
  );

  wp_register_script(
    'yec-learning-options-section-block',
    get_template_directory_uri() . '/assets/js/learning-options-section-block.js',
    ['wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n'],
    filemtime($learning_options_script_path),
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
      'titleSize' => [
        'type'    => 'string',
        'default' => 'medium',
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
      'titleSize' => [
        'type'    => 'string',
        'default' => 'medium',
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
      'titleSize' => [
        'type'    => 'string',
        'default' => 'medium',
      ],
      'subtitle' => [
        'type'    => 'string',
        'default' => 'Skupiamy sie na praktycznych efektach, ktore wykorzystasz od razu.',
      ],
      'hasBackground' => [
        'type'    => 'boolean',
        'default' => false,
      ],
      'backgroundColor' => [
        'type'    => 'string',
        'default' => '#F7EEF2',
      ],
      'item1Icon' => [
        'type'    => 'string',
        'default' => '🎯',
      ],
      'item1IconImageId' => [
        'type' => 'number',
      ],
      'item1IconImageUrl' => [
        'type'    => 'string',
        'default' => '',
      ],
      'item1IconImageAlt' => [
        'type'    => 'string',
        'default' => '',
      ],
      'item1Title' => [
        'type'    => 'string',
        'default' => 'Plan nauki dopasowany do Ciebie',
      ],
      'item2Icon' => [
        'type'    => 'string',
        'default' => '🗣️',
      ],
      'item2IconImageId' => [
        'type' => 'number',
      ],
      'item2IconImageUrl' => [
        'type'    => 'string',
        'default' => '',
      ],
      'item2IconImageAlt' => [
        'type'    => 'string',
        'default' => '',
      ],
      'item2Title' => [
        'type'    => 'string',
        'default' => 'Wieksza swoboda w mowieniu',
      ],
      'item3Icon' => [
        'type'    => 'string',
        'default' => '📈',
      ],
      'item3IconImageId' => [
        'type' => 'number',
      ],
      'item3IconImageUrl' => [
        'type'    => 'string',
        'default' => '',
      ],
      'item3IconImageAlt' => [
        'type'    => 'string',
        'default' => '',
      ],
      'item3Title' => [
        'type'    => 'string',
        'default' => 'Widoczne postepy tydzien po tygodniu',
      ],
      'item4Icon' => [
        'type'    => 'string',
        'default' => '💼',
      ],
      'item4IconImageId' => [
        'type' => 'number',
      ],
      'item4IconImageUrl' => [
        'type'    => 'string',
        'default' => '',
      ],
      'item4IconImageAlt' => [
        'type'    => 'string',
        'default' => '',
      ],
      'item4Title' => [
        'type'    => 'string',
        'default' => 'Przygotowanie do pracy i egzaminow',
      ],
    ],
  ]);

  register_block_type('yec/google-reviews', [
    'editor_script'   => 'yec-google-reviews-block',
    'render_callback' => 'yec_render_google_reviews_block',
    'attributes'      => [
      'sectionTitle' => [
        'type'    => 'string',
        'default' => '',
      ],
      'titleSize' => [
        'type'    => 'string',
        'default' => 'medium',
      ],
      'hasBackground' => [
        'type'    => 'boolean',
        'default' => false,
      ],
      'backgroundColor' => [
        'type'    => 'string',
        'default' => '#F7EEF2',
      ],
      'backgroundImageId' => [
        'type' => 'number',
      ],
      'backgroundImageUrl' => [
        'type'    => 'string',
        'default' => '',
      ],
      'cards' => [
        'type'    => 'array',
        'default' => [],
      ],
    ],
  ]);

  register_block_type('yec/parallax-image', [
    'editor_script'   => 'yec-parallax-image-block',
    'render_callback' => 'yec_render_parallax_image_block',
    'attributes'      => [
      'imageId' => [
        'type' => 'number',
      ],
      'imageUrl' => [
        'type'    => 'string',
        'default' => '',
      ],
      'imageAlt' => [
        'type'    => 'string',
        'default' => '',
      ],
      'parallaxEnabled' => [
        'type'    => 'boolean',
        'default' => true,
      ],
      'parallaxStrength' => [
        'type'    => 'number',
        'default' => 48,
      ],
    ],
  ]);

  register_block_type('yec/about-me-section', [
    'editor_script'   => 'yec-about-me-section-block',
    'render_callback' => 'yec_render_about_me_section_block',
    'attributes'      => [
      'eyebrow' => [
        'type'    => 'string',
        'default' => 'Poznaj mnie blizej',
      ],
      'title' => [
        'type'    => 'string',
        'default' => 'Pomagam mowic po angielsku pewnie i naturalnie',
      ],
      'titleSize' => [
        'type'    => 'string',
        'default' => 'medium',
      ],
      'contentText' => [
        'type'    => 'string',
        'default' => 'Tworze lekcje dopasowane do Twoich celow, tempa i stylu pracy. Skupiamy sie na praktyce, swobodzie mowienia i realnych efektach.',
      ],
      'ctaText' => [
        'type'    => 'string',
        'default' => 'Umow konsultacje',
      ],
      'ctaUrl' => [
        'type'    => 'string',
        'default' => '/kontakt',
      ],
    ],
  ]);

  register_block_type('yec/learning-options-section', [
    'editor_script'   => 'yec-learning-options-section-block',
    'render_callback' => 'yec_render_learning_options_section_block',
    'attributes'      => [
      'sectionTitle' => [
        'type'    => 'string',
        'default' => 'Jak mozesz uczyc sie ze mna',
      ],
      'titleSize' => [
        'type'    => 'string',
        'default' => 'medium',
      ],
      'card1Title' => [
        'type'    => 'string',
        'default' => 'Lekcje indywidualne',
      ],
      'card1Text' => [
        'type'    => 'string',
        'default' => 'Spotkania 1:1 dopasowane do Twoich celow i tempa pracy.',
      ],
      'card1ImageId' => [
        'type' => 'number',
      ],
      'card1ImageUrl' => [
        'type'    => 'string',
        'default' => '',
      ],
      'card1ImageAlt' => [
        'type'    => 'string',
        'default' => '',
      ],
      'card2Title' => [
        'type'    => 'string',
        'default' => 'Konwersacje tematyczne',
      ],
      'card2Text' => [
        'type'    => 'string',
        'default' => 'Praktyczne rozmowy, ktore pomagaja swobodnie mowic po angielsku.',
      ],
      'card2ImageId' => [
        'type' => 'number',
      ],
      'card2ImageUrl' => [
        'type'    => 'string',
        'default' => '',
      ],
      'card2ImageAlt' => [
        'type'    => 'string',
        'default' => '',
      ],
      'card3Title' => [
        'type'    => 'string',
        'default' => 'Wsparcie do egzaminow',
      ],
      'card3Text' => [
        'type'    => 'string',
        'default' => 'Materialy i plan nauki skoncentrowane na Twoim wyniku.',
      ],
      'card3ImageId' => [
        'type' => 'number',
      ],
      'card3ImageUrl' => [
        'type'    => 'string',
        'default' => '',
      ],
      'card3ImageAlt' => [
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