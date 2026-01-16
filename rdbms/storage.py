# rdbms/storage.py
import json
from pathlib import Path

DB_FILE = Path("data/database.json")

def save_db(tables):
    data = {}
    for name, table in tables.items():
        data[name] = table.rows
    DB_FILE.parent.mkdir(exist_ok=True)
    with DB_FILE.open("w", encoding="utf-8") as f:
        json.dump(data, f, default=str, indent=2)

def load_db(existing_tables=None):
    # If file doesn't exist or is empty, return empty dict
    if not DB_FILE.exists() or DB_FILE.stat().st_size == 0:
        return {}
    with DB_FILE.open("r", encoding="utf-8") as f:
        data = json.load(f)
    if existing_tables:
        # convert any date strings back to date objects
        from datetime import datetime
        for tname, rows in data.items():
            table = existing_tables.get(tname)
            if not table: 
                continue
            for row in rows:
                for col, col_type in table.columns.items():
                    if col_type == "date" and row.get(col):
                        row[col] = datetime.strptime(row[col], "%Y-%m-%d").date()
    return data
