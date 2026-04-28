import sqlite3

DB_FILE    = "Clean.db"
TABLE_NAME = "tvs"
NULL_FILL  = -1

def _get_column_names(cursor: sqlite3.Cursor, table: str) -> list[str]:
    cursor.execute(f"PRAGMA table_info({table})")
    return [row[1] for row in cursor.fetchall()]

def _fill_nulls(cursor: sqlite3.Cursor, table: str, columns: list[str], fill_value: int) -> None:
    for col in columns:
        cursor.execute(f'UPDATE {table} SET "{col}" = ? WHERE "{col}" IS NULL', (fill_value,))

def replace_nulls_with_sentinel(db_file: str, table: str, fill_value: int) -> None:
    """Replace every NULL in the target table with a sentinel integer value."""
    conn = sqlite3.connect(db_file)
    try:
        cursor  = conn.cursor()
        columns = _get_column_names(cursor, table)
        _fill_nulls(cursor, table, columns, fill_value)
        conn.commit()
        print(f"Done. All NULLs in '{table}' replaced with {fill_value}.")
    finally:
        conn.close()

if __name__ == "__main__":
    replace_nulls_with_sentinel(DB_FILE, TABLE_NAME, NULL_FILL)