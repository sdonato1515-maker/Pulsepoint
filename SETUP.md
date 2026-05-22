# PulsePoint — Team Setup Guide

> Healthcare market intelligence dashboard for Stamford Health strategy executives.
> This guide gets a new team member from zero to running in ~30 minutes.

---

## What you'll need

- A [GitHub](https://github.com) account (to host the code)
- A [Supabase](https://supabase.com) account (free — for the database and user logins)
- A [Vercel](https://vercel.com) account (free — to host the frontend website)
- A [Railway](https://railway.app) account (free trial — to host the backend server)
- [Node.js 18+](https://nodejs.org) installed on your machine

---

## Part 1 — One-time setup (do this once, as the owner)

### Step 1: Push the code to GitHub

1. Go to [github.com/new](https://github.com/new) and create a new **private** repository named `pulsepoint`
2. In your terminal, from the `/pulsepoint` folder:

```bash
git init
git add .
git commit -m "Initial PulsePoint commit"
git remote add origin https://github.com/YOUR_USERNAME/pulsepoint.git
git push -u origin main
```

---

### Step 2: Create your Supabase project

1. Go to [supabase.com](https://supabase.com) → **New project**
2. Name it `pulsepoint`, choose a strong database password, pick the **US East** region
3. Wait ~2 minutes for it to provision
4. Go to **SQL Editor** → **New query**
5. Copy and paste the entire contents of [`supabase/setup.sql`](supabase/setup.sql) and click **Run**
   - This creates the `intelligence_items` table. The backend will seed it with data on first startup.

6. Go to **Settings → API** and copy:
   - **Project URL** → you'll need this as `SUPABASE_URL` / `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_KEY` (keep this secret — never commit it)

---

### Step 3: Deploy the backend to Railway

1. Go to [railway.app](https://railway.app) → **New Project → Deploy from GitHub repo**
2. Select your `pulsepoint` repository
3. When prompted for the root directory, set it to **`backend`**
4. After deploy, go to **Variables** and add:

| Key | Value |
|-----|-------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Your Supabase service_role key |
| `FRONTEND_URL` | (leave blank for now — you'll add this after Step 4) |

5. Go to **Settings → Networking → Generate Domain** — copy the URL (e.g. `https://pulsepoint-api-xxxx.railway.app`)

---

### Step 4: Deploy the frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project → Import Git Repository**
2. Select your `pulsepoint` repository — leave the root directory as `/` (the frontend root)
3. Under **Environment Variables**, add:

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon public key |
| `VITE_API_URL` | Your Railway URL + `/api` (e.g. `https://pulsepoint-api-xxxx.railway.app/api`) |

4. Click **Deploy** — Vercel gives you a URL like `https://pulsepoint-abc.vercel.app`
5. Go back to Railway → **Variables** and set `FRONTEND_URL` to your Vercel URL

---

### Step 5: Create team accounts

User accounts are managed in Supabase. To add a team member:

1. Go to your Supabase project → **Authentication → Users → Invite user**
2. Enter their email address — they'll get an email to set their password
3. To set their display name and role, go to **Authentication → Users**, click the user, and add to **User Metadata**:

```json
{
  "name": "Jane Smith",
  "title": "Director of Strategy",
  "org": "Stamford Health",
  "role": "editor"
}
```

Roles:
- `admin` — full access including Content Hub
- `editor` — can publish intelligence signals
- `viewer` — read-only dashboard access

---

## Part 2 — Running locally (for developers)

### First-time setup

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/pulsepoint.git
cd pulsepoint

# 2. Install frontend dependencies
npm install

# 3. Install backend dependencies
cd backend && npm install && cd ..

# 4. Set up environment variables
cp .env.example .env
cp backend/.env.example backend/.env
# Open both .env files and fill in your Supabase credentials
```

### Running the app

You need two terminals:

**Terminal 1 — Frontend:**
```bash
cd pulsepoint
npm run dev
# Opens at http://localhost:5173
```

**Terminal 2 — Backend:**
```bash
cd pulsepoint/backend
npm run dev
# Runs at http://localhost:3001
```

> The app works without the backend running — it falls back to seed data. You only need the backend for real-time publishing and data persistence.

---

## Part 3 — Day-to-day usage

### Logging in
Go to your Vercel URL and log in with the email/password from Supabase.

### Publishing intelligence signals
1. Click **Content Hub** in the left sidebar
2. Click **Add New Signal**
3. Fill in the form and set status to **Publish immediately**
4. The signal appears on all team members' dashboards in real time

### Managing signals
- **Unpublish** — removes from the dashboard but keeps the record (can re-publish later)
- **Delete** — permanently removes the signal

### Adding a new team member
See Step 5 in Part 1.

---

## Troubleshooting

**Login doesn't work**
- Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in Vercel
- Go to Supabase → Authentication → Users and confirm the account exists

**Dashboard shows no data / real-time doesn't work**
- Check that `VITE_API_URL` in Vercel points to the correct Railway URL
- Check Railway logs for errors (Railway → your project → Deployments → View logs)

**Backend fails to start**
- Check Railway → Variables and confirm `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are set
- Make sure the SQL in `supabase/setup.sql` was run successfully

**New team member can't see data**
- Confirm their account was created in Supabase → Authentication → Users
- Have them try logging out and back in

---

## Project structure

```
pulsepoint/
├── src/                    # React frontend
│   ├── context/            # Auth + Data state
│   ├── hooks/              # useIntelFeed (SSE + REST)
│   ├── lib/                # Supabase client
│   ├── pages/              # Dashboard, Intel Feed, Admin, etc.
│   └── components/         # Layout, admin panel, cards
├── backend/                # Express API server
│   └── src/
│       ├── lib/            # Supabase backend client
│       ├── routes/         # API route handlers
│       └── store.js        # In-memory store + Supabase persistence
├── supabase/
│   ├── setup.sql           # Run this once to init the database
│   └── schema.sql          # Full schema reference (advanced)
├── .env.example            # Frontend env vars template
├── vercel.json             # Vercel deployment config
└── SETUP.md                # This file
```
