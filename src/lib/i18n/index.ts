import { writable, derived } from 'svelte/store';
import enRaw from '../../messages/en.json';
import viRaw from '../../messages/vi.json';

export type Locale = 'en' | 'vi';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Messages = Record<string, any>;

const messages: Record<Locale, Messages> = { en: enRaw, vi: viRaw };

function createI18nStore() {
	const locale = writable<Locale>('vi');

	const t = derived(locale, ($locale) => {
		const msgs = messages[$locale];

		function translate(key: string): string {
			const keys = key.split('.');
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			let current: any = msgs;
			for (const k of keys) {
				if (current === undefined || current === null) return key;
				current = current[k];
			}
			return typeof current === 'string' ? current : key;
		}

		return translate;
	});

	function setLocale(newLocale: Locale) {
		locale.set(newLocale);
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('locale', newLocale);
		}
	}

	function initLocale() {
		if (typeof localStorage !== 'undefined') {
			const saved = localStorage.getItem('locale') as Locale | null;
			if (saved && (saved === 'en' || saved === 'vi')) {
				locale.set(saved);
			}
		}
	}

	return { locale, t, setLocale, initLocale };
}

export const i18n = createI18nStore();
export const { locale, t, setLocale } = i18n;
