// src/features/sanitario/api/plagasApi.ts
import api from "../../../api/axios";
import type { Plaga, PlagaDetectada } from "../types";

/* =========================================================
   CATÁLOGO DE PLAGAS
   ========================================================= */
export const getPlagasCatalogo = async (): Promise<Plaga[]> => {
  const res = await api.get("/plagas");
  return res.data;
};

/* =========================================================
   PLAGAS DETECTADAS POR PARCELA
   ========================================================= */
export const getPlagasDetectadas = async (
  parcelaId: number
): Promise<PlagaDetectada[]> => {
  try {
    const res = await api.get(`/plagas/parcela/${parcelaId}`);
    return res.data;
  } catch (err) {
    console.error(`Error cargando plagas para parcela ${parcelaId}:`, err);
    return [];
  }
};
