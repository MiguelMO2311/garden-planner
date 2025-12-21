import api from "../../../api/axios";
import type { Parcela, ParcelaCreateDTO } from "../types";

export const getParcelas = () => api.get<Parcela[]>("/plots");

export const getParcela = (id: number) =>
    api.get<Parcela>(`/plots/${id}`);

export const createParcela = (data: ParcelaCreateDTO) =>
    api.post<Parcela>("/plots", data);

export const updateParcela = (id: number, data: ParcelaCreateDTO) =>
    api.put<Parcela>(`/plots/${id}`, data);

export const deleteParcela = (id: number) =>
    api.delete(`/plots/${id}`);
