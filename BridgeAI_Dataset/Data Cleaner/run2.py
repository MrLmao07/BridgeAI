import sqlite3

db_file = "Clean.db"
sql_file = "stergaturi.sql"

try:
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()

    with open(sql_file, 'r', encoding='utf-8') as f:
        sql_commands = f.read()

    cursor.executescript(sql_commands)
    
    conn.commit()
    print(f"✅ Succes! Comenzile din {sql_file} au fost aplicate pe {db_file}.")

except Exception as e:
    print(f"❌ Eroare: {e}")

finally:
    conn.close()