// src/features/sanitario/api/plagasApi.ts

import api from "../../../api/axios";
import type { Plaga, PlagaDetectada } from "../types";

//
// CATÁLOGO DE PLAGAS
//
export const getPlagasCatalogo = async (): Promise<Plaga[]> => {
  const res = await api.get(`/plagas`);
  return res.data;
};

//
// PLAGAS DETECTADAS EN PARCELA
//
export const getPlagasDetectadas = async (
  parcelaId: number
): Promise<PlagaDetectada[]> => {
  const res = await api.get(`/plagas/parcela/${parcelaId}`);
  return res.data;
};
