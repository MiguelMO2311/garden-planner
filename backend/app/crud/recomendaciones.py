# app/crud/recomendaciones.py

from sqlalchemy.orm import Session
from typing import List

from app.models.recomendacion import Recomendacion


class RecomendacionesCRUD:

    def crear(self, db: Session, parcela_id: int, mensaje: str) -> Recomendacion:
        recomendacion = Recomendacion(
            parcela_id=parcela_id,
            mensaje=mensaje
        )
        db.add(recomendacion)
        db.commit()
        db.refresh(recomendacion)
        return recomendacion

    def listar_por_parcela(self, db: Session, parcela_id: int) -> List[Recomendacion]:
        return (
            db.query(Recomendacion)
            .filter(Recomendacion.parcela_id == parcela_id)
            .order_by(Recomendacion.fecha.desc())
            .all()
        )

    def listar_globales(self, db: Session) -> List[Recomendacion]:
        return (
            db.query(Recomendacion)
            .order_by(Recomendacion.fecha.desc())
            .all()
        )


recomendaciones_crud = RecomendacionesCRUD()
