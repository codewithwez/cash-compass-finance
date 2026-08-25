import { useState, useEffect } from "react";
import { useStudentStore } from "@/store/useStudentStore";
import { useTheme } from "@/context/ThemeContext";
import {
  expenseSchema,
  getValidationMessage,
} from "@/lib/validationSchemas";
import {
  Receipt,
  Plus,
  Search,
  Trash2,
  Filter,
  DollarSign,
  Calendar,
  Tag,
  Loader2,
} from "lucide-react";

export default function ExpensesView() {
  const { isDarkMode } = useTheme();

  // Dynamic Theme Helpers
  const surface = isDarkMode
    ? "bg-[#121215] border-zinc-800/80 text-zinc-100"
    : "bg-white border-slate-200/80 text-slate-800";
  const subtleText = isDarkMode ? "text-zinc-400" : "text-slate-500";
  const inputBg = isDarkMode
    ? "bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-indigo-500"
    : "bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500";
  const labelText = isDarkMode ? "text-zinc-300" : "text-slate-600";

  const {
    expenses,
    fetchExpenses,
    addExpense,
    deleteExpense,
  } = useStudentStore();

  // Form State
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [period, setPeriod] = useState("this_week");

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Async Loading States
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formError, setFormError] = useState("");

  // Fetch initial expenses on mount
  useEffect(() => {
    async function loadData() {
      if (fetchExpenses) {
        setIsLoading(true);
        try {
          await fetchExpenses();
        } catch (error) {
          console.error("Failed to fetch expenses:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }
    loadData();
  }, [fetchExpenses]);

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const validation = expenseSchema.safeParse({ title, amount, category, period });
    const validationMessage = getValidationMessage(validation);
    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }

    const parsedAmount = validation.data.amount;

    const payload = {
      title: validation.data.title,
      category,
      amount: Math.round(parsedAmount * 100) / 100,
      period,
      date: new Date().toISOString(),
    };

    setIsSubmitting(true);
    try {
      if (addExpense) {
        await addExpense(payload);
      }
      // Reset form on success
      setTitle("");
      setAmount("");
      setCategory("Food");
      setPeriod("this_week");
    } catch (error) {
      console.error("Failed to record expense:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Expense Handler
  const handleDelete = async (id) => {
    if (!deleteExpense) return;
    setDeletingId(id);
    try {
      await deleteExpense(id);
    } catch (error) {
      console.error("Failed to delete expense:", error);
    } finally {
      setDeletingId(null);
    }
  };

  // Filter expenses based on Search + Category selection
  const filteredExpenses = (expenses || []).filter((item) => {
    const matchesSearch = item.title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    "All",
    "Food",
    "Education",
    "Entertainment",
    "Transport",
    "Utilities",
    "Other",
  ];

  // Date Formatter Helper
  const formatDate = (dateString) => {
    if (!dateString) return "Recently added";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? "text-zinc-100" : "text-slate-900"}`}>
          Expenses Tracker
        </h1>
        <p className={`mt-0.5 text-xs ${subtleText}`}>
          Log new expenses and review your full transaction history.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        {/* 1. ADD EXPENSE FORM */}
        <div className={`p-6 border shadow-sm rounded-2xl ${surface}`}>
          <div className={`flex items-center gap-2 mb-5 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>
            <Receipt className="w-5 h-5" />
            <h2 className={`text-sm font-bold ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>
              Add New Expense
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block mb-1 text-xs font-semibold ${labelText}`}>
                Description / Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Campus Lunch, Books"
                disabled={isSubmitting}
                className={`w-full px-3 py-2.5 text-xs transition border outline-none rounded-xl placeholder:text-zinc-500 disabled:opacity-50 ${inputBg}`}
                required
              />
            </div>

            <div>
              <label className={`block mb-1 text-xs font-semibold ${labelText}`}>
                Amount ($)
              </label>
              <div className="relative">
                <DollarSign className={`absolute w-4 h-4 left-3 top-2.5 ${subtleText}`} />
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  disabled={isSubmitting}
                  className={`w-full py-2.5 pl-9 pr-3 text-xs transition border outline-none rounded-xl placeholder:text-zinc-500 disabled:opacity-50 ${inputBg}`}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block mb-1 text-xs font-semibold ${labelText}`}>
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={isSubmitting}
                  className={`w-full px-2.5 py-2.5 text-xs transition cursor-pointer border outline-none rounded-xl disabled:opacity-50 ${inputBg}`}
                >
                  <option value="Food" className={isDarkMode ? "bg-zinc-900 text-zinc-100" : ""}>Food</option>
                  <option value="Education" className={isDarkMode ? "bg-zinc-900 text-zinc-100" : ""}>Education</option>
                  <option value="Entertainment" className={isDarkMode ? "bg-zinc-900 text-zinc-100" : ""}>Entertainment</option>
                  <option value="Transport" className={isDarkMode ? "bg-zinc-900 text-zinc-100" : ""}>Transport</option>
                  <option value="Utilities" className={isDarkMode ? "bg-zinc-900 text-zinc-100" : ""}>Utilities</option>
                  <option value="Other" className={isDarkMode ? "bg-zinc-900 text-zinc-100" : ""}>Other</option>
                </select>
              </div>

              <div>
                <label className={`block mb-1 text-xs font-semibold ${labelText}`}>
                  Timeframe
                </label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  disabled={isSubmitting}
                  className={`w-full px-2.5 py-2.5 text-xs transition cursor-pointer border outline-none rounded-xl disabled:opacity-50 ${inputBg}`}
                >
                  <option value="this_week" className={isDarkMode ? "bg-zinc-900 text-zinc-100" : ""}>This Week</option>
                  <option value="this_month" className={isDarkMode ? "bg-zinc-900 text-zinc-100" : ""}>This Month</option>
                </select>
              </div>
            </div>

            {formError && <p className="text-xs text-red-500">{formError}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center w-full gap-1.5 px-4 py-2.5 mt-2 text-xs font-semibold text-white transition bg-indigo-600 shadow-sm hover:bg-indigo-700 rounded-xl disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span>{isSubmitting ? "Saving..." : "Add Expense"}</span>
            </button>
          </form>
        </div>

        {/* 2. EXPENSES LIST & FILTERS */}
        <div className={`p-6 space-y-4 border shadow-sm lg:col-span-2 rounded-2xl ${surface}`}>
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <div className="relative w-full sm:w-64">
              <Search className={`absolute w-4 h-4 left-3 top-2.5 ${subtleText}`} />
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full py-2 pl-9 pr-3 text-xs transition border outline-none rounded-xl placeholder:text-zinc-500 ${inputBg}`}
              />
            </div>

            <div className="flex items-center w-full gap-1.5 overflow-x-auto pb-1 sm:w-auto sm:pb-0">
              <Filter className={`flex-shrink-0 w-3.5 h-3.5 mr-1 ${subtleText}`} />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition whitespace-nowrap ${
                    selectedCategory === cat
                      ? isDarkMode
                        ? "bg-indigo-950/70 text-indigo-300 border border-indigo-800"
                        : "bg-indigo-50 text-indigo-600 border border-indigo-200"
                      : isDarkMode
                      ? "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* List Items */}
          <div className={`pt-2 divide-y max-h-[420px] overflow-y-auto pr-1 ${isDarkMode ? "divide-zinc-800/60 border-t border-zinc-800/80" : "divide-slate-100 border-t border-slate-100"}`}>
            {isLoading ? (
              <div className={`flex items-center justify-center gap-2 py-12 ${subtleText}`}>
                <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                <span className="text-xs">Loading expenses...</span>
              </div>
            ) : filteredExpenses.length === 0 ? (
              <div className={`py-12 text-center ${subtleText}`}>
                <Receipt className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-medium">No expenses found.</p>
              </div>
            ) : (
              filteredExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className={`flex items-center justify-between p-2.5 transition rounded-xl group ${
                    isDarkMode ? "hover:bg-zinc-900/60" : "hover:bg-slate-50/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl transition ${
                      isDarkMode
                        ? "bg-zinc-900 text-zinc-400 group-hover:bg-indigo-950/60 group-hover:text-indigo-400"
                        : "bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600"
                    }`}>
                      <Tag className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>
                        {expense.title}
                      </h4>
                      <div className={`flex items-center gap-2 mt-0.5 text-[10px] ${subtleText}`}>
                        <span className={`font-semibold ${isDarkMode ? "text-zinc-300" : "text-slate-600"}`}>
                          {expense.category}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(expense.date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold ${isDarkMode ? "text-zinc-100" : "text-slate-900"}`}>
                      -${Number(expense.amount).toFixed(2)}
                    </span>
                    {deleteExpense && (
                      <button
                        onClick={() => handleDelete(expense.id)}
                        disabled={deletingId === expense.id}
                        className={`p-1.5 rounded-lg transition opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50 ${
                          isDarkMode
                            ? "text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30"
                            : "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        }`}
                        title="Delete expense"
                      >
                        {deletingId === expense.id ? (
                          <Loader2 className="w-3.5 h-3.5 text-rose-500 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
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