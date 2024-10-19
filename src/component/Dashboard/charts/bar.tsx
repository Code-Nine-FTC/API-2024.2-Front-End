import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    BarElement,
    ChartData,
    ChartOptions,
    scales,
} from "chart.js";

interface FetchBarGraphData {
    month: string;
    value: number;
}

interface BarGraphProps {
    options: ChartOptions<'bar'>;
    data2: FetchBarGraphData[];
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarGraph: React.FC<BarGraphProps> = ({ options, data2 }) => {
    const [isHorizontal, setIsHorizontal] = useState(false);

    const updateChartType = () => {
        if (window.innerWidth < 600) { // Largura que determina se o gráfico é horizontal
            setIsHorizontal(true);
        } else {
            setIsHorizontal(false);
        }
    };

    useEffect(() => {
        updateChartType(); // Verifique a largura da tela ao montar o componente
        window.addEventListener("resize", updateChartType); // Atualiza quando a janela é redimensionada

        return () => {
            window.removeEventListener("resize", updateChartType); // Limpeza do evento ao desmontar
        };
    }, []);

    const data = {
        labels: data2.map(row => row.month),
        datasets: [
            {
                label: "Valores",
                data: data2.map(row => row.value),
                backgroundColor: ["rgba(54, 162, 235, 1)"],
                borderColor: ["rgba(54, 162, 235, 1)"],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        ...options,
        indexAxis: isHorizontal ? 'y' : 'x' as 'y' | 'x', // Tipo assegurado
        scales: {
            y: {
                beginAtZero: true,
            },
            x: {
                beginAtZero: true, // Ativa no gráfico horizontal
            },
        },
    };

    return <Bar options={chartOptions} data={data} />;
};

export default BarGraph;

