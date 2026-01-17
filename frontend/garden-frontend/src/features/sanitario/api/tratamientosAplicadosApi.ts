import api from "../../../api/axios";

export const getTratamientosAplicados = async (cultivoParcelaId: number) => {
  const res = await api.get(
    `/tratamientos_aplicados?cultivo_parcela_id=${cultivoParcelaId}`
  );
  return res.data;
};

export const aplicarTratamiento = async (payload: {
  tratamiento_id: number;
  cultivo_parcela_id: number;
  fecha_inicio?: string;
  observaciones?: string;
}) => {
  const res = await api.post(`/tratamientos_aplicados`, payload);
  return res.data;
};

export const finalizarTratamiento = async (id: number) => {
  const res = await api.post(`/tratamientos_aplicados/${id}/finalizar`);
  return res.data;
};
