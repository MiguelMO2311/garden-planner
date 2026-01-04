import { useState } from "react";
import axios from "../../api/axios";
import { useAuth } from "../../auth/useAuth";

export default function AccountProfile() {
    const { user, login } = useAuth();

    const [form, setForm] = useState({
        name: user?.name ?? "",
        email: user?.email ?? "",
        avatar: user?.avatar ?? ""
    });

    const handleSave = async () => {
        try {
            const res = await axios.put("/auth/me", form);

            // Actualizar usuario global usando login()
            login(res.data);

            alert("Datos actualizados correctamente");
        } catch {
            alert("Error al actualizar los datos");
        }
    };

    return (
        <div className="p-4 border rounded shadow-sm mb-6 bg-white">
            <h2 className="h5 mb-3">Datos personales</h2>

            <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Tu nombre"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                    type="email"
                    className="form-control"
                    placeholder="tu@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Avatar (URL)</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="https://..."
                    value={form.avatar}
                    onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                />
            </div>

            <div className="mb-3">
                <img
                    src={form.avatar}
                    alt="avatar"
                    className="rounded border"
                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                />
            </div>

            <button className="btn btn-success" onClick={handleSave}>
                Guardar cambios
            </button>
        </div>
    );
}
