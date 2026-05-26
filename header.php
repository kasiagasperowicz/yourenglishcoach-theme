<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="yec-site-header">
  <div class="yec-site-header__inner">
    <div class="yec-site-logo" aria-label="Strona glowna">
      <?php if (has_custom_logo()) : ?>
        <?php the_custom_logo(); ?>
      <?php else : ?>
        <a class="yec-site-logo__text" href="<?php echo esc_url(home_url('/')); ?>"><?php bloginfo('name'); ?></a>
      <?php endif; ?>
    </div>

    <button
      class="yec-nav-toggle"
      type="button"
      aria-label="Otworz menu"
      aria-expanded="false"
      aria-controls="yec-main-nav">
      <span class="yec-nav-toggle__bar" aria-hidden="true"></span>
      <span class="yec-nav-toggle__bar" aria-hidden="true"></span>
      <span class="yec-nav-toggle__bar" aria-hidden="true"></span>
    </button>

    <nav id="yec-main-nav" class="yec-main-nav" aria-label="Menu glowne">
      <?php
      wp_nav_menu([
        'theme_location' => 'primary',
        'menu_class'     => 'yec-main-menu',
        'container'      => false,
        'fallback_cb'    => false,
      ]);
      ?>
    </nav>
  </div>
</header>