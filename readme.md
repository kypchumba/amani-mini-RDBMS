# Mini-RDBMS - Interactive SQL Command Center

A lightweight, web-based SQL learning environment built with Flask and Python. It allows users to explore SQL commands by querying and manipulating preloaded datasets through an interactive command interface.

Instead of working with an empty database, users can experiment with existing tables, execute SQL-like statements, observe query results and understand how database operations work in practice.

The project combines a custom-built Relational Database Management System (RDBMS) with a browser-based SQL command interface.

## Features

- **Interactive SQL REPL:** Execute SQL-like commands directly from the browser.
- **Preloaded Datasets:** Explore existing `inventory`, `members` and `rentals` tables.
- **CRUD Operations:** Practice inserting, retrieving, updating and deleting records.
- **Table Relationships:** Experiment with queries involving multiple tables.
- **Primary Keys:** Support for primary key constraints and automatic ID generation.
- **Unique Constraints:** Prevent duplicate values in designated columns.
- **Indexing:** Basic in-memory indexing support.
- **Persistent Storage:** Database records are saved in JSON format.
- **Live Table Viewer:** Inspect table contents and observe changes after executing commands.
- **Dashboard:** View database tables and key statistics.

## Technology Stack

| Technology | Purpose |
|---|---|
| Python | Database engine and backend logic |
| Flask | Web application and API |
| HTML | Application structure |
| CSS | Interface styling |
| JavaScript | Frontend interactions |
| JSON | Persistent database storage |

## SQL Commands to Explore

The command center supports a subset of SQL syntax, including:

| Command | Purpose |
|---|---|
| `SELECT` | Retrieve records |
| `INSERT` | Add new records |
| `UPDATE` | Modify existing records |
| `DELETE` | Remove records |
| `WHERE` | Filter records |
| `JOIN` | Combine related table data, where supported by the parser |

### Example Queries

**1. Retrieve all inventory records**

```sql
SELECT * FROM inventory;
```

**2. Retrieve selected columns**

```sql
SELECT name, phone, national_id
FROM members;
```

**3. Filter records**

```sql
SELECT * FROM inventory
WHERE available > 5;
```

**4. Insert a new record**

```sql
INSERT INTO members
(name, phone, national_id, date_joined)
VALUES
('Ken Kipchumba', '0113365971', '12345678', '2026-01-16');
```

**5. Update an existing record**

```sql
UPDATE members
SET phone = '0722000000'
WHERE id = 1;
```

**6. Delete a record**

```sql
DELETE FROM members
WHERE id = 1;
```

**7. Query related tables**

```sql
SELECT members.name, members.phone, rentals.item, rentals.qty
FROM members
JOIN rentals
ON members.name = rentals.name;
```

*Note: JOIN execution depends on the SQL parser's implemented grammar and supported operations.*

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/kypchumba/amani-mini-RDBMS.git
cd amani-mini-RDBMS
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the application

```bash
python app.py
```

### 4. Access the SQL Command Center

Open your browser and visit:

[http://127.0.0.1:5000](http://127.0.0.1:5000)

## Understanding the Database

The application comes with three sample tables:

- `inventory` – Sample inventory records.
- `members` – Sample member records.
- `rentals` – Sample rental records.

These datasets provide a practical environment for experimenting with database queries and learning how SQL operations affect stored records.

Changes made through the command interface are persisted in JSON storage.

## Current Limitations

This project implements a simplified SQL-like language rather than the complete SQL standard.

- Limited SQL grammar support.
- No query optimizer.
- Indexes are maintained in memory.
- Not all SQL clauses and operations are implemented.
- No full relational constraint enforcement.

## Project Purpose

This project explores the fundamental concepts behind relational databases and SQL execution by implementing a simplified database engine from scratch.

It provides a practical environment for learning how SQL statements interact with tables, how records are stored and retrieved and how database operations are processed internally.

**Built with Python, Flask and a custom Mini-RDBMS.**