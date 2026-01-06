import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix del icono por defecto (React 19 + Vite)
const defaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface Props {
    lat: number;
    lng: number;
}

export default function MapaVista({ lat, lng }: Props) {
    return (
        <div style={{ height: "400px", width: "100%" }}>
            <MapContainer
                center={[lat, lng]}
                zoom={14}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />

                <Marker position={[lat, lng]} icon={defaultIcon}>
                    <Popup>
                        Ubicación de la parcela
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
