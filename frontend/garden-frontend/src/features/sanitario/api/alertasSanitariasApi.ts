import api from "../../../api/axios";
import { getPanelSanitario } from "./panelSanitarioApi";
import type { AlertaSanitaria } from "../types";

/* =========================================================
   ALERTAS POR CULTIVO
   ========================================================= */
export const getAlertasSanitarias = async (
  cultivoParcelaId: number
): Promise<AlertaSanitaria[]> => {
  const res = await api.get("/alertas_sanitarias/por_cultivo", {
    params: { cultivo_parcela_id: cultivoParcelaId },
  });
  return res.data;
};

/* =========================================================
   ACCIONES SOBRE ALERTAS
   ========================================================= */
export const confirmarAlerta = async (id: number) => {
  const res = await api.post(`/alertas_sanitarias/${id}/confirmar`);
  return res.data;
};

export const descartarAlerta = async (id: number) => {
  const res = await api.post(`/alertas_sanitarias/${id}/descartar`);
  return res.data;
};

/* =========================================================
   ALERTAS GLOBALES (TODOS LOS CULTIVOS ACTIVOS DEL USUARIO)
   ========================================================= */
export const getAlertasSanitariasGlobal = async (): Promise<AlertaSanitaria[]> => {
  // 1. Obtener panel sanitario
  const panel = await getPanelSanitario();

  // 2. IDs únicos de cultivo_parcela
  const ids = [...new Set(panel.map((p) => p.cultivo_parcela_id))];

  if (ids.length === 0) return [];

  // 3. Llamar a la API por cada cultivo
  const results = await Promise.all(
    ids.map(async (id) => {
      try {
        const res = await api.get("/alertas_sanitarias/por_cultivo", {
          params: { cultivo_parcela_id: id },
        });
        return res.data as AlertaSanitaria[];
      } catch (err) {
        console.error(`Error cargando alertas sanitarias para cultivo ${id}:`, err);
        return [];
      }
    })
  );

  // 4. Unificar resultados
  return results.flat();
};
