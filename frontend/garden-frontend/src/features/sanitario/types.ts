// src/features/sanitario/types.ts

//
// PANEL SANITARIO
//
export interface ParcelaSanitariaPanelItem {
  parcela_id: number;
  parcela_nombre: string;
  cultivos: string[];
  riesgo: "ALTO" | "MEDIO" | "BAJO";
  alertas: number;
  plagas: number;
  enfermedades: number;
  tratamientos_activos: number;
}

//
// ALERTAS SANITARIAS
//
export interface AlertaSanitaria {
  id: number;
  parcela_id: number;
  titulo: string;
  descripcion: string;
  fecha: string; // ISO date
  tipo: string; // ej: "climática", "sanitaria", etc.
}

//
// PLAGAS
//
export interface Plaga {
  id: number;
  parcela_id: number;
  nombre: string;
  descripcion: string;
  severidad: "ALTA" | "MEDIA" | "BAJA";
  fecha_detectada: string;
}

//
// ENFERMEDADES
//
export interface Enfermedad {
  id: number;
  parcela_id: number;
  nombre: string;
  descripcion: string;
  severidad: "ALTA" | "MEDIA" | "BAJA";
  fecha_detectada: string;
}

//
// EVENTOS SANITARIOS
//
export interface EventoSanitario {
  id: number;
  parcela_id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
}

export interface CrearEventoSanitarioPayload {
  parcela_id: number;
  titulo: string;
  descripcion: string;
}

//
// TRATAMIENTOS
//
export interface Tratamiento {
  id: number;
  parcela_id: number;
  tipo: string; // "plaga", "enfermedad", "alerta", "recomendacion"
  producto: string;
  fecha_inicio: string;
  fecha_fin: string;
}

export interface CrearTratamientoPayload {
  parcela_id: number;
  tipo: string;
  producto: string;
  fecha_inicio: string;
}

//
// RECOMENDACIONES SANITARIAS
//
export interface Recomendacion {
  id: number;
  parcela_id: number;
  titulo: string;
  descripcion: string;
  prioridad: "ALTA" | "MEDIA" | "BAJA";
}

//
// TIPOS AUXILIARES
//
export type RiesgoSanitario = "ALTO" | "MEDIO" | "BAJO";
export type Severidad = "ALTA" | "MEDIA" | "BAJA";
