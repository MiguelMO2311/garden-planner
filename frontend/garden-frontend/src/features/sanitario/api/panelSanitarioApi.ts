// src/features/sanitario/api/panelSanitarioApi.ts
import api from "../../../api/axios";
import type { ParcelaSanitariaPanelItem } from "../types";

/* =========================================================
   PANEL SANITARIO GLOBAL (cultivos activos del usuario)
   ========================================================= */
export const getPanelSanitario = async (): Promise<ParcelaSanitariaPanelItem[]> => {
  try {
    const res = await api.get("/sanitario/panel");
    return res.data;
  } catch (err) {
    console.error("Error cargando panel sanitario:", err);
    return [];
  }
};
