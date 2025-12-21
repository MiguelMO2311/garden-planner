import { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { createParcela, updateParcela, getParcela } from "./api/parcelasApi";
import { useNavigate, useParams } from "react-router-dom";
import type { ParcelaCreateDTO } from "./types";

interface ParcelaFormState {
  name: string;
  location: string;
  soil_type: string;
  size_m2: string; // siempre string en el formulario
}

export default function ParcelaFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<ParcelaFormState>({
    name: "",
    location: "",
    soil_type: "",
    size_m2: ""
  });

  useEffect(() => {
    if (!id) return;

    getParcela(Number(id)).then(({ data }) => {
      setForm({
        name: data.name,
        location: data.location || "",
        soil_type: data.soil_type || "",
        size_m2: data.size_m2 ? String(data.size_m2) : ""
      });
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: ParcelaCreateDTO = {
      name: form.name,
      location: form.location || undefined,
      soil_type: form.soil_type || undefined,
      size_m2: form.size_m2 ? Number(form.size_m2) : undefined
    };

    if (id) {
      await updateParcela(Number(id), payload);
    } else {
      await createParcela(payload);
    }

    navigate("/parcelas");
  };

  return (
    <DashboardLayout>
      <div className="card shadow-sm p-4">
        <h3 className="fw-bold mb-3">
          {id ? "Editar parcela" : "Nueva parcela"}
        </h3>

        <form onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              className="form-control"
              placeholder="Nombre de la parcela"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          {/* Ubicación */}
          <div className="mb-3">
            <label className="form-label">Ubicación</label>
            <input
              className="form-control"
              placeholder="Ej: Huerto norte"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>

          {/* Tipo de suelo */}
          <div className="mb-3">
            <label className="form-label">Tipo de suelo</label>
            <input
              className="form-control"
              placeholder="Arcilloso, arenoso..."
              value={form.soil_type}
              onChange={(e) => setForm({ ...form, soil_type: e.target.value })}
            />
          </div>

          {/* Tamaño */}
          <div className="mb-3">
            <label className="form-label">Tamaño (m²)</label>
            <input
              type="number"
              className="form-control"
              placeholder="Ej: 25"
              value={form.size_m2}
              onChange={(e) => setForm({ ...form, size_m2: e.target.value })}
            />
          </div>

          <button className="btn btn-success">Guardar</button>
        </form>
      </div>
    </DashboardLayout>
  );
}
