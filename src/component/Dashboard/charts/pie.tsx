import React from 'react';
import { Pie } from 'react-chartjs-2';
import { ChartOptions, Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieGraphProps {
  data: { label: string, value: number }[];
}

const PieGraph: React.FC<PieGraphProps> = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.label),
    datasets: [{
      data: data.map(d => d.value),
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40'
      ]
    }]
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false
  };

  return <Pie data={chartData} options={options} />;
};

export default PieGraph;