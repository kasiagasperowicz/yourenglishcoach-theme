import '../scss/main.scss';

const siteHeader = document.querySelector('.yec-site-header');
const navToggle = document.querySelector('.yec-nav-toggle');
const mainNav = document.querySelector('.yec-main-nav');

const closeMobileMenu = () => {
	if (!siteHeader || !navToggle) {
		return;
	}

	siteHeader.classList.remove('is-menu-open');
	navToggle.setAttribute('aria-expanded', 'false');
	navToggle.setAttribute('aria-label', 'Otworz menu');
};

if (siteHeader && navToggle && mainNav) {
	navToggle.addEventListener('click', () => {
		const isOpen = siteHeader.classList.toggle('is-menu-open');
		navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
		navToggle.setAttribute('aria-label', isOpen ? 'Zamknij menu' : 'Otworz menu');
	});
}

const parentMenuItems = document.querySelectorAll('.yec-main-menu .menu-item-has-children');

parentMenuItems.forEach((item) => {
	const trigger = item.querySelector(':scope > a');

	if (!trigger) {
		return;
	}

	trigger.setAttribute('aria-expanded', 'false');

	trigger.addEventListener('click', (event) => {
		const href = (trigger.getAttribute('href') || '').trim();
		const isPlaceholderHref = href === '' || href === '#';
		const isDesktop = window.innerWidth > 860;
		const isOpen = item.classList.contains('is-open');

		// On desktop, first click opens submenu and second click navigates.
		if (isDesktop && isOpen && !isPlaceholderHref) {
			return;
		}

		event.preventDefault();

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
	if (event.target.closest('.yec-main-menu') || event.target.closest('.yec-nav-toggle')) {
		return;
	}

	parentMenuItems.forEach((item) => {
		item.classList.remove('is-open');
		const trigger = item.querySelector(':scope > a');
		if (trigger) {
			trigger.setAttribute('aria-expanded', 'false');
		}
	});

	closeMobileMenu();
});

document.addEventListener('keydown', (event) => {
	if (event.key !== 'Escape') {
		return;
	}

	closeMobileMenu();
});

if (mainNav) {
	mainNav.querySelectorAll('a').forEach((link) => {
		link.addEventListener('click', () => {
			if (window.innerWidth <= 860 && !link.closest('.menu-item-has-children')) {
				closeMobileMenu();
			}
		});
	});
}

window.addEventListener('resize', () => {
	if (window.innerWidth > 860) {
		closeMobileMenu();
	}
});

const reviewSections = document.querySelectorAll('.yec-google-reviews');

reviewSections.forEach((section) => {
	const track = section.querySelector('.yec-google-reviews__track');
	const viewport = section.querySelector('.yec-google-reviews__viewport');
	const prevBtn = section.querySelector('.yec-google-reviews__btn--prev');
	const nextBtn = section.querySelector('.yec-google-reviews__btn--next');

	if (!track || !viewport || !prevBtn || !nextBtn) {
		return;
	}

	const sourceCards = Array.from(track.querySelectorAll('.yec-google-reviews__card')).map((card) => card.cloneNode(true));
	if (!sourceCards.length) {
		return;
	}

	let index = 0;
	let cloneCount = 0;
	let resizeTimer;
	let activePointerId = null;
	let dragStartX = 0;
	let dragDeltaX = 0;
	let isDragging = false;
	let suppressClick = false;

	const getVisibleCount = () => {
		if (window.innerWidth <= 760) return 1;
		if (window.innerWidth <= 1100) return 2;
		return 3;
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

	const startDrag = (pointerId, clientX) => {
		activePointerId = pointerId;
		dragStartX = clientX;
		dragDeltaX = 0;
		isDragging = false;
		suppressClick = false;
		viewport.classList.add('is-dragging');
		track.style.transition = 'none';
	};

	const moveDrag = (clientX) => {
		if (activePointerId === null) {
			return;
		}

		dragDeltaX = clientX - dragStartX;

		if (Math.abs(dragDeltaX) > 6) {
			isDragging = true;
		}

		const baseOffset = -(index * getStep());
		track.style.transform = `translateX(${baseOffset + dragDeltaX}px)`;
	};

	const endDrag = () => {
		if (activePointerId === null) {
			return;
		}

		const step = getStep();
		if (!step) {
			activePointerId = null;
			dragDeltaX = 0;
			viewport.classList.remove('is-dragging');
			moveTrack(true);
			return;
		}
		const threshold = Math.min(120, step * 0.2);

		if (Math.abs(dragDeltaX) > threshold) {
			const stepShift = Math.max(1, Math.round(Math.abs(dragDeltaX) / step));
			if (dragDeltaX < 0) {
				index += stepShift;
			} else {
				index -= stepShift;
			}
			suppressClick = true;
		}

		activePointerId = null;
		dragDeltaX = 0;
		viewport.classList.remove('is-dragging');
		moveTrack(true);
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

	viewport.addEventListener('pointerdown', (event) => {
		if (event.pointerType === 'mouse' && event.button !== 0) {
			return;
		}

		viewport.setPointerCapture(event.pointerId);
		startDrag(event.pointerId, event.clientX);
	});

	viewport.addEventListener('pointermove', (event) => {
		if (event.pointerId !== activePointerId) {
			return;
		}

		moveDrag(event.clientX);
	});

	viewport.addEventListener('pointerup', (event) => {
		if (event.pointerId !== activePointerId) {
			return;
		}

		endDrag();
	});

	viewport.addEventListener('pointercancel', (event) => {
		if (event.pointerId !== activePointerId) {
			return;
		}

		endDrag();
	});

	track.addEventListener('click', (event) => {
		if (!suppressClick) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();
		suppressClick = false;
	}, true);

	window.addEventListener('resize', () => {
		window.clearTimeout(resizeTimer);
		resizeTimer = window.setTimeout(() => {
			rebuildLoop();
		}, 120);
	});

	rebuildLoop();
});

const parallaxItems = [
	...Array.from(document.querySelectorAll('.yec-parallax-image[data-parallax-enabled="1"]')).map((section) => ({
		section,
		mediaSelector: '.yec-parallax-image__media',
	})),
	...Array.from(document.querySelectorAll('.yec-overlay-banner[data-parallax-enabled="1"]')).map((section) => ({
		section,
		mediaSelector: '.yec-overlay-banner__media',
	})),
];

if (parallaxItems.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
	let ticking = false;

	const updateParallax = () => {
		parallaxItems.forEach((item) => {
			const section = item.section;
			const media = section.querySelector(item.mediaSelector);
			if (!media) {
				return;
			}

			const rect = media.getBoundingClientRect();
			const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
			const strength = parseFloat(section.getAttribute('data-parallax-strength') || '48') || 48;

			if (rect.bottom < 0 || rect.top > viewportHeight) {
				return;
			}

			const centerDelta = rect.top + rect.height / 2 - viewportHeight / 2;
			const distanceRatio = centerDelta / viewportHeight;
			const offset = Math.max(-strength, Math.min(strength, -distanceRatio * strength * 1.6));

			media.style.setProperty('--yec-parallax-offset', `${offset.toFixed(2)}px`);
		});

		ticking = false;
	};

	const requestTick = () => {
		if (ticking) {
			return;
		}

		ticking = true;
		window.requestAnimationFrame(updateParallax);
	};

	window.addEventListener('scroll', requestTick, { passive: true });
	window.addEventListener('resize', requestTick);
	window.addEventListener('load', requestTick);
	requestTick();
}