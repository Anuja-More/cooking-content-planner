import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { FC } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

// Define the type for a template
interface Template {
  name: string;
  sections: unknown[]; // You can update this if you know the specific type of the sections array
}

interface CreativeToolsChartProps {
  templates: Template[];
}

const CreativeToolsChart: FC<CreativeToolsChartProps> = ({ templates }) => {
  const templateUsage = templates.reduce<Record<string, number>>(
    (acc, template) => {
      acc[template.name] = template.sections.length;
      return acc;
    },
    {}
  );

  const data = {
    labels: Object.keys(templateUsage),
    datasets: [
      {
        data: Object.values(templateUsage),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  return <Doughnut data={data} />;
};

export default CreativeToolsChart;
