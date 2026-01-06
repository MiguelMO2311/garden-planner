import { useEffect, useRef } from "react";
import maplibregl, { Map as MapLibreMap, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface Props {
    lat: number | null;
    lng: number | null;
    onChange: (lat: number, lng: number, address?: string) => void;
}

export default function MapaSelector({ lat, lng, onChange }: Props) {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<MapLibreMap | null>(null);
    const markerRef = useRef<Marker | null>(null);

    const reverseGeocode = async (lat: number, lng: number) => {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

        try {
            const res = await fetch(url);
            const data = await res.json();
            return data.display_name || "";
        } catch {
            return "";
        }
    };

    useEffect(() => {
        if (!mapContainer.current) return;

        if (!mapRef.current) {
            mapRef.current = new maplibregl.Map({
                container: mapContainer.current,
                style: {
                    version: 8,
                    sources: {
                        osm: {
                            type: "raster",
                            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
                            tileSize: 256,
                            attribution: "© OpenStreetMap contributors",
                        },
                    },
                    layers: [
                        {
                            id: "osm",
                            type: "raster",
                            source: "osm",
                        },
                    ],
                },
                center: [lng ?? -3.7038, lat ?? 40.4168],
                zoom: 12,
            });

            mapRef.current.on("load", () => {
                mapRef.current!.resize();
            });

            mapRef.current.on("click", async (e) => {
                const { lng, lat } = e.lngLat;

                if (!markerRef.current) {
                    markerRef.current = new maplibregl.Marker()
                        .setLngLat([lng, lat])
                        .addTo(mapRef.current!);
                } else {
                    markerRef.current.setLngLat([lng, lat]);
                }

                const address = await reverseGeocode(lat, lng);
                onChange(lat, lng, address);
            });
        }

        if (lat && lng && mapRef.current) {
            if (!markerRef.current) {
                markerRef.current = new maplibregl.Marker()
                    .setLngLat([lng, lat])
                    .addTo(mapRef.current);
            } else {
                markerRef.current.setLngLat([lng, lat]);
            }

            mapRef.current.setCenter([lng, lat]);
        }
    }, [lat, lng, onChange]);

    return (
        <div
            ref={mapContainer}
            style={{
                width: "100%",
                height: "350px",
                borderRadius: "8px",
                overflow: "hidden",
                position: "relative",
            }}
        />
    );
}
