import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

function createThemeStore() {
	let theme = $state<Theme>('dark');
	let mounted = $state(false);

	function getSystemTheme(): Theme {
		if (!browser) return 'dark';
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}

	function initializeTheme() {
		if (!browser) return;

		mounted = true;

		// Check localStorage first
		const savedTheme = localStorage.getItem('theme') as Theme | null;
		if (savedTheme === 'light' || savedTheme === 'dark') {
			theme = savedTheme;
		} else {
			// Fall back to system preference
			theme = getSystemTheme();
		}

		applyTheme(theme);

		// Listen to system theme changes
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleChange = (e: MediaQueryListEvent) => {
			const newTheme: Theme = e.matches ? 'dark' : 'light';
			if (!localStorage.getItem('theme')) {
				theme = newTheme;
				applyTheme(newTheme);
			}
		};

		mediaQuery.addEventListener('change', handleChange);
		return () => mediaQuery.removeEventListener('change', handleChange);
	}

	function applyTheme(newTheme: Theme) {
		if (!browser) return;

		const html = document.documentElement;
		if (newTheme === 'dark') {
			html.classList.add('dark');
		} else {
			html.classList.remove('dark');
		}
		localStorage.setItem('theme', newTheme);
		theme = newTheme;
	}

	function toggleTheme() {
		const newTheme: Theme = theme === 'dark' ? 'light' : 'dark';
		applyTheme(newTheme);
	}

	return {
		get theme() {
			return theme;
		},
		get mounted() {
			return mounted;
		},
		initializeTheme,
		applyTheme,
		toggleTheme
	};
}

export const themeStore = createThemeStore();
