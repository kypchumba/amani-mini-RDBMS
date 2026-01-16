# app.py
from flask import Flask, render_template, request, jsonify
from rdbms.core import Database
from rdbms import storage
from datetime import date

app = Flask(__name__)

# ===========================
# DATABASE INIT
# ===========================
db = Database()

# Define tables
if "inventory" not in db.tables:
    db.create_table(
        "inventory",
        columns={"id": "int", "name": "str", "total": "int", "available": "int", "rented": "int", "status": "str"},
        primary_key="id"
    )

if "members" not in db.tables:
    db.create_table(
        "members",
        columns={"id": "int", "name": "str", "phone": "str", "national_id": "str", "date_joined": "date"},
        primary_key="id",
        unique_keys=["national_id"]
    )

if "rentals" not in db.tables:
    db.create_table(
        "rentals",
        columns={"id": "int", "name": "str", "phone": "str", "item": "str", "qty": "int", "available": "int", "date_out": "date", "payment": "int"},
        primary_key="id"
    )


# Load saved data
saved_data = storage.load_db(existing_tables=db.tables)
for tname, rows in saved_data.items():
    table = db.tables[tname]
    table.rows = rows
    # restore auto_increment
    if table.primary_key and table.columns[table.primary_key] == "int":
        max_id = max([r[table.primary_key] for r in rows], default=0)
        table.auto_increment = max_id + 1

# ===========================
# ROUTES
# ===========================
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/tables/<table_name>", methods=["GET"])
def get_table(table_name):
    if table_name not in db.tables:
        return jsonify({"error": "Table not found"}), 404
    rows = db.select(table_name)
    # Convert date objects to ISO string for JSON
    for row in rows:
        for k, v in row.items():
            if isinstance(v, date):
                row[k] = v.isoformat()
    return jsonify(rows)


@app.route("/api/repl", methods=["POST"])
def repl():
    """
    Expects JSON: { "command": "<sql-like command>" }
    Example commands:
    - INSERT INTO inventory (name,total,available,rented,status) VALUES ('Chair',10,10,0,'Good')
    - UPDATE members SET phone='0712345678' WHERE id=1
    - DELETE FROM rentals WHERE id=2
    - SELECT * FROM inventory
    """
    data = request.get_json()
    cmd = data.get("command")
    if not cmd:
        return jsonify({"error": "No command provided"}), 400

    try:
        # Send command to your parser
        from rdbms.parser import parse_and_execute
        result = parse_and_execute(db, cmd)
        # Save DB after any modification
        storage.save_db(db.tables)
        # Convert dates for JSON
        for row in result:
            for k, v in row.items():
                if isinstance(v, date):
                    row[k] = v.isoformat()
        return jsonify({"result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(debug=True)
