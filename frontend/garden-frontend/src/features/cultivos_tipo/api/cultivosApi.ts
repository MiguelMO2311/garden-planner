// src/features/cultivos_tipo/api/cultivosTipoApi.ts

import api from "../../../api/axios";
import type { CultivoTipo, CultivoTipoCreate, CultivoTipoUpdate } from "../types";

export const getCultivosTipo = () =>
    api.get<CultivoTipo[]>("/cultivo-tipo");

export const getCultivoTipo = (id: number) =>
    api.get<CultivoTipo>(`/cultivo-tipo/${id}`);

export const createCultivoTipo = (data: CultivoTipoCreate) =>
    api.post("/cultivo-tipo", data);

export const updateCultivoTipo = (id: number, data: CultivoTipoUpdate) =>
    api.put(`/cultivo-tipo/${id}`, data);

export const deleteCultivoTipo = (id: number) =>
    api.delete(`/cultivo-tipo/${id}`);
