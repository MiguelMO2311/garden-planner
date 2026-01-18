import api from "../../../api/axios";
import { getPanelSanitario } from "./panelSanitarioApi";
import type { TratamientoAplicado } from "../types";

/* =========================================================
   TRATAMIENTOS APLICADOS POR CULTIVO_PARCELA (API REAL)
   ========================================================= */
export const getTratamientosAplicados = async (cultivoParcelaId: number) => {
  const res = await api.get(
    `/tratamientos_aplicados?cultivo_parcela_id=${cultivoParcelaId}`
  );
  return res.data;
};

export const aplicarTratamiento = async (payload: {
  tratamiento_id: number;
  cultivo_parcela_id: number;
  fecha_inicio?: string;
  observaciones?: string;
}) => {
  const res = await api.post(`/tratamientos_aplicados`, payload);
  return res.data;
};

export const finalizarTratamiento = async (id: number) => {
  const res = await api.post(`/tratamientos_aplicados/${id}/finalizar`);
  return res.data;
};

/* =========================================================
   TRATAMIENTOS APLICADOS GLOBALES (para /sanitario/tratamientos)
   ========================================================= */
export const getTratamientosAplicadosGlobal = async (): Promise<TratamientoAplicado[]> => {
  // 1. Obtener el panel sanitario (todas las parcelas y cultivos)
  const panel = await getPanelSanitario();

  // 2. Extraer todos los cultivo_parcela_id
  const ids = panel.map((p) => p.cultivo_parcela_id);

  // 3. Llamar a la API real por cada uno
  const results = await Promise.all(
    ids.map((id) =>
      api.get(`/tratamientos_aplicados?cultivo_parcela_id=${id}`)
    )
  );

  // 4. Unificar resultados
  return results.flatMap((r) => r.data);
};
