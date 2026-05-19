<?php get_header(); ?>

<main class="yec-home-logo" aria-label="Logo strony">
	<?php if (has_custom_logo()) : ?>
		<?php the_custom_logo(); ?>
	<?php else : ?>
		<h1><?php bloginfo('name'); ?></h1>
	<?php endif; ?>
</main>

<?php get_footer(); ?>