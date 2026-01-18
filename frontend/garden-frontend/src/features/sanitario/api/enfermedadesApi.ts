// src/features/sanitario/api/enfermedadesApi.ts

import api from "../../../api/axios";
import type { Enfermedad, EnfermedadDetectada } from "../types";
import { getPanelSanitario } from "./panelSanitarioApi";

//
// CATÁLOGO DE ENFERMEDADES
//
export const getEnfermedadesCatalogo = async (): Promise<Enfermedad[]> => {
  const res = await api.get(`/enfermedades`);
  return res.data;
};

//
// ENFERMEDADES DETECTADAS EN PARCELA (API REAL)
//
export const getEnfermedadesDetectadas = async (
  parcelaId: number
): Promise<EnfermedadDetectada[]> => {
  const res = await api.get(`/enfermedades/parcela/${parcelaId}`);
  return res.data;
};

//
// ENFERMEDADES DETECTADAS GLOBALES (para /sanitario/enfermedades)
//
export const getEnfermedadesDetectadasGlobal = async (): Promise<EnfermedadDetectada[]> => {
  // 1. Obtener el panel sanitario
  const panel = await getPanelSanitario();

  // 2. Extraer todos los parcela_id
  const ids = panel.map((p) => p.parcela_id);

  // 3. Llamar a la API real por cada parcela
  const results = await Promise.all(
    ids.map((id) => api.get(`/enfermedades/parcela/${id}`))
  );

  // 4. Unificar resultados
  return results.flatMap((r) => r.data);
};
