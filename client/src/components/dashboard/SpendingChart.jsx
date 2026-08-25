import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useStudentStore } from "@/store/useStudentStore";
import { useTheme } from "@/context/ThemeContext";

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function SpendingChart() {
  const { isDarkMode } = useTheme();
  // Subscribe to expenses so Chart auto-re-renders when items are added
  const expenses = useStudentStore((state) => state.expenses);
  const getComparisonData = useStudentStore((state) => state.getComparisonData);

  // Fallback defaults to prevent destructuring errors
  const comparison = typeof getComparisonData === "function" 
    ? getComparisonData("last_week") 
    : {};

  const categories = comparison?.categories || ["Food", "Education", "Transport", "Entertainment"];
  const currentSpent = comparison?.currentSpent || [0, 0, 0, 0];
  const previousSpent = comparison?.previousSpent || [0, 0, 0, 0];

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: "This Week",
        data: currentSpent,
        backgroundColor: "#10b981", // Emerald Green
        borderRadius: 6,
      },
      {
        label: "Last Week",
        data: previousSpent,
        backgroundColor: "#6366f1", // Indigo Blue
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          color: isDarkMode ? "#a1a1aa" : "#64748b",
          font: { size: 11, weight: "500" },
          usePointStyle: true,
          boxWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: isDarkMode ? "#18181b" : "#ffffff",
        titleColor: isDarkMode ? "#f4f4f5" : "#0f172a",
        bodyColor: isDarkMode ? "#d4d4d8" : "#334155",
        borderColor: isDarkMode ? "#27272a" : "#e2e8f0",
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        cornerRadius: 10,
        callbacks: {
          label: (context) => ` ${context.dataset.label}: $${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: isDarkMode ? "#a1a1aa" : "#94a3b8", font: { size: 11 } },
        grid: { display: false },
      },
      y: {
        ticks: {
          color: isDarkMode ? "#a1a1aa" : "#94a3b8",
          font: { size: 11 },
          callback: (value) => `$${value}`,
        },
        grid: { color: isDarkMode ? "#27272a" : "#f1f5f9" },
      },
    },
  };

  return (
    <div
      className={`rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full border ${
        isDarkMode
          ? "bg-[#121215] border-zinc-800/80 text-zinc-100"
          : "bg-white border-slate-200/80 text-slate-800"
      }`}
    >
      {/* Header */}
      <div className="mb-4">
        <h2 className={`text-base font-bold ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>
          Spending Comparison
        </h2>
        <p className={`text-xs mt-0.5 ${isDarkMode ? "text-zinc-400" : "text-slate-400"}`}>
          Comparison with last week
        </p>
      </div>

      {/* Chart Canvas Wrapper */}
      <div className="h-[250px] w-full">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
