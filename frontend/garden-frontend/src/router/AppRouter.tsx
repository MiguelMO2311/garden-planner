import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../auth/ProtectedRoute";

import LandingPage from "../features/login/LandingPage";
import RegisterPage from "../features/login/RegisterPage";
import DashboardPage from "../features/dashboard/DashboardPage";

import ParcelaListPage from "../features/parcelas/ParcelaListPage";
import ParcelaFormPage from "../features/parcelas/ParcelaFormPage";
import ParcelaDetailPage from "../features/parcelas/ParcelaDetailPage";
import ParcelasLayout from "../features/parcelas/ParcelasLayout";

import CultivosMainPage from "../features/cultivos/CultivosMainPage";

// Cultivos Tipo
import CultivoTipoListPage from "../features/cultivos_tipo/pages/CultivoTipoListPage";
import CultivoTipoFormPage from "../features/cultivos_tipo/pages/CultivoTipoFormPage";

// Cultivos en Parcela
import CultivoParcelaListPage from "../features/cultivos_parcela/pages/CultivoParcelaListPage";
import CultivoParcelaFormPage from "../features/cultivos_parcela/pages/CultivoParcelaFormPage";

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

            {/* ----------------------------- */}
            {/*        PARCELAS (LAYOUT)      */}
            {/* ----------------------------- */}
            <Route path="/parcelas" element={<ParcelasLayout />}>
                <Route index element={<ParcelaListPage />} />
                <Route path="nueva" element={<ParcelaFormPage />} />
                <Route path=":id" element={<ParcelaDetailPage />} />
                <Route path=":id/editar" element={<ParcelaFormPage />} />
            </Route>

            {/* Cultivos (vista principal) */}
            <Route path="/cultivos" element={<CultivosMainPage />} />

            {/* Cultivos Tipo (catálogo) */}
            <Route path="/cultivos-tipo" element={<CultivoTipoListPage />} />
            <Route path="/cultivos-tipo/nuevo" element={<CultivoTipoFormPage />} />
            <Route path="/cultivos-tipo/:id" element={<CultivoTipoFormPage />} />

            {/* Cultivos en Parcela */}
            <Route path="/cultivos-parcela" element={<CultivoParcelaListPage />} />
            <Route path="/cultivos-parcela/nuevo" element={<CultivoParcelaFormPage />} />
            <Route path="/cultivos-parcela/:id" element={<CultivoParcelaFormPage />} />

            {/* Calendario */}
            <Route path="/calendario" element={<CalendarioPage />} />

            {/* Tareas */}
            <Route path="/tareas" element={<TareaListPage />} />
            <Route path="/tareas/nueva" element={<TareaFormPage />} />
            <Route path="/tareas/:id" element={<TareaFormPage />} />
        </Route>
    </Routes>
);
