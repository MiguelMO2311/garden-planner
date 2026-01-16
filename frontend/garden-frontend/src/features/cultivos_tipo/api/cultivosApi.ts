// src/features/cultivos_tipo/api/cultivosApi.ts

import api from "../../../api/axios";
import type {
    CultivoTipo,
    CultivoTipoCreate,
    CultivoTipoUpdate
} from "../types";

// Tipo seguro para datos crudos del backend
type RawCultivo = {
    id: number;
    nombre: string;
    nombre_latin: string | null;
    variedad: string | null;
    tipo: string | null;
    temporada_optima: string | null;
    dias_crecimiento: number | null;
    litros_agua_semana: number | null;
    fase_lunar: string | null;
    plagas: string[] | string | null;
    enfermedades: string[] | string | null;
    plazo_seguridad: number | null;
    frecuencia_tratamiento: number | null;
    temperatura_minima: number | null;
    temperatura_optima: number | null;
    exigencia_hidrica: string | null;
    exigencia_nutrientes: string | null;
    notas: string | null;
    user_id: number;
};

// Normalizador: asegura que plagas/enfermedades sean arrays
const normalizeCultivo = (c: RawCultivo): CultivoTipo => {
    return {
        ...c,
        plagas: Array.isArray(c.plagas)
            ? c.plagas
            : typeof c.plagas === "string"
                ? c.plagas.split(",").map(p => p.trim())
                : [],
        enfermedades: Array.isArray(c.enfermedades)
            ? c.enfermedades
            : typeof c.enfermedades === "string"
                ? c.enfermedades.split(",").map(e => e.trim())
                : []
    };
};

// ---------------------------------------------------------
// GET ALL
// ---------------------------------------------------------
export const getCultivosTipo = async (): Promise<CultivoTipo[]> => {
    const res = await api.get<RawCultivo[]>("/cultivo-tipo");
    return res.data.map(normalizeCultivo);
};

// ---------------------------------------------------------
// GET BY ID
// ---------------------------------------------------------
export const getCultivoTipo = async (id: number): Promise<CultivoTipo> => {
    const res = await api.get<RawCultivo>(`/cultivo-tipo/${id}`);
    return normalizeCultivo(res.data);
};

// ---------------------------------------------------------
// CREATE
// ---------------------------------------------------------
export const createCultivoTipo = async (
    data: CultivoTipoCreate
): Promise<CultivoTipo> => {
    const payload = {
        ...data,
        plagas: data.plagas || [],
        enfermedades: data.enfermedades || []
    };

    const res = await api.post<RawCultivo>("/cultivo-tipo", payload);
    return normalizeCultivo(res.data);
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
        plagas: data.plagas || [],
        enfermedades: data.enfermedades || []
    };

    const res = await api.put<RawCultivo>(`/cultivo-tipo/${id}`, payload);
    return normalizeCultivo(res.data);
};

// ---------------------------------------------------------
// DELETE
// ---------------------------------------------------------
export const deleteCultivoTipo = (id: number) =>
    api.delete(`/cultivo-tipo/${id}`);


// ---------------------------------------------------------
// NUEVO: GET PLAGAS
// ---------------------------------------------------------
export const getPlagas = async (): Promise<{ id: number; nombre: string }[]> => {
    const res = await api.get("/plagas");

    // Normalizamos por si el backend devuelve strings o arrays
    return res.data.map((p: any, index: number) => ({
        id: p.id ?? index,
        nombre: typeof p === "string" ? p : p.nombre
    }));
};

// ---------------------------------------------------------
// NUEVO: GET ENFERMEDADES
// ---------------------------------------------------------
export const getEnfermedades = async (): Promise<{ id: number; nombre: string }[]> => {
    const res = await api.get("/enfermedades");

    return res.data.map((e: any, index: number) => ({
        id: e.id ?? index,
        nombre: typeof e === "string" ? e : e.nombre
    }));
};
