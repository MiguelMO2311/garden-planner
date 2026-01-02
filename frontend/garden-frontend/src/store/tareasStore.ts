import { create } from "zustand";

import {
    getTareas,
    createTarea,
    updateTarea,
    deleteTarea,
} from "../features/tareas/api/tareasApi";

import type { TareaAgricola } from "../features/tareas/types";

interface TareasState {
    tareas: TareaAgricola[];
    loadTareas: () => Promise<void>;
    addTarea: (data: TareaAgricola) => Promise<TareaAgricola>;
    editTarea: (id: number, data: TareaAgricola) => Promise<TareaAgricola>;
    removeTarea: (id: number) => Promise<void>;
}

export const useTareasStore = create<TareasState>((set, get) => ({
    tareas: [],

    loadTareas: async () => {
        const res = await getTareas();
        set({ tareas: res.data });
    },

    addTarea: async (data: TareaAgricola) => {
        const res = await createTarea(data);
        set({ tareas: [...get().tareas, res.data] });
        return res.data;
    },

    editTarea: async (id: number, data: TareaAgricola) => {
        const res = await updateTarea(id, data);
        set({
            tareas: get().tareas.map((t) => (t.id === id ? res.data : t)),
        });
        return res.data;
    },

    removeTarea: async (id: number) => {
        await deleteTarea(id);
        set({
            tareas: get().tareas.filter((t) => t.id !== id),
        });
    },
}));
