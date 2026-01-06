// src/features/parcelas/ParcelaFormPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import api from "../../api/axios";
import { showToast } from "../../utils/toast";
import MapaSelector from "../../components/MapaSelector";

import "./parcelas.css";

interface ParcelaFormState {
  name: string;
  location: string;
  soil_type: string;
  size_m2: string;
  lat: string;
  lng: string;
}

interface PlotRead {
  id: number;
  name: string;
  location: string | null;
  soil_type: string | null;
  size_m2: number | null;
  lat: number | null;
  lng: number | null;
}

export default function ParcelaFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState<ParcelaFormState>({
    name: "",
    location: "",
    soil_type: "",
    size_m2: "",
    lat: "",
    lng: "",
  });

  // Carga de datos solo en modo edición
  useEffect(() => {
    if (!isEditing || !id) return;

    let isMounted = true;

    async function load() {
      try {
        const res = await api.get<PlotRead>(`/plots/${id}`);

        if (!isMounted) return;

        const parcela = res.data;

        setForm({
          name: parcela.name,
          location: parcela.location || "",
          soil_type: parcela.soil_type || "",
          size_m2: parcela.size_m2 != null ? String(parcela.size_m2) : "",
          lat: parcela.lat != null ? String(parcela.lat) : "",
          lng: parcela.lng != null ? String(parcela.lng) : "",
        });
      } catch (error: unknown) {
        console.error(error);

        if (axios.isAxiosError(error) && error.response?.status === 404) {
          showToast("Parcela no encontrada", "error");
        } else {
          showToast("Error al cargar la parcela", "error");
        }

        navigate("/parcelas");
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [id, isEditing, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      location: form.location || null,
      soil_type: form.soil_type || null,
      size_m2: form.size_m2 !== "" ? Number(form.size_m2) : null,
      lat: form.lat !== "" ? Number(form.lat) : null,
      lng: form.lng !== "" ? Number(form.lng) : null,
    };

    console.log("Payload enviado:", payload);

    try {
      if (isEditing && id) {
        const res = await api.put<PlotRead>(`/plots/${id}`, payload);
        showToast("Parcela actualizada correctamente", "success");
        navigate(`/parcelas/${res.data.id}`);
      } else {
        const res = await api.post<PlotRead>("/plots", payload);
        showToast("Parcela creada correctamente", "success");
        navigate(`/parcelas/${res.data.id}`);
      }
    } catch (error: unknown) {
      console.error(error);

      if (axios.isAxiosError(error) && error.response) {
        showToast(
          `Error al guardar la parcela: ${error.response.status}`,
          "error"
        );
      } else {
        showToast("Error al guardar la parcela", "error");
      }
    }
  };

  const handleDelete = async () => {
    if (!isEditing || !id) return;

    try {
      await api.delete(`/plots/${id}`);
      showToast("Parcela eliminada correctamente", "success");
      navigate("/parcelas");
    } catch (error: unknown) {
      console.error(error);
      showToast("Error al eliminar la parcela", "error");
    }
  };

  return (
    <div className="parcelas-bg">
      <div className="parcelas-card">
        <h3 className="parcelas-title mb-3">
          {isEditing ? "Editar parcela" : "Nueva parcela"}
        </h3>

        <form onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Nombre</label>
            <input
              id="name"
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
              className="form-control"
              placeholder="Ej: Finca norte"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>

          {/* Tipo de suelo */}
          <div className="mb-3">
            <label htmlFor="soil_type" className="form-label">Tipo de suelo</label>
            <input
              id="soil_type"
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
              type="number"
              className="form-control"
              placeholder="Ej: 1100"
              value={form.size_m2}
              onChange={(e) => setForm({ ...form, size_m2: e.target.value })}
            />
          </div>

          {/* Latitud */}
          <div className="mb-3">
            <label htmlFor="lat" className="form-label">Latitud</label>
            <input
              id="lat"
              type="number"
              step="0.000001"
              className="form-control"
              placeholder="Ej: 40.4678"
              value={form.lat}
              onChange={(e) => setForm({ ...form, lat: e.target.value })}
            />
          </div>

          {/* Longitud */}
          <div className="mb-3">
            <label htmlFor="lng" className="form-label">Longitud</label>
            <input
              id="lng"
              type="number"
              step="0.000001"
              className="form-control"
              placeholder="Ej: -3.7"
              value={form.lng}
              onChange={(e) => setForm({ ...form, lng: e.target.value })}
            />
          </div>

          {/* Mapa */}
          <h5 className="mt-4 mb-2">Seleccionar ubicación en el mapa</h5>

          <div style={{ width: "100%", minHeight: "400px", border: "3px solid blue" }}>
            <MapaSelector
              lat={form.lat !== "" ? Number(form.lat) : null}
              lng={form.lng !== "" ? Number(form.lng) : null}
              onChange={(lat, lng) =>
                setForm({ ...form, lat: String(lat), lng: String(lng) })
              }
            />
          </div>

          {/* Botones */}
          <div className="d-flex gap-3 mt-4">
            <button className="btn btn-success" type="submit">
              {isEditing ? "Actualizar" : "Crear"}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/parcelas")}
            >
              Cancelar
            </button>

            {isEditing && (
              <button
                type="button"
                className="btn btn-danger ms-auto"
                onClick={handleDelete}
              >
                Eliminar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
