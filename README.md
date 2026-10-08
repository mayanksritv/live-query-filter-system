# Live Query Filter System

A clean full-stack product catalog demonstrating debounced live search, multi-category filtering, pagination, responsive result cards, and a client-side shopping cart with a demo purchase flow.

## Features

- Express search API: `GET /api/products?search=&category=&page=&limit=`
- 400ms debounced frontend search
- Multi-category checkbox filters
- Paginated product grid
- Loading skeletons, empty states, and API error retry
- Responsive minimal storefront UI
- Add to cart from every product card
- Cart drawer with selected products, quantities, remove controls, subtotal, free delivery, and total
- Demo Purchase button with an order confirmation toast
- Cart persistence with `localStorage`
- Optional purchase API: `POST /api/purchase`

## Run locally

```bash
npm install
npm start
```

Open `http://localhost:10000`.

## Purchase API

Example request:

```json
{
  "items": [
    { "id": 2, "quantity": 1 },
    { "id": 7, "quantity": 2 }
  ]
}
```

The demo purchase endpoint returns an order id and calculated total. No real payment is processed.

## Render deployment

- Build command: `npm install`
- Start command: `npm start`
- The server reads Render's `PORT` environment variable and binds to `0.0.0.0`.

### Live links

- Live App: `PASTE_YOUR_RENDER_URL_HERE`
- GitHub: `PASTE_YOUR_GITHUB_REPOSITORY_URL_HERE`
