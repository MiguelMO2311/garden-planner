// src/features/cultivos_tipo/types.ts

export interface CultivoTipo {
    id: number;

    nombre: string;
    nombre_latin: string | null;
    variedad: string | null;

    tipo: string | null;
    temporada_optima: string | null;
    dias_crecimiento: number | null;
    litros_agua_semana: number | null;

    fase_lunar: string | null;

    plagas: string[];
    enfermedades: string[];

    plazo_seguridad: number | null;
    frecuencia_tratamiento: number | null;
    temperatura_minima: number | null;
    temperatura_optima: number | null;
    exigencia_hidrica: string | null;
    exigencia_nutrientes: string | null;

    notas: string | null;

    user_id: number;
}

export interface CultivoTipoCreate {
    nombre: string;
    nombre_latin?: string | null;
    variedad?: string | null;

    tipo?: string | null;
    temporada_optima?: string | null;
    dias_crecimiento?: number | null;
    litros_agua_semana?: number | null;

    fase_lunar?: string | null;

    plagas: string[];
    enfermedades: string[];

    plazo_seguridad?: number | null;
    frecuencia_tratamiento?: number | null;
    temperatura_minima?: number | null;
    temperatura_optima?: number | null;
    exigencia_hidrica?: string | null;
    exigencia_nutrientes?: string | null;

    notas?: string | null;
}

export type CultivoTipoUpdate = Partial<CultivoTipoCreate>;
