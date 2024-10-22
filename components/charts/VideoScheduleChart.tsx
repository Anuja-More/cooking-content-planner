import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { FC } from 'react'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// Define the type for an event
interface Event {
  date: string // Assuming date is in the format 'YYYY-MM-DD'
}

interface VideoScheduleChartProps {
  events: Event[]
}

const VideoScheduleChart: FC<VideoScheduleChartProps> = ({ events }) => {
  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return d.toISOString().split('T')[0] // 'YYYY-MM-DD' format
  })

  const data = {
    labels: next7Days,
    datasets: [
      {
        label: 'Scheduled Videos',
        data: next7Days.map(date =>
          events.filter(event => event.date === date).length
        ),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  }

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  }

  return <Bar data={data} options={options} />
}

export default VideoScheduleChart
