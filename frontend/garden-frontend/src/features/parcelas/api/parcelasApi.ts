import api from "../../../api/axios";
import type { Parcela } from "../types";

export const getParcelas = () => api.get<Parcela[]>("/parcelas");

export const getParcela = (id: number) => api.get<Parcela>(`/parcelas/${id}`);

export const createParcela = (data: Parcela) => api.post("/parcelas", data);

export const updateParcela = (id: number, data: Parcela) =>
    api.put(`/parcelas/${id}`, data);

export const deleteParcela = (id: number) => api.delete(`/parcelas/${id}`);
