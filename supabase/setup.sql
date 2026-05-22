-- PulsePoint Quick Setup
-- Run this entire file in: supabase.com → your project → SQL Editor → New query
-- This creates the intelligence_items table and seeds it with initial data.

-- ── Table ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS intelligence_items (
  id             TEXT PRIMARY KEY,
  competitor_id  TEXT,
  headline       TEXT NOT NULL,
  so_what        TEXT,
  source         TEXT,
  source_url     TEXT,
  published_date TEXT,
  service_line   TEXT,
  item_type      TEXT,
  geography      TEXT,
  status         TEXT NOT NULL DEFAULT 'draft',
  flag           TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── No RLS — internal team tool, all authenticated users see all data ─────────
ALTER TABLE intelligence_items DISABLE ROW LEVEL SECURITY;

-- ── Auto-update updated_at on every row change ────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON intelligence_items;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON intelligence_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Index for fast date-sorted queries ───────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_intelligence_items_published_date
  ON intelligence_items (published_date DESC);

CREATE INDEX IF NOT EXISTS idx_intelligence_items_status
  ON intelligence_items (status);
