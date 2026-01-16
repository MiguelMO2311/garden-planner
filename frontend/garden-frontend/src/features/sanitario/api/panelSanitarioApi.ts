// src/features/sanitario/api/panelSanitarioApi.ts
import api from "../../../api/axios";
import type { ParcelaSanitariaPanelItem } from "../types";

export const getPanelSanitario = async (): Promise<ParcelaSanitariaPanelItem[]> => {
  const res = await api.get("/sanitario/panel");
  return res.data;
};
