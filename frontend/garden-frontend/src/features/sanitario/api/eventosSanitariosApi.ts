// src/features/sanitario/api/eventosSanitariosApi.ts
import api from "../../../api/axios";
import type { EventoSanitario } from "../types";
import { getPanelSanitario } from "./panelSanitarioApi";

/* =========================================================
   EVENTOS SANITARIOS POR PARCELA
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
   EVENTOS SANITARIOS GLOBALES
   ========================================================= */
export const getEventosSanitariosGlobal = async (): Promise<EventoSanitario[]> => {
  const panel = await getPanelSanitario();

  const ids = [...new Set(panel.map((p) => p.parcela_id))];

  if (ids.length === 0) return [];

  const results = await Promise.all(
    ids.map(async (id) => {
      try {
        const res = await api.get(`/eventos-sanitarios/parcela/${id}`);
        return res.data as EventoSanitario[];
      } catch (err) {
        console.error(`Error cargando eventos sanitarios para parcela ${id}:`, err);
        return [];
      }
    })
  );

  return results.flat();
};
