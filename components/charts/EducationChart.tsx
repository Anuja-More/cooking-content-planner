import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { FC } from "react";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// Define the type for a resource
interface Resource {
  category: string;
}

interface EducationChartProps {
  resources: Resource[];
}

const EducationChart: FC<EducationChartProps> = ({ resources }) => {
  const categories = resources.reduce<Record<string, number>>(
    (acc, resource) => {
      acc[resource.category] = (acc[resource.category] || 0) + 1;
      return acc;
    },
    {}
  );

  const data = {
    labels: Object.keys(categories),
    datasets: [
      {
        label: "Resources per Category",
        data: Object.values(categories),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  return <Radar data={data} />;
};

export default EducationChart;
