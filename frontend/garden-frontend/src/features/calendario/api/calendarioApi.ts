import api from "../../../api/axios";
import type { EventoAgricola } from "../types";

export const getEventos = () => api.get<EventoAgricola[]>("/calendario");

export const createEvento = (data: EventoAgricola) =>
    api.post("/calendario", data);

export const updateEvento = (id: number, data: EventoAgricola) =>
    api.put(`/calendario/${id}`, data);

export const deleteEvento = (id: number) =>
    api.delete(`/calendario/${id}`);
