//
// ===============================
// PANEL SANITARIO
// ===============================
export interface ParcelaSanitariaPanelItem {
  cultivo_parcela_id: number;
  parcela_id: number;
  parcela_nombre: string | null;
  cultivo_tipo_id: number;
  cultivo_tipo_nombre: string | null;

  riesgos: {
    activos: number;
    historial: number;
  };

  alertas: {
    pendientes: number;
    confirmadas: number;
    descartadas: number;
  };

  eventos: {
    activos: number;
    resueltos: number;
  };

  recomendaciones: {
    pendientes: number;
    realizadas: number;
    descartadas: number;
  };

  tratamientos: {
    en_progreso: number;
    finalizados: number;
  };

  tareas_sanitarias: {
    pendientes: number;
    completadas: number;
  };

  plagas: {
    activas: number;
    historial: number;
  };

  enfermedades: {
    activas: number;
    historial: number;
  };
}

//
// ===============================
// RIESGOS CLIMÁTICOS
// ===============================
export interface RiesgoClimatico {
  id: number;
  cultivo_parcela_id: number;
  fecha: string;
  riesgo: string;
  probabilidad: number;
  temperatura: number | null;
  humedad: number | null;
  lluvia: number | null;
  estado: "activo" | "archivado";
}

//
// ===============================
// ALERTAS SANITARIAS
// ===============================
export interface AlertaSanitaria {
  id: number;
  cultivo_parcela_id: number;
  fecha: string;
  riesgo: string;
  probabilidad: number;
  prioridad: "alta" | "media" | "baja";
  mensaje: string;
  estado: "pendiente" | "confirmada" | "descartada";
}

//
// ===============================
// EVENTOS SANITARIOS
// ===============================
export interface EventoSanitario {
  id: number;
  cultivo_parcela_id: number;
  fecha: string;
  riesgo: string;
  probabilidad: number;
  objetivo: string;
  notas: string | null;
  estado: "activa" | "resuelta";
  tratamiento_id?: number | null;
}

//
// ===============================
// RECOMENDACIONES
// ===============================
export interface Recomendacion {
  id: number;
  cultivo_parcela_id: number;
  mensaje: string;
  fecha_sugerida: string;
  estado: "pendiente" | "realizada" | "descartada";
}

//
// ===============================
// TRATAMIENTOS APLICADOS
// ===============================
export interface TratamientoAplicado {
  id: number;
  tratamiento_id: number;
  cultivo_parcela_id: number;
  fecha_inicio: string;
  fecha_fin_prevista: string | null;
  fecha_fin: string | null;
  estado: "en_progreso" | "finalizado";
  observaciones: string | null;
}

export interface TratamientoCatalogo {
  id: number;
  nombre: string;
  descripcion: string;
}

//
// ===============================
// TAREAS SANITARIAS
// ===============================
export interface TareaSanitaria {
  id: number;
  cultivo_parcela_id: number;
  parcela_id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  fecha_fin: string | null;
  estado: "pendiente" | "en_progreso" | "completada" | "finalizada";
  origen: "sanitario";
  tratamiento_id?: number | null;
}

//
// ===============================
// CATÁLOGO (para formularios)
// ===============================
export interface Plaga {
  id: number;
  nombre: string;
}

export interface Enfermedad {
  id: number;
  nombre: string;
}

//
// ===============================
// CULTIVO TIPO
// ===============================
export interface CultivoTipoCreate {
  nombre: string;
  descripcion: string;
  ciclo: string;
  tipo_siembra: string;
  tipo_riego: string;
  tipo_suelo: string;
  observaciones: string;
  plagas: string[];
  enfermedades: string[];
}

//
// ===============================
// DETECTADAS EN PARCELA
// ===============================
export interface PlagaDetectada {
  id: number;
  nombre: string;
  descripcion: string;
  severidad: "baja" | "media" | "alta" | "critica";
  fecha_detectada: string;
}

export interface EnfermedadDetectada {
  id: number;
  nombre: string;
  descripcion: string;
  severidad: "baja" | "media" | "alta" | "critica";
  fecha_detectada: string;
}
