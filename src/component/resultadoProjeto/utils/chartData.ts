export const pieData = {
    labels: ["Tipo 1", "Tipo 2", "Tipo 3"],
    datasets: [
        {
            data: [10, 20, 30],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        },
    ],
};

export const barData = {
    labels: ["Janeiro", "Fevereiro", "Março"],
    datasets: [
        {
            label: "Gastos",
            data: [65, 59, 80],
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 1,
        },
    ],
};

export const barOptions = {
    scales: {
        y: {
            beginAtZero: true,
        },
    },
};

export const lineData = {
    labels: ["Janeiro", "Fevereiro", "Março"],
    datasets: [
        {
            label: "Receitas",
            data: [50, 60, 70],
            borderColor: "rgba(75,192,192,1)",
            backgroundColor: "rgba(75,192,192,0.4)",
            fill: false,
        },
        {
            label: "Gastos",
            data: [65, 59, 80],
            borderColor: "rgba(255,99,132,1)",
            backgroundColor: "rgba(255,99,132,0.4)",
            fill: false,
        },
    ],
};

export const lineOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Receitas e Gastos',
        },
    },
    scales: {
        y: {
            beginAtZero: true,
        },
    },
};