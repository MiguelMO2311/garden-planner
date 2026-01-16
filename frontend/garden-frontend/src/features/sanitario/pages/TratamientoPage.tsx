// src/features/sanitario/pages/TratamientoPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { crearTratamiento } from "../api/tratamientosApi";
import TratamientoForm from "../components/TratamientoForm";
import type{ CrearTratamientoPayload } from "../types";

export default function TratamientoPage() {
  const { parcelaId, tipo } = useParams();
  const navigate = useNavigate();

  const id = Number(parcelaId);

  const handleSubmit = async (data: CrearTratamientoPayload) => {
    await crearTratamiento(data);
    navigate(`/sanitario/${id}`);
  };

  return (
    <div className="san-page">
      <h2 className="san-page-title">Aplicar tratamiento</h2>

      <TratamientoForm parcelaId={id} tipo={tipo || ""} onSubmit={handleSubmit} />
    </div>
  );
}
