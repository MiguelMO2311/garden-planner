import api from "../../../api/axios";
import type { EventoAgricola } from "../types";

// Obtener todos los eventos
export const getEventos = () =>
    api.get("/calendar");

// Crear evento
export const createEvento = (data: EventoAgricola) =>
    api.post("/calendar", {
        title: data.titulo,
        date: data.fecha.split("T")[0],   // ← AQUÍ ESTÁ LA CLAVE
        type: data.tipo,
        description: data.descripcion,
    });

// Actualizar evento
export const updateEvento = (id: number, data: EventoAgricola) =>
    api.put(`/calendar/${id}`, {
        title: data.titulo,
        date: data.fecha.split("T")[0],   // ← MISMO CAMBIO
        type: data.tipo,
        description: data.descripcion,
    });


// Eliminar evento
export const deleteEvento = (id: number) =>
    api.delete(`/calendar/${id}`);
