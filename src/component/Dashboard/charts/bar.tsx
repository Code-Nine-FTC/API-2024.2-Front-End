import { Bar } from "react-chartjs-2"
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    Title,
    Tooltip,
    Legend,
    BarElement
} from "chart.js"
import {BarChartData} from "./testData/fakeData"

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

const BarGraph = () => {
    return <Bar options={options} data={BarChartData}/>
}

export default BarGraph