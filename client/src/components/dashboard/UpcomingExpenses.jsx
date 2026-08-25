import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Plus, Trash2, Clock } from "lucide-react";
import {
  fetchUpcomingExpenses,
  addUpcomingExpense,
  deleteUpcomingExpense,
} from "@/api/expensesApi";
import {
  getValidationMessage,
  upcomingExpenseSchema,
} from "@/lib/validationSchemas";
import { useTheme } from "@/context/ThemeContext";

export default function UpcomingExpenses() {
  const { isDarkMode } = useTheme();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Education");
  const [dueDate, setDueDate] = useState("");
  const [formError, setFormError] = useState("");

  const queryClient = useQueryClient();

  const {
    data: expenses,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["upcomingExpenses"],
    queryFn: fetchUpcomingExpenses,
  });

  const addMutation = useMutation({
    mutationFn: addUpcomingExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["upcomingExpenses"] });
      setTitle("");
      setAmount("");
      setCategory("Education");
      setDueDate("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUpcomingExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["upcomingExpenses"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");
    const validation = upcomingExpenseSchema.safeParse({
      title,
      amount,
      category,
      dueDate,
    });
    const validationMessage = getValidationMessage(validation);
    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }

    addMutation.mutate({
      title: validation.data.title,
      amount: validation.data.amount.toFixed(2),
      category: validation.data.category,
      dueDate: validation.data.dueDate,
    });
  };

  return (
    <div
      className={`p-5 md:p-6 rounded-2xl border shadow-sm space-y-4 w-full ${
        isDarkMode
          ? "bg-[#121215] border-zinc-800/80 text-zinc-100"
          : "bg-white border-slate-200/80 text-slate-800"
      }`}
    >
      {/* Header */}
      <div>
        <div className={`flex items-center gap-2 mb-1 ${isDarkMode ? "text-indigo-300" : "text-indigo-600"}`}>
          <Calendar className="w-4 h-4" />
          <h3 className={`text-base font-bold ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>
            Upcoming Student Expenses
          </h3>
        </div>
        <p className={`text-xs ${isDarkMode ? "text-zinc-400" : "text-slate-400"}`}>
          Track future payments like tuition, dorm rent, and books.
        </p>
      </div>

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Form Section (Left) */}
        <form
          onSubmit={handleSubmit}
          className={`xl:col-span-5 p-4 rounded-xl border space-y-3 ${
            isDarkMode
              ? "bg-zinc-900/60 border-zinc-800"
              : "bg-slate-50/80 border-slate-100"
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={`block text-[11px] font-semibold mb-1 ${isDarkMode ? "text-zinc-300" : "text-slate-600"}`}>
                Title
              </label>
              <input
                type="text"
                placeholder="e.g. Lab Fee"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 transition placeholder:text-slate-400 border ${
                  isDarkMode
                    ? "bg-zinc-900 border-zinc-800 text-zinc-100"
                    : "bg-white border-slate-200 text-slate-800"
                }`}
                required
              />
            </div>

            <div>
              <label className={`block text-[11px] font-semibold mb-1 ${isDarkMode ? "text-zinc-300" : "text-slate-600"}`}>
                Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 transition placeholder:text-slate-400 border ${
                  isDarkMode
                    ? "bg-zinc-900 border-zinc-800 text-zinc-100"
                    : "bg-white border-slate-200 text-slate-800"
                }`}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={`block text-[11px] font-semibold mb-1 ${isDarkMode ? "text-zinc-300" : "text-slate-600"}`}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full rounded-xl px-2 py-2 text-xs outline-none focus:border-indigo-500 transition cursor-pointer border ${
                  isDarkMode
                    ? "bg-zinc-900 border-zinc-800 text-zinc-100"
                    : "bg-white border-slate-200 text-slate-800"
                }`}
              >
                <option value="Education">Education</option>
                <option value="Supplies">Supplies</option>
                <option value="Housing">Housing</option>
                <option value="Food">Food</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            <div>
              <label className={`block text-[11px] font-semibold mb-1 ${isDarkMode ? "text-zinc-300" : "text-slate-600"}`}>
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`w-full rounded-xl px-2 py-2 text-xs outline-none focus:border-indigo-500 transition cursor-pointer border ${
                  isDarkMode
                    ? "bg-zinc-900 border-zinc-800 text-zinc-100"
                    : "bg-white border-slate-200 text-slate-600"
                }`}
                required
              />
            </div>
          </div>

          {formError && <p className="text-xs text-red-500">{formError}</p>}

          <button
            type="submit"
            disabled={addMutation.isPending}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-3 rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-1.5 disabled:opacity-50 mt-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>
              {addMutation.isPending ? "Saving..." : "Add Upcoming Expense"}
            </span>
          </button>
        </form>

        {/* Scheduled List Section (Right) */}
        <div className="xl:col-span-7 space-y-2">
          <div className={`flex items-center justify-between pb-1 border-b ${isDarkMode ? "border-zinc-800" : "border-slate-100"}`}>
            <span className={`text-[11px] font-bold uppercase tracking-wider ${isDarkMode ? "text-zinc-400" : "text-slate-400"}`}>
              Scheduled ({expenses?.length || 0})
            </span>
          </div>

          {isLoading && (
            <p className={`text-xs text-center py-6 ${isDarkMode ? "text-zinc-400" : "text-slate-400"}`}>
              Fetching upcoming expenses...
            </p>
          )}

          {isError && (
            <p className="text-xs text-rose-500 text-center py-6">
              Error: {error.message}
            </p>
          )}

          {!isLoading && expenses?.length === 0 && (
            <p className={`text-xs text-center py-6 ${isDarkMode ? "text-zinc-400" : "text-slate-400"}`}>
              No upcoming expenses scheduled.
            </p>
          )}

          {/* List items grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
            {expenses?.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3 rounded-xl transition group border ${
                  isDarkMode
                    ? "bg-zinc-900/60 border-zinc-800 hover:bg-zinc-900"
                    : "bg-slate-50/80 border-slate-100 hover:bg-slate-100/60"
                }`}
              >
                <div className="space-y-1 min-w-0 pr-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-xs font-semibold truncate max-w-[100px] ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>
                      {item.title}
                    </span>
                    <span className={`text-[9px] border px-1.5 py-0.5 rounded-full font-medium ${isDarkMode ? "bg-indigo-950/40 text-indigo-300 border-indigo-900/40" : "bg-indigo-50 text-indigo-600 border-indigo-100"}`}>
                      {item.category}
                    </span>
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] ${isDarkMode ? "text-zinc-400" : "text-slate-400"}`}>
                    <Clock className={`w-3 h-3 shrink-0 ${isDarkMode ? "text-zinc-400" : "text-slate-400"}`} />
                    <span className="truncate">Due: {item.dueDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-bold ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>
                    ${parseFloat(item.amount || 0).toFixed(2)}
                  </span>
                  <button
                    onClick={() => deleteMutation.mutate(item.id)}
                    disabled={deleteMutation.isPending}
                    className={`transition p-1 ${isDarkMode ? "text-zinc-500 hover:text-rose-400" : "text-slate-300 hover:text-rose-500"}`}
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
