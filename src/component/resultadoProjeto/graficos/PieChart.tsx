import React from "react";
import { Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
    data: any;
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
    return <Pie data={data} />;
};

export default PieChart;