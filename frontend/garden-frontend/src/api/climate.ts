import api from "./axios";

export async function getClimateByPlot(plotId: number) {
    const res = await api.get(`/clima/parcelas/${plotId}`);
    return res.data;
}
