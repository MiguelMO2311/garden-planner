export interface EventoAgricola {
    id?: number;
    titulo: string;
    fecha: string;
    tipo: string;
    descripcion?: string;
    tarea_id?: number;
    color?: string;

    estado?: "pendiente" | "en_progreso" | "completada" | "info" | "warning" | "danger";

}
