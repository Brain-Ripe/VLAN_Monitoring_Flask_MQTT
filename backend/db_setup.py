import sqlite3

# Connect to database (creates it if it doesn't exist)
conn = sqlite3.connect("vlan_data.db")
cursor = conn.cursor()

# Create table for device metadata
cursor.execute("""
CREATE TABLE IF NOT EXISTS device_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT,
    device_type TEXT,
    location TEXT,
    message_rate INTEGER,
    vlan INTEGER
)
""")

conn.commit()
conn.close()
print("✅ SQLite database and table created.")
