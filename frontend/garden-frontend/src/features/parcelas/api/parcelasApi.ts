import api from "../../../api/axios";
import type {
    Parcela,
    ParcelaCreateDTO,
    ClimateEvent,
    OpenWeatherResponse,
    AgroRecommendation
} from "../types";

// Obtener todas las parcelas
export async function getParcelas() {
    const res = await api.get<Parcela[]>("/plots");
    return res.data;
}

// Obtener una parcela por ID
export async function getParcela(id: number) {
    const res = await api.get<Parcela>(`/plots/${id}`);
    return res.data;
}

// Crear o actualizar parcela
export async function saveParcela(parcela: Parcela | ParcelaCreateDTO) {
    if ("id" in parcela) {
        const res = await api.put<Parcela>(`/plots/${parcela.id}`, parcela);
        return res.data;
    } else {
        const res = await api.post<Parcela>("/plots", parcela);
        return res.data;
    }
}

// Eliminar parcela
export async function deleteParcela(id: number) {
    const res = await api.delete(`/plots/${id}`);
    return res.data;
}

// 🔥 Clima por parcela (eventos simulados)
export async function getClimateByPlot(plotId: number) {
    const res = await api.get<ClimateEvent[]>(`/clima/parcelas/${plotId}`);
    return res.data;
}

// 🌤️🔥 Clima real desde OpenWeather
export async function getRealWeather(plotId: number) {
    const res = await api.get<OpenWeatherResponse>(`/clima/real/${plotId}`);
    return res.data;
}

// 🌱 Recomendaciones agrícolas por parcela
export async function getRecommendationsByPlot(plotId: number) {
    const res = await api.get<AgroRecommendation[]>(`/recomendaciones/parcelas/${plotId}`);
    return res.data;
}
