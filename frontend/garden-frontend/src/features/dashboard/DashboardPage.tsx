import DashboardLayout from "../../layout/DashboardLayout";
import MetricCard from "./components/MetricCard";
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function DashboardPage() {
    const [stats, setStats] = useState({
        parcelas: 0,
        cultivos: 0,
        tareas: 0,
        clima: "—",
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get("/dashboard/stats");
                setStats(res.data);
            } catch {
                // fallback si la API aún no existe
                setStats({
                    parcelas: 4,
                    cultivos: 12,
                    tareas: 7,
                    clima: "Soleado",
                });
            }
        };

        fetchStats();
    }, []);

    return (
        <DashboardLayout>
            <h2 className="text-3xl font-bold mb-6">Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <MetricCard
                    title="Parcelas"
                    value={stats.parcelas}
                    icon={<span>🌱</span>}
                />

                <MetricCard
                    title="Cultivos"
                    value={stats.cultivos}
                    icon={<span>🥕</span>}
                />

                <MetricCard
                    title="Tareas pendientes"
                    value={stats.tareas}
                    icon={<span>📋</span>}
                />

                <MetricCard
                    title="Clima"
                    value={stats.clima}
                    icon={<span>☀️</span>}
                />
            </div>
        </DashboardLayout>
    );
}
