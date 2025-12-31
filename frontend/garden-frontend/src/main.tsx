import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css"; // Tailwind después
import "bootstrap/dist/js/bootstrap.bundle.min.js";
  // ← FALTA ESTO
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import AuthProvider from "./auth/AuthProvider";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
