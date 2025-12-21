import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex">
            <Sidebar />

            <div className="ml-64 flex-1 min-h-screen bg-gray-100">
                <Navbar />

                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
