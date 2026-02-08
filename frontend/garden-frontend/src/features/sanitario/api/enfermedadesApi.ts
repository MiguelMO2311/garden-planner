// src/features/sanitario/api/enfermedadesApi.ts
import api from "../../../api/axios";
import type { Enfermedad, EnfermedadDetectada } from "../types";
import { getPanelSanitario } from "./panelSanitarioApi";

/* =========================================================
   CATÁLOGO DE ENFERMEDADES
   ========================================================= */
export const getEnfermedadesCatalogo = async (): Promise<Enfermedad[]> => {
  const res = await api.get("/enfermedades");
  return res.data;
};

/* =========================================================
   ENFERMEDADES DETECTADAS POR PARCELA
   ========================================================= */
export const getEnfermedadesDetectadas = async (
  parcelaId: number
): Promise<EnfermedadDetectada[]> => {
  const res = await api.get(`/enfermedades/parcela/${parcelaId}`);
  return res.data;
};

/* =========================================================
   ENFERMEDADES DETECTADAS GLOBALES
   ========================================================= */
export const getEnfermedadesDetectadasGlobal = async (): Promise<EnfermedadDetectada[]> => {
  const panel = await getPanelSanitario();

  const ids = [...new Set(panel.map((p) => p.parcela_id))];

  if (ids.length === 0) return [];

  const results = await Promise.all(
    ids.map(async (id) => {
      try {
        const res = await api.get(`/enfermedades/parcela/${id}`);
        return res.data as EnfermedadDetectada[];
      } catch (err) {
        console.error(`Error cargando enfermedades para parcela ${id}:`, err);
        return [];
      }
    })
  );

  return results.flat();
};
