# Theme & Language Support Documentation

## Overview

This document describes the new theme switching and language support features added to the miniFAnRoC web application.

## Features Added

### 1. **Theme Switching (Light/Dark Mode)**

#### How It Works
- **Default Behavior**: On first visit, the app detects the user's system preference using `prefers-color-scheme` media query
- **Persistence**: User's theme preference is saved to `localStorage` as `theme` key
- **Manual Toggle**: Users can toggle between light and dark modes using the theme button in the navbar
- **Real-time Updates**: Theme changes apply immediately with smooth CSS transitions

#### Technical Implementation
- Theme state is managed by `src/lib/stores/theme.svelte.ts` store
- Theme initialization happens in the root layout (`src/routes/+layout.svelte`)
- CSS variables are defined in `src/routes/layout.css` for both light and dark modes
- Tailwind CSS uses `darkMode: 'class'` configuration
- Theme script in `src/app.html` prevents flash of unstyled content on page load

#### CSS Variables
The app uses CSS custom properties (CSS variables) for theming:
```
Light Mode (:root):
  --background: oklch(1 0 0)           // White
  --foreground: oklch(0.145 0 0)       // Dark gray/black
  --primary: oklch(0.205 0 0)          // Dark blue
  --primary-foreground: oklch(0.985 0 0) // Off-white
  ... (and many more)

Dark Mode (.dark):
  --background: oklch(0.145 0 0)       // Dark gray/black
  --foreground: oklch(0.985 0 0)       // Off-white
  --primary: oklch(0.922 0 0)          // Light gray
  --primary-foreground: oklch(0.205 0 0) // Dark blue
  ... (and many more)
```

#### Files Modified
- `src/lib/stores/theme.svelte.ts` - New theme store
- `src/routes/+layout.svelte` - Added theme store initialization
- `src/routes/+layout.ts` - Layout data loading
- `src/routes/layout.css` - CSS variables for both themes
- `src/app.html` - Added theme initialization script and meta tags
- `src/app.css` - Updated to use CSS variables
- `src/lib/components/layout/Navbar.svelte` - Updated with theme toggle

### 2. **Language Support (English/Vietnamese)**

#### How It Works
- **Default Language**: English is now the base locale (changed from Vietnamese)
- **Language Switching**: Users can switch between English (EN) and Vietnamese (VI)
- **Persistent Selection**: Language preference is managed by Paraglide's built-in cookie (`PARAGLIDE_LOCALE`)
- **URL Routing**: Language is reflected in the URL path (e.g., `/en/homepage`, `/vi/homepage`)
- **Message Translation**: All UI messages are stored in `messages/en.json` and `messages/vi.json`

#### Technical Implementation
- Language state is managed by `src/lib/stores/language.svelte.ts` store
- Paraglide middleware handles locale detection and URL rewrites
- Base locale changed from "vi" to "en" in `project.inlang/settings.json`
- Language switching triggers a navigation to the localized URL path
- Paraglide runtime automatically generates localization functions

#### Message Files
- `messages/en.json` - English translations
- `messages/vi.json` - Vietnamese translations

#### Files Modified
- `src/lib/stores/language.svelte.ts` - New language store
- `project.inlang/settings.json` - Changed baseLocale to "en"
- `src/lib/components/layout/Navbar.svelte` - Added language switcher UI
- `src/routes/+layout.svelte` - Added language store imports

### 3. **Mobile Responsiveness Improvements**

#### Responsive Design Updates
- **Navbar**: Fully responsive with mobile hamburger menu
- **Theme Toggle**: Available on mobile with icon-only button
- **Language Selector**: Mobile-friendly language picker in menu
- **Touch Targets**: All interactive elements have adequate touch target size (min 44x44px)
- **Viewport Settings**: Improved meta tags for better mobile display
- **Padding/Spacing**: Responsive padding for different screen sizes

#### Mobile Features
- Logo hides on very small screens (sm breakpoint), text shows on sm and up
- Mobile hamburger menu for navigation
- Language selector in mobile menu with clear button styling
- Theme toggle accessible on all screen sizes
- Proper touch-friendly spacing and sizing

#### Files Modified
- `src/app.html` - Enhanced meta tags for mobile:
  - `viewport` - Improved settings for responsiveness
  - `theme-color` - Color for browser UI on mobile
  - `mobile-web-app-capable` - Android PWA support
  - `apple-mobile-web-app-capable` - iOS PWA support
  - `apple-mobile-web-app-status-bar-style` - iOS status bar styling
- `src/lib/components/layout/Navbar.svelte` - Responsive design improvements

## Usage Guide

### For Users

#### Switching Theme
1. Look for the sun/moon icon in the top navigation bar
2. Click to toggle between light and dark mode
3. Your preference is automatically saved

#### Switching Language
1. Look for the globe icon (desktop) or language buttons in menu (mobile)
2. Click to see available languages (EN, VI)
3. Select your preferred language
4. The page will reload with the new language

### For Developers

#### Accessing Theme State
```typescript
import { themeStore } from '$lib/stores/theme.svelte';

// Get current theme
const currentTheme = themeStore.theme; // 'light' or 'dark'

// Toggle theme
themeStore.toggleTheme();

// Apply specific theme
themeStore.applyTheme('light');

// Check if mounted
const isMounted = themeStore.mounted;
```

#### Accessing Language State
```typescript
import { languageStore } from '$lib/stores/language.svelte';
import { locales } from '$lib/paraglide/runtime';

// Get current locale
const currentLocale = languageStore.locale; // 'en' or 'vi'

// Change language
await languageStore.changeLocale('vi');

// Get available locales
console.log(locales); // ['en', 'vi']
```

#### Using Translations
Paraglide automatically generates functions for all messages:
```typescript
import * as m from '$lib/paraglide/messages';

// Use translations
const navHome = m.nav_home(); // "Home" or "Trang Chủ" depending on locale
```

## CSS Classes for Theming

When styling components, use these patterns for theme support:

```svelte
<!-- Light/Dark responsive classes -->
<div class="text-slate-900 dark:text-white">
  This text is black in light mode, white in dark mode
</div>

<!-- Background with theme support -->
<div class="bg-white dark:bg-slate-950">
  Light background in light mode, dark in dark mode
</div>

<!-- Borders with theme support -->
<div class="border border-slate-200 dark:border-white/10">
  Light border in light mode, subtle white border in dark mode
</div>

<!-- Hover states with theme support -->
<button class="hover:bg-slate-100 dark:hover:bg-white/5">
  Different hover states for each theme
</button>
```

## Browser Support

- **Theme Detection**: All modern browsers with CSS custom properties support (IE 11+ with polyfill)
- **prefers-color-scheme**: Chrome 76+, Firefox 67+, Safari 12.1+, Edge 76+
- **localStorage**: Supported in all modern browsers
- **Mobile**: iOS Safari 12.2+, Chrome Android 76+

## Testing

### Test Theme Switching
1. Open the app in browser dev tools with Network tab open
2. Check localStorage after clicking theme toggle:
   ```javascript
   localStorage.getItem('theme') // Should show 'light' or 'dark'
   ```
3. Verify the HTML element has/doesn't have the 'dark' class:
   ```javascript
   document.documentElement.classList.contains('dark')
   ```

### Test Language Switching
1. Click language button and select a language
2. URL should change to reflect new locale (e.g., `/vi/homepage`)
3. All text should update to new language
4. Refresh page - language should persist

### Test Mobile Responsiveness
1. Open dev tools with device emulation
2. Test on various screen sizes:
   - Mobile (375px): Hamburger menu, stacked layout
   - Tablet (768px): Responsive layout
   - Desktop (1024px+): Full layout with all controls visible
3. Test touch interactions on actual mobile device

## Customization

### Adding New Languages
1. Create new message file: `messages/[locale].json`
2. Add translations following the same structure as existing files
3. Update `project.inlang/settings.json` to include new locale in `locales` array
4. Restart dev server - Paraglide will regenerate runtime files

### Adding New Message Keys
1. Add key-value pair to `messages/en.json`
2. Add corresponding translation to `messages/vi.json`
3. Use with: `import * as m from '$lib/paraglide/messages'` then `m.your_key()`

### Modifying Theme Colors
Edit `src/routes/layout.css` and update the CSS variables in `:root` (light mode) or `.dark` (dark mode) sections.

## Performance Considerations

- Theme initialization happens synchronously in HTML to prevent flash
- Language switching uses SvelteKit's navigation which is optimized
- CSS variables provide performant theme switching without repainting entire DOM
- localStorage is used for persistence (minimal storage)

## Accessibility

- Theme toggle has proper `aria-label` attribute
- Language selector is keyboard accessible
- Colors meet WCAG contrast requirements in both themes
- Touch targets meet minimum 44x44px WCAG guidelines on mobile

## Troubleshooting

### Theme doesn't persist
- Check if localStorage is enabled
- Clear browser cache and localStorage
- Verify `src/app.html` script is executing

### Language doesn't change
- Check if Paraglide cookie is set: `PARAGLIDE_LOCALE`
- Verify URL structure includes locale prefix
- Check console for navigation errors
- Ensure message files exist for both languages

### Flash of wrong theme on page load
- The initialization script in `src/app.html` should prevent this
- If still occurs, verify script is in `<head>` or before body content

## Future Enhancements

- [ ] Add more language options (Chinese, Japanese, etc.)
- [ ] Add theme customization for accent colors
- [ ] Add system-wide theme preference detection for automatic switching
- [ ] Add theme scheduler (automatic switching based on time of day)
- [ ] Add animations for theme transitions
