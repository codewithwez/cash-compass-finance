import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useStudentStore } from "@/store/useStudentStore";
import { useTheme } from "@/context/ThemeContext";

// Register ArcElement for Pie/Donut rendering
ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryPieChart() {
  const { isDarkMode } = useTheme();
  const expenses = useStudentStore((state) => state.expenses);

  // List of unique categories to calculate
  const categories = ["Education", "Food", "Entertainment", "Transport"];

  const categoryColors = {
    Education: "#3b82f6",     // Blue
    Food: "#10b981",          // Green
    Entertainment: "#a855f7", // Purple
    Transport: "#f59e0b",     // Amber
  };

  // Calculate current week spending per category
  const categoryTotals = categories.map((cat) =>
    (expenses || [])
      .filter((e) => e.category === cat && e.period === "this_week")
      .reduce((sum, e) => sum + Number(e.amount || 0), 0)
  );

  const totalSpentThisWeek = categoryTotals.reduce((a, b) => a + b, 0);

  const chartData = {
    labels: categories,
    datasets: [
      {
        data: categoryTotals,
        backgroundColor: categories.map((cat) => categoryColors[cat]),
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "80%", // Thinner ring like the image
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: isDarkMode ? "#a1a1aa" : "#64748b",
          font: { size: 11, weight: "500" },
          usePointStyle: true,
          pointStyle: "circle",
          padding: 14,
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
          label: (context) => {
            const val = context.raw || 0;
            const percentage =
              totalSpentThisWeek > 0
                ? ((val / totalSpentThisWeek) * 100).toFixed(1)
                : 0;
            return ` ${context.label}: $${val} (${percentage}%)`;
          },
        },
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
      <div className="mb-2">
        <h2 className={`text-base font-bold ${isDarkMode ? "text-zinc-100" : "text-slate-900"}`}>
          Category Breakdown
        </h2>
        <p className={`text-xs mt-0.5 ${isDarkMode ? "text-zinc-400" : "text-slate-400"}`}>
          Share of total expenses this week
        </p>
      </div>

      {/* Donut Chart Container */}
      <div className="relative h-[220px] flex items-center justify-center my-auto">
        {totalSpentThisWeek > 0 ? (
          <>
            <Doughnut data={chartData} options={chartOptions} />
            
            {/* Perfectly Centered Total Badge */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-7">
              <span className={`text-2xl font-black tracking-tight leading-none ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>
                ${totalSpentThisWeek.toFixed(2)}
              </span>
              <span className={`text-[10px] font-extrabold uppercase tracking-widest mt-1 ${isDarkMode ? "text-zinc-400" : "text-slate-400"}`}>
                SPENT
              </span>
            </div>
          </>
        ) : (
          <p className={`text-xs ${isDarkMode ? "text-zinc-400" : "text-slate-400"}`}>
            No expenses recorded for this week.
          </p>
        )}
      </div>
    </div>
  );
}
