import os
import sys
import sqlite3

import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer

DB_FILE     = "Clean.db"
MODEL_NAME  = "all-MiniLM-L6-v2"
SYSTEM_TABLE = "sqlite_sequence"

# Database helpers
def _get_table_names(db_path: str) -> list[str]:
    conn = sqlite3.connect(db_path)
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        return [row[0] for row in cursor.fetchall() if row[0] != SYSTEM_TABLE]
    finally:
        conn.close()

def _load_table(db_path: str, table: str) -> pd.DataFrame:
    conn = sqlite3.connect(db_path)
    try:
        return pd.read_sql_query(f'SELECT * FROM "{table}"', conn)
    finally:
        conn.close()

# Text preparation
def _row_to_text(table: str, row: pd.Series) -> str:
    """
    Prefix each row with its table name so the embedding captures cross-table context
    when multiple tables are searched together in a single vector index.
    """
    fields = " | ".join(f"{col}: {val}" for col, val in row.items() if val is not None)
    return f"Table {table} | {fields}"

def _build_text_corpus(df: pd.DataFrame, table: str) -> list[str]:
    return [_row_to_text(table, row) for _, row in df.iterrows()]

# Output
def _save_embeddings(table: str, embeddings: np.ndarray, df: pd.DataFrame) -> None:
    np.save(f"embedded_{table}.npy", embeddings)
    df.to_csv(f"reference_{table}.csv", index=False)

# Embedder
class DatabaseEmbedder:
    def __init__(self, db_path: str, model_name: str = MODEL_NAME) -> None:
        if not os.path.exists(db_path):
            print(f"Database file not found: '{db_path}'")
            sys.exit(1)

        self.db_path = db_path
        print(f"Loading embedding model ({model_name})...")
        self.model = SentenceTransformer(model_name)

    def _embed_table(self, table: str) -> None:
        print(f"\nProcessing table: {table}")

        df = _load_table(self.db_path, table)
        if df.empty:
            print(f"  Skipping '{table}' — table is empty.")
            return

        corpus     = _build_text_corpus(df, table)
        print(f"  Generating embeddings for {len(corpus)} rows...")
        embeddings = self.model.encode(corpus, show_progress_bar=True)

        _save_embeddings(table, embeddings, df)
        print(f"  Saved: embedded_{table}.npy, reference_{table}.csv")

    def process_database(self) -> None:
        tables = _get_table_names(self.db_path)
        print(f"Found {len(tables)} tables: {', '.join(tables)}")

        for table in tables:
            self._embed_table(table)

# Entry point
if __name__ == "__main__":
    embedder = DatabaseEmbedder(DB_FILE)
    embedder.process_database()
    print("\nAll tables embedded successfully.")