import { useState } from "react";
import axios from "../../api/axios";
import { useAuth } from "../../auth/useAuth";

export default function AccountDelete() {
    const { logout } = useAuth();
    const [confirmText, setConfirmText] = useState("");

    const handleDelete = async () => {
        if (confirmText !== "ELIMINAR") {
            alert("Debes escribir ELIMINAR para confirmar");
            return;
        }

        try {
            await axios.delete("/auth/me");

            alert("Cuenta eliminada correctamente");

            logout(); // cerrar sesión y limpiar estado global
        } catch {
            alert("Error al eliminar la cuenta");
        }
    };

    return (
        <div className="p-4 border rounded shadow-sm bg-white">
            <h2 className="h5 mb-3 text-danger">Eliminar cuenta</h2>

            <p className="text-muted">
                Esta acción es irreversible. Se eliminarán todos tus datos,
                parcelas, cultivos y tareas asociadas.
            </p>

            <p className="fw-semibold">
                Para confirmar, escribe <span className="text-danger">ELIMINAR</span>:
            </p>

            <input
                type="text"
                className="form-control mb-3"
                placeholder="Escribe ELIMINAR"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
            />

            <button className="btn btn-danger" onClick={handleDelete}>
                Eliminar mi cuenta
            </button>
        </div>
    );
}
