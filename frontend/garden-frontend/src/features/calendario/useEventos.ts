import { useEffect, useState, useCallback } from "react";
import { getEventos } from "./api/eventosApi";
import type { EventoAgricola } from "./types";

export function useEventos() {
    const [eventos, setEventos] = useState<EventoAgricola[]>([]);
    const [loading, setLoading] = useState(true);

    const loadEventos = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getEventos();
            setEventos(res.data);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let mounted = true;

        const fetch = async () => {
            const res = await getEventos();
            if (mounted) {
                setEventos(res.data);
                setLoading(false);
            }
        };

        fetch();

        return () => {
            mounted = false;
        };
    }, []);

    return {
        eventos,
        loading,
        reload: loadEventos,
    };
}
