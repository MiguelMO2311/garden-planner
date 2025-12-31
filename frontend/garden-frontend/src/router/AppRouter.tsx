import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "../auth/ProtectedRoute";

import LoginPage from "../features/login/LoginPage";
import DashboardPage from "../features/dashboard/DashboardPage";

import ParcelaListPage from "../features/parcelas/ParcelaListPage";
import ParcelaFormPage from "../features/parcelas/ParcelaFormPage";

import CultivoListPage from "../features/cultivos/CultivoListPage";
import CultivoFormPage from "../features/cultivos/CultivoFormPage";

import CalendarioPage from "../features/calendario/CalendarioPage";

import TareaListPage from "../features/tareas/TareaListPage";
import TareaFormPage from "../features/tareas/TareaFormPage";

import AppLayout from "../layout/AppLayout";

export const AppRouter = () => (
    <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas protegidas con layout */}
        <Route
            element={
                <ProtectedRoute>
                    <AppLayout />
                </ProtectedRoute>
            }
        >
            {/* Redirección "/" → "/dashboard" */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Dashboard */}
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Parcelas */}
            <Route path="/parcelas" element={<ParcelaListPage />} />
            <Route path="/parcelas/nueva" element={<ParcelaFormPage />} />
            <Route path="/parcelas/:id" element={<ParcelaFormPage />} />

            {/* Cultivos */}
            <Route path="/cultivos" element={<CultivoListPage />} />
            <Route path="/cultivos/nuevo" element={<CultivoFormPage />} />
            <Route path="/cultivos/:id" element={<CultivoFormPage />} />

            {/* Calendario */}
            <Route path="/calendario" element={<CalendarioPage />} />

            {/* Tareas */}
            <Route path="/tareas" element={<TareaListPage />} />
            <Route path="/tareas/nueva" element={<TareaFormPage />} />
            <Route path="/tareas/:id" element={<TareaFormPage />} />
        </Route>
    </Routes>
);
