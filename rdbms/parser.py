# rdbms/parser.py
import re
from datetime import datetime

def parse_and_execute(db, command):
    cmd = command.strip()
    if cmd.upper().startswith("INSERT INTO"):
        # Example: INSERT INTO inventory (name,total,available,rented,status) VALUES ('Chair',10,10,0,'Good')
        m = re.match(r"INSERT INTO (\w+)\s*\((.+)\)\s*VALUES\s*\((.+)\)", cmd, re.I)
        if not m:
            raise ValueError("Invalid INSERT syntax")
        table, cols, vals = m.groups()
        cols = [c.strip() for c in cols.split(",")]
        vals = [v.strip() for v in re.split(r",(?=(?:[^']*'[^']*')*[^']*$)", vals)]
        row = {}
        for c,v in zip(cols, vals):
            if v.startswith("'") and v.endswith("'"):
                row[c] = v[1:-1]
            elif re.match(r"^\d+$", v):
                row[c] = int(v)
            else:
                # try date
                try:
                    row[c] = datetime.strptime(v, "%Y-%m-%d").date()
                except:
                    row[c] = v
        db.insert(table, row)
        return [row]

    elif cmd.upper().startswith("SELECT"):
        # Example: SELECT * FROM inventory
        m = re.match(r"SELECT\s+(.+)\s+FROM\s+(\w+)", cmd, re.I)
        if not m:
            raise ValueError("Invalid SELECT syntax")
        cols, table = m.groups()
        cols = None if cols.strip() == "*" else [c.strip() for c in cols.split(",")]
        return db.select(table, columns=cols)

    elif cmd.upper().startswith("UPDATE"):
        # Example: UPDATE members SET phone='0712345678' WHERE id=1
        m = re.match(r"UPDATE\s+(\w+)\s+SET\s+(.+?)\s+WHERE\s+(.+)", cmd, re.I)
        if not m:
            raise ValueError("Invalid UPDATE syntax")
        table, set_clause, where_clause = m.groups()
        updates = {}
        for part in set_clause.split(","):
            k,v = part.split("=")
            k = k.strip()
            v = v.strip()
            if v.startswith("'") and v.endswith("'"):
                updates[k] = v[1:-1]
            elif re.match(r"^\d+$", v):
                updates[k] = int(v)
            else:
                try:
                    updates[k] = datetime.strptime(v, "%Y-%m-%d").date()
                except:
                    updates[k] = v
        # support simple WHERE id=?
        m2 = re.match(r"id\s*=\s*(\d+)", where_clause)
        if not m2:
            raise ValueError("Only simple WHERE id=? supported")
        id_val = int(m2.group(1))
        count = db.update(table, updates, where=lambda r: r.get("id")==id_val)
        return [{"updated_rows": count}]

    elif cmd.upper().startswith("DELETE"):
        # Example: DELETE FROM rentals WHERE id=2
        m = re.match(r"DELETE FROM (\w+)\s+WHERE\s+(.+)", cmd, re.I)
        if not m:
            raise ValueError("Invalid DELETE syntax")
        table, where_clause = m.groups()
        m2 = re.match(r"id\s*=\s*(\d+)", where_clause)
        if not m2:
            raise ValueError("Only simple WHERE id=? supported")
        id_val = int(m2.group(1))
        count = db.delete(table, where=lambda r: r.get("id")==id_val)
        return [{"deleted_rows": count}]
    else:
        raise ValueError("Unknown command")
