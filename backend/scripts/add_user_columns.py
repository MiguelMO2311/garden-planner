from app.core.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE users ADD COLUMN name VARCHAR"))
    except Exception as e:
        print("name ya existe:", e)

    try:
        conn.execute(text("ALTER TABLE users ADD COLUMN avatar VARCHAR"))
    except Exception as e:
        print("avatar ya existe:", e)

print("Columnas añadidas correctamente")
