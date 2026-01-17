import type { Recomendacion } from "../types";
import {
  activarRecomendacion,
  realizarRecomendacion,
  descartarRecomendacion,
} from "../api/recomendacionesApi";

interface Props {
  recomendaciones: Recomendacion[];
  onRefresh?: () => void;
}

export default function RecomendacionList({ recomendaciones, onRefresh }: Props) {
  const handleActivar = async (id: number) => {
    await activarRecomendacion(id);
    onRefresh?.();
  };

  const handleRealizar = async (id: number) => {
    await realizarRecomendacion(id);
    onRefresh?.();
  };

  const handleDescartar = async (id: number) => {
    await descartarRecomendacion(id);
    onRefresh?.();
  };

  return (
    <div className="flex flex-col gap-3">
      {recomendaciones.map((r) => (
        <div
          key={r.id}
          className="border rounded-lg p-4 shadow-sm bg-white flex flex-col gap-2"
        >
          {/* CABECERA */}
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold text-gray-800">
              Recomendación
            </h4>

            <span
              className={`px-2 py-1 text-xs rounded-full ${
                r.estado === "pendiente"
                  ? "bg-yellow-100 text-yellow-700"
                  : r.estado === "realizada"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {r.estado}
            </span>
          </div>

          {/* MENSAJE */}
          <p className="text-gray-700">{r.mensaje}</p>

          {/* FECHA */}
          <div className="text-xs text-gray-500">
            Fecha sugerida: {r.fecha_sugerida}
          </div>

          {/* ACCIONES */}
          {r.estado === "pendiente" && (
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleActivar(r.id)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Activar
              </button>

              <button
                onClick={() => handleRealizar(r.id)}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Realizada
              </button>

              <button
                onClick={() => handleDescartar(r.id)}
                className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
              >
                Descartar
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
