import type { AlertaSanitaria } from "../types";
import { confirmarAlerta, descartarAlerta } from "../api/alertasSanitariasApi";

interface Props {
  alertas: AlertaSanitaria[];
  onRefresh?: () => void; // para recargar tras una acción
}

export default function AlertaList({ alertas, onRefresh }: Props) {
  const handleConfirmar = async (id: number) => {
    await confirmarAlerta(id);
    onRefresh?.();
  };

  const handleDescartar = async (id: number) => {
    await descartarAlerta(id);
    onRefresh?.();
  };

  return (
    <div className="flex flex-col gap-3">
      {alertas.map((a) => (
        <div
          key={a.id}
          className="border rounded-lg p-4 shadow-sm bg-white flex flex-col gap-2"
        >
          {/* CABECERA */}
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold text-gray-800">
              {a.riesgo}
            </h4>

            <span
              className={`px-2 py-1 text-xs rounded-full ${
                a.estado === "pendiente"
                  ? "bg-yellow-100 text-yellow-700"
                  : a.estado === "confirmada"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {a.estado}
            </span>
          </div>

          {/* MENSAJE */}
          <p className="text-gray-700">{a.mensaje}</p>

          {/* INFO */}
          <div className="text-xs text-gray-500">
            Fecha: {a.fecha} · Probabilidad: {(a.probabilidad * 100).toFixed(0)}%
          </div>

          {/* ACCIONES */}
          {a.estado === "pendiente" && (
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleConfirmar(a.id)}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Confirmar
              </button>

              <button
                onClick={() => handleDescartar(a.id)}
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
