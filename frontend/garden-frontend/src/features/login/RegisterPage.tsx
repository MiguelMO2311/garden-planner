import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import bgRegister from "../../assets/backgrounds/register-bg.webp";
import "./login.css";

interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    avatar?: string | null;
}

export default function RegisterPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState<RegisterPayload>({
        name: "",
        email: "",
        password: "",
        avatar: "/static/avatars/default.jpg"
    });

    // 🔥 Aplicamos el background dinámicamente SIN inline styles
    useEffect(() => {
        document.documentElement.style.setProperty(
            "--register-bg",
            `url(${bgRegister})`
        );
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await api.post("/auth/register", form);

            alert("Registro completado. Ahora puedes iniciar sesión.");
            navigate("/");

        } catch (error) {
            console.error("Error al registrar usuario:", error);
            alert("Error al registrar usuario");
        }
    };

    return (
        <div className="landing-container register-bg dynamic-bg">
            <div className="login-box register-box bg-white p-4 rounded shadow">
                <h3 className="fw-bold mb-3 text-center">Crear cuenta</h3>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Nombre"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                    />

                    <input
                        type="email"
                        className="form-control mb-3"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                    />

                    <input
                        type="password"
                        className="form-control mb-3"
                        placeholder="Contraseña"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                    />

                    <button type="submit" className="btn btn-success w-100">
                        Registrarse
                    </button>
                </form>

                <button
                    className="btn btn-link mt-3 w-100"
                    onClick={() => navigate("/")}
                >
                    Volver al landing Page
                </button>
            </div>
        </div>
    );
}
