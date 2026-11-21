# CarQuote — Premium frontend prototype

A responsive React + Vite frontend prototype based on the premium CarQuote visual direction.

## Screens included
- Home / landing page
- Quote request — Step 1: brand and model
- Quote request — Step 2: fuel, city and buying timeline
- Quote request — Step 3: contact details
- Request submitted confirmation
- Dealer quote comparison
- Dealer selected confirmation state

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite.

## Build
```bash
npm run build
```

## Structure
- `src/screens/` — page-level screens
- `src/components/` — reusable UI components
- `src/data.js` — sample cars, brands and dealer quote data
- `src/App.jsx` — lightweight hash navigation and shared prototype state
- `src/styles.css` — responsive visual system

## Integration notes for Claude / backend work
- All data is currently mock/static and lives in `src/data.js` or local component state.
- Replace sample quote data with API responses in `Quotes.jsx` / `DealerCard.jsx`.
- Connect the Step 3 form submit in `QuoteWizard.jsx` to the lead/request API.
- Replace the local hash navigation in `App.jsx` with your preferred router if required.
- The quote totals and dealer values are illustrative UI data, not live market prices.
- Car photography currently uses remote Unsplash image URLs; replace with approved local assets before production.
- Form validation, authentication, analytics, dealer registration, legal pages and real WhatsApp delivery are not connected.
