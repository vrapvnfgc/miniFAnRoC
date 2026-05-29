import { onMount } from 'svelte';

const MOBILE_BREAKPOINT = 768;

export class IsMobile {
	current = $state(false);

	constructor() {
		$effect(() => {
			const checkMobile = () => {
				this.current = window.innerWidth < MOBILE_BREAKPOINT;
			};

			checkMobile();
			window.addEventListener('resize', checkMobile);

			return () => {
				window.removeEventListener('resize', checkMobile);
			};
		});
	}
}
