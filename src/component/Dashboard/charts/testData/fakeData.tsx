const LineChartData = {
    labels: [
        "Domingo",
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sabado"
    ],
    datasets: [
        {
            label: "Passos",
            data: [3000, 2000, 1000, 4000, 7000, 2000, 12342],
            borderColor: "rgb(75, 192, 192)"
        }
    ]
}

const BarChartData = {
    labels: ["Aluguel", "Compras", "Utilidados", "Entretenimento", "Transporte"],
    datasets: [
        {
            label: "Gastos",
            data: [1200, 300, 150, 180, 100],
            backgroundColor: ["rgba(54, 162, 235, 1)"],
            borderColor: ["rgba(54, 162, 235, 1)"],
            borderWidth: 1
        }
    ]
}

const PieChartData = {
    labels: ["Aluguel", "Compras", "Utilidados", "Entretenimento", "Transporte"],
    datasets: [
        {
            label: "Gastos",
            data: [1200, 300, 150, 180, 100],
            backgroundColor: [
                "rgba(54, 162, 235, 1)",
                "rgba(65, 173, 246, 1)",
                "rgba(76, 184, 257, 1)",
                "rgba(87, 195, 268, 1)"
            ],
            borderColor: ["rgba(54, 162, 235, 1)"],
            borderWidth: 1,
            hoverOffset: 4
        }
    ]
}

export {LineChartData, BarChartData, PieChartData}