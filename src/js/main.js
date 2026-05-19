import '../scss/main.scss';

const parentMenuItems = document.querySelectorAll('.yec-main-menu .menu-item-has-children');

parentMenuItems.forEach((item) => {
	const trigger = item.querySelector(':scope > a');

	if (!trigger) {
		return;
	}

	trigger.setAttribute('aria-expanded', 'false');

	trigger.addEventListener('click', (event) => {
		event.preventDefault();

		const isOpen = item.classList.contains('is-open');

		parentMenuItems.forEach((menuItem) => {
			menuItem.classList.remove('is-open');
			const menuTrigger = menuItem.querySelector(':scope > a');
			if (menuTrigger) {
				menuTrigger.setAttribute('aria-expanded', 'false');
			}
		});

		if (!isOpen) {
			item.classList.add('is-open');
			trigger.setAttribute('aria-expanded', 'true');
		}
	});
});

document.addEventListener('click', (event) => {
	if (event.target.closest('.yec-main-menu')) {
		return;
	}

	parentMenuItems.forEach((item) => {
		item.classList.remove('is-open');
		const trigger = item.querySelector(':scope > a');
		if (trigger) {
			trigger.setAttribute('aria-expanded', 'false');
		}
	});
});