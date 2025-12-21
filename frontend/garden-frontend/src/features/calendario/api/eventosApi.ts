import axios from "../../../api/axios";

export const getEventos = () => axios.get("/eventos");
