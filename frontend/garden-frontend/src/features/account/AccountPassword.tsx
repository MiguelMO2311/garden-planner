import { useState } from "react";
import axios from "../../api/axios";

export default function AccountPassword() {
    const [form, setForm] = useState({
        old_password: "",
        new_password: "",
        confirm_password: ""
    });

    const handleSave = async () => {
        if (form.new_password !== form.confirm_password) {
            alert("Las contraseñas no coinciden");
            return;
        }

        try {
            await axios.put("/auth/me/password", {
                old_password: form.old_password,
                new_password: form.new_password
            });

            alert("Contraseña actualizada correctamente");

            setForm({
                old_password: "",
                new_password: "",
                confirm_password: ""
            });
        } catch {
            alert("Error al actualizar la contraseña");
        }
    };

    return (
        <div className="p-4 border rounded shadow-sm mb-6 bg-white">
            <h2 className="h5 mb-3">Cambiar contraseña</h2>

            <div className="mb-3">
                <label className="form-label">Contraseña actual</label>
                <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={form.old_password}
                    onChange={(e) =>
                        setForm({ ...form, old_password: e.target.value })
                    }
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Nueva contraseña</label>
                <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={form.new_password}
                    onChange={(e) =>
                        setForm({ ...form, new_password: e.target.value })
                    }
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Confirmar nueva contraseña</label>
                <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={form.confirm_password}
                    onChange={(e) =>
                        setForm({ ...form, confirm_password: e.target.value })
                    }
                />
            </div>

            <button className="btn btn-success" onClick={handleSave}>
                Actualizar contraseña
            </button>
        </div>
    );
}
