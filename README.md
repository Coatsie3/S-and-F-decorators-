# S & F Premier Decorators website

Static site for sfpremierdecoratorsltd.je, deployed on Vercel.

- `public/` is the site. `npm run build` copies it to `dist/`.
- Quote form posts to `/api/quote`, a Vercel function that sends via Resend (needs `RESEND_API_KEY` in Vercel).
- Real reviews live in the `REVIEWS` array in `public/index.html`.

Built by Kc Design.
