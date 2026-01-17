import { Link } from "react-router-dom";
import type { ParcelaSanitariaPanelItem } from "../types";

interface Props {
  item: ParcelaSanitariaPanelItem;
}

export default function ParcelaSanitariaCard({ item }: Props) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200 flex flex-col gap-3">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          {item.parcela_nombre || "Parcela sin nombre"}
        </h3>

        <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
          {item.cultivo_tipo_nombre || "Cultivo"}
        </span>
      </div>

      {/* BODY */}
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">

        {/* RIESGOS */}
        <div className="flex flex-col">
          <span className="font-semibold">Riesgos</span>
          <span>Activos: {item.riesgos.activos}</span>
          <span>Historial: {item.riesgos.historial}</span>
        </div>

        {/* ALERTAS */}
        <div className="flex flex-col">
          <span className="font-semibold">Alertas</span>
          <span>Pendientes: {item.alertas.pendientes}</span>
          <span>Confirmadas: {item.alertas.confirmadas}</span>
          <span>Descartadas: {item.alertas.descartadas}</span>
        </div>

        {/* EVENTOS */}
        <div className="flex flex-col">
          <span className="font-semibold">Eventos</span>
          <span>Activos: {item.eventos.activos}</span>
          <span>Resueltos: {item.eventos.resueltos}</span>
        </div>

        {/* RECOMENDACIONES */}
        <div className="flex flex-col">
          <span className="font-semibold">Recomendaciones</span>
          <span>Pendientes: {item.recomendaciones.pendientes}</span>
          <span>Realizadas: {item.recomendaciones.realizadas}</span>
          <span>Descartadas: {item.recomendaciones.descartadas}</span>
        </div>

        {/* TRATAMIENTOS */}
        <div className="flex flex-col">
          <span className="font-semibold">Tratamientos</span>
          <span>En progreso: {item.tratamientos.en_progreso}</span>
          <span>Finalizados: {item.tratamientos.finalizados}</span>
        </div>

        {/* TAREAS SANITARIAS */}
        <div className="flex flex-col">
          <span className="font-semibold">Tareas sanitarias</span>
          <span>Pendientes: {item.tareas_sanitarias.pendientes}</span>
          <span>Completadas: {item.tareas_sanitarias.completadas}</span>
        </div>
      </div>

      {/* FOOTER */}
      <div className="pt-2">
        <Link
          to={`/sanitario/${item.cultivo_parcela_id}`}
          className="block text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Ver información sanitaria
        </Link>
      </div>
    </div>
  );
}
