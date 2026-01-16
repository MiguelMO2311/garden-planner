// src/features/sanitario/api/eventosSanitariosApi.ts
import api from "../../../api/axios";
import type { EventoSanitario, CrearEventoSanitarioPayload } from "../types";

export const getEventosSanitarios = async (
  parcelaId: number
): Promise<EventoSanitario[]> => {
  const res = await api.get(`/eventos-sanitarios/parcela/${parcelaId}`);
  return res.data;
};

export const crearEventoSanitario = async (
  payload: CrearEventoSanitarioPayload
): Promise<EventoSanitario> => {
  const res = await api.post("/eventos-sanitarios", payload);
  return res.data;
};
