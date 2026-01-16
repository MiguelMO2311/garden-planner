// src/features/sanitario/api/alertasSanitariasApi.ts
import api from "../../../api/axios";
import type { AlertaSanitaria } from "../types";

export const getAlertasSanitarias = async (
  parcelaId: number
): Promise<AlertaSanitaria[]> => {
  const res = await api.get(`/alertas-sanitarias/parcela/${parcelaId}`);
  return res.data;
};

