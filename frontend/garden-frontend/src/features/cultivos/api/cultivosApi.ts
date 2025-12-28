import api from "../../../api/axios";
import type { Cultivo } from "../types";

export const getCultivos = () => api.get<Cultivo[]>("/cultivos/");

export const getCultivo = (id: number) => api.get<Cultivo>(`/cultivos/${id}`);

export const createCultivo = (data: Cultivo) => api.post("/cultivos/", data);

export const updateCultivo = (id: number, data: Cultivo) =>
    api.put(`/cultivos/${id}`, data);

export const deleteCultivo = (id: number) => api.delete(`/cultivos/${id}`);
