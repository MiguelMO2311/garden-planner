import api from "../../../api/axios";


export const getRecomendaciones = async (parcelaId: number) => {
  const res = await api.get(`/recomendaciones?cultivo_parcela_id=${parcelaId}`);
  return res.data;
};

export const activarRecomendacion = async (id: number) => {
  const res = await api.post(`/recomendaciones/${id}/activar`);
  return res.data;
};

export const realizarRecomendacion = async (id: number) => {
  const res = await api.post(`/recomendaciones/${id}/realizar`);
  return res.data;
};

export const descartarRecomendacion = async (id: number) => {
  const res = await api.post(`/recomendaciones/${id}/descartar`);
  return res.data;
};
