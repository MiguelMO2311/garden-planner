import api from "../../../api/axios";
import type { TratamientoCatalogo } from "../types";

/* =========================================================
   CATÁLOGO DE TRATAMIENTOS
   ========================================================= */
export const getTratamientos = async (): Promise<TratamientoCatalogo[]> => {
  const res = await api.get("/tratamientos");
  return res.data;
};
