// src/features/sanitario/api/tratamientosApi.ts
import api from "../../../api/axios";
import type { Tratamiento, CrearTratamientoPayload } from "../types";

export const getTratamientos = async (
  parcelaId: number
): Promise<Tratamiento[]> => {
  const res = await api.get(`/tratamientos/parcela/${parcelaId}`);
  return res.data;
};

export const crearTratamiento = async (
  payload: CrearTratamientoPayload
): Promise<Tratamiento> => {
  const res = await api.post("/tratamientos", payload);
  return res.data;
};
