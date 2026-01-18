import { useState } from "react";

interface CrearEventoSanitarioPayload {
  cultivo_parcela_id: number;
  riesgo: string;
  probabilidad: number;
  objetivo: string;
  notas?: string;
}

interface Props {
  parcelaId: number;
  onSubmit: (data: CrearEventoSanitarioPayload) => void;
}

export default function EventoForm({ parcelaId, onSubmit }: Props) {
  const [riesgo, setRiesgo] = useState("");
  const [probabilidad, setProbabilidad] = useState(0.5);
  const [objetivo, setObjetivo] = useState("");
  const [notas, setNotas] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      cultivo_parcela_id: parcelaId,
      riesgo,
      probabilidad,
      objetivo,
      notas,
    });

    setRiesgo("");
    setProbabilidad(0.5);
    setObjetivo("");
    setNotas("");
  };

  return (
    <form className="san-form" onSubmit={handleSubmit}>
      <h3 className="san-form-title">Nuevo evento sanitario</h3>
      <p className="san-form-subtitle">
        Registra un evento sanitario detectado en la parcela
      </p>

      {/* RIESGO */}
      <div className="san-form-group">
        <label className="san-label" htmlFor="riesgo">Riesgo detectado</label>
        <input
          id="riesgo"
          className="san-input"
          value={riesgo}
          onChange={(e) => setRiesgo(e.target.value)}
          placeholder="Ej: Mildiu, Roya, Helada..."
          required
        />
      </div>

      {/* PROBABILIDAD */}
      <div className="san-form-group">
        <label className="san-label" htmlFor="probabilidad">
          Probabilidad (0 a 1)
        </label>
        <input
          id="probabilidad"
          type="number"
          min={0}
          max={1}
          step={0.01}
          className="san-input"
          value={probabilidad}
          onChange={(e) => setProbabilidad(Number(e.target.value))}
          required
        />
      </div>

      {/* OBJETIVO */}
      <div className="san-form-group">
        <label className="san-label" htmlFor="objetivo">Objetivo del evento</label>
        <input
          id="objetivo"
          className="san-input"
          value={objetivo}
          onChange={(e) => setObjetivo(e.target.value)}
          placeholder="Ej: Control de mildiu"
          required
        />
      </div>

      {/* NOTAS */}
      <div className="san-form-group">
        <label className="san-label" htmlFor="notas">Notas adicionales</label>
        <textarea
          id="notas"
          className="san-textarea"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          placeholder="Observaciones opcionales"
        />
      </div>

      <button className="san-btn san-btn-primary san-btn-full">
        Guardar evento sanitario
      </button>
    </form>
  );
}
