// src/features/cultivos_parcela/api/cultivosParcelaApi.ts

import api from "../../../api/axios";
import type {
    CultivoParcela,
    CultivoParcelaCreate,
    CultivoParcelaUpdate,
} from "../types";

export const getCultivosParcela = (parcelaId?: number) =>
    api.get<CultivoParcela[]>("/cultivo-parcela", {
        params: parcelaId ? { parcela_id: parcelaId } : {},
    });

export const getCultivoParcela = (id: number) =>
    api.get<CultivoParcela>(`/cultivo-parcela/${id}`);

export const createCultivoParcela = (data: CultivoParcelaCreate) =>
    api.post("/cultivo-parcela", data);

export const updateCultivoParcela = (id: number, data: CultivoParcelaUpdate) =>
    api.put(`/cultivo-parcela/${id}`, data);

export const deleteCultivoParcela = (id: number) =>
    api.delete(`/cultivo-parcela/${id}`);
