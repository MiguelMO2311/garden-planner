import api from "../../../api/axios";
import type { EventoAgricola } from "../types";

export const getEventos = () => api.get<EventoAgricola[]>("/calendar");

export const createEvento = (data: EventoAgricola) =>
    api.post("/calendar", data);

export const updateEvento = (id: number, data: EventoAgricola) =>
    api.put(`/calendar/${id}`, data);

export const deleteEvento = (id: number) =>
    api.delete(`/calendar/${id}`);
