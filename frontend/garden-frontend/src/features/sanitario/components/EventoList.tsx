import type { EventoSanitario } from "../types";
import { resolverEvento } from "../api/eventosSanitariosApi";

interface Props {
  eventos: EventoSanitario[];
  onRefresh?: () => void;
}

export default function EventoList({ eventos, onRefresh }: Props) {
  const handleResolver = async (id: number) => {
    await resolverEvento(id);
    onRefresh?.();
  };

  return (
    <div className="flex flex-col gap-3">
      {eventos.map((e) => (
        <div
          key={e.id}
          className="border rounded-lg p-4 shadow-sm bg-white flex flex-col gap-2"
        >
          {/* CABECERA */}
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold text-gray-800">
              {e.riesgo}
            </h4>

            <span
              className={`px-2 py-1 text-xs rounded-full ${
                e.estado === "activa"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {e.estado}
            </span>
          </div>

          {/* OBJETIVO */}
          <p className="text-gray-700">
            <strong>Objetivo:</strong> {e.objetivo}
          </p>

          {/* NOTAS */}
          {e.notas && (
            <p className="text-gray-600 text-sm italic">{e.notas}</p>
          )}

          {/* INFO */}
          <div className="text-xs text-gray-500">
            Fecha: {e.fecha} · Probabilidad: {(e.probabilidad * 100).toFixed(0)}%
          </div>

          {/* ACCIONES */}
          {e.estado === "activa" && (
            <button
              onClick={() => handleResolver(e.id)}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition mt-2"
            >
              Resolver evento
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
