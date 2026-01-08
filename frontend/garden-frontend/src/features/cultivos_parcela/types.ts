// src/features/cultivos_parcela/types.ts

export interface CultivoParcela {
    id: number;
    cultivo_tipo_id: number;
    parcela_id: number;
    fecha_siembra: string | null;
    fecha_cosecha: string | null;
    estado: "activo" | "cosechado" | "muerto";
}

export type CultivoParcelaCreate = {
    cultivo_tipo_id: number;
    parcela_id: number;
    fecha_siembra?: string | null;
    fecha_cosecha?: string | null;
    estado?: "activo" | "cosechado" | "muerto";
};

export type CultivoParcelaUpdate = Partial<CultivoParcelaCreate>;
