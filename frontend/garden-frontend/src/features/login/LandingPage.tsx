import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../auth/useAuth";
import bgImage from "../../assets/backgrounds/landingPage-bg.webp";
import "./login.css";

export default function LandingPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [showLogin, setShowLogin] = useState(false);
    const [form, setForm] = useState({ email: "", password: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // OAuth2PasswordRequestForm requiere x-www-form-urlencoded
            const data = new URLSearchParams();
            data.append("username", form.email);
            data.append("password", form.password);

            const res = await api.post("/auth/login", data, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });

            const token = res.data.access_token;
            await login(token);
            setShowLogin(false);
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            alert("Credenciales incorrectas");
        }
    };

    return (
        <div
            className="landing-container text-white"
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                minHeight: "100vh"
            }}
        >
            {/* NAVBAR */}
            <nav className="landing-navbar d-flex justify-content-between align-items-center px-4 py-3">
                <div className="logo fw-bold fs-4 text-white">🌱 Garden Planner</div>

                <div className="d-flex gap-3">
                    <button className="btn btn-outline-light" onClick={() => setShowLogin(true)}>
                        Login
                    </button>

                    <button className="btn btn-success" onClick={() => navigate("/register")}>
                        Register
                    </button>
                </div>
            </nav>

            {/* HERO */}
            <header className="landing-hero text-center py-5">
                <h1 className="fw-bold display-5">Organiza tu huerto como un profesional</h1>
                <p className="mt-3 fs-5">
                    Calendario agrícola, gestión de tareas, parcelas y cultivos en sitios distintos desde un solo lugar.
                </p>
            </header>

            {/* CARRUSEL */}
            <div
                id="carouselExample"
                className="carousel slide mx-auto mt-4"
                style={{ width: "40%" }}
            >
                <div className="carousel-inner">

                    {/* ITEM 1 */}
                    <div className="carousel-item active text-center">
                        <div className="ratio ratio-16x9">
                            <iframe
                                src="https://www.youtube.com/embed/KQsoJ7n5DX0"
                                title="Consejos de cultivo"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <p className="mt-2">Consejos prácticos para empezar tu huerto</p>
                    </div>

                    {/* ITEM 2 */}
                    <div className="carousel-item text-center">
                        <div className="ratio ratio-16x9">
                            <iframe
                                src="https://www.youtube.com/embed/AhW6X5f9L_w"
                                title="Cómo empezar un huerto desde cero"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <p className="mt-2">Cómo empezar un huerto desde cero</p>
                    </div>

                    {/* ITEM 3 */}
                    <div className="carousel-item text-center">
                        <div className="ratio ratio-16x9">
                            <iframe
                                src="https://www.youtube.com/embed/8wZ2gYdExgA"
                                title="Noticias agrícolas"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <p className="mt-2">Últimas noticias del sector agrícola</p>
                    </div>

                    {/* ITEM 4 */}
                    <div className="carousel-item text-center">
                        <div className="ratio ratio-16x9">
                            <iframe
                                src="https://www.youtube.com/embed/0qkYyqS-gGk"
                                title="Meteorología"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <p className="mt-2">Cómo afecta el clima a tus cultivos</p>
                    </div>

                </div>

                {/* CONTROLES ACCESIBLES */}
                <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselExample"
                    data-bs-slide="prev"
                    aria-label="Anterior"
                    title="Anterior"
                >
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                </button>

                <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselExample"
                    data-bs-slide="next"
                    aria-label="Siguiente"
                    title="Siguiente"
                >
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                </button>
            </div>

            {/* MODAL LOGIN */}
            {showLogin && (
                <div className="login-modal">
                    <div className="login-box bg-white p-4 rounded shadow text-dark">
                        <h3 className="fw-bold mb-3">Iniciar sesión</h3>

                        <form onSubmit={handleSubmit}>
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
                            <button type="submit" className="btn btn-primary w-100">
                                Entrar
                            </button>
                        </form>

                        <button className="btn btn-link mt-3" onClick={() => setShowLogin(false)}>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {/* FOOTER */}
            <footer className="landing-footer text-center py-3 mt-5">
                <p>© 2026 Garden Planner</p>
                <a href="/contacto" className="text-white text-decoration-underline">
                    Contacto
                </a>
            </footer>
        </div>
    );
}
