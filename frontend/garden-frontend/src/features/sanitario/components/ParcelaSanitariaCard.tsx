import { Link } from "react-router-dom";
import type { ParcelaSanitariaPanelItem } from "../types";

interface Props {
  item: ParcelaSanitariaPanelItem;
}

export default function ParcelaSanitariaCard({ item }: Props) {
  return (
    <div className="san-card san-parcela-card">
      
      {/* HEADER */}
      <div className="san-card-header">
        <h3 className="san-card-title">
          {item.parcela_nombre || "Parcela sin nombre"}
        </h3>

        <span className="badge badge-cultivo">
          {item.cultivo_tipo_nombre || "Cultivo"}
        </span>
      </div>

      {/* BODY */}
      <div className="san-parcela-grid">
        
        {/* RIESGOS */}
        <div className="san-parcela-block">
          <span className="san-parcela-block-title">Riesgos</span>
          <span>Activos: {item.riesgos.activos}</span>
          <span>Historial: {item.riesgos.historial}</span>
        </div>

        {/* ALERTAS */}
        <div className="san-parcela-block">
          <span className="san-parcela-block-title">Alertas</span>
          <span>Pendientes: {item.alertas.pendientes}</span>
          <span>Confirmadas: {item.alertas.confirmadas}</span>
          <span>Descartadas: {item.alertas.descartadas}</span>
        </div>

        {/* EVENTOS */}
        <div className="san-parcela-block">
          <span className="san-parcela-block-title">Eventos</span>
          <span>Activos: {item.eventos.activos}</span>
          <span>Resueltos: {item.eventos.resueltos}</span>
        </div>

        {/* RECOMENDACIONES */}
        <div className="san-parcela-block">
          <span className="san-parcela-block-title">Recomendaciones</span>
          <span>Pendientes: {item.recomendaciones.pendientes}</span>
          <span>Realizadas: {item.recomendaciones.realizadas}</span>
          <span>Descartadas: {item.recomendaciones.descartadas}</span>
        </div>

        {/* TRATAMIENTOS */}
        <div className="san-parcela-block">
          <span className="san-parcela-block-title">Tratamientos</span>
          <span>En progreso: {item.tratamientos.en_progreso}</span>
          <span>Finalizados: {item.tratamientos.finalizados}</span>
        </div>

        {/* TAREAS SANITARIAS */}
        <div className="san-parcela-block">
          <span className="san-parcela-block-title">Tareas sanitarias</span>
          <span>Pendientes: {item.tareas_sanitarias.pendientes}</span>
          <span>Completadas: {item.tareas_sanitarias.completadas}</span>
        </div>
      </div>

      {/* FOOTER */}
      <Link
        to={`/sanitario/${item.cultivo_parcela_id}`}
        className="san-btn san-btn-primary san-btn-full san-parcela-link"
      >
        Ver información sanitaria
      </Link>
    </div>
  );
}
