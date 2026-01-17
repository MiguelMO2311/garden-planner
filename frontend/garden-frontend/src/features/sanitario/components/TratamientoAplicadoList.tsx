import type { TratamientoAplicado } from "../types";
import { finalizarTratamiento } from "../api/tratamientosAplicadosApi";

interface Props {
  tratamientos: TratamientoAplicado[];
  onRefresh?: () => void;
}

export default function TratamientoAplicadoList({ tratamientos, onRefresh }: Props) {
  const handleFinalizar = async (id: number) => {
    await finalizarTratamiento(id);
    onRefresh?.();
  };

  return (
    <div className="flex flex-col gap-3">
      {tratamientos.map((t) => (
        <div key={t.id} className="border rounded-lg p-4 shadow bg-white">
          <h4 className="font-semibold">Tratamiento #{t.id}</h4>

          <p><strong>Inicio:</strong> {t.fecha_inicio}</p>
          {t.fecha_fin_prevista && (
            <p><strong>Fin previsto:</strong> {t.fecha_fin_prevista}</p>
          )}
          {t.fecha_fin && (
            <p><strong>Finalizado:</strong> {t.fecha_fin}</p>
          )}

          {t.estado === "en_progreso" && (
            <button
              onClick={() => handleFinalizar(t.id)}
              className="mt-2 px-3 py-1 bg-green-600 text-white rounded"
            >
              Finalizar tratamiento
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
