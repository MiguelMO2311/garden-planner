import { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { createParcela, updateParcela, getParcela } from "./api/parcelasApi";
import { useNavigate, useParams } from "react-router-dom";
import type { ParcelaCreateDTO } from "./types";
import { showToast } from "../../utils/toast";

interface ParcelaFormState {
  name: string;
  location: string;
  soil_type: string;
  size_m2: string;
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

    try {
      if (id) {
        await updateParcela(Number(id), payload);
        showToast("Parcela actualizada correctamente", "success");
      } else {
        await createParcela(payload);
        showToast("Parcela creada correctamente", "success");
      }

      navigate("/parcelas");
    } catch (error) {
      console.error(error);
      showToast("Error al guardar la parcela", "error");
    }
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
            <label htmlFor="name" className="form-label">Nombre</label>
            <input
              id="name"
              name="name"
              className="form-control"
              placeholder="Nombre de la parcela"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          {/* Ubicación */}
          <div className="mb-3">
            <label htmlFor="location" className="form-label">Ubicación</label>
            <input
              id="location"
              name="location"
              className="form-control"
              placeholder="Ej: Huerto norte"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>

          {/* Tipo de suelo */}
          <div className="mb-3">
            <label htmlFor="soil_type" className="form-label">Tipo de suelo</label>
            <input
              id="soil_type"
              name="soil_type"
              className="form-control"
              placeholder="Arcilloso, arenoso..."
              value={form.soil_type}
              onChange={(e) => setForm({ ...form, soil_type: e.target.value })}
            />
          </div>

          {/* Tamaño */}
          <div className="mb-3">
            <label htmlFor="size_m2" className="form-label">Tamaño (m²)</label>
            <input
              id="size_m2"
              name="size_m2"
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
