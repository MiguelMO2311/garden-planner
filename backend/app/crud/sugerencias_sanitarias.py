# app/crud/sugerencias_sanitarias.py

from sqlalchemy.orm import Session
from typing import List

from app.services.sugerencias_sanitarias import generar_sugerencias
from app.schemas.sugerencia_sanitaria_schema import SugerenciaSanitariaRead


class SugerenciasSanitariasCRUD:

    def generar_para_cultivo_parcela(
        self, db: Session, cultivo_parcela_id: int
    ) -> List[SugerenciaSanitariaRead]:
        """
        Llama al servicio que genera sugerencias sanitarias dinámicamente.
        """
        return generar_sugerencias(db, cultivo_parcela_id)


sugerencias_sanitarias_crud = SugerenciasSanitariasCRUD()
