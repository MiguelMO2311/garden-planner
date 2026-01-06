import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

interface Props {
    hours: { dt: Date | null; temp: number }[];
}

export default function GraficoTemperatura({ hours }: Props) {
    const labels = hours.map(h =>
        h.dt
            ? h.dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "—"
    );

    const data = {
        labels,
        datasets: [
            {
                label: "Temperatura (°C)",
                data: hours.map(h => h.temp),
                borderColor: "#0d6efd",
                backgroundColor: "rgba(13,110,253,0.3)",
                tension: 0.3,
                pointRadius: 3,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: true },
        },
        scales: {
            y: {
                beginAtZero: false,
            },
        },
    };

    return <Line data={data} options={options} />;
}
