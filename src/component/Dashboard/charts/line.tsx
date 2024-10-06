import { Line } from "react-chartjs-2"
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    Title,
    Tooltip,
    Legend
} from "chart.js"
import {LineChartData} from "./testData/fakeData"

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    Title,
    Tooltip,
    Legend
)

const options = {}

const data = {}

const LineGraph = () => {
    return <Line options={options} data={LineChartData}/>
}

export default LineGraph