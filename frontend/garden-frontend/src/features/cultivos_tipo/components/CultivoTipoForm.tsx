import type { CultivoTipoCreate } from "../types";

interface CatalogItem {
  id: number;
  nombre: string;
}

interface Props {
  plagasCatalogo: CatalogItem[];
  enfermedadesCatalogo: CatalogItem[];
  form: CultivoTipoCreate;
  setForm: React.Dispatch<React.SetStateAction<CultivoTipoCreate>>;
  onSubmit: (data: CultivoTipoCreate) => void;
}

export default function CultivoTipoForm({
  plagasCatalogo,
  enfermedadesCatalogo,
  form,
  setForm,
  onSubmit,
}: Props) {

  type FieldValue = string | number | null | string[];

  const handleChange = (field: keyof CultivoTipoCreate, value: FieldValue) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form
      className="san-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      {/* NOMBRE */}
      <div className="san-form-group">
        <label htmlFor="nombre" className="san-label">Nombre</label>
        <input
          id="nombre"
          className="san-input"
          value={form.nombre}
          onChange={(e) => handleChange("nombre", e.target.value)}
          placeholder="Nombre del cultivo"
          required
        />
      </div>

      {/* NOMBRE LATÍN */}
      <div className="san-form-group">
        <label htmlFor="nombreLatin" className="san-label">Nombre latín</label>
        <input
          id="nombreLatin"
          className="san-input"
          value={form.nombre_latin ?? ""}
          onChange={(e) => handleChange("nombre_latin", e.target.value)}
          placeholder="Nombre científico"
        />
      </div>

      {/* VARIEDAD */}
      <div className="san-form-group">
        <label htmlFor="variedad" className="san-label">Variedad</label>
        <input
          id="variedad"
          className="san-input"
          value={form.variedad ?? ""}
          onChange={(e) => handleChange("variedad", e.target.value)}
          placeholder="Ej: Picual, Roma..."
        />
      </div>

      {/* TIPO */}
      <div className="san-form-group">
        <label htmlFor="tipo" className="san-label">Tipo</label>
        <input
          id="tipo"
          className="san-input"
          value={form.tipo ?? ""}
          onChange={(e) => handleChange("tipo", e.target.value)}
          placeholder="Árbol, hortaliza..."
        />
      </div>

      {/* TEMPORADA ÓPTIMA */}
      <div className="san-form-group">
        <label htmlFor="temporada" className="san-label">Temporada óptima</label>
        <input
          id="temporada"
          className="san-input"
          value={form.temporada_optima ?? ""}
          onChange={(e) => handleChange("temporada_optima", e.target.value)}
          placeholder="Primavera, verano..."
        />
      </div>

      {/* DÍAS CRECIMIENTO */}
      <div className="san-form-group">
        <label htmlFor="dias" className="san-label">Días de crecimiento</label>
        <input
          id="dias"
          type="number"
          className="san-input"
          value={form.dias_crecimiento ?? ""}
          onChange={(e) =>
            handleChange("dias_crecimiento", Number(e.target.value))
          }
          placeholder="Ej: 90"
        />
      </div>

      {/* LITROS AGUA */}
      <div className="san-form-group">
        <label htmlFor="agua" className="san-label">Litros de agua/semana</label>
        <input
          id="agua"
          type="number"
          className="san-input"
          value={form.litros_agua_semana ?? ""}
          onChange={(e) =>
            handleChange("litros_agua_semana", Number(e.target.value))
          }
          placeholder="Ej: 5"
        />
      </div>

      {/* FASE LUNAR */}
      <div className="san-form-group">
        <label htmlFor="fase" className="san-label">Fase lunar</label>
        <input
          id="fase"
          className="san-input"
          value={form.fase_lunar ?? ""}
          onChange={(e) => handleChange("fase_lunar", e.target.value)}
          placeholder="Creciente, menguante..."
        />
      </div>

      {/* PLAGAS */}
      <div className="san-form-group">
        <label htmlFor="plagas" className="san-label">Plagas</label>
        <select
          id="plagas"
          className="san-input"
          multiple
          value={form.plagas ?? []}
          onChange={(e) =>
            handleChange(
              "plagas",
              Array.from(e.target.selectedOptions, (opt) => opt.value)
            )
          }
        >
          {(plagasCatalogo ?? []).map((p) => (
            <option key={p.id} value={String(p.id)}>
              {p.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* ENFERMEDADES */}
      <div className="san-form-group">
        <label htmlFor="enfermedades" className="san-label">Enfermedades</label>
        <select
          id="enfermedades"
          className="san-input"
          multiple
          value={form.enfermedades ?? []}
          onChange={(e) =>
            handleChange(
              "enfermedades",
              Array.from(e.target.selectedOptions, (opt) => opt.value)
            )
          }
        >
          {(enfermedadesCatalogo ?? []).map((e) => (
            <option key={e.id} value={String(e.id)}>
              {e.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* NOTAS */}
      <div className="san-form-group">
        <label htmlFor="notas" className="san-label">Notas</label>
        <textarea
          id="notas"
          className="san-textarea"
          value={form.notas ?? ""}
          onChange={(e) => handleChange("notas", e.target.value)}
          placeholder="Notas adicionales"
        />
      </div>

      <button className="san-btn san-btn-primary san-btn-full">
        Guardar cultivo
      </button>
    </form>
  );
}
