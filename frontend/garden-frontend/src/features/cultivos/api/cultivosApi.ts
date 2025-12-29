import api from "../../../api/axios";
import type { Cultivo, CultivoCreate, CultivoUpdate } from "../types";

export const getCultivos = () => api.get<Cultivo[]>("/cultivos");

export const getCultivo = (id: number) =>
    api.get<Cultivo>(`/cultivos/${id}`);

export const createCultivo = (data: CultivoCreate) =>
    api.post("/cultivos", data);

export const updateCultivo = (id: number, data: CultivoUpdate) =>
    api.put(`/cultivos/${id}`, data);

export const deleteCultivo = (id: number) =>
    api.delete(`/cultivos/${id}`);
