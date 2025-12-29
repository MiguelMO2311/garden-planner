export interface TareaAgricola {
    id?: number;
    titulo: string;
    fecha: string;
    estado: "pendiente" | "en_progreso" | "completada";
    descripcion?: string;
    parcela_id: number | null;
    cultivo_id: number | null;
}
