import { useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../auth/useAuth";
import { FaSignInAlt } from "react-icons/fa";

export default function LoginPage() {
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        try {
            const formData = new URLSearchParams();
            formData.append("username", email);
            formData.append("password", password);

            // 1) Login → obtener token
            const response = await api.post("/auth/login", formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            console.log("LOGIN RESPONSE:", response.data);
            const { access_token } = response.data;

            // 2) Llamar al login REAL del AuthProvider
            await login(access_token);

        } catch (err) {
            console.error(err);
            setErrorMsg("Credenciales incorrectas");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-100 via-blue-100 to-purple-100 px-4">
            <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Garden Planner 🌿
                </h1>

                {errorMsg && (
                    <p className="text-red-600 text-center mb-4">
                        {errorMsg}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            placeholder="Contraseña"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200"
                    >
                        <FaSignInAlt />
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}
