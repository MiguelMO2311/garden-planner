import api from "../../../api/axios";
import type { TareaAgricola } from "../types";

export const getTareas = () => api.get<TareaAgricola[]>("/tareas");

export const getTarea = (id: number) => api.get<TareaAgricola>(`/tareas/${id}`);

export const createTarea = (data: TareaAgricola) =>
    api.post("/tareas", data);

export const updateTarea = (id: number, data: TareaAgricola) =>
    api.put(`/tareas/${id}`, data);

export const deleteTarea = (id: number) =>
    api.delete(`/tareas/${id}`);
