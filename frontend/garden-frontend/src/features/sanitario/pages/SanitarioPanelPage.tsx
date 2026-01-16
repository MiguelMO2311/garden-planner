// src/features/sanitario/pages/SanitarioPanelPage.tsx
import { useEffect, useState } from "react";
import { getPanelSanitario } from "../api/panelSanitarioApi";
import type { ParcelaSanitariaPanelItem } from "../types";
import ParcelaSanitariaCard from "../components/ParcelaSanitariaCard";

export default function SanitarioPanelPage() {
  const [items, setItems] = useState<ParcelaSanitariaPanelItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPanelSanitario().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="san-loading">Cargando panel sanitario...</div>;

  return (
    <div className="san-page">
      <h2 className="san-page-title">Panel Sanitario</h2>

      {items.length === 0 && (
        <p className="san-empty">No hay parcelas con riesgo sanitario.</p>
      )}

      <div className="san-grid">
        {items.map((item) => (
          <ParcelaSanitariaCard key={item.parcela_id} item={item} />
        ))}
      </div>
    </div>
  );
}
