/*
 * Enterprise Grade Schema for AstraCore Cloud - Billing Service
 * Features: UUID PKs, Audit Columns, Optimistic Locking, Strict FKs
 */

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- Common Audit Columns Function
-- ============================================================================
-- In a real scenario, we might use triggers to auto-update updated_at
-- For now, we rely on JPA @EntityListeners

-- ============================================================================
-- 1. Party Domain (Simplified for Vertical Slice)
-- ============================================================================
CREATE TABLE party (
    party_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    party_type VARCHAR(20) NOT NULL, -- PERSON, ORGANIZATION
    external_id VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE person (
    party_id UUID PRIMARY KEY REFERENCES party(party_id),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    birth_date DATE,
    gender CHAR(1)
);

CREATE TABLE organization (
    party_id UUID PRIMARY KEY REFERENCES party(party_id),
    organization_name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(50)
);

CREATE TABLE contact_mechanism (
    contact_mech_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_mech_type VARCHAR(20) NOT NULL, -- POSTAL, TELECOM, EMAIL
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE party_contact_mech (
    party_id UUID NOT NULL REFERENCES party(party_id),
    contact_mech_id UUID NOT NULL REFERENCES contact_mechanism(contact_mech_id),
    from_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    thru_date TIMESTAMPTZ,
    PRIMARY KEY (party_id, contact_mech_id, from_date)
);

-- ============================================================================
-- 2. Product Domain
-- ============================================================================
CREATE TABLE product (
    product_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    product_type VARCHAR(20) NOT NULL, -- GOOD, SERVICE
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE product_price (
    product_price_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES product(product_id),
    price_type_id VARCHAR(20) NOT NULL, -- LIST, PROMO
    currency_uom_id VARCHAR(3) NOT NULL,
    price DECIMAL(18, 2) NOT NULL,
    from_date TIMESTAMPTZ NOT NULL,
    thru_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT NOT NULL DEFAULT 0
);

-- ============================================================================
-- 3. Billing Domain
-- ============================================================================
CREATE TABLE invoice (
    invoice_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_type_id VARCHAR(20) NOT NULL, -- SALES, PURCHASE
    party_id_from UUID NOT NULL REFERENCES party(party_id),
    party_id_to UUID NOT NULL REFERENCES party(party_id),
    invoice_date DATE NOT NULL,
    due_date DATE,
    status_id VARCHAR(20) NOT NULL, -- IN_PROCESS, APPROVED, PAID
    currency_uom_id VARCHAR(3) NOT NULL,
    total_amount DECIMAL(18, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE invoice_line (
    invoice_line_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoice(invoice_id),
    invoice_item_seq_id INT NOT NULL,
    product_id UUID REFERENCES product(product_id),
    description VARCHAR(255),
    quantity DECIMAL(18, 6),
    amount DECIMAL(18, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT NOT NULL DEFAULT 0
);

-- Indexes
CREATE INDEX idx_party_external_id ON party(external_id);
CREATE INDEX idx_invoice_party_from ON invoice(party_id_from);
CREATE INDEX idx_invoice_party_to ON invoice(party_id_to);
CREATE INDEX idx_invoice_date ON invoice(invoice_date);
CREATE INDEX idx_product_price_lookup ON product_price(product_id, price_type_id, currency_uom_id);
