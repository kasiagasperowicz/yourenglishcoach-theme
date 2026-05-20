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

const reviewSections = document.querySelectorAll('.yec-google-reviews');

reviewSections.forEach((section) => {
	const track = section.querySelector('.yec-google-reviews__track');
	const prevBtn = section.querySelector('.yec-google-reviews__btn--prev');
	const nextBtn = section.querySelector('.yec-google-reviews__btn--next');

	if (!track || !prevBtn || !nextBtn) {
		return;
	}

	const sourceCards = Array.from(track.querySelectorAll('.yec-google-reviews__card')).map((card) => card.cloneNode(true));
	if (!sourceCards.length) {
		return;
	}

	let index = 0;
	let cloneCount = 0;
	let resizeTimer;

	const getVisibleCount = () => {
		if (window.innerWidth <= 760) return 1;
		if (window.innerWidth <= 1100) return 2;
		return 4;
	};

	const getGap = () => {
		const styles = window.getComputedStyle(track);
		return parseFloat(styles.columnGap || styles.gap || '18') || 18;
	};

	const getStep = () => {
		const card = track.querySelector('.yec-google-reviews__card');
		if (!card) {
			return 0;
		}

		return card.getBoundingClientRect().width + getGap();
	};

	const moveTrack = (useTransition = true) => {
		track.style.transition = useTransition ? 'transform 0.35s ease' : 'none';
		track.style.transform = `translateX(-${index * getStep()}px)`;
	};

	const rebuildLoop = () => {
		const visibleCount = getVisibleCount();
		cloneCount = Math.min(visibleCount, sourceCards.length);

		track.innerHTML = '';

		sourceCards.forEach((card) => {
			track.appendChild(card.cloneNode(true));
		});

		if (cloneCount > 0) {
			sourceCards.slice(-cloneCount).forEach((card) => {
				const clone = card.cloneNode(true);
				clone.classList.add('is-clone');
				track.prepend(clone);
			});

			sourceCards.slice(0, cloneCount).forEach((card) => {
				const clone = card.cloneNode(true);
				clone.classList.add('is-clone');
				track.appendChild(clone);
			});
		}

		index = cloneCount;
		moveTrack(false);

		prevBtn.disabled = false;
		nextBtn.disabled = false;
	};

	const normalizeLoopPosition = () => {
		const total = sourceCards.length;
		if (!total || cloneCount === 0) {
			return;
		}

		if (index >= total + cloneCount) {
			index = cloneCount;
			moveTrack(false);
		}

		if (index < cloneCount) {
			index = total + cloneCount - 1;
			moveTrack(false);
		}
	};

	prevBtn.addEventListener('click', () => {
		if (sourceCards.length <= 1) {
			return;
		}

		index -= 1;
		moveTrack(true);
	});

	nextBtn.addEventListener('click', () => {
		if (sourceCards.length <= 1) {
			return;
		}

		index += 1;
		moveTrack(true);
	});

	track.addEventListener('transitionend', (event) => {
		if (event.propertyName !== 'transform') {
			return;
		}

		normalizeLoopPosition();
	});

	window.addEventListener('resize', () => {
		window.clearTimeout(resizeTimer);
		resizeTimer = window.setTimeout(() => {
			rebuildLoop();
		}, 120);
	});

	rebuildLoop();
});