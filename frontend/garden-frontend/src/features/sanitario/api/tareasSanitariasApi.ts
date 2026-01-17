// src/features/sanitario/api/tareasSanitariasApi.ts
import api from "../../../api/axios";

export const getTareasSanitarias = async (cultivoParcelaId: number) => {
  const res = await api.get(
    `/tareas?cultivo_parcela_id=${cultivoParcelaId}&origen=sanitario`
  );
  return res.data;
};

export const completarTareaSanitaria = async (id: number) => {
  const res = await api.post(`/tareas/${id}/completar`);
  return res.data;
};
