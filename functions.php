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

// Serwuj logo w wyższej rozdzielczości (300px) dla ekranów Retina/HiDPI.
// CSS nadal wyświetla w 120px, ale plik jest większy → ostry na 2×/3× DPI.
add_filter('get_custom_logo', function ($html) {
  $logo_id = get_theme_mod('custom_logo');
  if (!$logo_id) {
    return $html;
  }
  $image = wp_get_attachment_image($logo_id, [300, 300], false, [
    'class' => 'custom-logo',
    'alt'   => get_bloginfo('name'),
  ]);
  if (!$image) {
    return $html;
  }
  return '<a href="' . esc_url(home_url('/')) . '" class="custom-logo-link" rel="home">' . $image . '</a>';
});

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

function yec_get_section_spacing_style($attributes) {
  $styles = [];

  if (isset($attributes['sectionSpaceTop']) && is_numeric($attributes['sectionSpaceTop'])) {
    $top = max(0, min(400, (int) $attributes['sectionSpaceTop']));
    $styles[] = 'margin-top:' . $top . 'px';
  }

  if (isset($attributes['sectionSpaceBottom']) && is_numeric($attributes['sectionSpaceBottom'])) {
    $bottom = max(0, min(400, (int) $attributes['sectionSpaceBottom']));
    $styles[] = 'margin-bottom:' . $bottom . 'px';
  }

  if (empty($styles)) {
    return '';
  }

  return implode(';', $styles) . ';';
}

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
  $mobile_image_url = isset($attributes['mobileImageUrl']) ? esc_url((string) $attributes['mobileImageUrl']) : '';
  $mobile_image_alt = isset($attributes['mobileImageAlt']) ? sanitize_text_field((string) $attributes['mobileImageAlt']) : '';
  $layout = isset($attributes['layout']) ? sanitize_key($attributes['layout']) : 'text-first';
  $layout = in_array($layout, ['text-first', 'image-first'], true) ? $layout : 'text-first';
  $section_spacing_style = yec_get_section_spacing_style($attributes);
  $anchor_id = isset($attributes['anchorId']) ? sanitize_key((string) $attributes['anchorId']) : '';

  ob_start();
  ?>
  <section<?php echo $anchor_id ? ' id="' . esc_attr($anchor_id) . '"' : ''; ?> class="yec-editable-section yec-editable-section--<?php echo esc_attr($layout); ?> yec-editable-section--title-<?php echo esc_attr($title_size); ?>"<?php echo $section_spacing_style ? ' style="' . esc_attr($section_spacing_style) . '"' : ''; ?> aria-label="Sekcja hero">
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
        <picture>
          <source media="(max-width: 860px)" srcset="<?php echo esc_url($mobile_image_url ?: $image_url); ?>">
          <img class="yec-editable-section__image" src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr($mobile_image_url ? ($mobile_image_alt ?: $image_alt) : $image_alt); ?>">
        </picture>
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
  $mobile_image_url = isset($attributes['mobileImageUrl']) ? esc_url((string) $attributes['mobileImageUrl']) : '';
  $mobile_image_alt = isset($attributes['mobileImageAlt']) ? sanitize_text_field((string) $attributes['mobileImageAlt']) : '';
  $layout     = isset($attributes['layout']) ? sanitize_key($attributes['layout']) : 'image-left';
  $layout     = in_array($layout, ['image-left', 'image-right'], true) ? $layout : 'image-left';
  $section_spacing_style = yec_get_section_spacing_style($attributes);
  $anchor_id = isset($attributes['anchorId']) ? sanitize_key((string) $attributes['anchorId']) : '';

  ob_start();
  ?>
  <section<?php echo $anchor_id ? ' id="' . esc_attr($anchor_id) . '"' : ''; ?> class="yec-image-text-section yec-image-text-section--<?php echo esc_attr($layout); ?> yec-image-text-section--title-<?php echo esc_attr($title_size); ?>"<?php echo $section_spacing_style ? ' style="' . esc_attr($section_spacing_style) . '"' : ''; ?> aria-label="Sekcja obraz i tekst">
    <?php if ($image_url) : ?>
      <div class="yec-image-text-section__media">
        <picture>
          <source media="(max-width: 860px)" srcset="<?php echo esc_url($mobile_image_url ?: $image_url); ?>">
          <img class="yec-image-text-section__image" src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr($mobile_image_url ? ($mobile_image_alt ?: $image_alt) : $image_alt); ?>">
        </picture>
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

  $section_style .= yec_get_section_spacing_style($attributes);

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
  $anchor_id = isset($attributes['anchorId']) ? sanitize_key((string) $attributes['anchorId']) : '';

  ob_start();
  ?>
  <section<?php echo $anchor_id ? ' id="' . esc_attr($anchor_id) . '"' : ''; ?> class="<?php echo esc_attr($section_class); ?>"<?php echo $section_style ? ' style="' . esc_attr($section_style) . '"' : ''; ?> aria-label="Co zyskujesz">
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

    <div class="yec-benefits-section__viewport-wrap">
      <div class="yec-benefits-section__viewport">
        <div class="yec-benefits-section__track">
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
      </div>
      <div class="yec-benefits-section__controls" aria-hidden="true">
        <button type="button" class="yec-benefits-section__btn yec-benefits-section__btn--prev" data-direction="prev">‹</button>
        <button type="button" class="yec-benefits-section__btn yec-benefits-section__btn--next" data-direction="next">›</button>
      </div>
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
  $mobile_background_image_url = isset($attributes['mobileBackgroundImageUrl']) ? esc_url_raw((string) $attributes['mobileBackgroundImageUrl']) : '';
  $section_class = 'yec-google-reviews yec-google-reviews--title-' . $title_size . ($has_background ? ' yec-google-reviews--with-bg' : '');
  $section_style = '';
  $style_parts = [];

  if ($has_background && $background_color) {
    $style_parts[] = '--yec-google-reviews-bg-color:' . $background_color;
  }

  if ($has_background && $background_image_url) {
    $style_parts[] = '--yec-google-reviews-bg-image:url(' . $background_image_url . ')';
  }

  $effective_mobile_bg = $mobile_background_image_url ? $mobile_background_image_url : $background_image_url;
  if ($has_background && $effective_mobile_bg) {
    $style_parts[] = '--yec-google-reviews-bg-image-mobile:url(' . $effective_mobile_bg . ')';
  }

  if (!empty($style_parts)) {
    $section_style = implode(';', $style_parts) . ';';
  }

  $section_style .= yec_get_section_spacing_style($attributes);

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
  $anchor_id = isset($attributes['anchorId']) ? sanitize_key((string) $attributes['anchorId']) : '';

  ob_start();
  ?>
  <section<?php echo $anchor_id ? ' id="' . esc_attr($anchor_id) . '"' : ''; ?> class="<?php echo esc_attr($section_class); ?>"<?php echo $section_style ? ' style="' . esc_attr($section_style) . '"' : ''; ?> aria-label="Opinie Google">
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
  $mobile_image_url = isset($attributes['mobileImageUrl']) ? esc_url((string) $attributes['mobileImageUrl']) : '';
  $mobile_image_alt = isset($attributes['mobileImageAlt']) ? sanitize_text_field((string) $attributes['mobileImageAlt']) : '';
  $parallax_enabled = !isset($attributes['parallaxEnabled']) || !empty($attributes['parallaxEnabled']);
  $parallax_strength = isset($attributes['parallaxStrength']) ? (int) $attributes['parallaxStrength'] : 48;
  $parallax_strength = max(0, min(120, $parallax_strength));
  $section_spacing_style = yec_get_section_spacing_style($attributes);

  if (!$image_url && !$mobile_image_url) {
    return '';
  }

  $desktop_image_url = $image_url ? $image_url : $mobile_image_url;
  $desktop_image_alt = $image_alt ? $image_alt : $mobile_image_alt;
  $mobile_image_url = $mobile_image_url ? $mobile_image_url : $desktop_image_url;
  $mobile_image_alt = $mobile_image_alt ? $mobile_image_alt : $desktop_image_alt;
  $anchor_id = isset($attributes['anchorId']) ? sanitize_key((string) $attributes['anchorId']) : '';

  ob_start();
  ?>
  <section<?php echo $anchor_id ? ' id="' . esc_attr($anchor_id) . '"' : ''; ?> class="yec-parallax-image<?php echo $parallax_enabled ? ' is-parallax-enabled' : ''; ?>"<?php echo $section_spacing_style ? ' style="' . esc_attr($section_spacing_style) . '"' : ''; ?> data-parallax-enabled="<?php echo $parallax_enabled ? '1' : '0'; ?>" data-parallax-strength="<?php echo esc_attr((string) $parallax_strength); ?>" aria-label="Sekcja obraz parallax">
    <div class="yec-parallax-image__media">
      <picture>
        <source media="(max-width: 860px)" srcset="<?php echo esc_url($mobile_image_url); ?>">
        <img class="yec-parallax-image__img" src="<?php echo esc_url($desktop_image_url); ?>" alt="<?php echo esc_attr($desktop_image_alt); ?>" data-mobile-alt="<?php echo esc_attr($mobile_image_alt); ?>">
      </picture>
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
  $section_spacing_style = yec_get_section_spacing_style($attributes);
  $anchor_id = isset($attributes['anchorId']) ? sanitize_key((string) $attributes['anchorId']) : '';

  ob_start();
  ?>
  <section<?php echo $anchor_id ? ' id="' . esc_attr($anchor_id) . '"' : ''; ?> class="yec-about-me-section yec-about-me-section--title-<?php echo esc_attr($title_size); ?>"<?php echo $section_spacing_style ? ' style="' . esc_attr($section_spacing_style) . '"' : ''; ?> aria-label="Poznaj mnie bliżej">
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
  $section_spacing_style = yec_get_section_spacing_style($attributes);

  $cards = [
    [
      'title' => isset($attributes['card1Title']) ? sanitize_text_field((string) $attributes['card1Title']) : '',
      'text' => isset($attributes['card1Text']) ? wp_kses_post((string) $attributes['card1Text']) : '',
      'image_url' => isset($attributes['card1ImageUrl']) ? esc_url((string) $attributes['card1ImageUrl']) : '',
      'image_alt' => isset($attributes['card1ImageAlt']) ? sanitize_text_field((string) $attributes['card1ImageAlt']) : '',
      'mobile_image_url' => isset($attributes['card1MobileImageUrl']) ? esc_url((string) $attributes['card1MobileImageUrl']) : '',
      'mobile_image_alt' => isset($attributes['card1MobileImageAlt']) ? sanitize_text_field((string) $attributes['card1MobileImageAlt']) : '',
    ],
    [
      'title' => isset($attributes['card2Title']) ? sanitize_text_field((string) $attributes['card2Title']) : '',
      'text' => isset($attributes['card2Text']) ? wp_kses_post((string) $attributes['card2Text']) : '',
      'image_url' => isset($attributes['card2ImageUrl']) ? esc_url((string) $attributes['card2ImageUrl']) : '',
      'image_alt' => isset($attributes['card2ImageAlt']) ? sanitize_text_field((string) $attributes['card2ImageAlt']) : '',
      'mobile_image_url' => isset($attributes['card2MobileImageUrl']) ? esc_url((string) $attributes['card2MobileImageUrl']) : '',
      'mobile_image_alt' => isset($attributes['card2MobileImageAlt']) ? sanitize_text_field((string) $attributes['card2MobileImageAlt']) : '',
    ],
    [
      'title' => isset($attributes['card3Title']) ? sanitize_text_field((string) $attributes['card3Title']) : '',
      'text' => isset($attributes['card3Text']) ? wp_kses_post((string) $attributes['card3Text']) : '',
      'image_url' => isset($attributes['card3ImageUrl']) ? esc_url((string) $attributes['card3ImageUrl']) : '',
      'image_alt' => isset($attributes['card3ImageAlt']) ? sanitize_text_field((string) $attributes['card3ImageAlt']) : '',
      'mobile_image_url' => isset($attributes['card3MobileImageUrl']) ? esc_url((string) $attributes['card3MobileImageUrl']) : '',
      'mobile_image_alt' => isset($attributes['card3MobileImageAlt']) ? sanitize_text_field((string) $attributes['card3MobileImageAlt']) : '',
    ],
  ];
  $anchor_id = isset($attributes['anchorId']) ? sanitize_key((string) $attributes['anchorId']) : '';

  ob_start();
  ?>
  <section<?php echo $anchor_id ? ' id="' . esc_attr($anchor_id) . '"' : ''; ?> class="yec-learning-section yec-learning-section--title-<?php echo esc_attr($title_size); ?>"<?php echo $section_spacing_style ? ' style="' . esc_attr($section_spacing_style) . '"' : ''; ?> aria-label="Jak możesz uczyć się ze mną">
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
              <picture>
                <source media="(max-width: 860px)" srcset="<?php echo esc_url($card['mobile_image_url'] ?: $card['image_url']); ?>">
                <img class="yec-learning-section__image" src="<?php echo esc_url($card['image_url']); ?>" alt="<?php echo esc_attr($card['mobile_image_url'] ? ($card['mobile_image_alt'] ?: $card['image_alt']) : $card['image_alt']); ?>">
              </picture>
            </div>
          <?php endif; ?>
        </article>
      <?php endforeach; ?>
    </div>
  </section>
  <?php

  return ob_get_clean();
}

function yec_render_overlay_banner_section_block($attributes) {
  $image_url = isset($attributes['imageUrl']) ? esc_url((string) $attributes['imageUrl']) : '';
  $image_alt = isset($attributes['imageAlt']) ? sanitize_text_field((string) $attributes['imageAlt']) : '';
  $mobile_image_url = isset($attributes['mobileImageUrl']) ? esc_url((string) $attributes['mobileImageUrl']) : '';
  $mobile_image_alt = isset($attributes['mobileImageAlt']) ? sanitize_text_field((string) $attributes['mobileImageAlt']) : '';
  $parallax_enabled = !isset($attributes['parallaxEnabled']) || !empty($attributes['parallaxEnabled']);
  $parallax_strength = isset($attributes['parallaxStrength']) ? (int) $attributes['parallaxStrength'] : 48;
  $parallax_strength = max(0, min(120, $parallax_strength));
  $overlay_color = isset($attributes['overlayColor']) ? sanitize_hex_color($attributes['overlayColor']) : '#000000';
  if (!$overlay_color) {
    $overlay_color = '#000000';
  }
  $overlay_opacity = isset($attributes['overlayOpacity']) ? (int) $attributes['overlayOpacity'] : 35;
  $overlay_opacity = max(0, min(100, $overlay_opacity));
  $title_primary = isset($attributes['titlePrimary']) ? sanitize_text_field((string) $attributes['titlePrimary']) : '';
  $title_secondary = isset($attributes['titleSecondary']) ? sanitize_text_field((string) $attributes['titleSecondary']) : '';
  $title_primary_size = isset($attributes['titlePrimarySize']) ? sanitize_key((string) $attributes['titlePrimarySize']) : 'large';
  $title_primary_size = in_array($title_primary_size, ['large', 'medium', 'small'], true) ? $title_primary_size : 'large';
  $title_secondary_size = isset($attributes['titleSecondarySize']) ? sanitize_key((string) $attributes['titleSecondarySize']) : 'small';
  $title_secondary_size = in_array($title_secondary_size, ['large', 'medium', 'small'], true) ? $title_secondary_size : 'small';
  $cta_text = isset($attributes['ctaText']) ? sanitize_text_field((string) $attributes['ctaText']) : '';
  $cta_url = isset($attributes['ctaUrl']) ? esc_url((string) $attributes['ctaUrl']) : '';
  $section_spacing_style = yec_get_section_spacing_style($attributes);
  $section_style = '--yec-overlay-color:' . $overlay_color . ';--yec-overlay-opacity:' . ($overlay_opacity / 100) . ';' . $section_spacing_style;
  $anchor_id = isset($attributes['anchorId']) ? sanitize_key((string) $attributes['anchorId']) : '';

  ob_start();
  ?>
  <section<?php echo $anchor_id ? ' id="' . esc_attr($anchor_id) . '"' : ''; ?> class="yec-overlay-banner<?php echo $parallax_enabled ? ' is-parallax-enabled' : ''; ?> yec-overlay-banner--primary-<?php echo esc_attr($title_primary_size); ?> yec-overlay-banner--secondary-<?php echo esc_attr($title_secondary_size); ?>"<?php echo $section_style ? ' style="' . esc_attr($section_style) . '"' : ''; ?> data-parallax-enabled="<?php echo $parallax_enabled ? '1' : '0'; ?>" data-parallax-strength="<?php echo esc_attr((string) $parallax_strength); ?>" aria-label="Sekcja overlay banner">
    <div class="yec-overlay-banner__media">
      <?php if ($image_url) : ?>
        <picture>
          <source media="(max-width: 860px)" srcset="<?php echo esc_url($mobile_image_url ?: $image_url); ?>">
          <img class="yec-overlay-banner__image" src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr($mobile_image_url ? ($mobile_image_alt ?: $image_alt) : $image_alt); ?>">
        </picture>
      <?php endif; ?>
      <div class="yec-overlay-banner__overlay"></div>
      <div class="yec-overlay-banner__content">
        <?php if ($title_primary) : ?>
          <h2 class="yec-overlay-banner__title-primary"><?php echo esc_html($title_primary); ?></h2>
        <?php endif; ?>

        <?php if ($title_secondary) : ?>
          <p class="yec-overlay-banner__title-secondary"><?php echo esc_html($title_secondary); ?></p>
        <?php endif; ?>

        <?php if ($cta_text && $cta_url) : ?>
          <a class="yec-cta__button" href="<?php echo esc_url($cta_url); ?>"><?php echo esc_html($cta_text); ?></a>
        <?php endif; ?>
      </div>
    </div>
  </section>
  <?php

  return ob_get_clean();
}

function yec_render_for_whom_section_block($attributes) {
  $section_title = isset($attributes['sectionTitle']) ? sanitize_text_field((string) $attributes['sectionTitle']) : '';
  $title_size = isset($attributes['titleSize']) ? sanitize_key((string) $attributes['titleSize']) : 'medium';
  $title_size = in_array($title_size, ['large', 'medium', 'small'], true) ? $title_size : 'medium';
  $section_spacing_style = yec_get_section_spacing_style($attributes);

  $cards = [
    [
      'image_url' => isset($attributes['card1ImageUrl']) ? esc_url((string) $attributes['card1ImageUrl']) : '',
      'image_alt' => isset($attributes['card1ImageAlt']) ? sanitize_text_field((string) $attributes['card1ImageAlt']) : '',
      'mobile_image_url' => isset($attributes['card1MobileImageUrl']) ? esc_url((string) $attributes['card1MobileImageUrl']) : '',
      'mobile_image_alt' => isset($attributes['card1MobileImageAlt']) ? sanitize_text_field((string) $attributes['card1MobileImageAlt']) : '',
      'text' => isset($attributes['card1Text']) ? sanitize_text_field((string) $attributes['card1Text']) : '',
      'url' => isset($attributes['card1Url']) ? esc_url((string) $attributes['card1Url']) : '',
      'overlay_color' => isset($attributes['card1OverlayColor']) ? sanitize_hex_color((string) $attributes['card1OverlayColor']) : '#000000',
      'overlay_opacity' => isset($attributes['card1OverlayOpacity']) ? (int) $attributes['card1OverlayOpacity'] : 35,
    ],
    [
      'image_url' => isset($attributes['card2ImageUrl']) ? esc_url((string) $attributes['card2ImageUrl']) : '',
      'image_alt' => isset($attributes['card2ImageAlt']) ? sanitize_text_field((string) $attributes['card2ImageAlt']) : '',
      'mobile_image_url' => isset($attributes['card2MobileImageUrl']) ? esc_url((string) $attributes['card2MobileImageUrl']) : '',
      'mobile_image_alt' => isset($attributes['card2MobileImageAlt']) ? sanitize_text_field((string) $attributes['card2MobileImageAlt']) : '',
      'text' => isset($attributes['card2Text']) ? sanitize_text_field((string) $attributes['card2Text']) : '',
      'url' => isset($attributes['card2Url']) ? esc_url((string) $attributes['card2Url']) : '',
      'overlay_color' => isset($attributes['card2OverlayColor']) ? sanitize_hex_color((string) $attributes['card2OverlayColor']) : '#000000',
      'overlay_opacity' => isset($attributes['card2OverlayOpacity']) ? (int) $attributes['card2OverlayOpacity'] : 35,
    ],
  ];

  foreach ($cards as $i => $card) {
    if (!$card['overlay_color']) {
      $cards[$i]['overlay_color'] = '#000000';
    }
    $cards[$i]['overlay_opacity'] = max(0, min(100, $card['overlay_opacity']));
  }
  $anchor_id = isset($attributes['anchorId']) ? sanitize_key((string) $attributes['anchorId']) : '';

  ob_start();
  ?>
  <section<?php echo $anchor_id ? ' id="' . esc_attr($anchor_id) . '"' : ''; ?> class="yec-for-whom yec-for-whom--title-<?php echo esc_attr($title_size); ?>"<?php echo $section_spacing_style ? ' style="' . esc_attr($section_spacing_style) . '"' : ''; ?> aria-label="Dla kogo">
    <?php if ($section_title) : ?>
      <h2 class="yec-for-whom__title"><?php echo esc_html($section_title); ?></h2>
    <?php endif; ?>

    <div class="yec-for-whom__grid">
      <?php foreach ($cards as $card) : ?>
        <a class="yec-for-whom__item" href="<?php echo esc_url($card['url'] ? $card['url'] : '#'); ?>">
          <?php if ($card['image_url']) : ?>
            <picture>
              <source media="(max-width: 860px)" srcset="<?php echo esc_url($card['mobile_image_url'] ?: $card['image_url']); ?>">
              <img class="yec-for-whom__image" src="<?php echo esc_url($card['image_url']); ?>" alt="<?php echo esc_attr($card['mobile_image_url'] ? ($card['mobile_image_alt'] ?: $card['image_alt']) : $card['image_alt']); ?>">
            </picture>
          <?php else : ?>
            <div class="yec-for-whom__placeholder"></div>
          <?php endif; ?>

          <div class="yec-for-whom__overlay" style="background-color: <?php echo esc_attr($card['overlay_color']); ?>; opacity: <?php echo esc_attr((string) ($card['overlay_opacity'] / 100)); ?>;"></div>

          <?php if ($card['text']) : ?>
            <span class="yec-for-whom__item-text"><?php echo esc_html($card['text']); ?></span>
          <?php endif; ?>
        </a>
      <?php endforeach; ?>
    </div>
  </section>
  <?php

  return ob_get_clean();
}

function yec_render_contact_form_section_block($attributes) {
  $section_title = isset($attributes['sectionTitle']) ? sanitize_text_field((string) $attributes['sectionTitle']) : '';
  $title_size = isset($attributes['titleSize']) ? sanitize_key((string) $attributes['titleSize']) : 'medium';
  $title_size = in_array($title_size, ['large', 'medium', 'small'], true) ? $title_size : 'medium';
  $content_text = isset($attributes['contentText']) ? wp_kses_post((string) $attributes['contentText']) : '';
  $phone = isset($attributes['phone']) ? sanitize_text_field((string) $attributes['phone']) : '';
  $email = isset($attributes['email']) ? sanitize_text_field((string) $attributes['email']) : '';
  $address = isset($attributes['address']) ? sanitize_text_field((string) $attributes['address']) : '';
  $facebook_url = isset($attributes['facebookUrl']) ? esc_url((string) $attributes['facebookUrl']) : '';
  $facebook_icon_url = isset($attributes['facebookIconUrl']) ? esc_url((string) $attributes['facebookIconUrl']) : '';
  $facebook_icon_alt = isset($attributes['facebookIconAlt']) ? sanitize_text_field((string) $attributes['facebookIconAlt']) : 'Facebook';
  $instagram_url = isset($attributes['instagramUrl']) ? esc_url((string) $attributes['instagramUrl']) : '';
  $instagram_icon_url = isset($attributes['instagramIconUrl']) ? esc_url((string) $attributes['instagramIconUrl']) : '';
  $instagram_icon_alt = isset($attributes['instagramIconAlt']) ? sanitize_text_field((string) $attributes['instagramIconAlt']) : 'Instagram';
  $form_title = isset($attributes['formTitle']) ? sanitize_text_field((string) $attributes['formTitle']) : '';
  $cta_text = isset($attributes['ctaText']) ? sanitize_text_field((string) $attributes['ctaText']) : 'Wyslij wiadomosc';
  $section_spacing_style = yec_get_section_spacing_style($attributes);
  $phone_href = 'tel:' . preg_replace('/[^0-9+]/', '', $phone);
  $email_href = is_email($email) ? 'mailto:' . $email : '';
  $maps_url = $address ? 'https://www.google.com/maps/search/?api=1&query=' . rawurlencode($address) : '';
  $status = isset($_GET['yec-contact-status']) ? sanitize_key((string) wp_unslash($_GET['yec-contact-status'])) : '';
  $status_message = '';
  $status_class = '';

  if ('success' === $status) {
    $status_class = 'is-success';
    $status_message = 'Dziekuje! Twoja wiadomosc zostala wyslana.';
  } elseif ('invalid' === $status) {
    $status_class = 'is-error';
    $status_message = 'Uzupelnij poprawnie wszystkie pola formularza.';
  } elseif ('security' === $status) {
    $status_class = 'is-error';
    $status_message = 'Nie udalo sie wyslac formularza. Sprobuj ponownie.';
  } elseif ('config' === $status) {
    $status_class = 'is-error';
    $status_message = 'Brak poprawnego adresu odbiorcy. Ustaw go w panelu WordPress: Ustawienia -> Ogolne.';
  } elseif ('error' === $status) {
    $status_class = 'is-error';
    $status_message = 'Wystapil blad podczas wysylki. Sprobuj ponownie.';
    if (is_user_logged_in() && current_user_can('manage_options')) {
      $mail_error = (string) get_transient('yec_contact_form_last_mail_error');
      if ($mail_error) {
        $status_message .= ' Szczegoly: ' . $mail_error;
      }
    }
  }

  $anchor_id = isset($attributes['anchorId']) ? sanitize_key((string) $attributes['anchorId']) : '';
  ob_start();
  ?>
  <section id="<?php echo $anchor_id ? esc_attr($anchor_id) : 'yec-contact-form'; ?>" class="yec-contact-form yec-contact-form--title-<?php echo esc_attr($title_size); ?>"<?php echo $section_spacing_style ? ' style="' . esc_attr($section_spacing_style) . '"' : ''; ?> aria-label="Formularz kontaktowy">
    <div class="yec-contact-form__layout">
      <div class="yec-contact-form__left">
        <?php if ($section_title) : ?>
          <h2 class="yec-contact-form__title"><?php echo esc_html($section_title); ?></h2>
        <?php endif; ?>

        <?php if ($content_text) : ?>
          <p class="yec-contact-form__text"><?php echo wp_kses_post($content_text); ?></p>
        <?php endif; ?>

        <?php if ($phone) : ?>
          <a class="yec-contact-form__contact-line" href="<?php echo esc_url($phone_href ? $phone_href : '#'); ?>"><?php echo esc_html($phone); ?></a>
        <?php endif; ?>

        <?php if ($email) : ?>
          <?php if ($email_href) : ?>
            <a class="yec-contact-form__contact-line" href="<?php echo esc_url($email_href); ?>"><?php echo esc_html($email); ?></a>
          <?php else : ?>
            <p class="yec-contact-form__contact-line"><?php echo esc_html($email); ?></p>
          <?php endif; ?>
        <?php endif; ?>

        <?php if ($address) : ?>
          <a class="yec-contact-form__contact-line" href="<?php echo esc_url($maps_url ? $maps_url : '#'); ?>" target="_blank" rel="noopener noreferrer"><?php echo esc_html($address); ?></a>
        <?php endif; ?>

        <div class="yec-contact-form__socials">
          <a class="yec-contact-form__social yec-contact-form__social-1" href="<?php echo esc_url($facebook_url ? $facebook_url : '#'); ?>" aria-label="Facebook">
            <?php if ($facebook_icon_url) : ?>
              <img src="<?php echo esc_url($facebook_icon_url); ?>" alt="<?php echo esc_attr($facebook_icon_alt); ?>">
            <?php else : ?>
              <span>FB</span>
            <?php endif; ?>
          </a>

          <a class="yec-contact-form__social yec-contact-form__social-2" href="<?php echo esc_url($instagram_url ? $instagram_url : '#'); ?>" aria-label="Instagram">
            <?php if ($instagram_icon_url) : ?>
              <img src="<?php echo esc_url($instagram_icon_url); ?>" alt="<?php echo esc_attr($instagram_icon_alt); ?>">
            <?php else : ?>
              <span>IG</span>
            <?php endif; ?>
          </a>
        </div>
      </div>

      <div class="yec-contact-form__right">
        <?php if ($form_title) : ?>
          <h3 class="yec-contact-form__form-title"><?php echo esc_html($form_title); ?></h3>
        <?php endif; ?>

        <?php if ($status_message) : ?>
          <div class="yec-contact-form__notice <?php echo esc_attr($status_class); ?>" role="status"><?php echo esc_html($status_message); ?></div>
        <?php endif; ?>

        <form method="post" action="" class="yec-contact-form__form">
          <input type="hidden" name="yec_contact_form_action" value="submit">
          <?php wp_nonce_field('yec_contact_form_submit', 'yec_contact_form_nonce'); ?>

          <p class="yec-contact-form__field">
            <label for="yec-contact-name">Imię</label>
            <input id="yec-contact-name" class="yec-contact-form__input" type="text" name="yec_contact_name" required>
          </p>

          <p class="yec-contact-form__field">
            <label for="yec-contact-email">Email</label>
            <input id="yec-contact-email" class="yec-contact-form__input" type="email" name="yec_contact_email" required>
          </p>

          <p class="yec-contact-form__field yec-contact-form__field--honeypot" aria-hidden="true">
            <label for="yec-contact-website">Website</label>
            <input id="yec-contact-website" type="text" name="yec_contact_website" tabindex="-1" autocomplete="off">
          </p>

          <p class="yec-contact-form__field">
            <label for="yec-contact-message">Treść</label>
            <textarea id="yec-contact-message" class="yec-contact-form__textarea" name="yec_contact_message" required></textarea>
          </p>

          <button class="yec-cta__button yec-contact-form__submit" type="submit"><?php echo esc_html($cta_text); ?></button>
        </form>
      </div>
    </div>
  </section>
  <?php

  return ob_get_clean();
}

function yec_render_google_map_section_block($attributes) {
  $section_title = isset($attributes['sectionTitle']) ? sanitize_text_field((string) $attributes['sectionTitle']) : '';
  $title_size = isset($attributes['titleSize']) ? sanitize_key((string) $attributes['titleSize']) : 'medium';
  $title_size = in_array($title_size, ['large', 'medium', 'small'], true) ? $title_size : 'medium';
  $address = isset($attributes['address']) ? sanitize_text_field((string) $attributes['address']) : 'sw. Leonarda 6, 60-654 Poznan';
  $map_height = isset($attributes['mapHeight']) ? (int) $attributes['mapHeight'] : 420;
  $map_height = max(240, min(720, $map_height));
  $section_spacing_style = yec_get_section_spacing_style($attributes);
  $maps_query = rawurlencode($address);
  $embed_url = 'https://www.google.com/maps?q=' . $maps_query . '&z=16&output=embed';
  $anchor_id = isset($attributes['anchorId']) ? sanitize_key((string) $attributes['anchorId']) : '';

  ob_start();
  ?>
  <section<?php echo $anchor_id ? ' id="' . esc_attr($anchor_id) . '"' : ''; ?> class="yec-google-map yec-google-map--title-<?php echo esc_attr($title_size); ?>"<?php echo $section_spacing_style ? ' style="' . esc_attr($section_spacing_style) . '"' : ''; ?> aria-label="Mapa Google">
    <?php if ($section_title) : ?>
      <h2 class="yec-google-map__title"><?php echo esc_html($section_title); ?></h2>
    <?php endif; ?>

    <div class="yec-google-map__frame-wrap" style="--yec-google-map-height: <?php echo esc_attr((string) $map_height); ?>px;">
      <iframe
        class="yec-google-map__iframe"
        src="<?php echo esc_url($embed_url); ?>"
        title="<?php echo esc_attr($address); ?>"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allowfullscreen>
      </iframe>
    </div>
  </section>
  <?php

  return ob_get_clean();
}

function yec_send_contact_email($recipient_email, $subject, $body, $reply_to_email, $from_email = '') {
  $headers = [
    'Content-Type: text/plain; charset=UTF-8',
    'Reply-To: ' . $reply_to_email,
  ];

  if ($from_email && is_email($from_email)) {
    $headers[] = 'From: Your English Coach <' . $from_email . '>';
  }

  delete_transient('yec_contact_form_last_mail_error');

  $sent = wp_mail($recipient_email, $subject, $body, $headers);

  // Fallback for hosts that reject custom headers but allow default wp_mail format.
  if (!$sent) {
    $sent = wp_mail($recipient_email, $subject, $body);
  }

  if ($sent) {
    return true;
  }

  // Local fallback: try SMTP listeners commonly used by local dev tools.
  if (!class_exists('PHPMailer\PHPMailer\PHPMailer')) {
    return false;
  }

  $smtp_ports = [1025, 10025, 2525];
  $smtp_errors = [];

  foreach ($smtp_ports as $smtp_port) {
    try {
      $mailer = new PHPMailer\PHPMailer\PHPMailer(true);
      $mailer->CharSet = 'UTF-8';
      $mailer->isSMTP();
      $mailer->Host = '127.0.0.1';
      $mailer->Port = (int) $smtp_port;
      $mailer->SMTPAuth = false;
      $mailer->SMTPAutoTLS = false;
      $mailer->Timeout = 5;
      $mailer->isHTML(false);

      $effective_from = $from_email && is_email($from_email) ? $from_email : 'no-reply@localhost';
      $mailer->setFrom($effective_from, 'Your English Coach');
      $mailer->addAddress($recipient_email);
      if ($reply_to_email && is_email($reply_to_email)) {
        $mailer->addReplyTo($reply_to_email);
      }
      $mailer->Subject = $subject;
      $mailer->Body = $body;

      if ($mailer->send()) {
        return true;
      }
    } catch (Throwable $error) {
      $smtp_errors[] = sprintf('SMTP localhost:%d - %s', $smtp_port, $error->getMessage());
    }
  }

  // Configurable fallback: use SMTP credentials from WP Admin settings.
  $smtp_enabled = (bool) get_option('yec_contact_form_smtp_enabled', false);
  $smtp_host = trim((string) get_option('yec_contact_form_smtp_host', ''));
  $smtp_port = (int) get_option('yec_contact_form_smtp_port', 587);
  $smtp_secure = sanitize_key((string) get_option('yec_contact_form_smtp_secure', 'tls'));
  $smtp_username = trim((string) get_option('yec_contact_form_smtp_username', ''));
  $smtp_password = (string) get_option('yec_contact_form_smtp_password', '');
  $smtp_from_email = sanitize_email((string) get_option('yec_contact_form_smtp_from_email', ''));
  $smtp_from_name = trim((string) get_option('yec_contact_form_smtp_from_name', 'Your English Coach'));

  if ($smtp_enabled && $smtp_host && $smtp_port > 0 && $smtp_username && $smtp_password) {
    try {
      $mailer = new PHPMailer\PHPMailer\PHPMailer(true);
      $mailer->CharSet = 'UTF-8';
      $mailer->isSMTP();
      $mailer->Host = $smtp_host;
      $mailer->Port = $smtp_port;
      $mailer->SMTPAuth = true;
      $mailer->Username = $smtp_username;
      $mailer->Password = $smtp_password;
      $mailer->SMTPAutoTLS = true;
      $mailer->Timeout = 10;
      $mailer->isHTML(false);

      if (!in_array($smtp_secure, ['tls', 'ssl'], true)) {
        $smtp_secure = 'tls';
      }
      $mailer->SMTPSecure = $smtp_secure;

      $effective_from = $smtp_from_email && is_email($smtp_from_email)
        ? $smtp_from_email
        : ($from_email && is_email($from_email) ? $from_email : $smtp_username);

      $mailer->setFrom($effective_from, $smtp_from_name ? $smtp_from_name : 'Your English Coach');
      $mailer->addAddress($recipient_email);
      if ($reply_to_email && is_email($reply_to_email)) {
        $mailer->addReplyTo($reply_to_email);
      }
      $mailer->Subject = $subject;
      $mailer->Body = $body;

      if ($mailer->send()) {
        return true;
      }
    } catch (Throwable $error) {
      $smtp_errors[] = 'SMTP custom - ' . $error->getMessage();
    }
  }

  if (!empty($smtp_errors)) {
    set_transient('yec_contact_form_last_mail_error', implode(' | ', $smtp_errors), 10 * MINUTE_IN_SECONDS);
  }

  return false;
}

function yec_handle_contact_form_submission() {
  $request_method = isset($_SERVER['REQUEST_METHOD']) ? strtoupper((string) $_SERVER['REQUEST_METHOD']) : '';
  if ('POST' !== $request_method) {
    return;
  }

  $form_action = isset($_POST['yec_contact_form_action']) ? sanitize_key((string) wp_unslash($_POST['yec_contact_form_action'])) : '';
  if ('submit' !== $form_action) {
    return;
  }

  $redirect_url = wp_get_referer();
  if (!$redirect_url) {
    $redirect_url = home_url('/');
  }
  $redirect_url = remove_query_arg('yec-contact-status', $redirect_url);

  $nonce = isset($_POST['yec_contact_form_nonce']) ? (string) wp_unslash($_POST['yec_contact_form_nonce']) : '';
  if (!$nonce || !wp_verify_nonce($nonce, 'yec_contact_form_submit')) {
    wp_safe_redirect(add_query_arg('yec-contact-status', 'security', $redirect_url));
    exit;
  }

  $honeypot = isset($_POST['yec_contact_website']) ? trim((string) wp_unslash($_POST['yec_contact_website'])) : '';
  if ('' !== $honeypot) {
    wp_safe_redirect(add_query_arg('yec-contact-status', 'success', $redirect_url));
    exit;
  }

  $name = isset($_POST['yec_contact_name']) ? sanitize_text_field((string) wp_unslash($_POST['yec_contact_name'])) : '';
  $email = isset($_POST['yec_contact_email']) ? sanitize_email((string) wp_unslash($_POST['yec_contact_email'])) : '';
  $message = isset($_POST['yec_contact_message']) ? sanitize_textarea_field((string) wp_unslash($_POST['yec_contact_message'])) : '';

  if (!$name || !$email || !is_email($email) || !$message) {
    wp_safe_redirect(add_query_arg('yec-contact-status', 'invalid', $redirect_url));
    exit;
  }

  $recipient_email = sanitize_email((string) get_option('yec_contact_form_recipient_email', ''));
  if (!$recipient_email || !is_email($recipient_email)) {
    $recipient_email = sanitize_email((string) get_option('admin_email', ''));
  }

  if (!$recipient_email || !is_email($recipient_email)) {
    wp_safe_redirect(add_query_arg('yec-contact-status', 'config', $redirect_url));
    exit;
  }

  $subject = sprintf('Nowa wiadomosc ze strony od: %s', $name);
  $body = "Imie: {$name}\n";
  $body .= "Email: {$email}\n\n";
  $body .= "Wiadomosc:\n{$message}\n";

  $site_host = (string) wp_parse_url(home_url('/'), PHP_URL_HOST);
  $site_host = preg_replace('/[^a-z0-9.-]/i', '', strtolower($site_host));
  $from_email = $site_host ? 'no-reply@' . $site_host : '';

  $sent = yec_send_contact_email($recipient_email, $subject, $body, $email, $from_email);

  wp_safe_redirect(add_query_arg('yec-contact-status', $sent ? 'success' : 'error', $redirect_url));
  exit;
}

function yec_capture_contact_form_mail_error($wp_error) {
  if (!($wp_error instanceof WP_Error)) {
    return;
  }

  $error_message = trim((string) $wp_error->get_error_message());
  if (!$error_message) {
    return;
  }

  set_transient('yec_contact_form_last_mail_error', $error_message, 10 * MINUTE_IN_SECONDS);
}

function yec_register_contact_form_settings() {
  register_setting('general', 'yec_contact_form_recipient_email', [
    'type' => 'string',
    'sanitize_callback' => 'sanitize_email',
    'default' => '',
  ]);

  register_setting('general', 'yec_contact_form_smtp_enabled', [
    'type' => 'boolean',
    'sanitize_callback' => 'yec_sanitize_checkbox',
    'default' => false,
  ]);

  register_setting('general', 'yec_contact_form_smtp_host', [
    'type' => 'string',
    'sanitize_callback' => 'sanitize_text_field',
    'default' => '',
  ]);

  register_setting('general', 'yec_contact_form_smtp_port', [
    'type' => 'integer',
    'sanitize_callback' => 'absint',
    'default' => 587,
  ]);

  register_setting('general', 'yec_contact_form_smtp_secure', [
    'type' => 'string',
    'sanitize_callback' => 'yec_sanitize_smtp_secure',
    'default' => 'tls',
  ]);

  register_setting('general', 'yec_contact_form_smtp_username', [
    'type' => 'string',
    'sanitize_callback' => 'sanitize_text_field',
    'default' => '',
  ]);

  register_setting('general', 'yec_contact_form_smtp_password', [
    'type' => 'string',
    'sanitize_callback' => 'yec_sanitize_smtp_password',
    'default' => '',
  ]);

  register_setting('general', 'yec_contact_form_smtp_from_email', [
    'type' => 'string',
    'sanitize_callback' => 'sanitize_email',
    'default' => '',
  ]);

  register_setting('general', 'yec_contact_form_smtp_from_name', [
    'type' => 'string',
    'sanitize_callback' => 'sanitize_text_field',
    'default' => 'Your English Coach',
  ]);

  add_settings_field(
    'yec_contact_form_recipient_email',
    'Email odbiorcy formularza kontaktowego',
    'yec_render_contact_form_settings_field',
    'general'
  );

  add_settings_field(
    'yec_contact_form_smtp_enabled',
    'Wlacz SMTP dla formularza',
    'yec_render_contact_form_smtp_enabled_field',
    'general'
  );

  add_settings_field(
    'yec_contact_form_smtp_host',
    'SMTP host',
    'yec_render_contact_form_smtp_host_field',
    'general'
  );

  add_settings_field(
    'yec_contact_form_smtp_port',
    'SMTP port',
    'yec_render_contact_form_smtp_port_field',
    'general'
  );

  add_settings_field(
    'yec_contact_form_smtp_secure',
    'SMTP szyfrowanie',
    'yec_render_contact_form_smtp_secure_field',
    'general'
  );

  add_settings_field(
    'yec_contact_form_smtp_username',
    'SMTP login',
    'yec_render_contact_form_smtp_username_field',
    'general'
  );

  add_settings_field(
    'yec_contact_form_smtp_password',
    'SMTP haslo',
    'yec_render_contact_form_smtp_password_field',
    'general'
  );

  add_settings_field(
    'yec_contact_form_smtp_from_email',
    'SMTP from email',
    'yec_render_contact_form_smtp_from_email_field',
    'general'
  );

  add_settings_field(
    'yec_contact_form_smtp_from_name',
    'SMTP from name',
    'yec_render_contact_form_smtp_from_name_field',
    'general'
  );
}

function yec_sanitize_checkbox($value) {
  return !empty($value) ? 1 : 0;
}

function yec_sanitize_smtp_secure($value) {
  $value = sanitize_key((string) $value);
  if (!in_array($value, ['tls', 'ssl'], true)) {
    return 'tls';
  }
  return $value;
}

function yec_sanitize_smtp_password($value) {
  return trim((string) $value);
}

function yec_render_contact_form_settings_field() {
  $value = (string) get_option('yec_contact_form_recipient_email', '');
  if (!$value) {
    $value = (string) get_option('admin_email', '');
  }
  ?>
  <input type="email" id="yec_contact_form_recipient_email" name="yec_contact_form_recipient_email" value="<?php echo esc_attr($value); ?>" class="regular-text" />
  <p class="description">Na ten adres beda wysylane wiadomosci z formularza kontaktowego.</p>
  <?php
}

function yec_render_contact_form_smtp_enabled_field() {
  $enabled = !empty(get_option('yec_contact_form_smtp_enabled', false));
  ?>
  <label>
    <input type="checkbox" name="yec_contact_form_smtp_enabled" value="1" <?php checked($enabled); ?> />
    Uzyj zewnetrznego SMTP (zalecane na local).
  </label>
  <?php
}

function yec_render_contact_form_smtp_host_field() {
  $value = (string) get_option('yec_contact_form_smtp_host', '');
  ?>
  <input type="text" id="yec_contact_form_smtp_host" name="yec_contact_form_smtp_host" value="<?php echo esc_attr($value); ?>" class="regular-text" placeholder="smtp.gmail.com" />
  <?php
}

function yec_render_contact_form_smtp_port_field() {
  $value = (int) get_option('yec_contact_form_smtp_port', 587);
  ?>
  <input type="number" id="yec_contact_form_smtp_port" name="yec_contact_form_smtp_port" value="<?php echo esc_attr((string) $value); ?>" class="small-text" min="1" max="65535" />
  <?php
}

function yec_render_contact_form_smtp_secure_field() {
  $value = (string) get_option('yec_contact_form_smtp_secure', 'tls');
  ?>
  <select id="yec_contact_form_smtp_secure" name="yec_contact_form_smtp_secure">
    <option value="tls" <?php selected($value, 'tls'); ?>>TLS</option>
    <option value="ssl" <?php selected($value, 'ssl'); ?>>SSL</option>
  </select>
  <?php
}

function yec_render_contact_form_smtp_username_field() {
  $value = (string) get_option('yec_contact_form_smtp_username', '');
  ?>
  <input type="text" id="yec_contact_form_smtp_username" name="yec_contact_form_smtp_username" value="<?php echo esc_attr($value); ?>" class="regular-text" />
  <?php
}

function yec_render_contact_form_smtp_password_field() {
  $value = (string) get_option('yec_contact_form_smtp_password', '');
  ?>
  <input type="password" id="yec_contact_form_smtp_password" name="yec_contact_form_smtp_password" value="<?php echo esc_attr($value); ?>" class="regular-text" autocomplete="new-password" />
  <p class="description">Wpisz haslo aplikacji SMTP.</p>
  <?php
}

function yec_render_contact_form_smtp_from_email_field() {
  $value = (string) get_option('yec_contact_form_smtp_from_email', '');
  ?>
  <input type="email" id="yec_contact_form_smtp_from_email" name="yec_contact_form_smtp_from_email" value="<?php echo esc_attr($value); ?>" class="regular-text" placeholder="no-reply@twojadomena.pl" />
  <?php
}

function yec_render_contact_form_smtp_from_name_field() {
  $value = (string) get_option('yec_contact_form_smtp_from_name', 'Your English Coach');
  ?>
  <input type="text" id="yec_contact_form_smtp_from_name" name="yec_contact_form_smtp_from_name" value="<?php echo esc_attr($value); ?>" class="regular-text" />
  <?php
}

function yec_register_custom_blocks() {
  $editor_script_path = get_template_directory() . '/assets/js/hero-section-block.js';
  $image_text_script_path = get_template_directory() . '/assets/js/image-text-section-block.js';
  $benefits_script_path = get_template_directory() . '/assets/js/benefits-section-block.js';
  $google_reviews_script_path = get_template_directory() . '/assets/js/google-reviews-block.js';
  $parallax_image_script_path = get_template_directory() . '/assets/js/parallax-image-block.js';
  $about_me_script_path = get_template_directory() . '/assets/js/about-me-section-block.js';
  $learning_options_script_path = get_template_directory() . '/assets/js/learning-options-section-block.js';
  $overlay_banner_script_path = get_template_directory() . '/assets/js/overlay-banner-section-block.js';
  $for_whom_script_path = get_template_directory() . '/assets/js/for-whom-section-block.js';
  $contact_form_script_path = get_template_directory() . '/assets/js/contact-form-section-block.js';
  $google_map_script_path = get_template_directory() . '/assets/js/google-map-section-block.js';

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

  if (!file_exists($overlay_banner_script_path)) {
    return;
  }

  if (!file_exists($for_whom_script_path)) {
    return;
  }

  if (!file_exists($contact_form_script_path)) {
    return;
  }

  if (!file_exists($google_map_script_path)) {
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

  wp_register_script(
    'yec-overlay-banner-section-block',
    get_template_directory_uri() . '/assets/js/overlay-banner-section-block.js',
    ['wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n'],
    filemtime($overlay_banner_script_path),
    true
  );

  wp_register_script(
    'yec-for-whom-section-block',
    get_template_directory_uri() . '/assets/js/for-whom-section-block.js',
    ['wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n'],
    filemtime($for_whom_script_path),
    true
  );

  wp_register_script(
    'yec-contact-form-section-block',
    get_template_directory_uri() . '/assets/js/contact-form-section-block.js',
    ['wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n'],
    filemtime($contact_form_script_path),
    true
  );

  wp_register_script(
    'yec-google-map-section-block',
    get_template_directory_uri() . '/assets/js/google-map-section-block.js',
    ['wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n'],
    filemtime($google_map_script_path),
    true
  );

  register_block_type('yec/hero-section', [
    'editor_script'   => 'yec-hero-section-block',
    'render_callback' => 'yec_render_hero_section_block',
    'attributes'      => [
      'eyebrow' => [
        'type'    => 'string',
        'default' => 'Angielski dla dorosłych i młodzieży',
      ],
      'title' => [
        'type'    => 'string',
        'default' => 'Mów po angielsku pewnie i swobodnie',
      ],
      'titleSize' => [
        'type'    => 'string',
        'default' => 'medium',
      ],
      'sectionSpaceTop' => [
        'type' => 'number',
      ],
      'sectionSpaceBottom' => [
        'type' => 'number',
      ],
      'subtitle' => [
        'type'    => 'string',
        'default' => 'Indywidualne lekcje online, które pomogą Ci w pracy, na egzaminie i w codziennej komunikacji.',
      ],
      'ctaText' => [
        'type'    => 'string',
        'default' => 'Umów konsultację',
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
        'default' => 'Poznajmy się',
      ],
      'title' => [
        'type'    => 'string',
        'default' => 'Angielski dopasowany do Twoich celów',
      ],
      'titleSize' => [
        'type'    => 'string',
        'default' => 'medium',
      ],
      'sectionSpaceTop' => [
        'type' => 'number',
      ],
      'sectionSpaceBottom' => [
        'type' => 'number',
      ],
      'contentText' => [
        'type'    => 'string',
        'default' => 'Pomagam dorosłym i młodzieży rozwijać swobodę mówienia, słownictwo i pewność siebie.',
      ],
      'ctaText' => [
        'type'    => 'string',
        'default' => 'Sprawdź ofertę',
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
        'default' => 'Dlaczego warto uczyć się ze mną',
      ],
      'titleSize' => [
        'type'    => 'string',
        'default' => 'medium',
      ],
      'sectionSpaceTop' => [
        'type' => 'number',
      ],
      'sectionSpaceBottom' => [
        'type' => 'number',
      ],
      'subtitle' => [
        'type'    => 'string',
        'default' => 'Skupiamy się na praktycznych efektach, które wykorzystasz od razu.',
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
        'default' => 'Większa swoboda w mówieniu',
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
        'default' => 'Widoczne postępy tydzień po tygodniu',
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
        'default' => 'Przygotowanie do pracy i egzaminów',
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
      'sectionSpaceTop' => [
        'type' => 'number',
      ],
      'sectionSpaceBottom' => [
        'type' => 'number',
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
      'mobileBackgroundImageId' => [
        'type' => 'number',
      ],
      'mobileBackgroundImageUrl' => [
        'type'    => 'string',
        'default' => '',
      ],
      'cards' => [
        'type'    => 'array',
        'default' => [],
      ],
      'anchorId' => [
        'type'    => 'string',
        'default' => '',
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
      'mobileImageId' => [
        'type' => 'number',
      ],
      'mobileImageUrl' => [
        'type'    => 'string',
        'default' => '',
      ],
      'mobileImageAlt' => [
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
      'sectionSpaceTop' => [
        'type' => 'number',
      ],
      'sectionSpaceBottom' => [
        'type' => 'number',
      ],
    ],
  ]);

  register_block_type('yec/about-me-section', [
    'editor_script'   => 'yec-about-me-section-block',
    'render_callback' => 'yec_render_about_me_section_block',
    'attributes'      => [
      'eyebrow' => [
        'type'    => 'string',
        'default' => 'Poznaj mnie bliżej',
      ],
      'title' => [
        'type'    => 'string',
        'default' => 'Pomagam mówić po angielsku pewnie i naturalnie',
      ],
      'titleSize' => [
        'type'    => 'string',
        'default' => 'medium',
      ],
      'sectionSpaceTop' => [
        'type' => 'number',
      ],
      'sectionSpaceBottom' => [
        'type' => 'number',
      ],
      'contentText' => [
        'type'    => 'string',
        'default' => 'Tworzę lekcje dopasowane do Twoich celów, tempa i stylu pracy. Skupiamy się na praktyce, swobodzie mówienia i realnych efektach.',
      ],
      'ctaText' => [
        'type'    => 'string',
        'default' => 'Umów konsultację',
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
        'default' => 'Jak możesz uczyć się ze mną',
      ],
      'titleSize' => [
        'type'    => 'string',
        'default' => 'medium',
      ],
      'sectionSpaceTop' => [
        'type' => 'number',
      ],
      'sectionSpaceBottom' => [
        'type' => 'number',
      ],
      'card1Title' => [
        'type'    => 'string',
        'default' => 'Lekcje indywidualne',
      ],
      'card1Text' => [
        'type'    => 'string',
        'default' => 'Spotkania 1:1 dopasowane do Twoich celów i tempa pracy.',
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
        'default' => 'Praktyczne rozmowy, które pomagają swobodnie mówić po angielsku.',
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
        'default' => 'Wsparcie do egzaminów',
      ],
      'card3Text' => [
        'type'    => 'string',
        'default' => 'Materiały i plan nauki skoncentrowane na Twoim wyniku.',
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

  register_block_type('yec/overlay-banner-section', [
    'editor_script'   => 'yec-overlay-banner-section-block',
    'render_callback' => 'yec_render_overlay_banner_section_block',
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
      'overlayColor' => [
        'type'    => 'string',
        'default' => '#000000',
      ],
      'overlayOpacity' => [
        'type'    => 'number',
        'default' => 35,
      ],
      'parallaxEnabled' => [
        'type'    => 'boolean',
        'default' => true,
      ],
      'parallaxStrength' => [
        'type'    => 'number',
        'default' => 48,
      ],
      'titlePrimary' => [
        'type'    => 'string',
        'default' => 'Ucz się wygodnie online',
      ],
      'titlePrimarySize' => [
        'type'    => 'string',
        'default' => 'large',
      ],
      'titleSecondary' => [
        'type'    => 'string',
        'default' => 'Elastyczny plan dopasowany do Ciebie',
      ],
      'titleSecondarySize' => [
        'type'    => 'string',
        'default' => 'small',
      ],
      'ctaText' => [
        'type'    => 'string',
        'default' => 'Umów konsultację',
      ],
      'ctaUrl' => [
        'type'    => 'string',
        'default' => '/kontakt',
      ],
      'sectionSpaceTop' => [
        'type' => 'number',
      ],
      'sectionSpaceBottom' => [
        'type' => 'number',
      ],
    ],
  ]);

  register_block_type('yec/for-whom-section', [
    'editor_script'   => 'yec-for-whom-section-block',
    'render_callback' => 'yec_render_for_whom_section_block',
    'attributes'      => [
      'sectionTitle' => [
        'type'    => 'string',
        'default' => 'Dla kogo',
      ],
      'titleSize' => [
        'type'    => 'string',
        'default' => 'medium',
      ],
      'sectionSpaceTop' => [
        'type' => 'number',
      ],
      'sectionSpaceBottom' => [
        'type' => 'number',
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
      'card1Text' => [
        'type'    => 'string',
        'default' => 'Dla dorosłych',
      ],
      'card1Url' => [
        'type'    => 'string',
        'default' => '/dla-doroslych',
      ],
      'card1OverlayColor' => [
        'type'    => 'string',
        'default' => '#000000',
      ],
      'card1OverlayOpacity' => [
        'type'    => 'number',
        'default' => 35,
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
      'card2Text' => [
        'type'    => 'string',
        'default' => 'Dla młodzieży',
      ],
      'card2Url' => [
        'type'    => 'string',
        'default' => '/dla-mlodziezy',
      ],
      'card2OverlayColor' => [
        'type'    => 'string',
        'default' => '#000000',
      ],
      'card2OverlayOpacity' => [
        'type'    => 'number',
        'default' => 35,
      ],
    ],
  ]);

  register_block_type('yec/contact-form-section', [
    'editor_script'   => 'yec-contact-form-section-block',
    'render_callback' => 'yec_render_contact_form_section_block',
    'attributes'      => [
      'sectionTitle' => [
        'type'    => 'string',
        'default' => 'Skontaktuj się',
      ],
      'titleSize' => [
        'type'    => 'string',
        'default' => 'medium',
      ],
      'contentText' => [
        'type'    => 'string',
        'default' => 'Napisz lub zadzwoń – odpowiem najszybciej, jak to możliwe.',
      ],
      'phone' => [
        'type'    => 'string',
        'default' => '+48 000 000 000',
      ],
      'email' => [
        'type'    => 'string',
        'default' => 'kontakt@twojadomena.pl',
      ],
      'address' => [
        'type'    => 'string',
        'default' => 'Poznan, Polska',
      ],
      'facebookUrl' => [
        'type'    => 'string',
        'default' => '',
      ],
      'facebookIconId' => [
        'type' => 'number',
      ],
      'facebookIconUrl' => [
        'type'    => 'string',
        'default' => '',
      ],
      'facebookIconAlt' => [
        'type'    => 'string',
        'default' => 'Facebook',
      ],
      'instagramUrl' => [
        'type'    => 'string',
        'default' => '',
      ],
      'instagramIconId' => [
        'type' => 'number',
      ],
      'instagramIconUrl' => [
        'type'    => 'string',
        'default' => '',
      ],
      'instagramIconAlt' => [
        'type'    => 'string',
        'default' => 'Instagram',
      ],
      'formTitle' => [
        'type'    => 'string',
        'default' => 'Napisz wiadomosc',
      ],
      'ctaText' => [
        'type'    => 'string',
        'default' => 'Wyslij wiadomosc',
      ],
      'sectionSpaceTop' => [
        'type' => 'number',
      ],
      'sectionSpaceBottom' => [
        'type' => 'number',
      ],
    ],
  ]);

  register_block_type('yec/google-map-section', [
    'editor_script'   => 'yec-google-map-section-block',
    'render_callback' => 'yec_render_google_map_section_block',
    'attributes'      => [
      'sectionTitle' => [
        'type'    => 'string',
        'default' => 'Gdzie mnie znajdziesz',
      ],
      'titleSize' => [
        'type'    => 'string',
        'default' => 'medium',
      ],
      'address' => [
        'type'    => 'string',
        'default' => 'sw. Leonarda 6, 60-654 Poznan',
      ],
      'mapHeight' => [
        'type'    => 'number',
        'default' => 420,
      ],
      'sectionSpaceTop' => [
        'type' => 'number',
      ],
      'sectionSpaceBottom' => [
        'type' => 'number',
      ],
    ],
  ]);
}

add_action('init', 'yec_register_custom_blocks');
add_action('init', 'yec_handle_contact_form_submission');
add_action('admin_init', 'yec_register_contact_form_settings');
add_action('wp_mail_failed', 'yec_capture_contact_form_mail_error');

function yec_set_static_front_page() {
  $front_page = get_page_by_path('strona-glowna');

  if (!$front_page instanceof WP_Post) {
    return;
  }

  update_option('show_on_front', 'page');
  update_option('page_on_front', (int) $front_page->ID);
}

add_action('after_switch_theme', 'yec_set_static_front_page');