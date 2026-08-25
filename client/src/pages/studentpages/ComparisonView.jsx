import { useMemo } from "react";
import { useStudentStore } from "@/store/useStudentStore";
import { useTheme } from "@/context/ThemeContext";
import {
  BarChart2,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  ArrowRight,
} from "lucide-react";

export default function ComparisonView() {
  const { user, expenses = [] } = useStudentStore();
  const { isDarkMode } = useTheme();
  const surface = isDarkMode ? "bg-[#121215] border-zinc-800/80 text-zinc-100" : "bg-white border-slate-200/80 text-slate-800";
  const subtleText = isDarkMode ? "text-zinc-400" : "text-slate-500";

  // Dynamic Date calculations based on user's local time
  const { currentMonthSpent, lastMonthSpent, categoryComparison } =
    useMemo(() => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      // Calculate last month's date bounds
      const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
      const lastMonthYear = lastMonthDate.getFullYear();
      const lastMonth = lastMonthDate.getMonth();

      let currTotal = 0;
      let prevTotal = 0;

      const categoryMap = {};

      // Categories list to enforce key initialization
      const categories = [
        "Food",
        "Education",
        "Entertainment",
        "Transport",
        "Utilities",
        "Other",
      ];
      categories.forEach((cat) => {
        categoryMap[cat] = { current: 0, lastMonth: 0 };
      });

      expenses.forEach((item) => {
        const itemDate = new Date(item.date);
        if (isNaN(itemDate.getTime())) return;

        const itemYear = itemDate.getFullYear();
        const itemMonth = itemDate.getMonth();
        const amount = Number(item.amount || 0);
        const cat = item.category || "Other";

        // Initialize category dynamic bucket if missing
        if (!categoryMap[cat]) {
          categoryMap[cat] = { current: 0, lastMonth: 0 };
        }

        // Active Month match
        if (itemYear === currentYear && itemMonth === currentMonth) {
          currTotal += amount;
          categoryMap[cat].current += amount;
        }
        // Last Month match
        else if (itemYear === lastMonthYear && itemMonth === lastMonth) {
          prevTotal += amount;
          categoryMap[cat].lastMonth += amount;
        }
      });

      // Format category object into standard component array
      const compArray = Object.keys(categoryMap)
        .map((cat) => ({
          category: cat,
          current: categoryMap[cat].current,
          lastMonth: categoryMap[cat].lastMonth,
        }))
        // Only keep categories that have non-zero spending in either period
        .filter((item) => item.current > 0 || item.lastMonth > 0);

      return {
        currentMonthSpent: currTotal,
        lastMonthSpent: prevTotal,
        categoryComparison: compArray,
      };
    }, [expenses]);

  const spendingDifference = currentMonthSpent - lastMonthSpent;
  const isSpendingLess = spendingDifference <= 0;
  const percentageChange = lastMonthSpent
    ? Math.abs(Math.round((spendingDifference / lastMonthSpent) * 100))
    : 0;

  return (
    <div className="space-y-6">
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? "text-zinc-100" : "text-slate-900"}`}>
            Monthly Spending Comparison
          </h1>
          <p className={`text-xs mt-0.5 ${subtleText}`}>
            Compare active month spending directly against last month's records.
          </p>
        </div>

        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold self-start sm:self-auto ${isDarkMode ? "bg-indigo-950/30 border border-indigo-900/40 text-indigo-300" : "bg-indigo-50 border border-indigo-100 text-indigo-700"}`}>
          <Calendar className="w-4 h-4" />
          <span>This Month vs Last Month</span>
        </div>
      </div>

      {/* TOP METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total Spent Last Month */}
        <div className={`p-5 rounded-2xl border shadow-sm flex flex-col justify-between ${surface}`}>
          <div className="flex justify-between items-start">
            <span className={`text-[11px] font-bold tracking-wider uppercase ${subtleText}`}>
              Last Month Total
            </span>
            <span className={`p-1.5 rounded-lg ${isDarkMode ? "bg-zinc-900 text-zinc-300" : "bg-slate-100 text-slate-600"}`}>
              <DollarSign className="w-4 h-4" />
            </span>
          </div>

          <div className="my-2">
            <div className={`text-2xl font-extrabold tracking-tight ${isDarkMode ? "text-zinc-100" : "text-slate-900"}`}>
              ${lastMonthSpent.toFixed(2)}
            </div>
            <p className={`text-xs mt-1 ${subtleText}`}>
              Previous month baseline
            </p>
          </div>

          <div className={`text-[10px] pt-2 border-t ${isDarkMode ? "text-zinc-500 border-zinc-800" : "text-slate-400 border-slate-100"}`}>
            Calculated from history
          </div>
        </div>

        {/* Total Spent This Month */}
        <div className={`p-5 rounded-2xl border shadow-sm flex flex-col justify-between ${surface}`}>
          <div className="flex justify-between items-start">
            <span className={`text-[11px] font-bold tracking-wider uppercase ${subtleText}`}>
              This Month Total
            </span>
            <span className={`p-1.5 rounded-lg ${isDarkMode ? "bg-indigo-950/40 text-indigo-300" : "bg-indigo-50 text-indigo-600"}`}>
              <DollarSign className="w-4 h-4" />
            </span>
          </div>

          <div className="my-2">
            <div className={`text-2xl font-extrabold tracking-tight ${isDarkMode ? "text-zinc-100" : "text-slate-900"}`}>
              ${currentMonthSpent.toFixed(2)}
            </div>
            <p className={`text-xs font-semibold mt-1 ${isDarkMode ? "text-indigo-300" : "text-indigo-600"}`}>
              Active month total
            </p>
          </div>

          <div className={`text-[10px] pt-2 border-t ${isDarkMode ? "text-zinc-500 border-zinc-800" : "text-slate-400 border-slate-100"}`}>
            Monthly allowance: ${user?.monthlyAllowance || 0}
          </div>
        </div>

        {/* Net Variance / Delta */}
        <div className={`p-5 rounded-2xl border shadow-sm flex flex-col justify-between ${surface}`}>
          <div className="flex justify-between items-start">
            <span className={`text-[11px] font-bold tracking-wider uppercase ${subtleText}`}>
              Difference
            </span>
            <span
              className={`p-1.5 rounded-lg ${
                isSpendingLess
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-rose-50 text-rose-600"
              }`}
            >
              {isSpendingLess ? (
                <TrendingDown className="w-4 h-4" />
              ) : (
                <TrendingUp className="w-4 h-4" />
              )}
            </span>
          </div>

          <div className="my-2">
            <div
              className={`text-2xl font-extrabold tracking-tight ${
                isSpendingLess ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {isSpendingLess ? "-" : "+"}${Math.abs(spendingDifference).toFixed(2)}
            </div>
            
          </div>

          <div className={`text-[10px] pt-2 border-t ${isDarkMode ? "text-zinc-500 border-zinc-800" : "text-slate-400 border-slate-100"}`}>
            {isSpendingLess
              ? "Great job! You are spending less this month."
              : "Careful, your spending is higher than last month."}
          </div>
        </div>
      </div>

      {/* CATEGORY BY CATEGORY COMPARISON */}
      <div className={`p-6 rounded-2xl border shadow-sm space-y-6 ${surface}`}>
        <div className={`flex items-center gap-2 ${isDarkMode ? "text-indigo-300" : "text-indigo-600"}`}>
          <BarChart2 className="w-5 h-5" />
          <h2 className={`text-sm font-bold ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>
            Category Breakdown: Last Month vs. This Month
          </h2>
        </div>

        {categoryComparison.length === 0 ? (
          <div className={`py-8 text-center text-xs ${subtleText}`}>
            No spending records found for this month or last month.
          </div>
        ) : (
          <div className="space-y-5">
            {categoryComparison.map((item) => {
              const diff = item.current - item.lastMonth;
              const maxVal = Math.max(item.current, item.lastMonth, 1);
              const currentPct = Math.round((item.current / maxVal) * 100);
              const lastPct = Math.round((item.lastMonth / maxVal) * 100);

              return (
                <div
                  key={item.category}
                  className={`space-y-2 pb-4 last:border-0 last:pb-0 ${isDarkMode ? "border-b border-zinc-800" : "border-b border-slate-100"}`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className={isDarkMode ? "text-zinc-100" : "text-slate-800"}>{item.category}</span>
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className={subtleText}>
                        Last Month:{" "}
                        <strong className={isDarkMode ? "text-zinc-200" : "text-slate-600"}>
                          ${item.lastMonth.toFixed(2)}
                        </strong>
                      </span>
                      <ArrowRight className={`w-3 h-3 ${isDarkMode ? "text-zinc-600" : "text-slate-300"}`} />
                      <span className={isDarkMode ? "text-indigo-300" : "text-indigo-600"}>
                        This Month:{" "}
                        <strong>${item.current.toFixed(2)}</strong>
                      </span>
                      <span
                        className={`ml-1 font-bold ${
                          diff <= 0 ? "text-emerald-600" : "text-rose-500"
                        }`}
                      >
                        ({diff <= 0 ? "" : "+"}${diff.toFixed(2)})
                      </span>
                    </div>
                  </div>

                  {/* Comparative Double Bars */}
                  <div className="space-y-1">
                    {/* Last Month Bar */}
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-medium w-16 ${subtleText}`}>
                        Last Month
                      </span>
                      <div className={`flex-1 h-2 rounded-full overflow-hidden ${isDarkMode ? "bg-zinc-800" : "bg-slate-100"}`}>
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${isDarkMode ? "bg-zinc-500" : "bg-slate-400"}`}
                          style={{ width: `${lastPct}%` }}
                        />
                      </div>
                    </div>

                    {/* This Month Bar */}
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-medium w-16 ${isDarkMode ? "text-indigo-300" : "text-indigo-600"}`}>
                        This Month
                      </span>
                      <div className={`flex-1 h-2 rounded-full overflow-hidden ${isDarkMode ? "bg-indigo-950/30" : "bg-indigo-50"}`}>
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${isDarkMode ? "bg-indigo-400" : "bg-indigo-600"}`}
                          style={{ width: `${currentPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
