import { useState, useEffect } from "react";
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

    // -----------------------------
    // CARRUSEL SIN BOOTSTRAP
    // -----------------------------
    const carouselItems = [
        {
            url: "https://www.youtube.com/embed/KQsoJ7n5DX0",
            title: "Consejos prácticos para empezar tu huerto"
        },
        {
            url: "https://www.youtube.com/embed/AhW6X5f9L_w",
            title: "Cómo empezar un huerto desde cero"
        },
        {
            url: "https://www.youtube.com/embed/8wZ2gYdExgA",
            title: "Últimas noticias del sector agrícola"
        },
        {
            url: "https://www.youtube.com/embed/0qkYyqS-gGk",
            title: "Cómo afecta el clima a tus cultivos"
        }
    ];

    const [carouselIndex, setCarouselIndex] = useState(0);

    const totalSlides = carouselItems.length;

    useEffect(() => {
        const interval = setInterval(() => {
            setCarouselIndex(prev =>
                prev + 1 < totalSlides ? prev + 1 : 0
            );
        }, 4000);

        return () => clearInterval(interval);
    }, [totalSlides]);

    // -----------------------------
    // LOGIN
    // -----------------------------
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = new URLSearchParams();
            data.append("username", form.email);
            data.append("password", form.password);

            const res = await api.post("/auth/login", data, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
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

            {/* CARRUSEL SIN BOOTSTRAP */}
            <div className="landing-carousel-container mx-auto mt-4">
                <div
                    className="landing-carousel-inner"
                    style={{
                        transform: `translateX(-${carouselIndex * 100}%)`
                    }}
                >
                    {carouselItems.map((item, index) => (
                        <div key={index} className="landing-carousel-item">
                            <div className="ratio ratio-16x9">
                                <iframe
                                    src={item.url}
                                    title={item.title}
                                    allowFullScreen
                                ></iframe>
                            </div>

                            <p className="mt-2">{item.title}</p>

                            <small className="text-light">
                                {new Date().toLocaleDateString("es-ES", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric"
                                })}
                            </small>
                        </div>
                    ))}
                </div>
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
