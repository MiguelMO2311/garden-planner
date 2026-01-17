import api from "../../../api/axios";

export const getTratamientos = async () => {
  const res = await api.get("/tratamientos");
  return res.data;
};
