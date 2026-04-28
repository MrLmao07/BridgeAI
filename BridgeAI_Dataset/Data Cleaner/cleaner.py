import re
import sqlite3

import pandas as pd

# Constants
# Columns whose names contain any of these substrings must stay as plain text.
TEXT_ONLY_COLUMN_KEYWORDS = [
    "url", "product", "nume", "descrier", "model",
    "producer", "camera", "functii", "mentiuni", "cod",
]

# Digits beyond this length almost certainly indicate a malformed value.
MAX_NUMERIC_DIGIT_LENGTH = 10

# Value cleaning
def _is_text_only_column(column_name: str) -> bool:
    lower = column_name.lower()
    return any(keyword in lower for keyword in TEXT_ONLY_COLUMN_KEYWORDS)

def _parse_price(value: str) -> float | str:
    """
    Convert PCGarage price strings like "1.234,56 RON" to a float.
    The format uses '.' as thousands separator and ',' as decimal separator.
    """
    try:
        digits_only = re.sub(r"[^\d,.]", "", value)
        normalised  = digits_only.replace(".", "").replace(",", ".")
        return float(normalised)
    except ValueError:
        return value

def _parse_numeric(value: str) -> int | float | str:
    """Extract the first number from strings like '16 GB' or '6.5 ms'."""
    match = re.search(r"(\d+[.,]?\d*)", value)
    if not match:
        return value

    num_str    = match.group(1).replace(",", ".")
    digit_count = len(num_str.replace(".", ""))

    if digit_count > MAX_NUMERIC_DIGIT_LENGTH:
        return value

    try:
        num = float(num_str)
        return int(num) if num.is_integer() else num
    except ValueError:
        return value

def clean_value(value: object, column_name: str) -> object:
    """
    Coerce a raw cell value to its most appropriate Python type.
    Returns None for empty/null values, preserves text columns unchanged,
    and attempts numeric conversion for everything else.
    """
    if value is None or value == "" or pd.isna(value):
        return None

    if isinstance(value, (int, float)):
        return value

    value_str = str(value).strip()

    if _is_text_only_column(column_name):
        return value_str

    if "RON" in value_str.upper():
        return _parse_price(value_str)

    return _parse_numeric(value_str)

# Database cleaning
def _load_table_names(conn: sqlite3.Connection) -> list[str]:
    return pd.read_sql_query(
        "SELECT name FROM sqlite_master WHERE type='table'", conn
    )["name"].tolist()

def _clean_table(df: pd.DataFrame) -> pd.DataFrame:
    for col in df.columns:
        df[col] = df[col].apply(lambda val: clean_value(val, col))
    return df

def clean_database(input_db: str, output_db: str) -> None:
    """Read every table from input_db, clean all values, and write to output_db."""
    source = sqlite3.connect(input_db)
    target = sqlite3.connect(output_db)

    try:
        for table in _load_table_names(source):
            print(f"Cleaning table: {table}...")
            df = pd.read_sql_query(f"SELECT * FROM {table}", source)
            _clean_table(df).to_sql(table, target, if_exists="replace", index=False)
    finally:
        source.close()
        target.close()

    print(f"Done. Output: {output_db}")

# Entry point
if __name__ == "__main__":
    clean_database("database 1.db", "Clean.db")