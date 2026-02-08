import api from "../../../api/axios";
import { getPanelSanitario } from "./panelSanitarioApi";
import type { TratamientoAplicado } from "../types";

/* =========================================================
   TRATAMIENTOS APLICADOS POR CULTIVO
   ========================================================= */
export const getTratamientosAplicados = async (
  cultivoParcelaId: number
): Promise<TratamientoAplicado[]> => {
  const res = await api.get("/tratamientos_aplicados", {
    params: { cultivo_parcela_id: cultivoParcelaId },
  });
  return res.data;
};

/* =========================================================
   APLICAR TRATAMIENTO
   ========================================================= */
export const aplicarTratamiento = async (payload: {
  tratamiento_id: number;
  cultivo_parcela_id: number;
  fecha_inicio?: string;
  observaciones?: string;
}) => {
  const res = await api.post("/tratamientos_aplicados", payload);
  return res.data;
};

/* =========================================================
   FINALIZAR TRATAMIENTO
   ========================================================= */
export const finalizarTratamiento = async (id: number) => {
  const res = await api.post(`/tratamientos_aplicados/${id}/finalizar`);
  return res.data;
};

/* =========================================================
   TRATAMIENTOS APLICADOS GLOBALES (TODOS LOS CULTIVOS ACTIVOS)
   ========================================================= */
export const getTratamientosAplicadosGlobal = async (): Promise<TratamientoAplicado[]> => {
  // 1. Obtener panel sanitario
  const panel = await getPanelSanitario();

  // 2. IDs únicos de cultivo_parcela
  const ids = [...new Set(panel.map((p) => p.cultivo_parcela_id))];

  if (ids.length === 0) return [];

  // 3. Llamar a la API por cada cultivo
  const results = await Promise.all(
    ids.map(async (id) => {
      try {
        const res = await api.get("/tratamientos_aplicados", {
          params: { cultivo_parcela_id: id },
        });
        return res.data as TratamientoAplicado[];
      } catch (err) {
        console.error(`Error cargando tratamientos aplicados para cultivo ${id}:`, err);
        return [];
      }
    })
  );

  // 4. Unificar resultados
  return results.flat();
};
