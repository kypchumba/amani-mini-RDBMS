# Mini-RDBMS with Flask + REPL

This is a lightweight web-based dashboard for managing a Amani (Self-Help Group).
It provides:

Inventory management

Members management

Rentals tracking

REPL interface for SQL-like commands

Built with: Flask + Python + HTML/CSS/JS + JSON DB.

# Features

- Custom RDBMS with tables: `inventory`, `members`, `rentals`
- SQL-like REPL: `INSERT`, `UPDATE`, `DELETE`, `SELECT`
- Primary keys, unique keys, indexing
- Persistent storage in `data/database.json`
- CRUD Operations on `Inventory`, `Members`, and `Rentals`
- Live Dashboard with key stats
- REPL to run SQL-like commands
- Modal Forms for adding entries easily

Limitations (Intentional)
- No query optimizer yet
- Indexes are in-memory only
- Limited SQL grammar support

Setup Instructions

Install dependencies

pip install -r requirements.txt


Run the project

# Option 1: Using Flask directly
flask run

# Option 2: Using run.sh (Linux/macOS)
Amani rdbms/run.sh 
chmod +x run.sh

# Option 3: Using run.bat (Windows)
Double click or click open Amani rdbms/run.bat

Access the dashboard
Open http://127.0.0.1:5000
 in your browser.

# Quick Commands (REPL)

SELECT members.name, members.phone, rentals.item, rentals.qty, rentals.payment 
FROM members
JOIN rentals
ON members.name = rentals.member_name;

Insert new members:
INSERT INTO members (name, phone, national_id, date_joined) VALUES ('Ken Kipchumba', '0113365971', '12345678', '2026-01-16')

Add a rental:
INSERT INTO rentals (member_name, item, qty, date_out, payment) VALUES ('Ken Kipchumba', 'Chair', 55, '2026-01-16', 500)

UPDATE members
SET phone = '0722000000'WHERE name = 'Ken Kipchumba';

Delete a row:
DELETE FROM members WHERE id=1


Notes

Inventory availability updates automatically when rentals are added or deleted

The REPL parser accepts single quotes for string values

Demo data is preloaded in dbData



