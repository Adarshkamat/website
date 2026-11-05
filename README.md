# FoodKart

A friendly, responsive frontend demo for browsing food, discovering restaurants, and building a basket. FoodKart is built with React, TypeScript, and Vite. It uses local mock data and browser-only state—there is no backend, account, or payment processing.

## Run locally

1. Install Node.js (LTS).
2. In this folder, run `npm install`.
3. Run `npm run dev` and open the local address printed in the terminal.

To check the production build, run `npm run build`. To run the configured linter, use `npm run lint`.

## Demo features

- Search by restaurant, cuisine, or category.
- Browse a small set of categories and filter restaurants with offers.
- Sort by recommendations, rating, or delivery time.
- Favourite restaurants and add/remove items from the basket.
- See a calculated subtotal and complete a non-payment demo checkout.
- Responsive layout, clear focus states, accessible labels, and reduced-motion support.

All restaurant data, prices, ratings, and delivery estimates are sample content. Basket and favourites are held in React state and reset when the page is refreshed.
