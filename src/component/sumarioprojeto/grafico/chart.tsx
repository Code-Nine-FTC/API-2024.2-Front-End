// import React from 'react';
// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';

// ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement);

// interface ChartComponentProps {
//     data: any;
// }

// const ChartComponent: React.FC<ChartComponentProps> = ({ data }) => {
//     const labels = data.labels || []; // Verifica se labels existe
//     const datasets = data.datasets || []; // Verifica se datasets existe

//     const chartData = {
//         labels: labels,
//         datasets: datasets,
//     };

//     const options = {
//         responsive: true,
//         plugins: {
//             legend: {
//                 position: 'top' as const,
//             },
//             title: {
//                 display: true,
//                 text: 'Sumário de Receitas e Gastos',
//             },
//         },
//         scales: {
//             y: {
//                 type: 'linear' as const,
//                 title: {
//                     display: true,
//                     text: 'Valor',
//                 },
//                 ticks: {
//                     callback: function(value: any) {
//                         return Number(value).toLocaleString(); // Formatar os valores do eixo Y
//                     }
//                 }
//             }
//         }
//     };

//     return <Line data={chartData} options={options} />;
// };

// export default ChartComponent;

export default function vazia () {
}
