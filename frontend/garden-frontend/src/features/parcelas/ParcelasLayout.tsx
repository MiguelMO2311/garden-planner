import { Outlet } from "react-router-dom";
import "./parcelas.css";

export default function ParcelasLayout() {
    return (
        <div className="parcelas-bg">
            <Outlet />
        </div>
    );
}
