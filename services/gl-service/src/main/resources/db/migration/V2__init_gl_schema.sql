/*
 * GL Schema for AstraCore Cloud - GL Service
 */

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. General Ledger Accounts
-- ============================================================================
CREATE TABLE gl_account (
    gl_account_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_name VARCHAR(255) NOT NULL,
    account_code VARCHAR(50) NOT NULL UNIQUE,
    gl_account_type_id VARCHAR(50) NOT NULL,
    parent_gl_account_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT NOT NULL DEFAULT 0
);

-- ============================================================================
-- 2. Accounting Transactions
-- ============================================================================
CREATE TABLE accounting_transaction (
    transaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_date TIMESTAMPTZ NOT NULL,
    entry_date TIMESTAMPTZ NOT NULL,
    description VARCHAR(500),
    transaction_type VARCHAR(50) NOT NULL,
    is_posted BOOLEAN NOT NULL DEFAULT FALSE,
    organization_party_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT NOT NULL DEFAULT 0
);

-- ============================================================================
-- 3. Transaction Entries
-- ============================================================================
CREATE TABLE transaction_entry (
    transaction_entry_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES accounting_transaction(transaction_id) ON DELETE CASCADE,
    gl_account_id UUID NOT NULL REFERENCES gl_account(gl_account_id),
    organization_party_id UUID,
    amount DECIMAL(18, 2) NOT NULL,
    debit_credit_flag CHAR(1) NOT NULL,
    description VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_transaction_entry_tx ON transaction_entry(transaction_id);
CREATE INDEX idx_transaction_entry_gl ON transaction_entry(gl_account_id);
