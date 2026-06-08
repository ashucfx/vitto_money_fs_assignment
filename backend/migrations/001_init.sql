-- ============================================================
-- Vitto Loan Application Portal — Initial Database Migration
-- Migration: 001_init.sql
-- Description: Creates the applications table with UUID PKs,
--              status constraints, and language constraints.
-- ============================================================

-- Enable pgcrypto for gen_random_uuid() (no-op if already enabled)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create the applications table
CREATE TABLE IF NOT EXISTS applications (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT          NOT NULL,
  mobile      TEXT          NOT NULL,
  amount      NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  purpose     TEXT          NOT NULL,
  language    TEXT          NOT NULL CHECK (language IN ('Hindi', 'Tamil', 'Telugu', 'Marathi', 'English')),
  status      TEXT          NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Index for fast status filtering
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications (status);

-- Index for fast ordering by latest first
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications (created_at DESC);
