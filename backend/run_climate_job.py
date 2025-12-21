from app.core.database import SessionLocal
from app.services.climate_events import generar_eventos_climaticos

db = SessionLocal()
generar_eventos_climaticos(db)
db.close()
