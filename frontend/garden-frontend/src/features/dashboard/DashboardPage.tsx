import DashboardLayout from "../../layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

export default function DashboardPage() {
    const navigate = useNavigate();

    return (
        <DashboardLayout>
            <div className="row g-4">

                {/* PARCELAS */}
                <div className="col-md-3">
                    <div
                        className="card shadow-sm p-4 dashboard-card"
                        onClick={() => navigate("/parcelas")}
                    >
                        <h4 className="fw-bold">Parcelas</h4>
                        <p className="text-muted">Ver parcelas</p>
                    </div>
                </div>

                {/* CULTIVOS */}
                <div className="col-md-3">
                    <div
                        className="card shadow-sm p-4 dashboard-card"
                        onClick={() => navigate("/cultivos")}
                    >
                        <h4 className="fw-bold">Cultivos</h4>
                        <p className="text-muted">Ver cultivos</p>
                    </div>
                </div>

                {/* TAREAS */}
                <div className="col-md-3">
                    <div
                        className="card shadow-sm p-4 dashboard-card"
                        onClick={() => navigate("/tareas")}
                    >
                        <h4 className="fw-bold">Tareas pendientes</h4>
                        <p className="text-muted">Ver tareas</p>
                    </div>
                </div>

                {/* CALENDARIO */}
                <div className="col-md-3">
                    <div
                        className="card shadow-sm p-4 dashboard-card"
                        onClick={() => navigate("/calendario")}
                    >
                        <h4 className="fw-bold">Calendario</h4>
                        <p className="text-muted">Ver calendario</p>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}
