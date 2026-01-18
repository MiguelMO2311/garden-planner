import api from "../../../api/axios";
import type { Recomendacion } from "../types";
import { getPanelSanitario } from "./panelSanitarioApi";

/* =========================================================
   RECOMENDACIONES POR CULTIVO (API REAL)
   ========================================================= */
export const getRecomendaciones = async (
  parcelaId: number
): Promise<Recomendacion[]> => {
  const res = await api.get(
    `/recomendaciones/por_cultivo?cultivo_parcela_id=${parcelaId}`
  );
  return res.data;
};

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
   RECOMENDACIONES GLOBALES (para /sanitario/sugerencias)
   ========================================================= */
export const getRecomendacionesGlobal = async (): Promise<Recomendacion[]> => {
  const panel = await getPanelSanitario();
  const ids = panel.map((p) => p.cultivo_parcela_id);

  const results = await Promise.all(
    ids.map((id) =>
      api.get(`/recomendaciones/por_cultivo?cultivo_parcela_id=${id}`)
    )
  );

  return results.flatMap((r) => r.data);
};
