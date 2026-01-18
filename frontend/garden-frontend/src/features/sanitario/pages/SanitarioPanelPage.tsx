// src/features/sanitario/pages/SanitarioPanelPage.tsx
import { useEffect, useMemo, useState } from "react";
import { getPanelSanitario } from "../api/panelSanitarioApi";
import type { ParcelaSanitariaPanelItem } from "../types";

export default function SanitarioPanelPage() {
  const [items, setItems] = useState<ParcelaSanitariaPanelItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPanelSanitario()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const kpis = useMemo(() => {
    return items.reduce(
      (acc, p) => {
        acc.riesgosActivos += p.riesgos.activos;
        acc.alertasPendientes += p.alertas.pendientes;
        acc.alertasConfirmadas += p.alertas.confirmadas;
        acc.alertasDescartadas += p.alertas.descartadas;

        acc.eventosActivos += p.eventos.activos;
        acc.eventosResueltos += p.eventos.resueltos;

        acc.recoPendientes += p.recomendaciones.pendientes;
        acc.recoRealizadas += p.recomendaciones.realizadas;
        acc.recoDescartadas += p.recomendaciones.descartadas;

        acc.tratEnProgreso += p.tratamientos.en_progreso;
        acc.tratFinalizados += p.tratamientos.finalizados;

        acc.tareasPendientes += p.tareas_sanitarias.pendientes;
        acc.tareasCompletadas += p.tareas_sanitarias.completadas;

        acc.plagasActivas += p.plagas.activas;
        acc.plagasHistorial += p.plagas.historial;

        acc.enfActivas += p.enfermedades.activas;
        acc.enfHistorial += p.enfermedades.historial;

        return acc;
      },
      {
        riesgosActivos: 0,
        alertasPendientes: 0,
        alertasConfirmadas: 0,
        alertasDescartadas: 0,
        eventosActivos: 0,
        eventosResueltos: 0,
        recoPendientes: 0,
        recoRealizadas: 0,
        recoDescartadas: 0,
        tratEnProgreso: 0,
        tratFinalizados: 0,
        tareasPendientes: 0,
        tareasCompletadas: 0,
        plagasActivas: 0,
        plagasHistorial: 0,
        enfActivas: 0,
        enfHistorial: 0,
      }
    );
  }, [items]);

  if (loading) {
    return (
      <div className="san-page">
        <h2 className="san-page-title">Panel sanitario</h2>
        <p className="san-page-subtitle">Cargando datos sanitarios…</p>
      </div>
    );
  }

  return (
    <div className="san-page">
      <h2 className="san-page-title">Panel sanitario</h2>
      <p className="san-page-subtitle">
        Visión global del estado sanitario de todas las parcelas y cultivos.
      </p>

      {/* KPIs principales */}
      <section className="san-grid san-grid-kpis">
        <div className="san-info-box san-info-box-warning">
          <div className="san-info-box-label">Riesgos activos</div>
          <div className="san-info-box-value">{kpis.riesgosActivos}</div>
        </div>

        <div className="san-info-box san-info-box-danger">
          <div className="san-info-box-label">Alertas pendientes</div>
          <div className="san-info-box-value">{kpis.alertasPendientes}</div>
        </div>

        <div className="san-info-box san-info-box-success">
          <div className="san-info-box-label">Tratamientos en progreso</div>
          <div className="san-info-box-value">{kpis.tratEnProgreso}</div>
        </div>

        <div className="san-info-box san-info-box-info">
          <div className="san-info-box-label">Tareas sanitarias pendientes</div>
          <div className="san-info-box-value">{kpis.tareasPendientes}</div>
        </div>
      </section>

      {/* Bloques sanitarios globales */}
      <section className="san-grid san-grid-section">
        <div className="san-card san-card-section">
          <div className="san-card-header">
            <h3 className="san-card-title">Alertas</h3>
          </div>
          <div className="san-card-body san-kpi-list">
            <div className="san-kpi-row">
              <span>Pendientes</span>
              <span className="badge badge-alerta-pendiente">
                {kpis.alertasPendientes}
              </span>
            </div>
            <div className="san-kpi-row">
              <span>Confirmadas</span>
              <span className="badge badge-alerta-confirmada">
                {kpis.alertasConfirmadas}
              </span>
            </div>
            <div className="san-kpi-row">
              <span>Descartadas</span>
              <span className="badge badge-alerta-descartada">
                {kpis.alertasDescartadas}
              </span>
            </div>
          </div>
        </div>

        <div className="san-card san-card-section">
          <div className="san-card-header">
            <h3 className="san-card-title">Recomendaciones</h3>
          </div>
          <div className="san-card-body san-kpi-list">
            <div className="san-kpi-row">
              <span>Pendientes</span>
              <span className="badge badge-reco-pendiente">
                {kpis.recoPendientes}
              </span>
            </div>
            <div className="san-kpi-row">
              <span>Realizadas</span>
              <span className="badge badge-reco-realizada">
                {kpis.recoRealizadas}
              </span>
            </div>
            <div className="san-kpi-row">
              <span>Descartadas</span>
              <span className="badge badge-reco-descartada">
                {kpis.recoDescartadas}
              </span>
            </div>
          </div>
        </div>

        <div className="san-card san-card-section">
          <div className="san-card-header">
            <h3 className="san-card-title">Eventos sanitarios</h3>
          </div>
          <div className="san-card-body san-kpi-list">
            <div className="san-kpi-row">
              <span>Activos</span>
              <span className="badge badge-evento-activa">
                {kpis.eventosActivos}
              </span>
            </div>
            <div className="san-kpi-row">
              <span>Resueltos</span>
              <span className="badge badge-evento-resuelta">
                {kpis.eventosResueltos}
              </span>
            </div>
          </div>
        </div>

        <div className="san-card san-card-section">
          <div className="san-card-header">
            <h3 className="san-card-title">Plagas y enfermedades</h3>
          </div>
          <div className="san-card-body san-kpi-list">
            <div className="san-kpi-row">
              <span>Plagas activas</span>
              <span className="badge badge-plaga-activa">
                {kpis.plagasActivas}
              </span>
            </div>
            <div className="san-kpi-row">
              <span>Enfermedades activas</span>
              <span className="badge badge-enfermedad-activa">
                {kpis.enfActivas}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Tabla / grid por parcela-cultivo */}
      <section className="san-section">
        <h3 className="san-section-title">Detalle por parcela y cultivo</h3>

        <div className="san-table-wrapper">
          <table className="san-table">
            <thead>
              <tr>
                <th>Parcela</th>
                <th>Cultivo</th>
                <th>Riesgos</th>
                <th>Alertas</th>
                <th>Recomendaciones</th>
                <th>Tratamientos</th>
                <th>Tareas sanitarias</th>
                <th>Plagas</th>
                <th>Enfermedades</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={`${p.parcela_id}-${p.cultivo_parcela_id}`}>
                  <td>{p.parcela_nombre ?? `Parcela #${p.parcela_id}`}</td>
                  <td>{p.cultivo_tipo_nombre ?? `Cultivo #${p.cultivo_tipo_id}`}</td>
                  <td>
                    {p.riesgos.activos} / {p.riesgos.historial}
                  </td>
                  <td>
                    {p.alertas.pendientes} / {p.alertas.confirmadas} /{" "}
                    {p.alertas.descartadas}
                  </td>
                  <td>
                    {p.recomendaciones.pendientes} / {p.recomendaciones.realizadas} /{" "}
                    {p.recomendaciones.descartadas}
                  </td>
                  <td>
                    {p.tratamientos.en_progreso} / {p.tratamientos.finalizados}
                  </td>
                  <td>
                    {p.tareas_sanitarias.pendientes} / {p.tareas_sanitarias.completadas}
                  </td>
                  <td>
                    {p.plagas.activas} / {p.plagas.historial}
                  </td>
                  <td>
                    {p.enfermedades.activas} / {p.enfermedades.historial}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
