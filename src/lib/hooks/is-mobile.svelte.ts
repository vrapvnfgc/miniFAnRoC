/**
 * Mobile detection hook using media queries
 * Returns a reactive object with a `current` property
 * that tracks whether the viewport is mobile (< 768px)
 */
export class IsMobile {
	current = $state<boolean>(false);
	private mediaQuery: MediaQueryList | null = null;

	constructor(breakpoint = 768) {
		if (typeof window !== 'undefined') {
			this.mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
			this.current = this.mediaQuery.matches;

			// Listen for changes
			this.mediaQuery.addEventListener('change', this.handleChange.bind(this));
		}
	}

	private handleChange = (e: MediaQueryListEvent) => {
		this.current = e.matches;
	};

	destroy() {
		if (this.mediaQuery) {
			this.mediaQuery.removeEventListener('change', this.handleChange);
		}
	}
}
