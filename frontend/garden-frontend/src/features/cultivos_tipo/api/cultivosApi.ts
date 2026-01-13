// src/features/cultivos_tipo/api/cultivosApi.ts

import api from "../../../api/axios";
import type {
    CultivoTipo,
    CultivoTipoCreate,
    CultivoTipoUpdate
} from "../types";

// Tipo seguro para datos crudos del backend
type RawCultivo = Record<string, unknown>;

// Normalizador: convierte JSON → arrays y devuelve CultivoTipo
const normalizeCultivo = (c: RawCultivo): CultivoTipo => {
    return {
        ...c,
        plagas: c.plagas ? JSON.parse(c.plagas as string) : [],
        enfermedades: c.enfermedades ? JSON.parse(c.enfermedades as string) : []
    } as CultivoTipo;
};

// ---------------------------------------------------------
// GET ALL
// ---------------------------------------------------------
export const getCultivosTipo = async (): Promise<CultivoTipo[]> => {
    const res = await api.get<unknown[]>("/cultivo-tipo");
    const raw = res.data as RawCultivo[];
    return raw.map(normalizeCultivo);
};

// ---------------------------------------------------------
// GET BY ID
// ---------------------------------------------------------
export const getCultivoTipo = async (id: number): Promise<CultivoTipo> => {
    const res = await api.get<unknown>(`/cultivo-tipo/${id}`);
    return normalizeCultivo(res.data as RawCultivo);
};

// ---------------------------------------------------------
// CREATE
// ---------------------------------------------------------
export const createCultivoTipo = async (
    data: CultivoTipoCreate
): Promise<CultivoTipo> => {
    const payload = {
        ...data,
        plagas: JSON.stringify(data.plagas || []),
        enfermedades: JSON.stringify(data.enfermedades || [])
    };

    const res = await api.post("/cultivo-tipo", payload);
    return normalizeCultivo(res.data as RawCultivo);
};

// ---------------------------------------------------------
// UPDATE
// ---------------------------------------------------------
export const updateCultivoTipo = async (
    id: number,
    data: CultivoTipoUpdate
): Promise<CultivoTipo> => {
    const payload = {
        ...data,
        plagas: JSON.stringify(data.plagas || []),
        enfermedades: JSON.stringify(data.enfermedades || [])
    };

    const res = await api.put(`/cultivo-tipo/${id}`, payload);
    return normalizeCultivo(res.data as RawCultivo);
};

// ---------------------------------------------------------
// DELETE
// ---------------------------------------------------------
export const deleteCultivoTipo = (id: number) =>
    api.delete(`/cultivo-tipo/${id}`);
