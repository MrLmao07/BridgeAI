import sqlite3

DB_FILE  = "Clean.db"
# the file "editor.sql" no longer exists, but the code is left here for reference as the file already achieved its purpose.
SQL_FILE = "editor.sql"


def apply_sql_script(db_file: str, sql_file: str) -> None:
    """Execute all statements from sql_file against db_file in a single transaction."""
    conn = sqlite3.connect(db_file)
    try:
        with open(sql_file, encoding="utf-8") as f:
            conn.cursor().executescript(f.read())
        conn.commit()
        print(f"Success. Commands from '{sql_file}' applied to '{db_file}'.")
    except Exception as exc:
        print(f"Error: {exc}")
    finally:
        conn.close()


if __name__ == "__main__":
    apply_sql_script(DB_FILE, SQL_FILE)