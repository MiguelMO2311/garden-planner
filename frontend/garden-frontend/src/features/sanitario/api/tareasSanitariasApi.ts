// src/features/sanitario/api/tareasSanitariasApi.ts
import api from "../../../api/axios";
import { getPanelSanitario } from "./panelSanitarioApi";
import type { TareaSanitaria } from "../types";

/* =========================================================
   TAREAS SANITARIAS POR CULTIVO
   ========================================================= */
export const getTareasSanitarias = async (
  cultivoParcelaId: number
): Promise<TareaSanitaria[]> => {
  const res = await api.get("/tareas", {
    params: {
      cultivo_parcela_id: cultivoParcelaId,
      origen: "sanitario",
    },
  });
  return res.data;
};

export const completarTareaSanitaria = async (id: number) => {
  const res = await api.post(`/tareas/${id}/completar`);
  return res.data;
};

/* =========================================================
   TAREAS SANITARIAS GLOBALES
   ========================================================= */
export const getTareasSanitariasGlobal = async (): Promise<TareaSanitaria[]> => {
  const panel = await getPanelSanitario();

  const ids = [...new Set(panel.map((p) => p.cultivo_parcela_id))];

  if (ids.length === 0) return [];

  const results = await Promise.all(
    ids.map(async (id) => {
      try {
        const res = await api.get("/tareas", {
          params: {
            cultivo_parcela_id: id,
            origen: "sanitario",
          },
        });
        return res.data as TareaSanitaria[];
      } catch (err) {
        console.error(`Error cargando tareas sanitarias para cultivo ${id}:`, err);
        return [];
      }
    })
  );

  return results.flat();
};
