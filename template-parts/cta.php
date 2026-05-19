<?php
/**
 * Template Part: CTA (Call to Action)
 *
 * Użycie: get_template_part('template-parts/cta', null, $args);
 *
 * Dostępne parametry $args:
 *   $args['title']       – główny nagłówek (wymagany)
 *   $args['subtitle']    – krótki tekst pod nagłówkiem (opcjonalny)
 *   $args['button_text'] – tekst przycisku (domyślnie: 'Skontaktuj się')
 *   $args['button_url']  – URL przycisku (domyślnie: strona kontaktowa)
 */

$title       = $args['title']       ?? '';
$subtitle    = $args['subtitle']    ?? '';
$button_text = $args['button_text'] ?? 'Skontaktuj się';
$button_url  = $args['button_url']  ?? get_permalink( get_page_by_path('kontakt') );
?>

<section class="yec-cta">
  <div class="yec-cta__inner">

    <?php if ($title) : ?>
      <h2 class="yec-cta__title"><?php echo esc_html($title); ?></h2>
    <?php endif; ?>

    <?php if ($subtitle) : ?>
      <p class="yec-cta__subtitle"><?php echo esc_html($subtitle); ?></p>
    <?php endif; ?>

    <a class="yec-cta__button"
       href="<?php echo esc_url($button_url); ?>">
      <?php echo esc_html($button_text); ?>
    </a>

  </div>
</section>
