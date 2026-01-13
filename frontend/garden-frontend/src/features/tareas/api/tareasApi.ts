import api from "../../../api/axios";
import type {
    TareaAgricola,
    TareaAgricolaCreate,
    TareaAgricolaUpdate,
} from "../types";

export const getTareas = () =>
    api.get<TareaAgricola[]>("/tareas");

export const getTarea = (id: number) =>
    api.get<TareaAgricola>(`/tareas/${id}`);

export const createTarea = (data: TareaAgricolaCreate) =>
    api.post("/tareas", data);

export const updateTarea = (id: number, data: TareaAgricolaUpdate) =>
    api.put(`/tareas/${id}`, data);

export const deleteTarea = (id: number) =>
    api.delete(`/tareas/${id}`);

export const createTaskFromRecommendation = (data: {
    plot_id: number;
    recommendation_type: string;
    message: string;
    fecha?: string;
}) =>
    api.post("/tareas/from-recommendation", data);
