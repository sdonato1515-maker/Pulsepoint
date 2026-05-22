# PulsePoint API

Express backend for the PulsePoint healthcare intelligence platform.

## Run

```bash
npm install
npm run dev   # starts on port 3001 with --watch
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/health | Health check |
| GET | /api/intelligence | All intel items (filter: competitorId, serviceLine, itemType, q) |
| GET | /api/intelligence/:id | Single intel item |
| GET | /api/competitors | All competitors with alert counts |
| GET | /api/competitors/:id | Single competitor with intel items |
| GET | /api/market-pulse | All market pulse topics |
| GET | /api/market-pulse/:id | Single topic |
| GET | /api/innovation | Innovation feed items |
| GET | /api/digest/latest | Full weekly digest payload |

## Connecting to Supabase

1. `npm install @supabase/supabase-js`
2. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env`
3. Replace seed data imports in each route with Supabase queries
4. Run `psql` against the schema in `../supabase/schema.sql`
