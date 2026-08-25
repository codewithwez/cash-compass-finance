import { useState, useEffect } from "react";
import { useStudentStore } from "@/store/useStudentStore";
import { useTheme } from "@/context/ThemeContext";
import {
  depositSchema,
  getValidationMessage,
} from "@/lib/validationSchemas";
import {
  Wallet,
  PlusCircle,
  TrendingUp,
  ArrowDownRight,
  PiggyBank,
  CheckCircle2,
  Trash2,
  Loader2,
} from "lucide-react";

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

export default function AllowanceView() {
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

  // Fetch store values and actions
  const {
    user,
    expenses,
    deposits: storeDeposits,
    fetchDeposits,
    addDeposit,
    deleteDeposit,
  } = useStudentStore();

  // Form State
  const [topUpAmount, setTopUpAmount] = useState("");
  const [source, setSource] = useState("Parents");
  const [notes, setNotes] = useState("");

  // Loading & Action states for API sync
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formError, setFormError] = useState("");

  // Fallback local state if store does not maintain deposits directly
  const [localDeposits, setLocalDeposits] = useState([]);
  const deposits = storeDeposits || localDeposits;

  // Fetch initial deposit history from backend
  useEffect(() => {
    async function loadAllowanceData() {
      if (fetchDeposits) {
        setIsLoading(true);
        try {
          await fetchDeposits();
        } catch (error) {
          console.error("Failed to fetch deposit history:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }
    loadAllowanceData();
  }, [fetchDeposits]);

  // Calculations
  const baseAllowance = user?.monthlyAllowance || 0;
  const additionalDeposits = (deposits || []).reduce(
    (acc, d) => acc + Number(d.amount || 0),
    0
  );
  const totalAllowance = baseAllowance + additionalDeposits;

  const totalSpent = (expenses || []).reduce(
    (acc, curr) => acc + Number(curr.amount || 0),
    0
  );

  const remainingBalance = totalAllowance - totalSpent;
  const spentPercentage =
    totalAllowance > 0
      ? Math.min(100, Math.round((totalSpent / totalAllowance) * 100))
      : 0;

  // Form Submission Handler
  const handleAddDeposit = async (e) => {
    e.preventDefault();
    setFormError("");
    const validation = depositSchema.safeParse({
      amount: topUpAmount,
      source,
      notes,
    });
    const validationMessage = getValidationMessage(validation);
    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }

    const newDepositPayload = {
      source: validation.data.source,
      amount: Math.round(validation.data.amount * 100) / 100,
      date: new Date().toISOString().split("T")[0],
      notes: validation.data.notes || "Manual top-up",
    };

    setIsSubmitting(true);
    try {
      if (addDeposit) {
        await addDeposit(newDepositPayload);
      } else {
        const tempDeposit = { ...newDepositPayload, id: Date.now() };
        setLocalDeposits((prev) => [tempDeposit, ...prev]);
      }

      // Reset form
      setTopUpAmount("");
      setNotes("");
      setSource("Parents");
    } catch (error) {
      console.error("Failed to post new deposit:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Deposit Handler
  const handleDeleteDeposit = async (id) => {
    setDeletingId(id);
    try {
      if (deleteDeposit) {
        await deleteDeposit(id);
      } else {
        setLocalDeposits((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete deposit:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? "text-zinc-100" : "text-slate-900"}`}>
          Allowance Management
        </h1>
        <p className={`mt-0.5 text-xs ${subtleText}`}>
          Track your income sources, top up funds, and monitor your monthly spending budget.
        </p>
      </div>

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* Total Allowance Card */}
        <div className={`flex flex-col justify-between p-5 border shadow-sm rounded-2xl ${surface}`}>
          <div className="flex items-start justify-between">
            <span className={`text-[11px] font-bold tracking-wider uppercase ${subtleText}`}>
              Total Budget
            </span>
            <span className={`p-1.5 rounded-lg ${isDarkMode ? "bg-indigo-950/40 text-indigo-300" : "bg-indigo-50 text-indigo-600"}`}>
              <Wallet className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <div className={`text-2xl font-extrabold tracking-tight ${isDarkMode ? "text-zinc-100" : "text-slate-900"}`}>
              ${totalAllowance.toFixed(2)}
            </div>
            <p className={`mt-1 text-[10px] ${subtleText}`}>
              Base (${baseAllowance.toFixed(2)}) + extra deposits (${additionalDeposits.toFixed(2)})
            </p>
          </div>
        </div>

        {/* Spent Card */}
        <div className={`flex flex-col justify-between p-5 border shadow-sm rounded-2xl ${surface}`}>
          <div className="flex items-start justify-between">
            <span className={`text-[11px] font-bold tracking-wider uppercase ${subtleText}`}>
              Total Spent
            </span>
            <span className={`p-1.5 rounded-lg ${isDarkMode ? "bg-rose-950/40 text-rose-300" : "bg-rose-50 text-rose-600"}`}>
              <ArrowDownRight className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <div className={`text-2xl font-extrabold tracking-tight ${isDarkMode ? "text-zinc-100" : "text-slate-900"}`}>
              ${totalSpent.toFixed(2)}
            </div>
            <p className={`mt-1 text-[10px] ${subtleText}`}>
              {spentPercentage}% of total allowance used
            </p>
          </div>
        </div>

        {/* Remaining Balance Card */}
        <div className={`flex flex-col justify-between p-5 border shadow-sm rounded-2xl ${surface}`}>
          <div className="flex items-start justify-between">
            <span className={`text-[11px] font-bold tracking-wider uppercase ${subtleText}`}>
              Available Cash
            </span>
            <span className={`p-1.5 rounded-lg ${isDarkMode ? "bg-emerald-950/40 text-emerald-300" : "bg-emerald-50 text-emerald-600"}`}>
              <PiggyBank className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <div className={`text-2xl font-extrabold tracking-tight ${isDarkMode ? "text-zinc-100" : "text-slate-900"}`}>
              ${remainingBalance.toFixed(2)}
            </div>
            <div className={`w-full my-2 h-1.5 rounded-full overflow-hidden ${isDarkMode ? "bg-zinc-800" : "bg-slate-100"}`}>
              <div
                className="h-full transition-all duration-300 rounded-full bg-emerald-500"
                style={{ width: `${Math.max(0, 100 - spentPercentage)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Form + Deposit History Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Top-Up Allowance Form */}
        <div className={`p-6 space-y-4 border shadow-sm lg:col-span-5 rounded-2xl ${surface}`}>
          <div className={`flex items-center gap-2 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>
            <PlusCircle className="w-5 h-5" />
            <h3 className={`text-sm font-bold ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>
              Add Allowance / Funds
            </h3>
          </div>

          <form onSubmit={handleAddDeposit} className="space-y-3">
            <div>
              <label htmlFor="topUpAmount" className={`block text-[11px] font-semibold mb-1 ${labelText}`}>
                Amount ($)
              </label>
              <input
                id="topUpAmount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="e.g. 50.00"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 text-xs transition border outline-none rounded-xl placeholder:text-zinc-500 disabled:opacity-50 ${inputBg}`}
                required
              />
            </div>

            <div>
              <label htmlFor="source" className={`block text-[11px] font-semibold mb-1 ${labelText}`}>
                Source
              </label>
              <select
                id="source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 text-xs transition cursor-pointer border outline-none rounded-xl disabled:opacity-50 ${inputBg}`}
              >
                <option value="Parents" className={isDarkMode ? "bg-zinc-900 text-zinc-100" : ""}>Parents / Family</option>
                <option value="Campus Job" className={isDarkMode ? "bg-zinc-900 text-zinc-100" : ""}>Campus Job</option>
                <option value="Scholarship" className={isDarkMode ? "bg-zinc-900 text-zinc-100" : ""}>Scholarship / Grant</option>
                <option value="Savings" className={isDarkMode ? "bg-zinc-900 text-zinc-100" : ""}>Personal Savings</option>
                <option value="Other" className={isDarkMode ? "bg-zinc-900 text-zinc-100" : ""}>Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="notes" className={`block text-[11px] font-semibold mb-1 ${labelText}`}>
                Notes (Optional)
              </label>
              <input
                id="notes"
                type="text"
                placeholder="e.g. Extra money for books"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 text-xs transition border outline-none rounded-xl placeholder:text-zinc-500 disabled:opacity-50 ${inputBg}`}
              />
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
                <TrendingUp className="w-4 h-4" />
              )}
              <span>{isSubmitting ? "Saving..." : "Top Up Allowance"}</span>
            </button>
          </form>
        </div>

        {/* Deposit History Log */}
        <div className={`p-6 space-y-4 border shadow-sm lg:col-span-7 rounded-2xl ${surface}`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-bold ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>Deposit History</h3>
            <span className={`text-[11px] font-bold uppercase tracking-wider ${subtleText}`}>
              {deposits.length} Received
            </span>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {isLoading ? (
              <div className={`flex items-center justify-center py-12 gap-2 ${subtleText}`}>
                <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                <span className="text-xs">Loading deposits...</span>
              </div>
            ) : deposits.length === 0 ? (
              <p className={`py-8 text-xs text-center ${subtleText}`}>
                No deposit history recorded yet.
              </p>
            ) : (
              deposits.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3.5 border rounded-xl transition group ${
                    isDarkMode
                      ? "bg-zinc-900/60 border-zinc-800 hover:bg-zinc-900"
                      : "bg-slate-50/80 border-slate-100 hover:bg-slate-100/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isDarkMode ? "bg-emerald-950/40 text-emerald-300" : "bg-emerald-100/70 text-emerald-600"}`}>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className={`text-xs font-semibold ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>
                        {item.source}
                      </div>
                      <div className={`text-[10px] ${subtleText}`}>
                        {item.notes} • {formatDate(item.date)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                      +${Number(item.amount).toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleDeleteDeposit(item.id)}
                      disabled={deletingId === item.id}
                      className={`p-1 transition opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50 ${
                        isDarkMode ? "text-zinc-500 hover:text-rose-400" : "text-slate-400 hover:text-rose-500"
                      }`}
                      title="Delete deposit entry"
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
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