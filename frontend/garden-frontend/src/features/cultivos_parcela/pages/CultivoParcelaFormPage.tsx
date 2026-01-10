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
        estado: "activo",
    });

    // Campo calculado por backend (solo lectura)
    const [fechaCosecha, setFechaCosecha] = useState<string>("");

    const [cultivosTipo, setCultivosTipo] = useState<CultivoTipo[]>([]);
    const [parcelas, setParcelas] = useState<Parcela[]>([]);

    useEffect(() => {
        getCultivosTipo().then((res) => setCultivosTipo(res.data));
        getParcelas().then((res) => setParcelas(res));

        if (isEditing) {
            getCultivoParcela(Number(id)).then((res) => {
                setFormData({
                    cultivo_tipo_id: res.data.cultivo_tipo_id,
                    parcela_id: res.data.parcela_id,
                    fecha_siembra: res.data.fecha_siembra,
                    estado: res.data.estado,
                });

                setFechaCosecha(res.data.fecha_cosecha ?? "");
            });
        }
    }, [id, isEditing]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (isEditing) {
                const res = await updateCultivoParcela(Number(id), formData);
                setFechaCosecha(res.data.fecha_cosecha);
                showToast("Cultivo actualizado", "success");
            } else {
                const res = await createCultivoParcela(formData);
                setFechaCosecha(res.data.fecha_cosecha);
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
                fechaCosecha={fechaCosecha}   // ← añadido
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
