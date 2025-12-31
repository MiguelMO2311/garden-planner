import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import "./layout.css";

export default function AppLayout() {
    return (
        <>
            <Navbar />
            <Sidebar />
            <main className="main-content">
                <Outlet />
            </main>
        </>
    );
}
