import csv
import os
import logging

from config import CATEGORIES
from database import get_connection

log = logging.getLogger(__name__)

CSV_OUTPUT_DIR = "output_csv"

# Helpers
def _fetch_table(table_name: str) -> tuple[list[str], list]:
    """Return (column_names, rows) for the given table."""
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(f"SELECT * FROM {table_name}")
        rows = cursor.fetchall()
        column_names = [description[0] for description in cursor.description]
        return column_names, rows
    finally:
        conn.close()

def _write_csv(output_path: str, column_names: list[str], rows: list) -> None:
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(column_names)
        writer.writerows(rows)

# Public API
def export_table_to_csv(table_name: str, output_path: str) -> None:
    try:
        column_names, rows = _fetch_table(table_name)

        if not rows:
            log.warning("Table '%s' is empty — nothing to export.", table_name)
            return

        _write_csv(output_path, column_names, rows)
        log.info("Exported: %s", output_path)
    except Exception as exc:
        log.error("Failed to export table '%s': %s", table_name, exc)


def export_all() -> None:
    """Export every category table to a CSV file under the output directory."""
    log.info("Starting CSV export for all categories...")
    for info in CATEGORIES.values():
        table_name  = info["table"]
        output_path = os.path.join(CSV_OUTPUT_DIR, f"{table_name}.csv")
        export_table_to_csv(table_name, output_path)