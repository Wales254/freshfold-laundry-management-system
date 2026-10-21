
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'staff',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    email VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
    customer VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    service VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    delivery_date DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'Received',
    total NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (total >= 0),
    payment_status VARCHAR(30) NOT NULL DEFAULT 'Unpaid',
    payment_method VARCHAR(50),
    amount_paid NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (amount_paid >= 0),
    balance NUMERIC(12, 2) NOT NULL DEFAULT 0,
    change NUMERIC(12, 2) NOT NULL DEFAULT 0,
    payment_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL
        REFERENCES orders(id) ON DELETE CASCADE,
    service VARCHAR(150) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    line_total NUMERIC(12, 2) NOT NULL CHECK (line_total >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL
        REFERENCES orders(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    method VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    payment_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    transaction_reference TEXT
);

CREATE INDEX IF NOT EXISTS idx_orders_status
    ON orders(status);

CREATE INDEX IF NOT EXISTS idx_orders_delivery_date
    ON orders(delivery_date);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id
    ON order_items(order_id);

CREATE INDEX IF NOT EXISTS idx_payments_order_id
    ON payments(order_id);


-- ==========================================
-- FRESHFOLD AUTHENTICATION AND ACCOUNT CONTROL
-- ==========================================

-- Give every employee a username.
ALTER TABLE users
ADD COLUMN IF NOT EXISTS username VARCHAR(50);

-- Allow administrators to deactivate accounts.
ALTER TABLE users
ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;

-- Track login and account update activity.
ALTER TABLE users
ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;

ALTER TABLE users
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Ensure usernames are unique, ignoring capitalization.
-- Multiple existing NULL usernames are allowed during migration.
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_unique
ON users (LOWER(username))
WHERE username IS NOT NULL;

-- Record important actions performed by employees.
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    username VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INTEGER,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id
ON audit_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at
ON audit_logs(created_at);


-- Employee contact information
ALTER TABLE users
ADD COLUMN IF NOT EXISTS phone VARCHAR(30);

-- Ensure employee listings can be sorted efficiently.
CREATE INDEX IF NOT EXISTS idx_users_created_at
ON users(created_at);

-- ==========================================
-- FRESHFOLD LAUNDRY: RECEIPT SETTINGS
-- ==========================================

CREATE TABLE IF NOT EXISTS receipt_settings (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),

    prefix VARCHAR(20) NOT NULL DEFAULT 'RC-',

    currency VARCHAR(10) NOT NULL DEFAULT 'KES',

    footer TEXT NOT NULL DEFAULT
        'Thank you for choosing FreshFold Laundry! We appreciate your trust in us and look forward to serving you again.',

    show_logo BOOLEAN NOT NULL DEFAULT TRUE,

    auto_print BOOLEAN NOT NULL DEFAULT FALSE,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default settings only if they do not exist.
INSERT INTO receipt_settings (
    id,
    prefix,
    currency,
    footer,
    show_logo,
    auto_print
)
VALUES (
    1,
    'RC-',
    'KES',
    'Thank you for choosing FreshFold Laundry! We appreciate your trust in us and look forward to serving you again.',
    TRUE,
    FALSE
)
ON CONFLICT (id) DO NOTHING;
