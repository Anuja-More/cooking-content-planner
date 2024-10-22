import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { FC } from 'react'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// Define the type for a transaction
interface Transaction {
  date: string // Assuming date is a string in the 'YYYY-MM-DD' format
  type: 'income' | 'expense'
  amount: number
}

interface FinancialChartProps {
  transactions: Transaction[]
}

const FinancialChart: FC<FinancialChartProps> = ({ transactions }) => {
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const data = {
    labels: sortedTransactions.map((t) => t.date),
    datasets: [
      {
        label: 'Income',
        data: sortedTransactions.map((t) => (t.type === 'income' ? t.amount : 0)),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Expenses',
        data: sortedTransactions.map((t) => (t.type === 'expense' ? t.amount : 0)),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  }

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return <Line data={data} options={options} />
}

export default FinancialChart
