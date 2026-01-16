// src/features/sanitario/api/recomendacionesApi.ts
import api from "../../../api/axios";
import type { Recomendacion } from "../types";

export const getRecomendaciones = async (
  parcelaId: number
): Promise<Recomendacion[]> => {
  const res = await api.get(`/recomendaciones/parcela/${parcelaId}`);
  return res.data;
};
