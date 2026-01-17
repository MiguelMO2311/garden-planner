import { useParams, useNavigate } from "react-router-dom";
import { aplicarTratamiento } from "../api/tratamientosAplicadosApi";
import TratamientoForm from "../components/TratamientoForm";
import { getTratamientos } from "../api/tratamientosApi";
import { useEffect, useState } from "react";

export default function TratamientoPage() {
  const { parcelaId } = useParams();
  const navigate = useNavigate();
  const id = Number(parcelaId);

  const [catalogo, setCatalogo] = useState([]);

  useEffect(() => {
    getTratamientos().then(setCatalogo);
  }, []);

  const handleSubmit = async (data: {
    tratamiento_id: number;
    cultivo_parcela_id: number;
    fecha_inicio?: string;
    observaciones?: string;
  }) => {
    await aplicarTratamiento(data);
    navigate(`/sanitario/${id}`);
  };

  return (
    <div className="san-page">
      <h2 className="san-page-title">Aplicar tratamiento</h2>

      <TratamientoForm
        parcelaId={id}
        tratamientosCatalogo={catalogo}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
