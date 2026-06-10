import { readable } from 'svelte/store';
import * as messages from '$lib/paraglide/messages';

type MessageFn = () => string;

const messageMap = messages as Record<string, unknown>;

function fallbackLabel(key: string) {
	return key
		.split('.')
		.at(-1)!
		.replaceAll('_', ' ')
		.replace(/\b\w/g, (char) => char.toUpperCase());
}

function translate(key: string) {
	const message =
		messageMap[key] ??
		messageMap[key.replaceAll('.', '_')] ??
		messageMap[key.replaceAll('.', '').replaceAll('_', '')];

	return typeof message === 'function' ? (message as MessageFn)() : fallbackLabel(key);
}

export const t = readable(translate);
