-- ==========================================
-- CHAMAA DEMO SQL DATA
-- ==========================================

-- Drop tables if they exist
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS members;
DROP TABLE IF EXISTS rentals;

-- ==========================================
-- INVENTORY
-- ==========================================
CREATE TABLE inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    total INTEGER NOT NULL,
    available INTEGER NOT NULL,
    rented INTEGER NOT NULL,
    status TEXT
);

INSERT INTO inventory (name, total, available, rented, status) VALUES
('Chair', 50, 40, 10, 'Good'),
('Table', 20, 20, 0, 'Good');

-- ==========================================
-- MEMBERS
-- ==========================================
CREATE TABLE members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    national_id TEXT,
    date_joined TEXT
);

INSERT INTO members (name, phone, national_id, date_joined) VALUES
('John Doe', '0712345678', '12345678', '2025-01-01'),
('Jane Doe', '0798765432', '87654321', '2025-02-15');

-- ==========================================
-- RENTALS
-- ==========================================
CREATE TABLE rentals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_name TEXT NOT NULL,
    phone TEXT,
    item TEXT NOT NULL,
    qty INTEGER NOT NULL,
    available INTEGER NOT NULL,
    date_out TEXT NOT NULL,
    payment REAL
);

INSERT INTO rentals (member_name, phone, item, qty, available, date_out, payment) VALUES
('John Doe', '0712345678', 'Chair', 5, 40, '2026-01-16', 500);
