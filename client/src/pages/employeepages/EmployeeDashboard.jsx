import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { useStudentStore } from "@/store/useStudentStore";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";

// Employee Sub-views
import ExpensesView from "@/pages/employeepages/ExpensesView";
import PayrollView from "@/pages/employeepages/PayrollView";
import PTOView from "@/pages/employeepages/PTOView";
import ClaimsView from "@/pages/employeepages/ClaimsView";
import SettingsView from "@/pages/employeepages/SettingsView";

// Icons & UI
import {
  PanelLeft,
  LayoutDashboard,
  Receipt,
  DollarSign,
  CalendarDays,
  FileCheck,
  Settings,
  Plus,
  LogOut,
  AlertTriangle,
  X,
  Bell,
  Check,
} from "lucide-react";

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  // Exact Zinc Theme Tokens matching Admin Dashboard
  const surface = isDarkMode
    ? "bg-[#121215] border-zinc-800/80 text-zinc-100"
    : "bg-white border-slate-200/80 text-slate-800";
  const subtleText = isDarkMode ? "text-zinc-400" : "text-slate-500";
  const labelText = isDarkMode ? "text-zinc-400" : "text-slate-600";

  const { user, pto, expensePolicy, claims, addClaim, logout, fetchEmployeeData } =
    useEmployeeStore();
  const logoutAuth = useStudentStore((state) => state.logout);

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Pop-up Alert Modal State
  const [showAlertModal, setShowAlertModal] = useState(false);

  // Quick Claim Form State
  const [claimTitle, setClaimTitle] = useState("");
  const [claimAmount, setClaimAmount] = useState("");
  const [claimCategory, setClaimCategory] = useState("Travel");

  useEffect(() => {
    fetchEmployeeData().catch((error) => {
      console.error("Failed to load employee data:", error);
    });
  }, [fetchEmployeeData]);

  // Dynamic Spending / Policy Calculations
  // Dynamically sums Approved/Pending claims if expensePolicy.spent is undefined
  const calculatedSpent = claims
    ? claims
        .filter((c) => c.status !== "Rejected")
        .reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0)
    : 0;

  const spentAmount = expensePolicy?.spent ?? calculatedSpent;
  const policyLimit = expensePolicy?.limit || 1000; // Fallback default cap
  const remainingBudget = Math.max(0, policyLimit - spentAmount);

  // Health / Budget Score calculation (Percentage of remaining budget)
  const budgetHealthScore =
    policyLimit > 0
      ? Math.max(0, Math.min(100, Math.round((remainingBudget / policyLimit) * 100)))
      : 0;

  // Dynamic Status & Colors based on Budget Health Score
  const getHealthStatus = (score) => {
    if (score >= 70)
      return {
        label: "Healthy",
        textColor: "text-emerald-500",
        strokeColor: "text-emerald-500",
        desc: "Your monthly expenses are well within budget limits.",
      };
    if (score >= 30)
      return {
        label: "Moderate",
        textColor: "text-indigo-600",
        strokeColor: "text-indigo-600",
        desc: "You have used a moderate portion of your policy cap.",
      };
    return {
      label: "Critical",
      textColor: "text-rose-500",
      strokeColor: "text-rose-500",
      desc: "Warning: You are close to exceeding your policy limit.",
    };
  };

  const healthStatus = getHealthStatus(budgetHealthScore);

  const handleSignOut = () => {
    if (logout) logout();
    logoutAuth();
    navigate("/");
  };

  const handleQuickClaimSubmit = async (e) => {
    e.preventDefault();
    if (!claimTitle.trim() || !claimAmount || parseFloat(claimAmount) <= 0) return;

    if (addClaim) {
      await addClaim({
        title: claimTitle.trim(),
        category: claimCategory,
        amount: Math.round(parseFloat(claimAmount) * 100) / 100,
        status: "Pending",
        date: new Date().toISOString().split("T")[0],
      });
    }

    setClaimTitle("");
    setClaimAmount("");
    setClaimCategory("Travel");
  };

  const sidebarItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Expenses & Tracker", icon: Receipt },
    { name: "Payroll", icon: DollarSign },
    { name: "PTO & Leave", icon: CalendarDays },
    { name: "Claims", icon: FileCheck },
  ];

  const displayClaims = claims || [];

  return (
    <div
      className={`flex h-screen w-full font-sans overflow-hidden relative transition-colors duration-300 ${
        isDarkMode ? "bg-[#09090b] text-zinc-100" : "bg-[#f8f9fe] text-slate-800"
      }`}
    >
      {/* EXPENSE POLICY ALERT POPUP MODAL */}
      {showAlertModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`${surface} rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in duration-200 border`}
          >
            <div
              className={`flex items-center justify-between border-b pb-3 ${
                isDarkMode ? "border-zinc-800" : "border-slate-100"
              }`}
            >
              <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
                <AlertTriangle className="w-5 h-5" />
                <span>Policy Threshold Alert</span>
              </div>
              <button
                onClick={() => setShowAlertModal(false)}
                className={`p-1 rounded-lg transition ${
                  isDarkMode
                    ? "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                }`}
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className={`text-xs ${subtleText}`}>
              You are approaching your monthly expense reimbursement limit:
            </p>

            <div
              className={`p-3 rounded-xl flex items-center justify-between text-xs border ${
                isDarkMode
                  ? "bg-amber-950/20 border-amber-900/40 text-amber-200"
                  : "bg-amber-50/60 border-amber-200/80 text-amber-900"
              }`}
            >
              <div className="pr-2">
                <span className="font-bold block">Monthly Policy Cap</span>
                <span className={`text-[11px] mt-0.5 block ${subtleText}`}>
                  Spent ${spentAmount.toFixed(2)} of ${policyLimit} allowance limit.
                </span>
              </div>
              <button
                onClick={() => setShowAlertModal(false)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-2.5 py-1 rounded-lg font-semibold text-[11px] shrink-0 transition flex items-center gap-1 shadow-sm"
              >
                <Check className="w-3 h-3" /> Dismiss
              </button>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAlertModal(false);
                  setActiveTab("Expenses & Tracker");
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl text-xs transition shadow-sm"
              >
                View Expense Details
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
          {/* SIDEBAR HEADER */}
          <div className="mb-6 pt-1">
            {isSidebarCollapsed ? (
              <div className="flex flex-col items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full border shadow-[0_0_15px_rgba(99,102,241,0.12)] p-1 flex items-center justify-center shrink-0 ${
                    isDarkMode
                      ? "bg-indigo-950/50 border-indigo-900/40"
                      : "bg-indigo-50/60 border-indigo-100"
                  }`}
                >
                  <img
                    src="/logofnl.png"
                    alt="CashCompass Logo"
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <button
                  onClick={() => setIsSidebarCollapsed(false)}
                  className={`p-1.5 rounded-lg transition shrink-0 ${
                    isDarkMode
                      ? "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
                      : "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                  }`}
                  title="Expand sidebar"
                >
                  <PanelLeft className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div
                    className={`w-9 h-9 rounded-full border shadow-[0_0_15px_rgba(99,102,241,0.12)] p-1 flex items-center justify-center shrink-0 ${
                      isDarkMode
                        ? "bg-indigo-950/50 border-indigo-900/40"
                        : "bg-indigo-50/60 border-indigo-100"
                    }`}
                  >
                    <img
                      src="/logofnl.png"
                      alt="CashCompass Logo"
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                  <span
                    className={`font-bold text-sm tracking-tight truncate ${
                      isDarkMode ? "text-zinc-100" : "text-slate-800"
                    }`}
                  >
                    CashCompass
                  </span>
                </div>
                <button
                  onClick={() => setIsSidebarCollapsed(true)}
                  className={`p-1.5 rounded-lg transition shrink-0 ${
                    isDarkMode
                      ? "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
                      : "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                  }`}
                  title="Collapse sidebar"
                >
                  <PanelLeft className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* NAVIGATION LINKS */}
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  title={isSidebarCollapsed ? item.name : undefined}
                  className={`w-full flex items-center justify-between py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isSidebarCollapsed ? "justify-center px-0" : "px-3"
                  } ${
                    isActive
                      ? isDarkMode
                        ? "bg-indigo-950/50 text-indigo-300 shadow-sm"
                        : "bg-indigo-50 text-indigo-600 shadow-sm"
                      : isDarkMode
                      ? "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
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
                </button>
              );
            })}
          </nav>
        </div>

        {/* SIDEBAR FOOTER */}
        <div
          className={`pt-4 space-y-1 ${
            isDarkMode ? "border-t border-zinc-800" : "border-t border-slate-100"
          }`}
        >
          <button
            onClick={() => setActiveTab("Settings")}
            title={isSidebarCollapsed ? "Settings" : undefined}
            className={`w-full flex items-center gap-3 py-2 rounded-xl text-xs font-semibold transition ${
              isSidebarCollapsed ? "justify-center px-0" : "px-3"
            } ${
              activeTab === "Settings"
                ? isDarkMode
                  ? "bg-indigo-950/50 text-indigo-300 shadow-sm"
                  : "bg-indigo-50 text-indigo-600 shadow-sm"
                : isDarkMode
                ? "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            {!isSidebarCollapsed && (
              <span className="whitespace-nowrap overflow-hidden">Settings</span>
            )}
          </button>

          <button
            onClick={handleSignOut}
            title={isSidebarCollapsed ? "Sign Out" : undefined}
            className={`w-full flex items-center gap-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition ${
              isSidebarCollapsed ? "justify-center px-0" : "px-3"
            }`}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!isSidebarCollapsed && (
              <span className="whitespace-nowrap overflow-hidden">Sign Out</span>
            )}
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* TOP HEADER NAVBAR */}
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
            Employee Workspace
          </span>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setShowAlertModal(true)}
              className={`p-2 rounded-lg transition relative ${
                isDarkMode
                  ? "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
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
              {user?.name?.[0] || "A"}
            </button>
          </div>
        </header>

        {/* DASHBOARD LAYOUT */}
        <main className="p-8 space-y-6 max-w-7xl mx-auto w-full">
          {activeTab === "Dashboard" && (
            <>
              {/* PAGE HEADER */}
              <div>
                <h1
                  className={`text-2xl font-bold tracking-tight ${
                    isDarkMode ? "text-zinc-100" : "text-slate-900"
                  }`}
                >
                  Employee Dashboard
                </h1>
                <p className={`text-xs mt-0.5 ${subtleText}`}>
                  Welcome back,{" "}
                  <span
                    className={
                      isDarkMode
                        ? "font-semibold text-zinc-200"
                        : "font-semibold text-slate-700"
                    }
                  >
                    {user?.name || "Alex Morgan"}
                  </span>
                  ! Track expenses, reimbursement claims, and leave requests.
                </p>
              </div>

              {/* TOP 3 STAT CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. POLICY HEALTH SCORE */}
                <div
                  className={`${surface} p-5 rounded-2xl shadow-sm flex flex-col justify-between`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span
                      className={`text-[11px] font-bold tracking-wider uppercase ${subtleText}`}
                    >
                      Policy Health Score
                    </span>
                    <span
                      className={`p-1.5 rounded-lg ${
                        isDarkMode
                          ? "bg-indigo-950/60 text-indigo-300"
                          : "bg-indigo-50 text-indigo-600"
                      }`}
                    >
                      <Receipt className="w-4 h-4" />
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center my-2">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="36"
                          stroke="currentColor"
                          strokeWidth="8"
                          className={
                            isDarkMode ? "text-zinc-800" : "text-slate-100"
                          }
                          fill="transparent"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="36"
                          stroke="currentColor"
                          strokeWidth="8"
                          strokeDasharray={2 * Math.PI * 36}
                          strokeDashoffset={
                            2 * Math.PI * 36 * (1 - budgetHealthScore / 100)
                          }
                          strokeLinecap="round"
                          className={`${healthStatus.strokeColor} transition-all duration-500`}
                          fill="transparent"
                        />
                      </svg>
                      <span
                        className={`absolute text-xl font-bold ${
                          isDarkMode ? "text-zinc-100" : "text-slate-800"
                        }`}
                      >
                        {budgetHealthScore}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-bold mt-2 ${healthStatus.textColor}`}
                    >
                      {healthStatus.label}
                    </span>
                    <p className={`text-[11px] text-center mt-1 ${subtleText}`}>
                      {healthStatus.desc}
                    </p>
                  </div>
                </div>

                {/* 2. REMAINING POLICY LIMIT */}
                <div
                  className={`${surface} p-5 rounded-2xl shadow-sm flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span
                        className={`text-[11px] font-bold tracking-wider uppercase ${subtleText}`}
                      >
                        Remaining Policy Limit
                      </span>
                      <span
                        className={`p-1.5 rounded-lg ${
                          isDarkMode
                            ? "bg-indigo-950/60 text-indigo-300"
                            : "bg-indigo-50 text-indigo-600"
                        }`}
                      >
                        <DollarSign className="w-4 h-4" />
                      </span>
                    </div>

                    <div
                      className={`text-2xl font-extrabold tracking-tight mt-2 ${
                        isDarkMode ? "text-zinc-100" : "text-slate-900"
                      }`}
                    >
                      ${remainingBudget.toFixed(2)}
                    </div>

                    <div
                      className={
                        isDarkMode
                          ? "w-full bg-zinc-800 h-2 rounded-full my-4 overflow-hidden"
                          : "w-full bg-slate-100 h-2 rounded-full my-4 overflow-hidden"
                      }
                    >
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            policyLimit > 0
                              ? (remainingBudget / policyLimit) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>

                    <span className={`text-[11px] ${subtleText}`}>
                      Of ${policyLimit} monthly policy allowance
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveTab("Claims")}
                    className={`w-full py-2 rounded-xl text-xs font-semibold transition mt-4 border ${
                      isDarkMode
                        ? "border-zinc-800 text-indigo-300 hover:bg-zinc-900"
                        : "border-indigo-200 text-indigo-600 hover:bg-indigo-50/50"
                    }`}
                  >
                    Submit Expense Claim
                  </button>
                </div>

                {/* 3. AVAILABLE PTO / LEAVE */}
                <div
                  className={`${surface} p-5 rounded-2xl shadow-sm flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span
                        className={`text-[11px] font-bold tracking-wider uppercase ${subtleText}`}
                      >
                        Available PTO / Leave
                      </span>
                      <span
                        className={`p-1.5 rounded-lg ${
                          isDarkMode
                            ? "bg-amber-950/40 text-amber-300"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        <CalendarDays className="w-4 h-4" />
                      </span>
                    </div>

                    <div
                      className={`text-2xl font-extrabold tracking-tight mt-2 ${
                        isDarkMode ? "text-zinc-100" : "text-slate-900"
                      }`}
                    >
                      {pto?.availableDays || 0} Days
                    </div>

                    <p
                      className={`text-xs font-semibold mt-3 flex items-center gap-1 ${
                        isDarkMode ? "text-amber-300" : "text-amber-600"
                      }`}
                    >
                      ↗ {pto?.usedDays || 0} Days taken
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab("PTO & Leave")}
                    className={`w-full py-2 rounded-xl text-xs font-semibold transition mt-4 border ${
                      isDarkMode
                        ? "border-zinc-800 text-zinc-200 hover:bg-zinc-900"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Request Leave
                  </button>
                </div>
              </div>

              {/* LOWER SECTION: RECENT CLAIMS & QUICK SUBMIT */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* RECENT REIMBURSEMENT CLAIMS */}
                <div
                  className={`${surface} p-5 rounded-2xl shadow-sm lg:col-span-2 space-y-4`}
                >
                  <div className="flex items-center justify-between">
                    <h3
                      className={`text-sm font-bold ${
                        isDarkMode ? "text-zinc-100" : "text-slate-800"
                      }`}
                    >
                      Recent Reimbursement Claims
                    </h3>
                    <button
                      onClick={() => setActiveTab("Claims")}
                      className={`text-xs font-semibold ${
                        isDarkMode
                          ? "text-indigo-300 hover:underline"
                          : "text-indigo-600 hover:underline"
                      }`}
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-3">
                    {displayClaims.map((claim) => (
                      <div
                        key={claim.id}
                        className={`p-4 rounded-xl border flex items-center justify-between ${
                          isDarkMode
                            ? "bg-zinc-900/40 border-zinc-800"
                            : "bg-slate-50 border-slate-200/80"
                        }`}
                      >
                        <div>
                          <p
                            className={`text-xs font-semibold ${
                              isDarkMode ? "text-zinc-100" : "text-slate-700"
                            }`}
                          >
                            {claim.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-xs font-bold ${
                              isDarkMode ? "text-zinc-100" : "text-slate-900"
                            }`}
                          >
                            ${parseFloat(claim.amount).toFixed(2)}
                          </p>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              isDarkMode
                                ? "text-amber-300 bg-amber-950/40"
                                : "text-amber-600 bg-amber-50"
                            }`}
                          >
                            {claim.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* QUICK CLAIM SUBMIT FORM */}
                <div className={`${surface} p-5 rounded-2xl shadow-sm lg:col-span-1`}>
                  <div
                    className={`flex items-center gap-2 mb-4 ${
                      isDarkMode ? "text-indigo-300" : "text-indigo-600"
                    }`}
                  >
                    <FileCheck className="w-4 h-4" />
                    <h3
                      className={`text-sm font-bold ${
                        isDarkMode ? "text-zinc-100" : "text-slate-800"
                      }`}
                    >
                      Quick Claim Submit
                    </h3>
                  </div>

                  <form onSubmit={handleQuickClaimSubmit} className="space-y-3">
                    <div>
                      <label
                        className={`block text-[11px] font-semibold mb-1 ${labelText}`}
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        value={claimTitle}
                        onChange={(e) => setClaimTitle(e.target.value)}
                        placeholder="e.g., Software Subscription"
                        className={`w-full rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 transition placeholder:text-slate-400 border ${
                          isDarkMode
                            ? "bg-zinc-900 border-zinc-800 text-zinc-100"
                            : "bg-slate-50 border-slate-200 text-slate-800"
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label
                          className={`block text-[11px] font-semibold mb-1 ${labelText}`}
                        >
                          Amount ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          value={claimAmount}
                          onChange={(e) => setClaimAmount(e.target.value)}
                          placeholder="0.00"
                          className={`w-full rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 transition placeholder:text-slate-400 border ${
                            isDarkMode
                              ? "bg-zinc-900 border-zinc-800 text-zinc-100"
                              : "bg-slate-50 border-slate-200 text-slate-800"
                          }`}
                        />
                      </div>

                      <div>
                        <label
                          className={`block text-[11px] font-semibold mb-1 ${labelText}`}
                        >
                          Category
                        </label>
                        <select
                          value={claimCategory}
                          onChange={(e) => setClaimCategory(e.target.value)}
                          className={`w-full rounded-xl px-2 py-2 text-xs outline-none focus:border-indigo-500 transition cursor-pointer border ${
                            isDarkMode
                              ? "bg-zinc-900 border-zinc-800 text-zinc-100"
                              : "bg-slate-50 border-slate-200 text-slate-800"
                          }`}
                        >
                          <option value="Travel">Travel</option>
                          <option value="Meals">Meals</option>
                          <option value="Software">Software</option>
                          <option value="Office Supplies">
                            Office Supplies
                          </option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-1.5 mt-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Submit Claim</span>
                    </button>
                  </form>
                </div>
              </div>
            </>
          )}

          {/* TAB SUB-VIEWS */}
          {activeTab === "Expenses & Tracker" && <ExpensesView />}
          {activeTab === "Payroll" && <PayrollView />}
          {activeTab === "PTO & Leave" && <PTOView />}
          {activeTab === "Claims" && <ClaimsView />}
          {activeTab === "Settings" && <SettingsView />}
        </main>
      </div>
    </div>
  );
}