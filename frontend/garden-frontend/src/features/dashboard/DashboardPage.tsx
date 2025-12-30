import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useCounter } from "./../hooks/useCounter";

import { FaMapMarkedAlt, FaTasks, FaCalendarAlt } from "react-icons/fa";
import { GiPlantRoots } from "react-icons/gi";

import "./dashboard.css";

export default function DashboardPage() {
    const navigate = useNavigate();

    const [counts, setCounts] = useState({
        parcelas: 0,
        cultivos: 0,
        tareas: 0,
        calendario: 0,
    });

    const loadCounts = useCallback(async () => {
        try {
            const [p, c, t, cal] = await Promise.all([
                api.get("/plots"),       // ← CORREGIDO
                api.get("/cultivos"),
                api.get("/tareas"),
                api.get("/calendar"),
            ]);

            setCounts({
                parcelas: p.data.length,
                cultivos: c.data.length,
                tareas: t.data.length,
                calendario: cal.data.length,
            });
        } catch (err) {
            console.error("Error cargando contadores:", err);
        }
    }, []);

    useEffect(() => {
        const run = async () => {
            await loadCounts();
        };
        run();
    }, [loadCounts]);

    // Contadores animados
    const parcelasCount = useCounter(counts.parcelas);
    const cultivosCount = useCounter(counts.cultivos);
    const tareasCount = useCounter(counts.tareas);
    const calendarioCount = useCounter(counts.calendario);

    return (
        <DashboardLayout>
            <div className="dashboard-bg">
                <div className="row g-4">

                    {/* PARCELAS */}
                    <div className="col-12 col-md-6 col-lg-3">
                        <div
                            className="dashboard-card-saas"
                            onClick={() => navigate("/parcelas")}
                        >
                            <FaMapMarkedAlt className="dashboard-icon text-primary" />
                            <h4 className="fw-bold mt-3">Parcelas</h4>
                            <p className="text-muted">Ver parcelas</p>

                            <div className="dashboard-counter text-primary">
                                {parcelasCount}
                            </div>
                        </div>
                    </div>

                    {/* CULTIVOS */}
                    <div className="col-12 col-md-6 col-lg-3">
                        <div
                            className="dashboard-card-saas"
                            onClick={() => navigate("/cultivos")}
                        >
                            <GiPlantRoots className="dashboard-icon text-success" />
                            <h4 className="fw-bold mt-3">Cultivos</h4>
                            <p className="text-muted">Ver cultivos</p>

                            <div className="dashboard-counter text-success">
                                {cultivosCount}
                            </div>
                        </div>
                    </div>

                    {/* TAREAS */}
                    <div className="col-12 col-md-6 col-lg-3">
                        <div
                            className="dashboard-card-saas"
                            onClick={() => navigate("/tareas")}
                        >
                            <FaTasks className="dashboard-icon text-warning" />
                            <h4 className="fw-bold mt-3">Tareas</h4>
                            <p className="text-muted">Ver tareas</p>

                            <div className="dashboard-counter text-warning">
                                {tareasCount}
                            </div>
                        </div>
                    </div>

                    {/* CALENDARIO */}
                    <div className="col-12 col-md-6 col-lg-3">
                        <div
                            className="dashboard-card-saas"
                            onClick={() => navigate("/calendario")}
                        >
                            <FaCalendarAlt className="dashboard-icon text-danger" />
                            <h4 className="fw-bold mt-3">Calendario</h4>
                            <p className="text-muted">Ver calendario</p>

                            <div className="dashboard-counter text-danger">
                                {calendarioCount}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}
