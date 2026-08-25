import { useState, useEffect } from "react";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { useTheme } from "@/context/ThemeContext";
import {
  employeeExpenseSchema,
  getValidationMessage,
} from "@/lib/validationSchemas";
import {
  Receipt,
  Plus,
  TrendingUp,
  CreditCard,
  Tag,
  Calendar,
} from "lucide-react";

export default function ExpensesView() {
  const { isDarkMode } = useTheme();
  const { expensePolicy } = useEmployeeStore(); // Removed addClaim

  // Personal Expense Form State
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Meals & Entertainment");
  const [type, setType] = useState("Work");

  // Local state with localStorage persistence for expense logs
  const [personalLogs, setPersonalLogs] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("personal_expense_logs");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    localStorage.setItem("personal_expense_logs", JSON.stringify(personalLogs));
  }, [personalLogs]);

  const policyLimit = expensePolicy?.limit || 1000;
  const policySpent = expensePolicy?.spent || 0;
  const policyRemaining = policyLimit - policySpent;
  const usagePercentage = policyLimit
    ? Math.min(100, Math.round((policySpent / policyLimit) * 100))
    : 0;

  const handleAddExpense = (e) => {
    e.preventDefault();
    setFormError("");
    const validation = employeeExpenseSchema.safeParse({
      title,
      amount,
      category,
      type,
    });
    const validationMessage = getValidationMessage(validation);
    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }

    const newExpense = {
      id: Date.now(),
      title: validation.data.title,
      amount: validation.data.amount,
      category: validation.data.category,
      type: validation.data.type,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    // Store strictly in personal logs array
    setPersonalLogs([newExpense, ...personalLogs]);
    setTitle("");
    setAmount("");
  };

  const surface = isDarkMode
    ? "bg-zinc-900 border-zinc-800"
    : "bg-white border-slate-200";

  const cardItemBg = isDarkMode
    ? "bg-zinc-950/60 border-zinc-800 hover:border-zinc-700"
    : "bg-slate-50 border-slate-200 hover:border-slate-300";

  const inputBg = isDarkMode
    ? "bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-indigo-500"
    : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500";

  return (
    <div className="space-y-6 w-full">
      {/* HEADER TITLE */}
      <div>
        <h1
          className={`text-2xl font-bold tracking-tight ${
            isDarkMode ? "text-zinc-100" : "text-slate-900"
          }`}
        >
          Expense Tracker
        </h1>
        <p
          className={`text-xs mt-0.5 ${
            isDarkMode ? "text-zinc-400" : "text-slate-500"
          }`}
        >
          Monitor allowance caps and maintain your independent work or personal expense history.
        </p>
      </div>

      {/* TOP CARDS: POLICY BREAKDOWN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className={`p-5 rounded-2xl border shadow-sm transition-colors ${surface}`}>
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
              Corporate Policy Limit
            </span>
            <span
              className={`p-1.5 rounded-lg ${
                isDarkMode
                  ? "bg-indigo-950 text-indigo-400"
                  : "bg-indigo-50 text-indigo-600"
              }`}
            >
              <CreditCard className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div
              className={`text-2xl font-extrabold tracking-tight ${
                isDarkMode ? "text-zinc-100" : "text-slate-900"
              }`}
            >
              ${policyLimit.toFixed(2)}
            </div>
            <span className="text-[10px] text-zinc-500">Monthly allowed</span>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border shadow-sm transition-colors ${surface}`}>
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
              Spent / Used Limit
            </span>
            <span
              className={`p-1.5 rounded-lg ${
                isDarkMode
                  ? "bg-amber-950/60 text-amber-400"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div
              className={`text-2xl font-extrabold tracking-tight ${
                isDarkMode ? "text-zinc-100" : "text-slate-900"
              }`}
            >
              ${policySpent.toFixed(2)}
            </div>
            <div
              className={`w-full h-1.5 rounded-full my-2 overflow-hidden ${
                isDarkMode ? "bg-zinc-800" : "bg-slate-200"
              }`}
            >
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
            <span className="text-[10px] text-zinc-500">
              {usagePercentage}% of monthly allowance consumed
            </span>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border shadow-sm transition-colors ${surface}`}>
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
              Remaining Cap
            </span>
            <span
              className={`p-1.5 rounded-lg ${
                isDarkMode
                  ? "bg-emerald-950/60 text-emerald-400"
                  : "bg-emerald-50 text-emerald-600"
              }`}
            >
              <Receipt className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div
              className={`text-2xl font-extrabold tracking-tight ${
                isDarkMode ? "text-zinc-100" : "text-slate-900"
              }`}
            >
              ${policyRemaining.toFixed(2)}
            </div>
            <span className="text-[10px] text-emerald-500 font-medium">
              Available for future allowance
            </span>
          </div>
        </div>
      </div>

      {/* FORM AND LIST GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`p-5 rounded-2xl border shadow-sm transition-colors ${surface}`}>
          <div className="flex items-center gap-2 mb-4 text-indigo-500">
            <Plus className="w-4 h-4" />
            <h3
              className={`text-sm font-bold ${
                isDarkMode ? "text-zinc-100" : "text-slate-900"
              }`}
            >
              Log New Expense
            </h3>
          </div>

          <form onSubmit={handleAddExpense} className="space-y-3">
            <div>
              <label
                className={`block text-[11px] font-semibold mb-1 ${
                  isDarkMode ? "text-zinc-300" : "text-slate-700"
                }`}
              >
                Expense Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Client Dinner, Coffee, Metro"
                className={`w-full rounded-xl px-3 py-2 text-xs border outline-none transition placeholder:text-zinc-400 ${inputBg}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label
                  className={`block text-[11px] font-semibold mb-1 ${
                    isDarkMode ? "text-zinc-300" : "text-slate-700"
                  }`}
                >
                  Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className={`w-full rounded-xl px-3 py-2 text-xs border outline-none transition placeholder:text-zinc-400 ${inputBg}`}
                />
              </div>

              <div>
                <label
                  className={`block text-[11px] font-semibold mb-1 ${
                    isDarkMode ? "text-zinc-300" : "text-slate-700"
                  }`}
                >
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className={`w-full rounded-xl px-2 py-2 text-xs border outline-none transition cursor-pointer ${inputBg}`}
                >
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>
            </div>

            <div>
              <label
                className={`block text-[11px] font-semibold mb-1 ${
                  isDarkMode ? "text-zinc-300" : "text-slate-700"
                }`}
              >
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full rounded-xl px-2 py-2 text-xs border outline-none transition cursor-pointer ${inputBg}`}
              >
                <option value="Meals & Entertainment">Meals & Entertainment</option>
                <option value="Travel">Travel</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
              </select>
            </div>

            {formError && <p className="text-xs text-red-500">{formError}</p>}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-1.5 mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>Save Expense</span>
            </button>
          </form>
        </div>

        <div className={`p-5 rounded-2xl border shadow-sm transition-colors lg:col-span-2 ${surface}`}>
          <div className="flex items-center justify-between mb-4">
            <h3
              className={`text-sm font-bold ${
                isDarkMode ? "text-zinc-100" : "text-slate-900"
              }`}
            >
              Recent Expense History
            </h3>
            <span className="text-[11px] text-zinc-500 font-medium">
              Work & Personal expenses
            </span>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {personalLogs.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 text-xs">
                No expense entries logged yet.
              </div>
            ) : (
              personalLogs.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition ${cardItemBg}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        item.type === "Work"
                          ? isDarkMode
                            ? "bg-indigo-950 text-indigo-400"
                            : "bg-indigo-50 text-indigo-600"
                          : isDarkMode
                          ? "bg-zinc-800 text-zinc-400"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      <Tag className="w-4 h-4" />
                    </div>
                    <div>
                      <h4
                        className={`text-xs font-bold ${
                          isDarkMode ? "text-zinc-100" : "text-slate-900"
                        }`}
                      >
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-0.5">
                        <span>{item.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {item.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-extrabold block ${
                        isDarkMode ? "text-zinc-100" : "text-slate-900"
                      }`}
                    >
                      ${Number(item.amount).toFixed(2)}
                    </span>
                    <span
                      className={`inline-block px-2 py-0.5 text-[9px] font-bold rounded-full mt-0.5 ${
                        item.type === "Work"
                          ? "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20"
                          : "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}