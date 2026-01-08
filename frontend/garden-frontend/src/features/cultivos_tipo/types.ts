// src/features/cultivos_tipo/types.ts

export interface CultivoTipo {
    id: number;
    nombre: string;
    temporada_optima: string | null;
    dias_crecimiento: number | null;
    litros_agua_semana: number | null;
    notas: string | null;
}

export type CultivoTipoCreate = {
    nombre: string;
    temporada_optima?: string | null;
    dias_crecimiento?: number | null;
    litros_agua_semana?: number | null;
    notas?: string | null;
};

export type CultivoTipoUpdate = Partial<CultivoTipoCreate>;
