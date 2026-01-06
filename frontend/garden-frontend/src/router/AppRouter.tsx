import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../auth/ProtectedRoute";

import LandingPage from "../features/login/LandingPage";
import RegisterPage from "../features/login/RegisterPage";
import DashboardPage from "../features/dashboard/DashboardPage";

import ParcelaListPage from "../features/parcelas/ParcelaListPage";
import ParcelaFormPage from "../features/parcelas/ParcelaFormPage";
import ParcelaDetailPage from "../features/parcelas/ParcelaDetailPage";

import CultivoListPage from "../features/cultivos/CultivoListPage";
import CultivoFormPage from "../features/cultivos/CultivoFormPage";

import CalendarioPage from "../features/calendario/CalendarioPage";

import TareaListPage from "../features/tareas/TareaListPage";
import TareaFormPage from "../features/tareas/TareaFormPage";

import AppLayout from "../layout/AppLayout";
import AccountPage from "../features/account/AccountPage";

export const AppRouter = () => (
    <Routes>
        {/* Landing pública */}
        <Route path="/" element={<LandingPage />} />

        {/* Register público */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas protegidas */}
        <Route
            element={
                <ProtectedRoute>
                    <AppLayout />
                </ProtectedRoute>
            }
        >
            {/* Dashboard */}
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Página de cuenta */}
            <Route path="/account" element={<AccountPage />} />

            {/* Parcelas */}
            <Route path="/parcelas" element={<ParcelaListPage />} />
            <Route path="/parcelas/nueva" element={<ParcelaFormPage />} />
            <Route path="/parcelas/:id" element={<ParcelaDetailPage />} />
            <Route path="/parcelas/:id/editar" element={<ParcelaFormPage />} />

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
