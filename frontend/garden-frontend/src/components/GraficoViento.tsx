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
    hours: { dt: Date | null; wind_speed: number }[];
}

export default function GraficoViento({ hours }: Props) {
    const labels = hours.map(h =>
        h.dt
            ? h.dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "—"
    );

    const data = {
        labels,
        datasets: [
            {
                label: "Viento (km/h)",
                data: hours.map(h => h.wind_speed),
                borderColor: "#6f42c1",
                backgroundColor: "rgba(111, 66, 193, 0.3)",
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
                beginAtZero: true,
            },
        },
    };

    return <Line data={data} options={options} />;
}
