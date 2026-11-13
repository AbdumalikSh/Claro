# Claro

Claro is a Vite and React visa portal with an Express API.

## Run locally

```sh
npm install
npm run dev:full
```

The Vite development server runs at `http://localhost:5173` and proxies `/api` requests to the Express server on port `3001`.

## Deploy to Vercel

Import this repository as a Vercel project and use these project settings:

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

`vercel.json` configures these build settings and sends client side routes to the Vite app. The `api/[...path].js` function forwards API requests to the Express app in `server/index.js`.

The API currently stores demo users in memory. New accounts are temporary and can be lost when a serverless function instance restarts. Add persistent storage before using real accounts or production data.
