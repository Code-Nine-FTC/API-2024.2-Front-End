import { Pie } from "react-chartjs-2"
import { 
    Chart as ChartJS, 
    Tooltip,
    Legend,
    ArcElement
} from "chart.js"
import { PieChartData } from "./testData/fakeData";

ChartJS.register(Tooltip, Legend, ArcElement)

const PieGraph = () => {
    const options = {}

    return <Pie options={options} data={PieChartData}/>
}

export default PieGraph