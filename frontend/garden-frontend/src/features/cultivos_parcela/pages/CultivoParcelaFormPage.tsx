// src/features/cultivos_parcela/pages/CultivoParcelaFormPage.tsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    createCultivoParcela,
    getCultivoParcela,
    updateCultivoParcela,
    deleteCultivoParcela,
} from "../api/cultivosParcelaApi";

import { getCultivosTipo } from "../../cultivos_tipo/api/cultivosApi";
import { getParcelas } from "../../parcelas/api/parcelasApi";

import CultivoParcelaForm from "../components/CultivoParcelaForm";

import type { CultivoParcelaCreate } from "../types";
import type { CultivoTipo } from "../../cultivos_tipo/types";
import type { Parcela } from "../../parcelas/types";

import { showToast } from "../../../utils/toast";

export default function CultivoParcelaFormPage() {
    const { id } = useParams();
    const isEditing = Boolean(id);
    const navigate = useNavigate();

    const [formData, setFormData] = useState<CultivoParcelaCreate>({
        cultivo_tipo_id: 0,
        parcela_id: 0,
        fecha_siembra: "",
        fecha_cosecha: "",
        estado: "activo",
    });

    const [cultivosTipo, setCultivosTipo] = useState<CultivoTipo[]>([]);
    const [parcelas, setParcelas] = useState<Parcela[]>([]);

    useEffect(() => {
        // Cargar catálogo de cultivos tipo
        getCultivosTipo().then((res) => setCultivosTipo(res.data));

        // Cargar parcelas
        getParcelas().then((res) => setParcelas(res));

        // Si estamos editando, cargar el cultivo en parcela
        if (isEditing) {
            getCultivoParcela(Number(id)).then((res) =>
                setFormData(res.data)
            );
        }
    }, [id, isEditing]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (isEditing) {
                await updateCultivoParcela(Number(id), formData);
                showToast("Cultivo actualizado", "success");
            } else {
                await createCultivoParcela(formData);
                showToast("Cultivo creado", "success");
            }

            navigate("/cultivos-parcela");
        } catch {
            showToast("Error al guardar", "error");
        }
    };

    const handleDelete = async () => {
        if (!isEditing) return;

        try {
            await deleteCultivoParcela(Number(id));
            showToast("Cultivo eliminado", "success");
            navigate("/cultivos-parcela");
        } catch {
            showToast("Error al eliminar", "error");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">
                {isEditing ? "Editar cultivo en parcela" : "Nuevo cultivo en parcela"}
            </h2>

            <CultivoParcelaForm
                form={formData}
                setForm={setFormData}
                cultivosTipo={cultivosTipo}
                parcelas={parcelas}
                onSubmit={handleSubmit}
            />

            {isEditing && (
                <button
                    onClick={handleDelete}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
                >
                    Eliminar
                </button>
            )}
        </div>
    );
}
