export interface Cultivo {
    id?: number;
    nombre: string;
    temporada_optima?: string;
    dias_crecimiento?: number;
    litros_agua_semana?: number;
    notas?: string;
    plot_id: number | undefined;
}
