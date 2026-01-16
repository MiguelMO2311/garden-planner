// src/features/sanitario/components/EventoForm.tsx
import { useState } from "react";
import type { CrearEventoSanitarioPayload } from "../types";

interface Props {
  parcelaId: number;
  onSubmit: (data: CrearEventoSanitarioPayload) => void;
}

export default function EventoForm({ parcelaId, onSubmit }: Props) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      parcela_id: parcelaId,
      titulo,
      descripcion,
    });

    setTitulo("");
    setDescripcion("");
  };

  return (
    <form className="san-form" onSubmit={handleSubmit}>
      <div className="san-form-group">
        <label className="san-label" htmlFor="titulo">Título del evento</label>
        <input
          id="titulo"
          className="san-input"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ej: Observación de síntomas"
          required
        />
      </div>

      <div className="san-form-group">
        <label className="san-label" htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          className="san-textarea"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Describe lo observado en la parcela"
          required
        />
      </div>

      <button className="san-btn san-btn-full san-btn-primary">
        Guardar evento sanitario
      </button>
    </form>
  );
}
