import api from "../../../api/axios";
import type { EventoAgricola } from "../types";

export const getEventos = () =>
    api.get<EventoAgricola[]>("/eventos");
