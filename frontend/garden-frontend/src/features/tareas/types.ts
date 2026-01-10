// ---------------------------------------------
// PARCELA (PlotRead)
// ---------------------------------------------
export interface Parcela {
    id: number;
    name: string;
    location?: string | null;
    soil_type?: string | null;
    size_m2?: number | null;
    lat?: number | null;
    lng?: number | null;
    user_id?: number;
}



// ---------------------------------------------
// CULTIVO TIPO (CultivoTipoNested)
// ---------------------------------------------
export interface CultivoTipo {
    id: number;
    nombre: string;
}



// ---------------------------------------------
// CULTIVO EN PARCELA (CultivoParcelaRead)
// ---------------------------------------------
export interface CultivoParcela {
    id: number;
    cultivo_tipo_id: number;
    parcela_id: number;
    fecha_siembra: string | null;
    fecha_cosecha: string | null;
    estado: "activo" | "cosechado" | "muerto";

    cultivo_tipo?: CultivoTipo;

    // 🔥 ESTA ES LA PARTE CRÍTICA QUE FALTABA
    parcela?: {
        id: number;
        name: string;
    };
}



// ---------------------------------------------
// TAREA (TareaRead)
// ---------------------------------------------
export interface TareaAgricola {
    id?: number;
    titulo: string;
    fecha: string;
    estado: "pendiente" | "en_progreso" | "completada";
    descripcion?: string;

    parcela_id: number | null;
    cultivo_parcela_id: number | null;

    // Datos expandidos por joinedload
    parcela?: Parcela;
    cultivo_parcela?: CultivoParcela;
}



// ---------------------------------------------
// CREATE / UPDATE
// ---------------------------------------------
export type TareaAgricolaCreate = {
    titulo: string;
    fecha: string;
    estado: "pendiente" | "en_progreso" | "completada";
    descripcion?: string;

    parcela_id: number | null;
    cultivo_parcela_id: number | null;
};

export type TareaAgricolaUpdate = Partial<TareaAgricolaCreate>;
