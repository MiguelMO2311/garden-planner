import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    createCultivo,
    getCultivo,
    updateCultivo,
    deleteCultivo,
} from "./api/cultivosApi";
import { showToast } from "../../utils/toast";

type FormCultivo = {
    nombre: string;
    temporada_optima: string;
    dias_crecimiento: string;
    litros_agua_semana: string;
    notas: string;
    plot_id: string;
};

export default function CultivoFormPage() {
    const { id } = useParams();
    const isEditing = Boolean(id);
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormCultivo>({
        nombre: "",
        temporada_optima: "",
        dias_crecimiento: "",
        litros_agua_semana: "",
        notas: "",
        plot_id: "",
    });

    useEffect(() => {
        if (isEditing) {
            const fetch = async () => {
                const res = await getCultivo(Number(id));
                const c = res.data;

                setFormData({
                    nombre: c.nombre ?? "",
                    temporada_optima: c.temporada_optima ?? "",
                    dias_crecimiento: c.dias_crecimiento?.toString() ?? "",
                    litros_agua_semana: c.litros_agua_semana?.toString() ?? "",
                    notas: c.notas ?? "",
                    plot_id: c.plot_id?.toString() ?? "",
                });
            };

            fetch();
        }
    }, [id, isEditing]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            nombre: formData.nombre,
            temporada_optima: formData.temporada_optima,
            dias_crecimiento: formData.dias_crecimiento
                ? Number(formData.dias_crecimiento)
                : null,
            litros_agua_semana: formData.litros_agua_semana
                ? Number(formData.litros_agua_semana)
                : null,
            notas: formData.notas,
            plot_id: Number(formData.plot_id),
        };

        try {
            if (isEditing) {
                await updateCultivo(Number(id), payload);
                showToast("Cultivo actualizado correctamente", "success");
            } else {
                await createCultivo(payload);
                showToast("Cultivo creado correctamente", "success");
            }

            navigate("/cultivos");
        } catch {
            showToast("Error al guardar el cultivo", "error");
        }
    };

    const handleDelete = async () => {
        if (!isEditing) return;

        try {
            await deleteCultivo(Number(id));
            showToast("Cultivo eliminado correctamente", "success");
            navigate("/cultivos");
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
                />

                <input
                    type="text"
                    name="temporada_optima"
                    value={formData.temporada_optima}
                    onChange={handleChange}
                    placeholder="Temporada óptima"
                    className="border p-2 w-full rounded"
                />

                <input
                    type="number"
                    name="dias_crecimiento"
                    value={formData.dias_crecimiento}
                    onChange={handleChange}
                    placeholder="Días de crecimiento"
                    className="border p-2 w-full rounded"
                />

                <input
                    type="number"
                    name="litros_agua_semana"
                    value={formData.litros_agua_semana}
                    onChange={handleChange}
                    placeholder="Litros de agua por semana"
                    className="border p-2 w-full rounded"
                />

                <textarea
                    name="notas"
                    value={formData.notas}
                    onChange={handleChange}
                    placeholder="Notas"
                    className="border p-2 w-full rounded"
                />

                <input
                    type="number"
                    name="plot_id"
                    value={formData.plot_id}
                    onChange={handleChange}
                    placeholder="ID de la parcela"
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
