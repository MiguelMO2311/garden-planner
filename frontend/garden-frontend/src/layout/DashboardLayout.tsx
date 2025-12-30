import "./layout.css";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="dashboard-container d-flex flex-column">
            <Navbar />

            <div className="d-flex grow">
                <Sidebar />

                <main className="grow p-4">
                    <div className="card shadow-sm p-4">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
