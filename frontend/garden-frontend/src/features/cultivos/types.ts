// src/features/cultivos/types.ts
export interface Cultivo {
    id: number;
    nombre: string;
    temporada_optima: string | null;
    dias_crecimiento: number | null;
    litros_agua_semana: number | null;
    notas: string | null;
    plot_id: number;
    user_id: number;
}

export type CultivoCreate = {
    nombre: string;
    temporada_optima: string;
    dias_crecimiento: number | null;
    litros_agua_semana: number | null;
    notas: string;
    plot_id: number;
};

export type CultivoUpdate = Partial<CultivoCreate>;
