import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { FC } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

// Define the type for a recipe
interface Recipe {
  category: string;
}

interface RecipeChartProps {
  recipes: Recipe[];
}

const RecipeChart: FC<RecipeChartProps> = ({ recipes }) => {
  const categories = recipes.reduce<Record<string, number>>((acc, recipe) => {
    acc[recipe.category] = (acc[recipe.category] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(categories),
    datasets: [
      {
        data: Object.values(categories),
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

  return <Pie data={data} />;
};

export default RecipeChart;
