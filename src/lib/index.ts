// Re-export stores and utilities for convenience
export { teamStore } from './stores/teams';
export { uiStore } from './stores/ui';
export { t, locale, setLocale } from './i18n';
export type { Team, TeamFormData, TeamStatus } from './stores/teams';
export type { Locale } from './i18n';
