import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function CreativeToolsChart({ templates }) {
  const templateUsage = templates.reduce((acc, template) => {
    acc[template.name] = template.sections.length
    return acc
  }, {})

  const data = {
    labels: Object.keys(templateUsage),
    datasets: [
      {
        data: Object.values(templateUsage),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  }

  return <Doughnut data={data} />
}