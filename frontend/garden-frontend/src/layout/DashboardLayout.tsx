import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar fijo */}
            <Sidebar />

            {/* Contenido principal */}
            <div className="flex-1 ml-64 flex flex-col">
                {/* Navbar */}
                <Navbar />

                {/* Contenido */}
                <main className="p-8">
                    <div className="bg-white shadow-md rounded-xl p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

