import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    createCultivoTipo,
    getCultivoTipo,
    updateCultivoTipo,
    deleteCultivoTipo,
} from "../api/cultivosApi";

import { showToast } from "../../../utils/toast";
import type { CultivoTipoCreate, CultivoTipo } from "../types";

export default function CultivoTipoFormPage() {
    const { id } = useParams();
    const isEditing = Boolean(id);
    const navigate = useNavigate();

    const [formData, setFormData] = useState<CultivoTipoCreate>({
        nombre: "",
        temporada_optima: "",
        dias_crecimiento: null,
        litros_agua_semana: null,
        notas: "",
    });

    // Cargar datos si estamos editando
    useEffect(() => {
        if (isEditing) {
            const fetch = async () => {
                const res = await getCultivoTipo(Number(id));
                const c: CultivoTipo = res.data;

                setFormData({
                    nombre: c.nombre ?? "",
                    temporada_optima: c.temporada_optima ?? "",
                    dias_crecimiento: c.dias_crecimiento ?? null,
                    litros_agua_semana: c.litros_agua_semana ?? null,
                    notas: c.notas ?? "",
                });
            };

            fetch();
        }
    }, [id, isEditing]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]:
                name === "dias_crecimiento" || name === "litros_agua_semana"
                    ? value
                        ? Number(value)
                        : null
                    : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (isEditing) {
                await updateCultivoTipo(Number(id), formData);
                showToast("Cultivo actualizado correctamente", "success");
            } else {
                await createCultivoTipo(formData);
                showToast("Cultivo creado correctamente", "success");
            }

            navigate("/cultivos-tipo");
        } catch {
            showToast("Error al guardar el cultivo", "error");
        }
    };

    const handleDelete = async () => {
        if (!isEditing) return;

        try {
            await deleteCultivoTipo(Number(id));
            showToast("Cultivo eliminado correctamente", "success");
            navigate("/cultivos-tipo");
        } catch {
            showToast("Error al eliminar el cultivo", "error");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">
                {isEditing ? "Editar cultivo" : "Nuevo cultivo"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

                <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Nombre"
                    className="border p-2 w-full rounded"
                    required
                />

                <input
                    type="text"
                    name="temporada_optima"
                    value={formData.temporada_optima ?? ""}
                    onChange={handleChange}
                    placeholder="Temporada óptima"
                    className="border p-2 w-full rounded"
                />

                <input
                    type="number"
                    name="dias_crecimiento"
                    value={formData.dias_crecimiento ?? ""}
                    onChange={handleChange}
                    placeholder="Días de crecimiento"
                    className="border p-2 w-full rounded"
                />

                <input
                    type="number"
                    name="litros_agua_semana"
                    value={formData.litros_agua_semana ?? ""}
                    onChange={handleChange}
                    placeholder="Litros de agua por semana"
                    className="border p-2 w-full rounded"
                />

                <textarea
                    name="notas"
                    value={formData.notas ?? ""}
                    onChange={handleChange}
                    placeholder="Notas"
                    className="border p-2 w-full rounded"
                />

                <div className="flex gap-3 mt-4">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                    >
                        {isEditing ? "Actualizar" : "Crear"}
                    </button>

                    {isEditing && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                        >
                            Eliminar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
