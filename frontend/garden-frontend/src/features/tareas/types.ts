export interface TareaAgricola {
    id?: number;
    titulo: string;
    fecha: string;
    estado: "pendiente" | "en_progreso" | "completada";
    descripcion?: string;

    // Relaciones correctas según el nuevo modelo
    parcela_id: number | null;
    cultivo_parcela_id: number | null;

    // Datos expandidos opcionales (joinedload)
    parcela?: {
        id: number;
        name: string;
    };

    cultivo_parcela?: {
        id: number;
        cultivo_tipo_id: number;
        parcela_id: number;
        fecha_siembra: string | null;
        fecha_cosecha: string | null;
        estado: "activo" | "cosechado" | "muerto";

        cultivo_tipo?: {
            id: number;
            nombre: string;
        };
    };
}

export type TareaAgricolaCreate = {
    titulo: string;
    fecha: string;
    estado: "pendiente" | "en_progreso" | "completada";
    descripcion?: string;

    parcela_id: number | null;
    cultivo_parcela_id: number | null;
};

export type TareaAgricolaUpdate = Partial<TareaAgricolaCreate>;
