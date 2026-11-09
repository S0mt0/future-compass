# Future Compass

A mobile-first career exploration experience for secondary-school students, built with React and Vite.

## Development

```bash
pnpm dev
```

## Checkout setup

The subscription screen uses Paystack InlineJS. Copy `.env.example` to `.env.local` and set `VITE_PAYSTACK_PUBLIC_KEY` to your Paystack public key.

Use a Paystack webhook or a server-side transaction-verification endpoint before granting real subscription access. Never expose a Paystack secret key in this Vite application.
