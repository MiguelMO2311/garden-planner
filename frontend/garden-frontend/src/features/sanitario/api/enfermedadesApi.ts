// src/features/sanitario/api/enfermedadesApi.ts
import api from "../../../api/axios";
import type { Enfermedad } from "../types";

export const getEnfermedades = async (
  parcelaId: number
): Promise<Enfermedad[]> => {
  const res = await api.get(`/enfermedades/parcela/${parcelaId}`);
  return res.data;
};
