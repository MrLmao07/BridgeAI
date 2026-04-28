import os
import sqlite3

import numpy as np
import pandas as pd

DB_FILE            = "Clean.db"
SYSTEM_TABLE       = "sqlite_sequence"
EXPECTED_EMBEDDING_DIM = 384

# Database helpers
def _get_table_names(db_path: str) -> list[str]:
    conn = sqlite3.connect(db_path)
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        return [row[0] for row in cursor.fetchall() if row[0] != SYSTEM_TABLE]
    finally:
        conn.close()

# Per-table audit checks
def _embedding_files_exist(table: str) -> bool:
    return os.path.exists(f"embedded_{table}.npy") and os.path.exists(f"reference_{table}.csv")


def _check_row_count(vectors: np.ndarray, df: pd.DataFrame) -> None:
    n_vectors, n_rows = vectors.shape[0], len(df)
    if n_vectors == n_rows:
        print(f"  [OK] Count: {n_vectors} records fully processed.")
    else:
        print(f"  [!]  Mismatch — vectors: {n_vectors}, CSV rows: {n_rows}")

def _check_embedding_dimension(vectors: np.ndarray) -> None:
    # MiniLM-L6-v2 produces 384-dimensional vectors; any other value signals a wrong model.
    dim = vectors.shape[1]
    if dim == EXPECTED_EMBEDDING_DIM:
        print(f"  [OK] Dimension: {dim} (correct).")
    else:
        print(f"  [!]  Wrong embedding dimension: {dim} (expected {EXPECTED_EMBEDDING_DIM})")

def _audit_table(table: str) -> None:
    print(f"Table: {table}")

    if not _embedding_files_exist(table):
        print(f"  [X]  Embedding files missing for '{table}'.")
        print("-" * 30)
        return

    vectors = np.load(f"embedded_{table}.npy")
    df      = pd.read_csv(f"reference_{table}.csv")

    _check_row_count(vectors, df)
    _check_embedding_dimension(vectors)
    print("-" * 30)

# Entry point
def run_audit(db_path: str) -> None:
    """Verify that every table in db_path has complete, correctly shaped embeddings."""
    tables = _get_table_names(db_path)
    print(f"--- EMBEDDING AUDIT REPORT: {db_path} ---\n")
    for table in tables:
        _audit_table(table)


if __name__ == "__main__":
    run_audit(DB_FILE)