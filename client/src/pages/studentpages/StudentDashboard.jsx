import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStudentStore } from "@/store/useStudentStore";
import SpendingChart from "@/components/dashboard/SpendingChart";
import CategoryPieChart from "@/components/dashboard/CategoryPieChart";
import UpcomingExpenses from "@/components/dashboard/UpcomingExpenses";
import ThemeToggle from "@/components/ThemeToggle";
import { expenseSchema, getValidationMessage } from "@/lib/validationSchemas";
import { useTheme } from "@/context/ThemeContext";

import AllowanceView from "./AllowanceView";
import ExpensesView from "./ExpensesView";
import ComparisonView from "./ComparisonView";
import RemindersView from "./RemindersView";
import SettingsView from "./SettingsView";

import {
  PanelLeft,
  LayoutDashboard,
  Wallet,
  Receipt,
  BarChart2,
  Bell,
  Settings,
  User,
  Plus,
  ArrowUpRight,
  LogOut,
  AlertTriangle,
  X,
  Check,
} from "lucide-react";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const surface = isDarkMode ? "bg-[#121215] border-zinc-800/80 text-zinc-100" : "bg-white border-slate-200/80 text-slate-800";
  const subtleSurface = isDarkMode ? "bg-zinc-900/60 border-zinc-800/70" : "bg-slate-50/70 border-slate-200/80";
  const softSurface = isDarkMode ? "bg-zinc-900/40 border-zinc-800/60" : "bg-white/80 border-slate-200/80";
  const subtleText = isDarkMode ? "text-zinc-400" : "text-slate-500";
  const { 
    user, 
    expenses, 
    addExpense, 
    logout, 
    reminders, 
    discardReminder,
    fetchDashboard,
  } = useStudentStore();

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Pop-up Alert Modal State
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  // 1. BACKEND DATA INITIALIZATION HOOK
  useEffect(() => {
    const fetchStudentData = async () => {
      setIsLoading(true);
      try {
        await fetchDashboard();
      } catch (error) {
        console.error("Failed to load student dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentData();
  }, [fetchDashboard]);

  // Unread reminders count
  const unreadReminders = (reminders || []).filter((r) => !r.isRead);
  const unreadCount = unreadReminders.length;

  // Trigger alert pop-up when unread count is detected
  useEffect(() => {
    if (unreadCount > 0) {
      setShowLoginAlert(true);
    }
  }, [unreadCount]);

  // Quick Expense Form State
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [formError, setFormError] = useState("");

  // Spending Calculations (Safe dynamic evaluation)
  const totalSpent = (expenses || []).reduce(
    (acc, curr) => acc + Number(curr.amount || 0), 
    0
  );

  const allowance = Number(user?.monthlyAllowance || 0);
  const remainingBalance = Math.max(0, allowance - totalSpent);


  const healthScore = allowance > 0 
    ? Math.max(0, Math.min(100, Math.round(((allowance - totalSpent) / allowance) * 100)))
    : 100;

  const handleSignOut = () => {
    if (logout) logout();
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const validation = expenseSchema.safeParse({
      title,
      amount,
      category,
      period: "this_week",
    });
    const validationMessage = getValidationMessage(validation);
    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }

    const newExpense = {
      title: validation.data.title,
      category: validation.data.category,
      amount: Math.round(validation.data.amount * 100) / 100,
      period: "this_week",
      date: new Date().toISOString(),
    };

    await addExpense(newExpense);

    // Reset Form
    setTitle("");
    setAmount("");
    setCategory("Food");
  };

  const sidebarItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Allowance", icon: Wallet },
    { name: "Expenses", icon: Receipt },
    { name: "Comparison", icon: BarChart2 },
    { name: "Reminders", icon: Bell },
  ];

  return (
    <div
      className={`flex h-screen w-full font-sans overflow-hidden relative transition-colors duration-300 ${
        isDarkMode ? "bg-[#09090b] text-zinc-100" : "bg-[#f8f9fe] text-slate-800"
      }`}
    >
      {/* OVERSPENDING ALERT POPUP MODAL */}
      {showLoginAlert && unreadCount > 0 && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`${surface} rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in duration-200 border`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isDarkMode ? "border-zinc-800" : "border-slate-100"}`}>
              <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
                <AlertTriangle className="w-5 h-5" />
                <span>Overspending Alert</span>
              </div>
              <button
                onClick={() => setShowLoginAlert(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className={`text-xs ${subtleText}`}>
              You have <strong className={isDarkMode ? "text-zinc-100" : "text-slate-800"}>{unreadCount} active alerts</strong> regarding your current spending:
            </p>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {unreadReminders.map((rem) => (
                <div
                  key={rem.id}
                  className={`p-3 rounded-xl flex items-center justify-between text-xs border ${isDarkMode ? "bg-amber-950/30 border-amber-900/40" : "bg-amber-50/60 border-amber-200/80"}`}
                >
                  <div className="pr-2">
                    <span className={`font-bold block ${isDarkMode ? "text-amber-200" : "text-amber-900"}`}>{rem.title}</span>
                    <span className={`text-[11px] mt-0.5 block ${subtleText}`}>{rem.message}</span>
                  </div>
                  <button
                    onClick={() => discardReminder(rem.id)}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-2.5 py-1 rounded-lg font-semibold text-[11px] shrink-0 transition flex items-center gap-1 shadow-xs cursor-pointer"
                    title="Mark as Read"
                  >
                    <Check className="w-3 h-3" /> Read
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowLoginAlert(false);
                  setActiveTab("Reminders");
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl text-xs transition cursor-pointer"
              >
                View Reminders Page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COLLAPSIBLE SIDEBAR */}
      <aside
        className={`flex flex-col justify-between p-4 flex-shrink-0 transition-all duration-300 ease-in-out border-r ${
          isSidebarCollapsed ? "w-20" : "w-60"
        } ${
          isDarkMode
            ? "bg-[#121215] border-zinc-800/80"
            : "bg-white border-slate-200/80"
        }`}
      >
        <div>
          {/* SIDEBAR HEADER / TOGGLE BUTTON */}
          <div className="mb-6 pt-1">
            {isSidebarCollapsed ? (
              <div className="flex flex-col items-center gap-3">
                <div className={`w-9 h-9 rounded-full border shadow-[0_0_15px_rgba(99,102,241,0.12)] p-1 flex items-center justify-center shrink-0 ${isDarkMode ? "bg-indigo-950/50 border-indigo-900/40" : "bg-indigo-50/60 border-indigo-100"}`}>
                  <img
                    src="/logofnl.png"
                    alt="CashCompass Logo"
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <button
                  onClick={() => setIsSidebarCollapsed(false)}
                  className={`p-1.5 rounded-lg transition shrink-0 cursor-pointer ${isDarkMode ? "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900" : "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"}`}
                  title="Expand sidebar"
                >
                  <PanelLeft className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className={`w-9 h-9 rounded-full border shadow-[0_0_15px_rgba(99,102,241,0.12)] p-1 flex items-center justify-center shrink-0 ${isDarkMode ? "bg-indigo-950/50 border-indigo-900/40" : "bg-indigo-50/60 border-indigo-100"}`}>
                    <img
                      src="/logofnl.png"
                      alt="CashCompass Logo"
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                  <span className={`font-bold text-sm tracking-tight truncate ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>
                    CashCompass
                  </span>
                </div>
                <button
                  onClick={() => setIsSidebarCollapsed(true)}
                  className={`p-1.5 rounded-lg transition shrink-0 cursor-pointer ${isDarkMode ? "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900" : "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"}`}
                  title="Collapse sidebar"
                >
                  <PanelLeft className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              const isReminders = item.name === "Reminders";

              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  title={isSidebarCollapsed ? item.name : undefined}
                  className={`w-full flex items-center justify-between py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSidebarCollapsed ? "justify-center px-0" : "px-3"
                  } ${
                    isActive
                      ? (isDarkMode ? "bg-indigo-950/50 text-indigo-300 shadow-sm" : "bg-indigo-50 text-indigo-600 shadow-sm")
                      : (isDarkMode ? "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800")
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!isSidebarCollapsed && (
                      <span className="whitespace-nowrap overflow-hidden">
                        {item.name}
                      </span>
                    )}
                  </div>

                  {!isSidebarCollapsed && isReminders && unreadCount > 0 && (
                    <span className="bg-amber-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-zinc-800 space-y-1">
          <button
            onClick={() => setActiveTab("Settings")}
            title={isSidebarCollapsed ? "Settings" : undefined}
            className={`w-full flex items-center gap-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              isSidebarCollapsed ? "justify-center px-0" : "px-3"
            } ${
              activeTab === "Settings"
              ? (isDarkMode ? "bg-indigo-950/50 text-indigo-300 shadow-sm" : "bg-indigo-50 text-indigo-600 shadow-sm")
              : (isDarkMode ? "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800")
            }`}
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            {!isSidebarCollapsed && (
              <span className="whitespace-nowrap overflow-hidden">
                Settings
              </span>
            )}
          </button>

          <button
            onClick={handleSignOut}
            title={isSidebarCollapsed ? "Sign Out" : undefined}
            className={`w-full flex items-center gap-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer ${
              isSidebarCollapsed ? "justify-center px-0" : "px-3"
            }`}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!isSidebarCollapsed && (
              <span className="whitespace-nowrap overflow-hidden">
                Sign Out
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header
          className={`h-14 backdrop-blur border-b px-8 flex items-center justify-between sticky top-0 z-10 transition-colors duration-300 ${
            isDarkMode
              ? "bg-[#09090b]/80 border-zinc-800/80"
              : "bg-white/80 border-slate-200/80"
          }`}
        >
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full border ${
              isDarkMode
                ? "text-indigo-300 bg-indigo-950/40 border-indigo-900/60"
                : "text-indigo-600 bg-indigo-50 border-indigo-100"
            }`}
          >
            Student Workspace
          </span>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setActiveTab("Reminders")}
              className={`p-2 rounded-lg transition relative cursor-pointer ${
                isDarkMode
                  ? "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("Settings")}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition cursor-pointer border ${
                activeTab === "Settings"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : isDarkMode
                  ? "bg-zinc-900 text-zinc-200 hover:bg-zinc-800 border-zinc-800"
                  : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-transparent"
              }`}
              title="Open Settings"
            >
              {user?.name?.[0] || <User className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* DYNAMIC CONTENT AREA */}
        <main className="p-8 space-y-6 max-w-7xl mx-auto w-full">
          {activeTab === "Dashboard" && (
            <>
              <div>
                <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? "text-zinc-100" : "text-slate-900"}`}>
                  Student Dashboard
                </h1>
                <p className={`text-xs mt-0.5 ${subtleText}`}>
                  Welcome back, {user?.name || "Student"}! Track your budget and expenses here.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className={`${surface} p-5 rounded-2xl shadow-sm flex flex-col justify-between`}>
                  <div className="flex justify-between items-start">
                    <span className={`text-[11px] font-bold tracking-wider uppercase ${subtleText}`}>
                      Health Score
                    </span>
                    <span className={`p-1.5 rounded-lg ${isDarkMode ? "bg-indigo-950/60 text-indigo-300" : "bg-indigo-50 text-indigo-600"}`}>
                      <BarChart2 className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="flex flex-col items-center my-1">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          stroke="currentColor"
                          strokeWidth="7"
                          className={isDarkMode ? "text-zinc-800" : "text-slate-100"}
                          fill="transparent"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          stroke="currentColor"
                          strokeWidth="7"
                          strokeDasharray={2 * Math.PI * 32}
                          strokeDashoffset={2 * Math.PI * 32 * (1 - healthScore / 100)}
                          strokeLinecap="round"
                          className="text-indigo-600 transition-all duration-500"
                          fill="transparent"
                        />
                      </svg>
                      <span className={`absolute text-lg font-bold ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>
                        {healthScore}
                      </span>
                    </div>
                    <span className={`text-xs font-semibold mt-1 ${isDarkMode ? "text-indigo-300" : "text-indigo-600"}`}>
                      {healthScore >= 75 ? "Excellent" : healthScore >= 50 ? "Good" : "Needs Attention"}
                    </span>
                    <p className={`text-[10px] text-center mt-1 ${subtleText}`}>
                      {healthScore >= 50 ? "Your spending is within safe budget limits." : "Warning: Spending threshold almost exceeded."}
                    </p>
                  </div>
                </div>

                <div className={`${surface} p-5 rounded-2xl shadow-sm flex flex-col justify-between`}>
                  <div className="flex justify-between items-start">
                    <span className={`text-[11px] font-bold tracking-wider uppercase ${subtleText}`}>
                      Remaining Balance
                    </span>
                    <span className={`p-1.5 rounded-lg ${isDarkMode ? "bg-indigo-950/60 text-indigo-300" : "bg-indigo-50 text-indigo-600"}`}>
                      <Wallet className="w-4 h-4" />
                    </span>
                  </div>
                  <div>
                    <div className={`text-2xl font-extrabold tracking-tight ${isDarkMode ? "text-zinc-100" : "text-slate-900"}`}>
                      ${remainingBalance.toFixed(2)}
                    </div>
                    <div className={isDarkMode ? "w-full bg-zinc-800 h-1.5 rounded-full my-2.5 overflow-hidden" : "w-full bg-slate-100 h-1.5 rounded-full my-2.5 overflow-hidden"}>
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(
                              0,
                              (remainingBalance / (allowance || 1)) * 100
                            )
                          )}%`,
                        }}
                      />
                    </div>
                    <span className={`text-[10px] ${subtleText}`}>
                      Of ${allowance.toFixed(2)} monthly allowance
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab("Allowance")}
                    className={`w-full py-1.5 rounded-xl text-xs font-semibold transition mt-2 cursor-pointer border ${isDarkMode ? "border-indigo-900/50 text-indigo-300 hover:bg-indigo-950/40" : "border-indigo-200 text-indigo-600 hover:bg-indigo-50/50"}`}
                  >
                    Add Monthly Allowance
                  </button>
                </div>

                <div className={`${surface} p-5 rounded-2xl shadow-sm flex flex-col justify-between`}>
                  <div className="flex justify-between items-start">
                    <span className={`text-[11px] font-bold tracking-wider uppercase ${subtleText}`}>
                      Total Spent
                    </span>
                    <span className={`p-1.5 rounded-lg ${isDarkMode ? "bg-amber-950/40 text-amber-300" : "bg-amber-50 text-amber-600"}`}>
                      <Receipt className="w-4 h-4" />
                    </span>
                  </div>
                  <div>
                    <div className={`text-2xl font-extrabold tracking-tight ${isDarkMode ? "text-zinc-100" : "text-slate-900"}`}>
                      ${totalSpent.toFixed(2)}
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-semibold mt-2 ${isDarkMode ? "text-amber-300" : "text-amber-600"}`}>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>{expenses.length} Total recorded items</span>
                    </div>
                  </div>
                  <div className={`text-[10px] pt-2 border-t ${isDarkMode ? "text-zinc-500 border-zinc-800" : "text-slate-400 border-slate-100"}`}>
                    Updated from expense records
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                <SpendingChart />
                <CategoryPieChart />

                <div className={`${surface} p-6 rounded-2xl shadow-sm flex flex-col justify-between`}>
                  <div>
                    <div className={`flex items-center gap-2 mb-4 ${isDarkMode ? "text-indigo-300" : "text-indigo-600"}`}>
                      <Receipt className="w-4 h-4" />
                      <h3 className={`text-sm font-bold ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>
                        Quick Expense
                      </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div>
                        <label className={`block text-[11px] font-semibold mb-1 ${subtleText}`}>
                          Title
                        </label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g., Coffee, Textbooks"
                          className={`w-full rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 transition placeholder:text-slate-400 border ${isDarkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-slate-50 border-slate-200 text-slate-800"}`}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className={`block text-[11px] font-semibold mb-1 ${subtleText}`}>
                            Amount ($)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className={`w-full rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 transition placeholder:text-slate-400 border ${isDarkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-slate-50 border-slate-200 text-slate-800"}`}
                          />
                        </div>

                        <div>
                          <label className={`block text-[11px] font-semibold mb-1 ${subtleText}`}>
                            Category
                          </label>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className={`w-full rounded-xl px-2 py-2 text-xs outline-none focus:border-indigo-500 transition cursor-pointer border ${isDarkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-slate-50 border-slate-200 text-slate-800"}`}
                          >
                            <option value="Education">Education</option>
                            <option value="Food">Food</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Transport">Transport</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Expense</span>
                      </button>
                      {formError && <p className="text-xs text-red-500">{formError}</p>}
                    </form>
                  </div>
                </div>
              </div>

              <div className="w-full">
                <UpcomingExpenses />
              </div>
            </>
          )}

          {activeTab === "Allowance" && <AllowanceView />}
          {activeTab === "Expenses" && <ExpensesView />}
          {activeTab === "Comparison" && <ComparisonView />}
          {activeTab === "Reminders" && <RemindersView />}
          {activeTab === "Settings" && <SettingsView />}
        </main>
      </div>
    </div>
  );
}
