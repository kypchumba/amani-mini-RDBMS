# rdbms/core.py
import datetime
from copy import deepcopy
from . import storage  # relative import, same package

class Table:
    def __init__(self, name, columns, primary_key=None, unique_keys=None, foreign_keys=None):
        """
        columns: dict of column_name: type (int, str, date)
        primary_key: str
        unique_keys: list of column names
        foreign_keys: dict {column_name: (table_ref, column_ref)}
        """
        self.name = name
        self.columns = columns
        self.primary_key = primary_key
        self.unique_keys = unique_keys or []
        self.foreign_keys = foreign_keys or {}
        self.rows = []
        self.auto_increment = 1  # For INT PKs

        # Indexes for fast lookup
        self.pk_index = {}  # value -> row
        self.unique_indexes = {key: {} for key in self.unique_keys}

    def _validate_row(self, row):
        # Ensure all required columns exist
        for col, col_type in self.columns.items():
            if col not in row:
                raise ValueError(f"Missing column '{col}' in insert")
            # Type enforcement
            if col_type == 'int' and not isinstance(row[col], int):
                raise ValueError(f"Column '{col}' must be int")
            if col_type == 'str' and not isinstance(row[col], str):
                raise ValueError(f"Column '{col}' must be str")
            if col_type == 'date' and not isinstance(row[col], datetime.date):
                raise ValueError(f"Column '{col}' must be date")

        # Primary key unique
        if self.primary_key:
            pk_val = row.get(self.primary_key)
            if pk_val in self.pk_index:
                raise ValueError(f"Duplicate primary key '{pk_val}'")

        # Unique keys
        for key in self.unique_keys:
            val = row.get(key)
            if val in self.unique_indexes[key]:
                raise ValueError(f"Duplicate unique key '{key}'='{val}'")

    def insert(self, row):
        # Auto increment PK
        if self.primary_key and self.columns[self.primary_key] == 'int' and self.primary_key not in row:
            row[self.primary_key] = self.auto_increment
            self.auto_increment += 1

        # Validate row
        self._validate_row(row)

        # Add to rows
        self.rows.append(deepcopy(row))

        # Update indexes
        if self.primary_key:
            self.pk_index[row[self.primary_key]] = row
        for key in self.unique_keys:
            self.unique_indexes[key][row[key]] = row

    def select(self, columns=None, where=None):
        result = []
        for row in self.rows:
            if where is None or where(row):
                if columns:
                    result.append({col: row[col] for col in columns})
                else:
                    result.append(deepcopy(row))
        return result

    def update(self, updates, where=None):
        count = 0
        for row in self.rows:
            if where is None or where(row):
                for col, val in updates.items():
                    if col in self.unique_keys:
                        old_val = row[col]
                        del self.unique_indexes[col][old_val]
                        self.unique_indexes[col][val] = row
                    row[col] = val
                count += 1
        return count

    def delete(self, where=None):
        to_delete = [row for row in self.rows if where is None or where(row)]
        count = len(to_delete)
        for row in to_delete:
            self.rows.remove(row)
            if self.primary_key:
                del self.pk_index[row[self.primary_key]]
            for key in self.unique_keys:
                del self.unique_indexes[key][row[key]]
        return count


class Database:
    def __init__(self):
        self.tables = {}

        # --- Define prefilled schema here ---
        self.create_table(
            "inventory",
            columns={
                "id": "int",
                "name": "str",
                "total": "int",
                "available": "int",
                "rented": "int",
                "status": "str"
            },
            primary_key="id",
            unique_keys=["name"]
        )

        self.create_table(
            "members",
            columns={
                "id": "int",
                "name": "str",
                "phone": "str",
                "national_id": "str",
                "date_joined": "date"
            },
            primary_key="id",
            unique_keys=["national_id"]
        )

        self.create_table(
            "rentals",
            columns={
                "id": "int",
                "member_id": "int",
                "item_id": "int",
                "qty": "int",
                "available_qty": "int",
                "date_out": "date",
                "payment": "int"
            },
            primary_key="id"
        )
        # --- End schema ---

        # Load saved DB data
        saved = storage.load_db(existing_tables=self.tables)
        for tname, rows in saved.items():
            if tname in self.tables:
                table = self.tables[tname]
                table.rows = rows
                # update auto_increment
                if table.primary_key and table.columns[table.primary_key] == "int":
                    max_id = max([r[table.primary_key] for r in rows], default=0)
                    table.auto_increment = max_id + 1

    # CRUD operations
    def create_table(self, name, columns, primary_key=None, unique_keys=None, foreign_keys=None):
        if name in self.tables:
            raise ValueError(f"Table '{name}' already exists")
        self.tables[name] = Table(name, columns, primary_key, unique_keys, foreign_keys)

    def insert(self, table_name, row):
        if table_name not in self.tables:
            raise ValueError(f"Table '{table_name}' does not exist")
        self.tables[table_name].insert(row)
        storage.save_db(self.tables)

    def select(self, table_name, columns=None, where=None):
        if table_name not in self.tables:
            raise ValueError(f"Table '{table_name}' does not exist")
        return self.tables[table_name].select(columns, where)

    def update(self, table_name, updates, where=None):
        if table_name not in self.tables:
            raise ValueError(f"Table '{table_name}' does not exist")
        count = self.tables[table_name].update(updates, where)
        storage.save_db(self.tables)
        return count

    def delete(self, table_name, where=None):
        if table_name not in self.tables:
            raise ValueError(f"Table '{table_name}' does not exist")
        count = self.tables[table_name].delete(where)
        storage.save_db(self.tables)
        return count

    # Simple inner join
    def join(self, left_table_name, right_table_name, left_col, right_col, columns=None):
        if left_table_name not in self.tables or right_table_name not in self.tables:
            raise ValueError("One of the tables does not exist")
        left_rows = self.tables[left_table_name].rows
        right_rows = self.tables[right_table_name].rows
        result = []
        for l in left_rows:
            for r in right_rows:
                if l[left_col] == r[right_col]:
                    if columns:
                        res_row = {}
                        for t, c in columns:
                            res_row[f"{t}.{c}"] = (l if t==left_table_name else r)[c]
                        result.append(res_row)
                    else:
                        merged = deepcopy(l)
                        merged.update(r)
                        result.append(merged)
        return result
