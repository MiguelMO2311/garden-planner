// src/features/sanitario/api/eventosSanitariosApi.ts
import api from "../../../api/axios";
import type { EventoSanitario } from "../types";


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
