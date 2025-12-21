import { useEffect, useState } from "react";
import { getEventos } from "./api/eventosApi";

export function useEventos() {
    const [eventos, setEventos] = useState([]);

    useEffect(() => {
        getEventos().then((res) => setEventos(res.data));
    }, []);

    return eventos;
}
