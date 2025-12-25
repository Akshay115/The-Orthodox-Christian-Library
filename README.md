## Setup

1) Install deps
```bash
npm ci
```

2) Environment variables  
Copy `.env.example` to `.env` and fill:
- `DATABASE_URL` – Neon Postgres URL (`sslmode=require`).
- `PRISMA_ACCELERATE_URL` – Prisma Accelerate/Data Proxy endpoint (HTTP for Workers).
- `XAI_API_KEY` – xAI API key.
- `NEXTAUTH_SECRET` – strong random string (e.g., `openssl rand -base64 32`).

3) Prisma (Postgres)  
```bash
npx prisma generate
# for local dev (optional)
npx prisma migrate dev
# for deploying to Neon
npx prisma migrate deploy
```

## Cloudflare Workers deploy (OpenNext)
```bash
npm run build:worker   # npx open-next@latest build
npm run deploy:worker  # npx wrangler deploy
```
Required Worker secrets:
- `DATABASE_URL`
- `PRISMA_ACCELERATE_URL`
- `XAI_API_KEY`
- `NEXTAUTH_SECRET`

`wrangler.toml` uses `compatibility_flags = ["nodejs_compat"]`.

## Development
```bash
npm run dev
```
