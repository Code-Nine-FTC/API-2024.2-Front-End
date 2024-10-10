import React, { useEffect, useState } from "react"
import { Bar } from "react-chartjs-2"
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    Title,
    Tooltip,
    Legend,
    BarElement,
    ChartData,
    ChartOptions
} from "chart.js"
import {BarChartData} from "./testData/fakeData"

interface FetchBarGraphData {
    month: string
    value: number
}

interface BarGraphProps {
    options: ChartOptions<'bar'>
    data2: FetchBarGraphData[]
}

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    BarElement,
    Title,
    Tooltip,
    Legend
)

const options = {}

const data = {}

const BarGraph: React.FC<BarGraphProps> = ({ options }) => {
    const [data2, setData2] = useState<FetchBarGraphData[]>([])

    useEffect(() => {
        fetch('/data.json')
            .then(response => response.json())
            .then(data => setData2(data))
            .catch(error => console.error('Erro ao buscar os dados: ', error))
    }, [])

    const data = {
        labels: data2.map(row => row.month),
        datasets: [
            {
                label: "Gastos",
                data: data2.map(row => row.value),
                backgroundColor: ["rgba(54, 162, 235, 1)"],
                borderColor: ["rgba(54, 162, 235, 1)"],
                borderWidth: 1
            }
        ]
    }
    
    return <Bar options={options} data={data} />
}

export default BarGraph