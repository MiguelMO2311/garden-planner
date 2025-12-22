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

export const AppRouter = () => (
    <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard explícito */}
        <Route
            path="/dashboard"
            element={
                <ProtectedRoute>
                    <DashboardPage />
                </ProtectedRoute>
            }
        />

        {/* Redirección de "/" → "/dashboard" */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Rutas protegidas */}
        <Route
            path="/parcelas"
            element={
                <ProtectedRoute>
                    <ParcelaListPage />
                </ProtectedRoute>
            }
        />

        <Route
            path="/parcelas/nueva"
            element={
                <ProtectedRoute>
                    <ParcelaFormPage />
                </ProtectedRoute>
            }
        />

        <Route
            path="/parcelas/:id"
            element={
                <ProtectedRoute>
                    <ParcelaFormPage />
                </ProtectedRoute>
            }
        />

        <Route
            path="/cultivos"
            element={
                <ProtectedRoute>
                    <CultivoListPage />
                </ProtectedRoute>
            }
        />

        <Route
            path="/cultivos/nuevo"
            element={
                <ProtectedRoute>
                    <CultivoFormPage />
                </ProtectedRoute>
            }
        />

        <Route
            path="/cultivos/:id"
            element={
                <ProtectedRoute>
                    <CultivoFormPage />
                </ProtectedRoute>
            }
        />

        <Route
            path="/calendario"
            element={
                <ProtectedRoute>
                    <CalendarioPage />
                </ProtectedRoute>
            }
        />

        <Route
            path="/tareas"
            element={
                <ProtectedRoute>
                    <TareaListPage />
                </ProtectedRoute>
            }
        />

        <Route
            path="/tareas/nueva"
            element={
                <ProtectedRoute>
                    <TareaFormPage />
                </ProtectedRoute>
            }
        />

        <Route
            path="/tareas/:id"
            element={
                <ProtectedRoute>
                    <TareaFormPage />
                </ProtectedRoute>
            }
        />
    </Routes>
);
