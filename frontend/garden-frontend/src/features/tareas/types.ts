export interface TareaAgricola {
    id?: number;
    titulo: string;
    fecha: string;
    estado: "pendiente" | "en_progreso" | "completada";
    descripcion?: string;
    parcela_id?: number;
    cultivo_id?: number; // 👈 NUEVO
}
