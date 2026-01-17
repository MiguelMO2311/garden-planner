// src/features/sanitario/components/TareaSanitariaList.tsx
import type { TareaSanitaria } from "../types";
import { completarTareaSanitaria } from "../api/tareasSanitariasApi";

interface Props {
  tareas: TareaSanitaria[];
  onRefresh?: () => void;
}

export default function TareaSanitariaList({ tareas, onRefresh }: Props) {
  const handleCompletar = async (id: number) => {
    await completarTareaSanitaria(id);
    onRefresh?.();
  };

  return (
    <div className="flex flex-col gap-3">
      {tareas.map((t) => (
        <div
          key={t.id}
          className="border rounded-lg p-4 shadow-sm bg-white flex flex-col gap-2"
        >
          {/* CABECERA */}
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold text-gray-800">
              {t.titulo}
            </h4>

            <span
              className={`px-2 py-1 text-xs rounded-full ${
                t.estado === "pendiente" || t.estado === "en_progreso"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {t.estado}
            </span>
          </div>

          {/* DESCRIPCIÓN */}
          <p className="text-gray-700">{t.descripcion}</p>

          {/* FECHAS */}
          <div className="text-xs text-gray-500">
            <p>Inicio: {t.fecha}</p>
            {t.fecha_fin && <p>Finalizada: {t.fecha_fin}</p>}
          </div>

          {/* ACCIÓN */}
          {(t.estado === "pendiente" || t.estado === "en_progreso") && (
            <button
              onClick={() => handleCompletar(t.id)}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition mt-2"
            >
              Completar tarea
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
