import { Radar } from 'react-chartjs-2'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

export default function EducationChart({ resources }) {
  const categories = resources.reduce((acc, resource) => {
    acc[resource.category] = (acc[resource.category] || 0) + 1
    return acc
  }, {})

  const data = {
    labels: Object.keys(categories),
    datasets: [
      {
        label: 'Resources per Category',
        data: Object.values(categories),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  }

  return <Radar data={data} />
}