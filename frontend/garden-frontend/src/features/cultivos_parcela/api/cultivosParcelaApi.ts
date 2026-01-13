// src/features/cultivos_parcela/api/cultivosParcelaApi.ts

import api from "../../../api/axios";
import type {
    CultivoParcela,
    CultivoParcelaCreate,
    CultivoParcelaUpdate
} from "../types";

// Normalizador de datos crudos del backend
type RawCultivoParcela = {
    [key: string]: unknown;
    fecha_cosecha?: string | null;
    plagas_detectadas?: unknown;
    enfermedades_detectadas?: unknown;
    tratamientos?: unknown;
};

const normalizeCultivoParcela = (c: RawCultivoParcela): CultivoParcela => {
    return {
        ...c,

        // Arrays reales
        plagas_detectadas:
            Array.isArray(c.plagas_detectadas)
                ? c.plagas_detectadas
                : typeof c.plagas_detectadas === "string"
                    ? JSON.parse(c.plagas_detectadas || "[]")
                    : [],

        enfermedades_detectadas:
            Array.isArray(c.enfermedades_detectadas)
                ? c.enfermedades_detectadas
                : typeof c.enfermedades_detectadas === "string"
                    ? JSON.parse(c.enfermedades_detectadas || "[]")
                    : [],

        // Tratamientos (preparado para futuro)
        tratamientos:
            Array.isArray(c.tratamientos)
                ? c.tratamientos
                : typeof c.tratamientos === "string"
                    ? JSON.parse(c.tratamientos || "[]")
                    : [],

        // Campo calculado por backend
        fecha_cosecha: typeof c.fecha_cosecha === "string" ? c.fecha_cosecha : null
    } as CultivoParcela;
};

// ---------------------------------------------------------
// GET ALL
// ---------------------------------------------------------
export const getCultivosParcela = async (parcelaId?: number) => {
    const res = await api.get<unknown[]>("/cultivo-parcela/", {
        params: parcelaId ? { parcela_id: parcelaId } : {},
    });

    return (res.data as RawCultivoParcela[]).map(normalizeCultivoParcela);
};

// ---------------------------------------------------------
// GET BY ID
// ---------------------------------------------------------
export const getCultivoParcela = async (id: number) => {
    const res = await api.get<unknown>(`/cultivo-parcela/${id}/`);
    return normalizeCultivoParcela(res.data as RawCultivoParcela);
};

// ---------------------------------------------------------
// CREATE
// ---------------------------------------------------------
export const createCultivoParcela = async (data: CultivoParcelaCreate) => {
    const payload = {
        ...data,
        plagas_detectadas: JSON.stringify(
            Array.isArray(data.plagas_detectadas) ? data.plagas_detectadas : []
        ),
        enfermedades_detectadas: JSON.stringify(
            Array.isArray(data.enfermedades_detectadas) ? data.enfermedades_detectadas : []
        ),
        tratamientos: JSON.stringify(
            Array.isArray(data.tratamientos) ? data.tratamientos : []
        ),
    };

    const res = await api.post("/cultivo-parcela/", payload);
    return normalizeCultivoParcela(res.data as RawCultivoParcela);
};

// ---------------------------------------------------------
// UPDATE
// ---------------------------------------------------------
export const updateCultivoParcela = async (
    id: number,
    data: CultivoParcelaUpdate
) => {
    const payload = {
        ...data,
        plagas_detectadas: JSON.stringify(
            Array.isArray(data.plagas_detectadas) ? data.plagas_detectadas : []
        ),
        enfermedades_detectadas: JSON.stringify(
            Array.isArray(data.enfermedades_detectadas) ? data.enfermedades_detectadas : []
        ),
        tratamientos: JSON.stringify(
            Array.isArray(data.tratamientos) ? data.tratamientos : []
        ),
    };

    const res = await api.put(`/cultivo-parcela/${id}/`, payload);
    return normalizeCultivoParcela(res.data as RawCultivoParcela);
};

// ---------------------------------------------------------
// DELETE
// ---------------------------------------------------------
export const deleteCultivoParcela = (id: number) =>
    api.delete(`/cultivo-parcela/${id}/`);
