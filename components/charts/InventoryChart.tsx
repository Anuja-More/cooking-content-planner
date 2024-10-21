import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function InventoryChart({ inventory }) {
  const sortedInventory = [...inventory].sort((a, b) => a.quantity - b.quantity).slice(0, 10)

  const data = {
    labels: sortedInventory.map(item => item.name),
    datasets: [
      {
        label: 'Quantity',
        data: sortedInventory.map(item => item.quantity),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  }

  const options = {
    indexAxis: 'y' as const,
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  }

  return <Bar data={data} options={options} />
}