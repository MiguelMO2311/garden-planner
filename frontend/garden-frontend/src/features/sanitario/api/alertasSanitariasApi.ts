import api from "../../../api/axios";


export const getAlertasSanitarias = async (parcelaId: number) => {
  const res = await api.get(`/alertas_sanitarias?cultivo_parcela_id=${parcelaId}`);
  return res.data;
};

export const confirmarAlerta = async (id: number) => {
  const res = await api.post(`/alertas_sanitarias/${id}/confirmar`);
  return res.data;
};

export const descartarAlerta = async (id: number) => {
  const res = await api.post(`/alertas_sanitarias/${id}/descartar`);
  return res.data;
};
