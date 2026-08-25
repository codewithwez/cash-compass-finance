import { useNavigate } from "react-router-dom";
import { 
  PieChart, 
  Receipt, 
  ShieldCheck, 
  Clock, 
  Wallet, 
  TrendingUp, 
  ArrowLeft,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from "@/components/ui/card";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";

export default function Features() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const featureList = [
    {
      icon: <Wallet className="w-6 h-6 text-indigo-500" />,
      title: "Allowance & Budget Tracking",
      description: "Set up monthly allowances, allocate dynamic category budgets, and monitor real-time balance updates.",
      target: "Individuals & Students"
    },
    {
      icon: <Receipt className="w-6 h-6 text-indigo-500" />,
      title: "Reimbursement Claims System",
      description: "Submit expenses with receipt proof, categorize items, and track live approval status powered by TanStack Query.",
      target: "Employees & Professionals"
    },
    {
      icon: <PieChart className="w-6 h-6 text-indigo-500" />,
      title: "Visual Analytics & Charts",
      description: "Interactive Chart.js breakdowns showing category-wise spending patterns and monthly cash flow insights.",
      target: "All Roles"
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-indigo-500" />,
      title: "Role-Based Access Control",
      description: "Strict secure route guarding ensuring Students, Employees, and Admin access tailored dashboards seamlessly.",
      target: "Organizations & Admins"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-indigo-500" />,
      title: "Real-time Expense Validation",
      description: "Instant policy checks against budgets to eliminate invalid submissions.",
      target: "All Roles"
    }
  ];

  return (
    <div
      className={`min-h-screen font-sans flex flex-col justify-between transition-colors duration-300 ${
        isDarkMode ? "bg-[#09090b] text-zinc-100" : "bg-[#f5f5fe] text-slate-900"
      }`}
    >
      {/* TOP NAVBAR */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${
          isDarkMode
            ? "bg-[#09090b]/80 border-zinc-800/80"
            : "bg-[#f5f5fe]/80 border-indigo-100/60"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-14 flex justify-between items-center">
          
          {/* Custom Logo Brand */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-200/60 dark:border-indigo-500/30 shadow-sm transition-transform duration-200 group-hover:scale-105 shrink-0 overflow-hidden">
              <img
                src="/logofnl.png"
                alt="CashCompass Emblem"
                className="w-[86%] h-[86%] object-contain drop-shadow-sm transition-transform group-hover:scale-110"
              />
            </div>

            <span
              className={`text-xl font-extrabold tracking-tight ${
                isDarkMode ? "text-white" : "text-indigo-950"
              }`}
            >
              Cash<span className="text-indigo-600 dark:text-indigo-400">Compass</span>
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Global Reusable Theme Toggle */}
            <ThemeToggle />

            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className={`flex items-center gap-1.5 text-xs font-semibold ${
                isDarkMode
                  ? "text-zinc-300 hover:text-white hover:bg-zinc-900"
                  : "text-slate-700 hover:text-indigo-600"
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Button>

            <Button
              onClick={() => navigate("/signup")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-1.5 h-9 rounded-lg text-xs shadow-sm transition"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-10 w-full flex-1">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span
            className={`text-[11px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full border ${
              isDarkMode
                ? "bg-indigo-950/60 text-indigo-400 border-indigo-900/60"
                : "bg-indigo-100/80 text-indigo-600 border-indigo-200/60"
            }`}
          >
            Platform Capabilities
          </span>
          <h1
            className={`text-3xl md:text-4xl font-extrabold tracking-tight mt-3 ${
              isDarkMode ? "text-white" : "text-indigo-950"
            }`}
          >
            Everything you need for financial control.
          </h1>
          <p
            className={`text-xs md:text-sm mt-3 max-w-xl mx-auto ${
              isDarkMode ? "text-zinc-400" : "text-slate-600"
            }`}
          >
            Discover how CashCompass unifies personal budgeting, professional salary logging, and enterprise expense automation in one system.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureList.map((item, index) => (
            <Card 
              key={index} 
              className={`border shadow-sm hover:shadow-md transition rounded-xl overflow-hidden flex flex-col justify-between ${
                isDarkMode
                  ? "bg-[#121215] border-zinc-800/80 text-zinc-100"
                  : "bg-white border-slate-200/80 text-slate-900"
              }`}
            >
              <CardHeader className="p-5 pb-2">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                    isDarkMode ? "bg-zinc-900" : "bg-indigo-100/80"
                  }`}
                >
                  {item.icon}
                </div>
                <CardTitle
                  className={`text-lg font-bold ${
                    isDarkMode ? "text-white" : "text-indigo-950"
                  }`}
                >
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-3">
                <CardDescription
                  className={`text-xs leading-relaxed ${
                    isDarkMode ? "text-zinc-400" : "text-slate-600"
                  }`}
                >
                  {item.description}
                </CardDescription>
                <div className="pt-2 flex items-center gap-2 text-[11px] font-semibold text-indigo-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{item.target}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* FOOTER WITH LOGO */}
      <footer
        className={`border-t py-6 px-6 text-xs transition-colors ${
          isDarkMode
            ? "bg-[#09090b] border-zinc-900 text-zinc-600"
            : "bg-[#f5f5fe] border-indigo-100/80 text-slate-500"
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 select-none">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-200/60 dark:border-indigo-500/30 shrink-0 overflow-hidden">
              <img
                src="/logofnl.png"
                alt="CashCompass Emblem"
                className="w-[85%] h-[85%] object-contain"
              />
            </div>
            <span
              className={`font-bold text-sm tracking-tight ${
                isDarkMode ? "text-white" : "text-indigo-950"
              }`}
            >
              Cash<span className="text-indigo-600 dark:text-indigo-400">Compass</span>
            </span>
          </div>

          <p>© 2026 CashCompass Finance Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}