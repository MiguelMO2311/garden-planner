import api from "../../../api/axios";
import { getPanelSanitario } from "./panelSanitarioApi";
import type { TareaSanitaria } from "../types";

/* =========================================================
   TAREAS SANITARIAS POR CULTIVO_PARCELA (API REAL)
   ========================================================= */
export const getTareasSanitarias = async (cultivoParcelaId: number) => {
  const res = await api.get(
    `/tareas?cultivo_parcela_id=${cultivoParcelaId}&origen=sanitario`
  );
  return res.data;
};

export const completarTareaSanitaria = async (id: number) => {
  const res = await api.post(`/tareas/${id}/completar`);
  return res.data;
};

/* =========================================================
   TAREAS SANITARIAS GLOBALES (para /sanitario/tareas)
   ========================================================= */
export const getTareasSanitariasGlobal = async (): Promise<TareaSanitaria[]> => {
  // 1. Obtener el panel sanitario
  const panel = await getPanelSanitario();

  // 2. Extraer todos los cultivo_parcela_id
  const ids = panel.map((p) => p.cultivo_parcela_id);

  // 3. Llamar a la API real por cada uno
  const results = await Promise.all(
    ids.map((id) =>
      api.get(`/tareas?cultivo_parcela_id=${id}&origen=sanitario`)
    )
  );

  // 4. Unificar resultados
  return results.flatMap((r) => r.data);
};
