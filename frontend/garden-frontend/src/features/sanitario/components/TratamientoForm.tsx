import { useState } from "react";

interface Props {
  parcelaId: number;
  tratamientosCatalogo: { id: number; nombre: string }[];
  onSubmit: (data: {
    tratamiento_id: number;
    cultivo_parcela_id: number;
    fecha_inicio?: string;
    observaciones?: string;
  }) => void;
}

export default function TratamientoForm({
  parcelaId,
  tratamientosCatalogo,
  onSubmit,
}: Props) {
  const [tratamientoId, setTratamientoId] = useState<number>(0);
  const [fechaInicio, setFechaInicio] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      tratamiento_id: tratamientoId,
      cultivo_parcela_id: parcelaId,
      fecha_inicio: fechaInicio,
      observaciones,
    });

    setTratamientoId(0);
    setFechaInicio("");
    setObservaciones("");
  };

  return (
    <form className="san-form" onSubmit={(e) => handleSubmit(e)}>
      <h3 className="san-form-title">Aplicar tratamiento</h3>
      <p className="san-form-subtitle">
        Selecciona un tratamiento y registra su inicio
      </p>

      {/* TRATAMIENTO */}
      <div className="san-form-group">
        <label className="san-label" htmlFor="tratamiento">Tratamiento</label>
        <select
          id="tratamiento"
          className="san-input"
          value={tratamientoId}
          onChange={(e) => setTratamientoId(Number(e.target.value))}
          required
        >
          <option value="">Selecciona un tratamiento</option>
          {tratamientosCatalogo.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* FECHA INICIO */}
      <div className="san-form-group">
        <label className="san-label" htmlFor="fechaInicio">Fecha de inicio</label>
        <input
          id="fechaInicio"
          type="date"
          className="san-input"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
        />
      </div>

      {/* OBSERVACIONES */}
      <div className="san-form-group">
        <label className="san-label" htmlFor="observaciones">Observaciones</label>
        <textarea
          id="observaciones"
          className="san-textarea"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Añade notas opcionales"
        />
      </div>

      <button className="san-btn san-btn-primary san-btn-full">
        Aplicar tratamiento
      </button>
    </form>
  );
}
