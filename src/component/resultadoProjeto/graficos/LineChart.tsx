import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement);

interface LineChartProps {
    data: any;
    options: any;
}

const LineChart: React.FC<LineChartProps> = ({ data, options }) => {
    return <Line data={data} options={options} />;
};

export default LineChart;