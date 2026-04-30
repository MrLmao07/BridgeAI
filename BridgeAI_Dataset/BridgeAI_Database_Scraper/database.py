import re
import sqlite3
import logging

from config import DB_PATH, CATEGORIES
from mapping import translate_data

log = logging.getLogger(__name__)

# Connection
def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# Schema management
def init_database() -> None:
    """Create one base table per category if they do not already exist."""
    conn = get_connection()
    try:
        for category in CATEGORIES.values():
            conn.execute(
                f"CREATE TABLE IF NOT EXISTS {category['table']} (url TEXT PRIMARY KEY)"
            )
        conn.commit()
        log.info("Database initialised: %s", DB_PATH)
    except Exception as exc:
        log.error("Failed to initialise database: %s", exc)
    finally:
        conn.close()

def _ensure_columns_exist(conn: sqlite3.Connection, table_name: str, columns: list[str]) -> None:
    """
    Add any missing columns to the table.
    ALTER TABLE raises OperationalError when the column already exists — that is expected and ignored.
    """
    for col in columns:
        try:
            conn.execute(f'ALTER TABLE {table_name} ADD COLUMN "{col}" TEXT')
            conn.commit()
        except sqlite3.OperationalError:
            pass

# Data sanitisation
def _sanitise_key(raw_key: str) -> str:
    """
    Normalise a column name to [a-z0-9_].
    Leading digits are allowed by SQLite when the identifier is quoted,
    so we preserve them here and rely on quoting at the SQL layer.
    """
    return re.sub(r"[^a-z0-9_]", "", str(raw_key).lower()).strip("_")

def _sanitise_record(data: dict) -> dict:
    return {_sanitise_key(k): str(v) for k, v in data.items()}

# SQL building
def _build_upsert_sql(table_name: str, keys: list[str]) -> str:
    columns      = ", ".join(f'"{k}"' for k in keys)
    placeholders = ", ".join(f":{k}" for k in keys)
    update_pairs = ", ".join(f'"{k}"=excluded."{k}"' for k in keys if k != "url")
    return (
        f"INSERT INTO {table_name} ({columns}) "
        f"VALUES ({placeholders}) "
        f"ON CONFLICT(url) DO UPDATE SET {update_pairs}"
    )

# Public write API
def upsert_product(table_name: str, data: dict) -> None:
    if not data or "url" not in data:
        log.warning("Invalid record — missing 'url'. Skipping.")
        return

    clean_data = _sanitise_record(translate_data(data))
    sql        = _build_upsert_sql(table_name, list(clean_data.keys()))

    conn = get_connection()
    try:
        _ensure_columns_exist(conn, table_name, list(clean_data.keys()))
        conn.execute(sql, clean_data)
        conn.commit()
    except Exception as exc:
        log.error("upsert_product failed for table '%s': %s", table_name, exc)
    finally:
        conn.close()