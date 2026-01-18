import api from "../../../api/axios";
import { getPanelSanitario } from "./panelSanitarioApi";
import type { AlertaSanitaria } from "../types";

export const getAlertasSanitarias = async (cultivoParcelaId: number) => {
  const res = await api.get(
    `/alertas_sanitarias/por_cultivo?cultivo_parcela_id=${cultivoParcelaId}`
  );
  return res.data;
};

export const confirmarAlerta = async (id: number) => {
  const res = await api.post(`/alertas_sanitarias/${id}/confirmar`);
  return res.data;
};

export const descartarAlerta = async (id: number) => {
  const res = await api.post(`/alertas_sanitarias/${id}/descartar`);
  return res.data;
};

/* =========================================================
   ALERTAS GLOBALES (para la página /sanitario/alertas)
   ========================================================= */
export const getAlertasSanitariasGlobal = async (): Promise<AlertaSanitaria[]> => {
  const panel = await getPanelSanitario();
  const ids = panel.map((p) => p.cultivo_parcela_id);

  const results = await Promise.all(
    ids.map((id) =>
      api.get(`/alertas_sanitarias/por_cultivo?cultivo_parcela_id=${id}`)
    )
  );

  return results.flatMap((r) => r.data);
};
