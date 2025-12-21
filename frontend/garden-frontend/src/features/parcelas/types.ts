export interface Parcela {
    id: number;
    name: string;
    location?: string;
    soil_type?: string;
    size_m2?: number;
    user_id: number;
}

export interface ParcelaCreateDTO {
    name: string;
    location?: string;
    soil_type?: string;
    size_m2?: number;
}
