// Tipos base de Parcela

export interface Parcela {
    id: number;
    name: string;
    location?: string | null;
    soil_type?: string | null;
    size_m2?: number | null;

    // Coordenadas para clima y mapa
    lat?: number | null;
    lng?: number | null;
}

export interface ParcelaCreateDTO {
    name: string;
    location?: string;
    soil_type?: string;
    size_m2?: number;

    // Coordenadas opcionales
    lat?: number;
    lng?: number;
}

// Eventos climáticos simulados (backend ClimateEvent)

export interface ClimateEvent {
    id: number;
    plot_id: number;
    date: string; // ISO
    type: string;
    intensity: number;
    description: string;
}

// Respuesta de OpenWeather (lo que usamos en frontend)

export interface OpenWeatherCurrent {
    temp: number;
    humidity: number;
    wind_speed: number;
    weather: { description: string }[];
}

export interface OpenWeatherAlert {
    event: string;
    description?: string;
}

export interface OpenWeatherDaily {
    dt: number; // timestamp UNIX
    temp: {
        min: number;
        max: number;
    };
    humidity: number;
    wind_speed: number;
    weather: { description: string }[];
    pop?: number; // probabilidad de precipitación (0-1)
}

export interface OpenWeatherResponse {
    current: OpenWeatherCurrent;
    alerts?: OpenWeatherAlert[];
    daily?: OpenWeatherDaily[]; // 🔥 NUEVO
}

export interface OpenWeatherHourly {
    dt: number;
    temp: number;
    humidity: number;
    wind_speed: number;
    weather: { description: string }[];
}

export interface OpenWeatherResponse {
    current: OpenWeatherCurrent;
    alerts?: OpenWeatherAlert[];
    daily?: OpenWeatherDaily[];
    hourly?: OpenWeatherHourly[]; // 🔥 NUEVO
}
