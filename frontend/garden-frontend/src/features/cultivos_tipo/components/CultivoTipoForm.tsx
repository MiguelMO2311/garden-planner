import { useState } from "react";
import type { CultivoTipoCreate, Plaga, Enfermedad } from "../types";


interface Props {
  plagasCatalogo: Plaga[];
  enfermedadesCatalogo: Enfermedad[];
  onSubmit: (data: CultivoTipoCreate) => void;
}

export default function CultivoTipoForm({
  plagasCatalogo,
  enfermedadesCatalogo,
  onSubmit,
}: Props) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [ciclo, setCiclo] = useState("");
  const [tipoSiembra, setTipoSiembra] = useState("");
  const [tipoRiego, setTipoRiego] = useState("");
  const [tipoSuelo, setTipoSuelo] = useState("");
  const [observaciones, setObservaciones] = useState("");

  // MULTISELECTS — deben ser string[] porque tu tipo lo exige
  const [plagas, setPlagas] = useState<string[]>([]);
  const [enfermedades, setEnfermedades] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      nombre,
      descripcion,
      ciclo,
      tipo_siembra: tipoSiembra,
      tipo_riego: tipoRiego,
      tipo_suelo: tipoSuelo,
      observaciones,
      plagas,
      enfermedades,
    });
  };

  return (
    <form className="san-form" onSubmit={handleSubmit}>
      {/* NOMBRE */}
      <div className="san-form-group">
        <label htmlFor="nombre" className="san-label">Nombre</label>
        <input
          id="nombre"
          className="san-input"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del cultivo"
          required
        />
      </div>

      {/* DESCRIPCIÓN */}
      <div className="san-form-group">
        <label htmlFor="descripcion" className="san-label">Descripción</label>
        <textarea
          id="descripcion"
          className="san-textarea"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción del cultivo"
        />
      </div>

      {/* CICLO */}
      <div className="san-form-group">
        <label htmlFor="ciclo" className="san-label">Ciclo</label>
        <input
          id="ciclo"
          className="san-input"
          value={ciclo}
          onChange={(e) => setCiclo(e.target.value)}
          placeholder="Ej: anual, perenne..."
        />
      </div>

      {/* TIPO SIEMBRA */}
      <div className="san-form-group">
        <label htmlFor="tipoSiembra" className="san-label">Tipo de siembra</label>
        <select
          id="tipoSiembra"
          className="san-input"
          value={tipoSiembra}
          onChange={(e) => setTipoSiembra(e.target.value)}
          required
        >
          <option value="">Selecciona una opción</option>
          <option value="directa">Siembra directa</option>
          <option value="trasplante">Trasplante</option>
        </select>
      </div>

      {/* TIPO RIEGO */}
      <div className="san-form-group">
        <label htmlFor="tipoRiego" className="san-label">Tipo de riego</label>
        <select
          id="tipoRiego"
          className="san-input"
          value={tipoRiego}
          onChange={(e) => setTipoRiego(e.target.value)}
          required
        >
          <option value="">Selecciona una opción</option>
          <option value="goteo">Goteo</option>
          <option value="aspersión">Aspersión</option>
          <option value="inundación">Inundación</option>
        </select>
      </div>

      {/* TIPO SUELO */}
      <div className="san-form-group">
        <label htmlFor="tipoSuelo" className="san-label">Tipo de suelo</label>
        <select
          id="tipoSuelo"
          className="san-input"
          value={tipoSuelo}
          onChange={(e) => setTipoSuelo(e.target.value)}
          required
        >
          <option value="">Selecciona una opción</option>
          <option value="arenoso">Arenoso</option>
          <option value="arcilloso">Arcilloso</option>
          <option value="franco">Franco</option>
        </select>
      </div>

      {/* PLAGAS */}
      <div className="san-form-group">
        <label htmlFor="plagas" className="san-label">Plagas asociadas</label>
        <select
          id="plagas"
          className="san-input"
          multiple
          value={plagas}
          onChange={(e) =>
            setPlagas(Array.from(e.target.selectedOptions, (opt) => opt.value))
          }
          title="Selecciona una o varias plagas"
        >
          {plagasCatalogo.map((p) => (
            <option key={p.id} value={String(p.id)}>
              {p.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* ENFERMEDADES */}
      <div className="san-form-group">
        <label htmlFor="enfermedades" className="san-label">Enfermedades asociadas</label>
        <select
          id="enfermedades"
          className="san-input"
          multiple
          value={enfermedades}
          onChange={(e) =>
            setEnfermedades(Array.from(e.target.selectedOptions, (opt) => opt.value))
          }
          title="Selecciona una o varias enfermedades"
        >
          {enfermedadesCatalogo.map((e) => (
            <option key={e.id} value={String(e.id)}>
              {e.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* OBSERVACIONES */}
      <div className="san-form-group">
        <label htmlFor="observaciones" className="san-label">Observaciones</label>
        <textarea
          id="observaciones"
          className="san-textarea"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Notas adicionales"
        />
      </div>

      <button className="san-btn san-btn-primary san-btn-full">
        Guardar cultivo
      </button>
    </form>
  );
}
