import { writable } from 'svelte/store';

export type Tab = 'list' | 'register';
export type Theme = 'dark' | 'light';

function createUIStore() {
	const activeTab = writable<Tab>('list');
	const theme = writable<Theme>('dark');
	const mobileMenuOpen = writable(false);
	const registrationSuccess = writable(false);

	function switchTab(tab: Tab) {
		activeTab.set(tab);
		registrationSuccess.set(false);
	}

	function toggleTheme() {
		theme.update((t) => {
			const next = t === 'dark' ? 'light' : 'dark';
			if (typeof document !== 'undefined') {
				document.documentElement.classList.toggle('dark', next === 'dark');
				localStorage.setItem('theme', next);
			}
			return next;
		});
	}

	function initTheme() {
		if (typeof localStorage !== 'undefined') {
			const saved = localStorage.getItem('theme') as Theme | null;
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			const resolved = saved ?? (prefersDark ? 'dark' : 'light');
			theme.set(resolved);
			document.documentElement.classList.toggle('dark', resolved === 'dark');
		}
	}

	return {
		activeTab,
		theme,
		mobileMenuOpen,
		registrationSuccess,
		switchTab,
		toggleTheme,
		initTheme
	};
}

export const uiStore = createUIStore();
