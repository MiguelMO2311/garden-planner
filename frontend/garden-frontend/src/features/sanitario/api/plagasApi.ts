// src/features/sanitario/api/plagasApi.ts

import api from "../../../api/axios";
import type { Plaga } from "../types";

export const getPlagas = async (parcelaId: number): Promise<Plaga[]> => {
  const res = await api.get(`/plagas/parcela/${parcelaId}`);
  return res.data;
};
