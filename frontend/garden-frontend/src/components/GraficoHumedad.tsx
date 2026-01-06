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
    hours: { dt: Date | null; humidity: number }[];
}


export default function GraficoHumedad({ hours }: Props) {
    const labels = hours.map(h =>
        h.dt
            ? h.dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "—"
    );

    const data = {
        labels,
        datasets: [
            {
                label: "Humedad (%)",
                data: hours.map(h => h.humidity),
                borderColor: "#20c997",
                backgroundColor: "rgba(32, 201, 151, 0.3)",
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
                max: 100,
            },
        },
    };

    return <Line data={data} options={options} />;
}
