// src/features/sanitario/api/eventosSanitariosApi.ts
import api from "../../../api/axios";
import type { EventoSanitario } from "../types";
import { getPanelSanitario } from "./panelSanitarioApi";

/* =========================================================
   EVENTOS SANITARIOS POR PARCELA (API REAL)
   ========================================================= */
export const getEventosSanitarios = async (
  parcelaId: number
): Promise<EventoSanitario[]> => {
  const res = await api.get(`/eventos-sanitarios/parcela/${parcelaId}`);
  return res.data;
};

export const crearEventoSanitario = async (payload: {
  cultivo_parcela_id: number;
  riesgo: string;
  probabilidad: number;
  objetivo: string;
  notas?: string;
}) => {
  const res = await api.post("/eventos-sanitarios", payload);
  return res.data;
};

export const resolverEvento = async (id: number) => {
  const res = await api.post(`/eventos_sanitarios/${id}/resolver`);
  return res.data;
};

/* =========================================================
   EVENTOS SANITARIOS GLOBALES (para /sanitario/eventos)
   ========================================================= */
export const getEventosSanitariosGlobal = async (): Promise<EventoSanitario[]> => {
  // 1. Obtener el panel sanitario
  const panel = await getPanelSanitario();

  // 2. Extraer todos los parcela_id
  const ids = panel.map((p) => p.parcela_id);

  // 3. Llamar a la API real por cada parcela
  const results = await Promise.all(
    ids.map((id) => api.get(`/eventos-sanitarios/parcela/${id}`))
  );

  // 4. Unificar resultados
  return results.flatMap((r) => r.data);
};
