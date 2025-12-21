import type { ReactNode } from "react";

export default function MetricCard({
    title,
    value,
    icon,
}: {
    title: string;
    value: string | number;
    icon: ReactNode;
}) {
    return (
        <div className="bg-white shadow rounded-lg p-5 flex items-center gap-4">
            <div className="text-blue-600 text-3xl">{icon}</div>

            <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <p className="text-2xl font-semibold">{value}</p>
            </div>
        </div>
    );
}
