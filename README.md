# Car Rental — Frontend

Frontend for the Car Rental project.  
Backend repo: https://github.com/SRedRider/car-rental-backend

## Overview
React + Vite frontend for browsing cars, booking, and an admin dashboard (stock, active rentals, users, feedback, payments). Features:
- Public pages (home, search, booking)
- Auth modals (login / register)
- Admin area (stock, rentals, payments, charts)
- Nivo charts and i18n (react-i18next)

## Prerequisites
- Node.js >= 16
- npm (or yarn)
- Running backend API (see backend repo)

## Quick start (Windows)
1. Install
```bash
cd c:\Users\quang\OneDrive\Tiedostot\Otp1\CarRental
npm install
```

2. Environment
- Create `.env` in project root (if needed). Example:
```env
VITE_API_URL=http://localhost:3000
```
- Ensure backend is running and CORS configured.

3. Run (dev)
```bash
npm run dev
```
Open the URL Vite reports (default http://localhost:5173).

4. Build / Preview
```bash
npm run build
npm run preview
```

## Project structure (short)
```
src/
  components/
    Auth/            # Login, Register modals
    LineChart/       # reusable LineChart (Nivo)
    AddCarModal/     # recommended modal components
  pages/
    Home/
    Admin/
      Stock/
      ActiveRentals/
      Admin.jsx
  assets/
  i18n.js
```

## Important notes / tips
- Protected admin routes: implement a wrapper that checks user role/token and redirects when unauthorized.
- Modals: prefer a single state (e.g. `activeModal: null | "add" | "edit" | "remove"`) to control modal visibility.
- Sidebar layout: use `min-height: 100vh` on top containers to allow page growth and scrolling; avoid forcing `height:100vh` on all containers if content should grow.
- Charts (Nivo): sanitize data before passing to charts. Each point must have a defined `x` and numeric `y`. Example sanitize:
```js
const sanitize = data => data.map(s => ({ ...s, data: s.data.filter(p => p.x != null && Number.isFinite(p.y)) }));
```
Invalid points can cause SVG `transform` errors in the console.

## Internationalization (i18n)
- Install: `npm install i18next react-i18next i18next-browser-languagedetector`
- Create `src/i18n.js` and load resources or use `i18next-http-backend` with `public/locales/{lng}/{ns}.json`.
- Use `useTranslation()` and `t('key')` in components. Persist language with the detector (localStorage).

### RTL support (Arabic)
This project supports right-to-left layout when Arabic is selected. Add the following behaviors:

1. Set document direction when language changes (example in `src/i18n.js`):
```js
// after i18n.init(...)
const RTL_LANGS = ['ar','he','fa','ur'];

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = RTL_LANGS.includes(lng) ? 'rtl' : 'ltr';
});
```

2. Use logical CSS properties where possible (padding-inline, margin-inline, text-align) and add small RTL overrides:
```css
/* example */
.navbar-links { padding-inline-start: 12px; }
html[dir="rtl"] .navbar-links { text-align: right; }

/* explicit overrides */
html[dir="rtl"] .footer-container { direction: rtl; }
html[dir="rtl"] .some-icon { transform: scaleX(-1); } /* flip arrows/icons if needed */
```

3. Fonts and UI details
- Use an Arabic-capable font for Arabic locale (add via Google Fonts or @font-face).
- Some third-party components (charts, maps) may not auto-flip — handle alignment programmatically when dir === 'rtl'.

4. Fallback & translation checks
- Keep `fallbackLng: "en"` so missing keys show English.
- Optionally show English text as tooltip: `t('key', { lng: 'en' })` for clarification.

## Auth & user state
- Pass an `onLogin(user)` callback from Navbar to Login so Navbar can store user state (and persist to `localStorage`) and display user name / logout button.

## Debugging
- Check browser console for fetch/chart errors.
- Verify API endpoints and CORS.
- Log data for charts to detect malformed points or missing IDs.

## Contributing
- Use feature branches.
- Keep components small and reusable.
- Add translation keys to locale files when updating UI text.

## License
MIT
```// filepath: c:\Users\quang\OneDrive\Tiedostot\Otp1\CarRental\README.md
# Car Rental — Frontend

Frontend for the Car Rental project.  
Backend repo: https://github.com/SRedRider/car-rental-backend

## Overview
React + Vite frontend for browsing cars, booking, and an admin dashboard (stock, active rentals, users, feedback, payments). Features:
- Public pages (home, search, booking)
- Auth modals (login / register)
- Admin area (stock, rentals, payments, charts)
- Nivo charts and i18n (react-i18next)

## Prerequisites
- Node.js >= 16
- npm (or yarn)
- Running backend API (see backend repo)

## Quick start (Windows)
1. Install
```bash
cd c:\Users\quang\OneDrive\Tiedostot\Otp1\CarRental
npm install
```

2. Environment
- Create `.env` in project root (if needed). Example:
```env
VITE_API_URL=http://localhost:3000
```
- Ensure backend is running and CORS configured.

3. Run (dev)
```bash
npm run dev
```
Open the URL Vite reports (default http://localhost:5173).

4. Build / Preview
```bash
npm run build
npm run preview
```

## Project structure (short)
```
src/
  components/
    Auth/            # Login, Register modals
    LineChart/       # reusable LineChart (Nivo)
    AddCarModal/     # recommended modal components
  pages/
    Home/
    Admin/
      Stock/
      ActiveRentals/
      Admin.jsx
  assets/
  i18n.js
```

## Important notes / tips
- Protected admin routes: implement a wrapper that checks user role/token and redirects when unauthorized.
- Modals: prefer a single state (e.g. `activeModal: null | "add" | "edit" | "remove"`) to control modal visibility.
- Sidebar layout: use `min-height: 100vh` on top containers to allow page growth and scrolling; avoid forcing `height:100vh` on all containers if content should grow.
- Charts (Nivo): sanitize data before passing to charts. Each point must have a defined `x` and numeric `y`. Example sanitize:
```js
const sanitize = data => data.map(s => ({ ...s, data: s.data.filter(p => p.x != null && Number.isFinite(p.y)) }));
```
Invalid points can cause SVG `transform` errors in the console.

## Internationalization (i18n)
- Install: `npm install i18next react-i18next i18next-browser-languagedetector`
- Create `src/i18n.js` and load resources or use `i18next-http-backend` with `public/locales/{lng}/{ns}.json`.
- Use `useTranslation()` and `t('key')` in components. Persist language with the detector (localStorage).

### RTL support (Arabic)
This project supports right-to-left layout when Arabic is selected. Add the following behaviors:

1. Set document direction when language changes (example in `src/i18n.js`):
```js
// after i18n.init(...)
const RTL_LANGS = ['ar','he','fa','ur'];

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = RTL_LANGS.includes(lng) ? 'rtl' : 'ltr';
});
```

2. Use logical CSS properties where possible (padding-inline, margin-inline, text-align) and add small RTL overrides:
```css
/* example */
.navbar-links { padding-inline-start: 12px; }
html[dir="rtl"] .navbar-links { text-align: right; }

/* explicit overrides */
html[dir="rtl"] .footer-container { direction: rtl; }
html[dir="rtl"] .some-icon { transform: scaleX(-1); } /* flip arrows/icons if needed */
```

3. Fonts and UI details
- Use an Arabic-capable font for Arabic locale (add via Google Fonts or @font-face).
- Some third-party components (charts, maps) may not auto-flip — handle alignment programmatically when dir === 'rtl'.

4. Fallback & translation checks
- Keep `fallbackLng: "en"` so missing keys show English.
- Optionally show English text as tooltip: `t('key', { lng: 'en' })` for clarification.

## Auth & user state
- Pass an `onLogin(user)` callback from Navbar to Login so Navbar can store user state (and persist to `localStorage`) and display user name / logout button.

## Debugging
- Check browser console for fetch/chart errors.
- Verify API endpoints and CORS.
- Log data for charts to detect malformed points or missing IDs.

## Contributing
- Use feature branches.
- Keep components small and reusable.
- Add translation keys to locale files when updating UI text.

## License
MIT