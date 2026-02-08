// src/features/cultivos_parcela/types.ts

import type { CultivoTipo } from "./../cultivos_tipo/types";

export interface CultivoParcela {
    id: number;

    cultivo_tipo_id: number;
    cultivo_tipo: CultivoTipo; // 👈 AÑADIDO: el backend lo devuelve

    parcela_id: number;

    fecha_siembra: string | null;

    // Calculada automáticamente por backend (solo lectura)
    fecha_cosecha: string | null;

    fecha_muerte: string | null;

    estado: "activo" | "cosechado" | "muerto";

    // Datos reales detectados en la parcela
    plagas_detectadas: string[];
    enfermedades_detectadas: string[];

    // Preparado para el futuro (tratamientos), pero sin tipo definido aún
    tratamientos: unknown[];

    // Plazo de seguridad restante (calculado)
    plazo_seguridad_restante: number | null;

    // Riego real aplicado
    riego_aplicado_semana: number | null;

    notas: string | null;
}

export interface CultivoParcelaCreate {
    cultivo_tipo_id: number;
    parcela_id: number;

    fecha_siembra?: string | null;
    fecha_muerte?: string | null;

    estado?: "activo" | "cosechado" | "muerto";

    plagas_detectadas?: string[];
    enfermedades_detectadas?: string[];

    // Preparado para el futuro
    tratamientos?: unknown[];

    plazo_seguridad_restante?: number | null;

    riego_aplicado_semana?: number | null;

    notas?: string | null;
}

export type CultivoParcelaUpdate = Partial<CultivoParcelaCreate>;

/* ---------------------------------------------------------
   NUEVO TIPO PARA EL FORMULARIO
   --------------------------------------------------------- */

export interface CultivoParcelaFormData {
    cultivo_tipo_id: number;
    cultivo_tipo?: CultivoTipo; // 👈 NECESARIO PARA MOSTRARLO EN EDICIÓN

    parcela_id: number;

    fecha_siembra: string | null;
    fecha_muerte?: string | null;

    estado: "activo" | "cosechado" | "muerto";

    plagas_detectadas: string[];
    enfermedades_detectadas: string[];

    riego_aplicado_semana: number | null;

    notas: string | null;
}
