// src/features/sanitario/components/TratamientoForm.tsx
import { useState } from "react";
import type { CrearTratamientoPayload } from "../types";

interface Props {
  parcelaId: number;
  tipo: string;
  onSubmit: (data: CrearTratamientoPayload) => void;
}

export default function TratamientoForm({ parcelaId, tipo, onSubmit }: Props) {
  const [producto, setProducto] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      parcela_id: parcelaId,
      tipo,
      producto,
      fecha_inicio: fechaInicio,
    });

    setProducto("");
    setFechaInicio("");
  };

  return (
    <form className="san-form" onSubmit={handleSubmit}>
      <div className="san-form-group">
        <label className="san-label" htmlFor="producto">Producto</label>
        <input
          id="producto"
          className="san-input"
          value={producto}
          onChange={(e) => setProducto(e.target.value)}
          placeholder="Nombre del producto"
          required
        />
      </div>

      <div className="san-form-group">
        <label className="san-label" htmlFor="fechaInicio">Fecha de inicio</label>
        <input
          id="fechaInicio"
          className="san-input"
          type="date"
          title="Selecciona la fecha de inicio"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          required
        />
      </div>

      <button className="san-btn san-btn-full san-btn-primary">
        Aplicar tratamiento
      </button>
    </form>
  );
}
