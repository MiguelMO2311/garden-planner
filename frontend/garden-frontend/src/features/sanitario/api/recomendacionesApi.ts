import api from "../../../api/axios";
import { getPanelSanitario } from "./panelSanitarioApi";
import type { Recomendacion } from "../types";

/* =========================================================
   RECOMENDACIONES POR CULTIVO
   ========================================================= */
export const getRecomendaciones = async (
  cultivoParcelaId: number
): Promise<Recomendacion[]> => {
  const res = await api.get("/recomendaciones/por_cultivo", {
    params: { cultivo_parcela_id: cultivoParcelaId },
  });
  return res.data;
};

/* =========================================================
   ACCIONES SOBRE RECOMENDACIONES
   ========================================================= */
export const activarRecomendacion = async (id: number) => {
  const res = await api.post(`/recomendaciones/${id}/activar`);
  return res.data;
};

export const realizarRecomendacion = async (id: number) => {
  const res = await api.post(`/recomendaciones/${id}/realizada`);
  return res.data;
};

export const descartarRecomendacion = async (id: number) => {
  const res = await api.post(`/recomendaciones/${id}/descartar`);
  return res.data;
};

/* =========================================================
   RECOMENDACIONES GLOBALES (TODOS LOS CULTIVOS ACTIVOS)
   ========================================================= */
export const getRecomendacionesGlobal = async (): Promise<Recomendacion[]> => {
  // 1. Obtener panel sanitario
  const panel = await getPanelSanitario();

  // 2. IDs únicos de cultivo_parcela
  const ids = [...new Set(panel.map((p) => p.cultivo_parcela_id))];

  if (ids.length === 0) return [];

  // 3. Llamar a la API por cada cultivo
  const results = await Promise.all(
    ids.map(async (id) => {
      try {
        const res = await api.get("/recomendaciones/por_cultivo", {
          params: { cultivo_parcela_id: id },
        });
        return res.data as Recomendacion[];
      } catch (err) {
        console.error(`Error cargando recomendaciones para cultivo ${id}:`, err);
        return [];
      }
    })
  );

  // 4. Unificar resultados
  return results.flat();
};
