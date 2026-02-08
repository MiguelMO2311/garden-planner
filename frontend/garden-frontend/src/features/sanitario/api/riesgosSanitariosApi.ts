import api from "../../../api/axios";
import type { RiesgoClimatico } from "../types";
import { getPanelSanitario } from "./panelSanitarioApi";

/* =========================================================
   RIESGOS POR CULTIVO
   ========================================================= */
export const getRiesgosClimaticos = async (
  cultivoParcelaId: number
): Promise<RiesgoClimatico[]> => {
  const res = await api.get("/riesgos_climaticos/por_cultivo", {
    params: { cultivo_parcela_id: cultivoParcelaId },
  });
  return res.data;
};

/* =========================================================
   RIESGOS GLOBALES (TODOS LOS CULTIVOS ACTIVOS DEL USUARIO)
   ========================================================= */
export const getRiesgosClimaticosGlobal = async (): Promise<RiesgoClimatico[]> => {
  // 1. Obtener panel sanitario
  const panel = await getPanelSanitario();

  // 2. Extraer IDs únicos de cultivo_parcela
  const ids = [...new Set(panel.map((p) => p.cultivo_parcela_id))];

  if (ids.length === 0) return [];

  // 3. Llamar a la API por cada cultivo
  const results = await Promise.all(
    ids.map(async (id) => {
      try {
        const res = await api.get("/riesgos_climaticos/por_cultivo", {
          params: { cultivo_parcela_id: id },
        });
        return res.data as RiesgoClimatico[];
      } catch (err) {
        console.error(`Error cargando riesgos para cultivo ${id}:`, err);
        return [];
      }
    })
  );

  // 4. Unificar resultados
  return results.flat();
};
