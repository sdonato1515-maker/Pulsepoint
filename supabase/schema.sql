-- PulsePoint Database Schema
-- PostgreSQL / Supabase
-- Run this in your Supabase SQL editor to initialize the schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ORGANIZATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('health_system', 'hospital', 'medical_group', 'payer', 'vendor')),
  geography_psas TEXT[], -- Primary Service Areas (zip codes or PSA codes)
  geography_ssas TEXT[], -- Secondary Service Areas
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  title TEXT,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- COMPETITOR SYSTEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS competitor_systems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color_hex TEXT NOT NULL DEFAULT '#475569',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INTELLIGENCE ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS intelligence_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  competitor_id UUID REFERENCES competitor_systems(id) ON DELETE SET NULL,
  headline TEXT NOT NULL,
  so_what TEXT, -- Strategic implication for the user's org
  source TEXT,
  source_url TEXT,
  published_date DATE,
  service_line TEXT, -- e.g., 'Cardiology', 'Oncology', 'Behavioral Health'
  item_type TEXT CHECK (item_type IN ('expansion', 'acquisition', 'leadership', 'payer', 'technology', 'partnership', 'regulatory', 'other')),
  geography_level TEXT CHECK (geography_level IN ('local', 'regional', 'national')),
  is_starred BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MARKET PULSE TOPICS
-- ============================================================
CREATE TABLE IF NOT EXISTS market_pulse_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  momentum_score INTEGER NOT NULL CHECK (momentum_score >= 0 AND momentum_score <= 100),
  trend_direction TEXT NOT NULL CHECK (trend_direction IN ('up', 'down', 'neutral')),
  summary TEXT,
  board_questions JSONB, -- Array of suggested board discussion questions
  peer_activity TEXT, -- What peer orgs are doing with this topic
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INNOVATION FEED ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS innovation_feed_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  system_name TEXT NOT NULL, -- e.g., 'Mayo Clinic', 'Kaiser Permanente'
  headline TEXT NOT NULL,
  summary TEXT,
  outcomes TEXT, -- Key outcome metrics from the initiative
  service_line TEXT,
  initiative_type TEXT CHECK (initiative_type IN ('technology', 'care_model', 'new_service_line', 'care_integration', 'employer_partnership', 'partnership_model', 'other')),
  published_date DATE,
  relevance_tags JSONB, -- Array of tags for org-type relevance
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PEER CONNECTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS peer_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  initiator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_name TEXT NOT NULL,
  target_title TEXT,
  target_org TEXT NOT NULL,
  topic TEXT NOT NULL,
  context TEXT, -- Brief context / message
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'connected', 'declined', 'awaiting_response')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- WEEKLY DIGESTS
-- ============================================================
CREATE TABLE IF NOT EXISTS weekly_digests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  week_of DATE NOT NULL,
  sections JSONB NOT NULL DEFAULT '[]', -- Array of { title, items: [...] }
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(org_id, week_of)
);

-- ============================================================
-- CON FILINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS con_filings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE, -- Watching org
  competitor_id UUID REFERENCES competitor_systems(id) ON DELETE SET NULL,
  facility TEXT NOT NULL,
  beds INTEGER,
  service_line TEXT,
  filed_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'public_comment', 'approved', 'denied', 'withdrawn')),
  state CHAR(2) NOT NULL DEFAULT 'CT',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE intelligence_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_pulse_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE innovation_feed_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE peer_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_digests ENABLE ROW LEVEL SECURITY;
ALTER TABLE con_filings ENABLE ROW LEVEL SECURITY;

-- Users can only see their own org's data
CREATE POLICY "org_isolation" ON organizations
  FOR ALL USING (id = (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "org_isolation" ON competitor_systems
  FOR ALL USING (org_id = (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "org_isolation" ON intelligence_items
  FOR ALL USING (org_id = (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "org_isolation" ON weekly_digests
  FOR ALL USING (org_id = (SELECT org_id FROM users WHERE id = auth.uid()));

CREATE POLICY "org_isolation" ON con_filings
  FOR ALL USING (org_id = (SELECT org_id FROM users WHERE id = auth.uid()));

-- Market pulse and innovation feed are global (shared across all orgs)
CREATE POLICY "public_read" ON market_pulse_topics FOR SELECT USING (true);
CREATE POLICY "public_read" ON innovation_feed_items FOR SELECT USING (true);

-- Users can see their own profile
CREATE POLICY "own_profile" ON users
  FOR ALL USING (id = auth.uid() OR org_id = (SELECT org_id FROM users WHERE id = auth.uid()));

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_intelligence_items_org_id ON intelligence_items(org_id);
CREATE INDEX idx_intelligence_items_competitor_id ON intelligence_items(competitor_id);
CREATE INDEX idx_intelligence_items_published_date ON intelligence_items(published_date DESC);
CREATE INDEX idx_con_filings_org_id ON con_filings(org_id);
CREATE INDEX idx_con_filings_status ON con_filings(status);
CREATE INDEX idx_weekly_digests_week_of ON weekly_digests(week_of DESC);
