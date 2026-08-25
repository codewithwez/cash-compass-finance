import { useNavigate } from "react-router-dom";
import { 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  Sparkles,
  ArrowUpRight,
  Receipt
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";

// Sample Mini Chart Data for Browser Hero Mockup
const heroChartData = [
  { month: "Jan", spend: 2400 },
  { month: "Feb", spend: 1398 },
  { month: "Mar", spend: 3800 },
  { month: "Apr", spend: 2780 },
  { month: "May", spend: 1890 },
  { month: "Jun", spend: 2390 },
];

// Data for Organizations Card based on provided UI
const employeeReimbursementData = [
  { name: "Sarah Connor", amount: 450 },
  { name: "John Doe", amount: 120 },
  { name: "Elena Rostova", amount: 680 },
];

const claimsApprovalData = [
  { name: "Approved", value: 35, color: "#10b981" },
  { name: "Pending", value: 55, color: "#f59e0b" },
  { name: "Rejected", value: 10, color: "#ef4444" },
];

export default function Home() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

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
            {/* Emblem Frame with soft glow */}
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-200/60 dark:border-indigo-500/30 shadow-sm transition-transform duration-200 group-hover:scale-105 shrink-0 overflow-hidden">
              <img
                src="/logofnl.png"
                alt="CashCompass Emblem"
                className="w-[86%] h-[86%] object-contain drop-shadow-sm transition-transform group-hover:scale-110"
              />
            </div>

            {/* Brand Name */}
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
            {/* Global Theme Toggle */}
            <ThemeToggle />

            <button
              onClick={() => navigate("/login")}
              className={`text-sm font-semibold transition px-2 ${
                isDarkMode
                  ? "text-zinc-400 hover:text-white"
                  : "text-slate-700 hover:text-indigo-600"
              }`}
            >
              Log In
            </button>
            <Button
              onClick={() => navigate("/signup")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-1.5 h-9 rounded-lg text-xs shadow-sm transition"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* COMPACT HERO */}
      <section className="pt-8 pb-8 px-6 text-center max-w-5xl mx-auto flex flex-col items-center">
        <h1
          className={`text-4xl md:text-5xl font-extrabold tracking-tight leading-tight ${
            isDarkMode ? "text-white" : "text-indigo-950"
          }`}
        >
          Financial Clarity for Everyone.
        </h1>
        <p
          className={`mt-3 text-sm md:text-base max-w-xl leading-normal ${
            isDarkMode ? "text-zinc-400" : "text-slate-600"
          }`}
        >
          Empower individuals, teams, and organizations with a unified platform for personal allowance, salary tracking, and business expense management.
        </p>

        {/* Action Buttons */}
        <div className="mt-5 flex flex-wrap gap-3 justify-center">
          <Button
            onClick={() => navigate("/signup")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 h-10 text-sm rounded-lg shadow-md shadow-indigo-500/10"
          >
            Get Started
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/features")}
            className={`font-semibold px-5 py-2 h-10 text-sm rounded-lg shadow-sm flex items-center gap-2 ${
              isDarkMode
                ? "bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800"
                : "bg-white border-slate-300 text-slate-800 hover:bg-slate-50"
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            Features
          </Button>
        </div>

        {/* Browser Mockup with Live Visuals */}
        <div
          className={`mt-8 w-full max-w-8xl border rounded-xl shadow-2xl overflow-hidden text-left transition-colors ${
            isDarkMode
              ? "bg-[#121215] border-zinc-800/80 shadow-black"
              : "bg-white border-indigo-100 shadow-xl"
          }`}
        >
          <div
            className={`border-b px-4 py-2 flex items-center justify-between ${
              isDarkMode
                ? "bg-zinc-900/60 border-zinc-800"
                : "bg-indigo-50/60 border-indigo-100/80"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                isDarkMode ? "bg-zinc-800 text-zinc-400" : "bg-white/80 text-slate-400"
              }`}
            >
              cashcompass.edusoft.com/dashboard
            </span>
            <div className="w-6" />
          </div>

          {/* Interactive Hero Content */}
          <div className="p-4 md:p-6 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div
                className={`p-3 rounded-lg border ${
                  isDarkMode
                    ? "bg-zinc-900/40 border-zinc-800/60"
                    : "bg-slate-50/60 border-slate-100"
                }`}
              >
                <div className="text-[10px] font-bold text-zinc-400 uppercase">Total Claims Value</div>
                <div className="text-sm md:text-lg text-red-500 font-black">$12,480.00</div>
                <div className="text-[10px] font-semibold text-zinc-400 flex items-center gap-0.5 mt-0.5">
                 3 total claims submitted
                </div>
              </div>

              <div
                className={`p-3 rounded-lg border ${
                  isDarkMode
                    ? "bg-zinc-900/40 border-zinc-800/60"
                    : "bg-slate-50/60 border-slate-100"
                }`}
              >
                <div className="text-[10px] font-bold text-zinc-400 uppercase">Approved Claims</div>
                <div className="text-sm md:text-lg font-black text-emerald-500">$3,250.00</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">18 Claims Settled</div>
              </div>

              <div
                className={`p-3 rounded-lg border ${
                  isDarkMode
                    ? "bg-zinc-900/40 border-zinc-800/60"
                    : "bg-slate-50/60 border-slate-100"
                }`}
              >
                <div className="text-[10px] font-bold text-zinc-400 uppercase">Pending Claims</div>
                <div className="text-sm md:text-lg font-black text-amber-500">$450.00</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">2 Items in Queue</div>
              </div>
            </div>

            {/* Live Chart */}
            <div
              className={`p-3 rounded-lg border ${
                isDarkMode ? "bg-zinc-900/30 border-zinc-800/50" : "bg-slate-50/40 border-slate-100"
              }`}
            >
              <div className="text-[11px] font-semibold mb-2 flex justify-between items-center">
                <span>Expenditure Analytics</span>
                <span className="text-[9px] bg-indigo-500/10 text-indigo-500 font-bold px-2 py-0.5 rounded">
                  Live Preview
                </span>
              </div>
              <div className="h-36 md:h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={heroChartData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSpendHome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} />
                    <YAxis tick={{ fontSize: 10 }} tickLine={false} />
                    <Tooltip
                     formatter={(value) => [`$${value}`, "spend"]}
  contentStyle={{
    backgroundColor: isDarkMode ? "#18181b" : "#ffffff",
    borderColor: isDarkMode ? "#27272a" : "#e2e8f0",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    fontSize: "12px",
    padding: "8px 12px",
  }}
  labelStyle={{
    color: isDarkMode ? "#f4f4f5" : "#0f172a",
    fontWeight: "bold",
    marginBottom: "4px",
  }}
  itemStyle={{
    color: "#6366f1",
    fontWeight: "600",
    fontSize: "12px",
  }}
/>
                    <Area
                      type="monotone"
                      dataKey="spend"
                      stroke="#6366f1"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorSpendHome)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-12 px-6 max-w-7xl mx-auto text-center w-full">
        <h2
          className={`text-2xl md:text-3xl font-extrabold tracking-tight ${
            isDarkMode ? "text-white" : "text-indigo-950"
          }`}
        >
          Open Source for Everyone.
        </h2>
        <p
          className={`mt-2 text-xs md:text-sm max-w-xl mx-auto ${
            isDarkMode ? "text-zinc-400" : "text-slate-600"
          }`}
        >
          Tailored workflows designed specifically for the unique needs of every user, from personal finance to enterprise scale.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          
{/* FOR INDIVIDUALS CARD */}
<Card
  className={`border shadow-sm hover:shadow-md transition rounded-xl p-5 text-left flex flex-col justify-between ${
    isDarkMode
      ? "bg-[#121215] border-zinc-800/80 text-zinc-100"
      : "bg-white border-slate-200/80 text-slate-900"
  }`}
>
  <div>
    <div
      className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
        isDarkMode
          ? "bg-indigo-950/80 text-indigo-400"
          : "bg-indigo-100/80 text-indigo-600"
      }`}
    >
      <GraduationCap className="w-5 h-5" />
    </div>
    <CardTitle
      className={`text-lg font-bold ${
        isDarkMode ? "text-white" : "text-indigo-950"
      }`}
    >
      For Individuals
    </CardTitle>
    <CardDescription
      className={`text-xs mt-2 leading-relaxed ${
        isDarkMode ? "text-zinc-400" : "text-slate-600"
      }`}
    >
      Manage your monthly allowance, monitor your financial Health Score, track weekly spending velocity, and categorize expenses seamlessly.
    </CardDescription>
  </div>

  {/* Student Dashboard Inspired Mini-Widget */}
  <div
    className={`mt-6 border rounded-lg p-2.5 space-y-2.5 ${
      isDarkMode
        ? "bg-zinc-900/50 border-zinc-800/60"
        : "bg-indigo-50/30 border-slate-100"
    }`}
  >
    {/* Top Row: Health Score & Remaining Balance */}
    <div className="grid grid-cols-2 gap-2">
      {/* Health Score Gauge */}
      <div
        className={`p-2 rounded border flex flex-col items-center justify-center ${
          isDarkMode ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-slate-200/60"
        }`}
      >
        <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
          Health Score
        </span>
        <div className="relative w-10 h-10 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-zinc-200 dark:text-zinc-800"
              strokeWidth="4"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-indigo-600"
              strokeDasharray="61, 100"
              strokeWidth="4"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span className="absolute text-[10px] font-extrabold">61</span>
        </div>
        <span className="text-[8px] font-bold text-indigo-500 mt-0.5">Good</span>
      </div>

      {/* Remaining Balance */}
      <div
        className={`p-2 rounded border flex flex-col justify-between ${
          isDarkMode ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-slate-200/60"
        }`}
      >
        <div>
          <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider">
            Remaining Balance
          </span>
          <div className="text-sm font-black text-slate-900 dark:text-white">$305.00</div>
          <span className="text-[7px] text-zinc-400 block mt-0.5">
            Of $500 monthly allowance
          </span>
        </div>
        <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-1">
          <div className="bg-indigo-600 h-full rounded-full" style={{ width: "61%" }} />
        </div>
      </div>
    </div>

    {/* Bottom Row: Quick Summary Banner */}
    <div
      className={`p-2 rounded border flex items-center justify-between ${
        isDarkMode ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-slate-200/60"
      }`}
    >
      <div>
        <div className="text-[8px] font-bold text-zinc-400 uppercase">Spent This Week</div>
        <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">$195.00</div>
      </div>
      <div className="text-[8px] font-semibold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
        +12% vs last week
      </div>
    </div>
  </div>
</Card>

          {/* FOR PROFESSIONALS CARD */}
<Card
  className={`border shadow-sm hover:shadow-md transition rounded-xl p-5 text-left flex flex-col justify-between ${
    isDarkMode
      ? "bg-[#121215] border-zinc-800/80 text-zinc-100"
      : "bg-white border-slate-200/80 text-slate-900"
  }`}
>
  <div>
    <div
      className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
        isDarkMode
          ? "bg-indigo-950/80 text-indigo-400"
          : "bg-indigo-100/80 text-indigo-600"
      }`}
    >
      <Briefcase className="w-5 h-5" />
    </div>
    <CardTitle
      className={`text-lg font-bold ${
        isDarkMode ? "text-white" : "text-indigo-950"
      }`}
    >
      For Professionals
    </CardTitle>
    <CardDescription
      className={`text-xs mt-2 leading-relaxed ${
        isDarkMode ? "text-zinc-400" : "text-slate-600"
      }`}
    >
      Monitor corporate T&E policy limits, track monthly spend caps, log work expenses, and submit receipt-backed claims for instant reimbursement.
    </CardDescription>
  </div>

  {/* Employee Workspace Inspired Mini-Widget */}
  <div
    className={`mt-6 border rounded-lg p-2.5 space-y-2.5 ${
      isDarkMode
        ? "bg-zinc-900/50 border-zinc-800/60"
        : "bg-indigo-50/30 border-slate-100"
    }`}
  >
    {/* Policy Limit Caps Breakdown */}
    <div
      className={`p-2 rounded border space-y-2 ${
        isDarkMode ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-slate-200/60"
      }`}
    >
      <div className="flex justify-between items-center text-[8px] font-bold text-zinc-400 uppercase tracking-wider">
        <span>Corporate Policy Limit</span>
        <span className="text-indigo-500 font-extrabold">$1,000.00 Cap</span>
      </div>

      {/* Progress Bar for $450 Used */}
      <div>
        <div className="flex justify-between text-[10px] font-bold mb-1">
          <span>Spent: $450.00</span>
          <span className="text-emerald-500">Remaining: $550.00</span>
        </div>
        <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-indigo-600 h-full rounded-full" style={{ width: "45%" }} />
        </div>
        <span className="text-[7px] text-zinc-400 mt-1 block">
          45% of monthly allowance consumed
        </span>
      </div>
    </div>

    {/* Submit Claim Trigger Banner */}
    <div
      className={`p-2 rounded border flex items-center justify-between ${
        isDarkMode ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-slate-200/60"
      }`}
    >
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
          <Receipt className="w-3.5 h-3.5" />
        </div>
        <div>
          <div className="text-[10px] font-bold">Submit New Claim</div>
          <div className="text-[8px] text-zinc-400">PDF, PNG, JPG (Max 10MB)</div>
        </div>
      </div>
      <span className="text-[8px] font-bold bg-indigo-600 text-white px-2 py-1 rounded shadow-sm">
        + Claim
      </span>
    </div>
  </div>
</Card>

          {/* FOR ORGANIZATIONS CARD */}
          <Card
            className={`border shadow-sm hover:shadow-md transition rounded-xl p-5 text-left flex flex-col justify-between ${
              isDarkMode
                ? "bg-[#121215] border-zinc-800/80 text-zinc-100"
                : "bg-white border-slate-200/80 text-slate-900"
            }`}
          >
            <div>
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                  isDarkMode
                    ? "bg-indigo-950/80 text-indigo-400"
                    : "bg-indigo-100/80 text-indigo-600"
                }`}
              >
                <ShieldCheck className="w-5 h-5" />
              </div>
              <CardTitle
                className={`text-lg font-bold ${
                  isDarkMode ? "text-white" : "text-indigo-950"
                }`}
              >
                For Organizations
              </CardTitle>
              <CardDescription
                className={`text-xs mt-2 leading-relaxed ${
                  isDarkMode ? "text-zinc-400" : "text-slate-600"
                }`}
              >
                Full-scale management for organization-wide data, centralized approval queues, and high-density analytics for global financial operations.
              </CardDescription>
            </div>

            {/* Organizations Custom Widget (Reflecting Provided UI Image) */}
            <div
              className={`mt-6 border rounded-lg p-2.5 space-y-3 ${
                isDarkMode
                  ? "bg-zinc-900/50 border-zinc-800/60"
                  : "bg-indigo-50/30 border-slate-100"
              }`}
            >
              <div className="grid grid-cols-2 gap-2">
                {/* Reimbursement Volume by Employee */}
                <div
                  className={`p-2 rounded border ${
                    isDarkMode ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-slate-200/60"
                  }`}
                >
                  <div className="text-[9px] font-bold text-zinc-400 truncate mb-1">
                    Submitted Reimbursemets
                  </div>
                  <div className="h-16 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={employeeReimbursementData} margin={{ top: 2, right: 0, left: -28, bottom: -10 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 6.2 }} tickLine={false} interval={0} />
                        <YAxis tick={{ fontSize: 7 }} tickLine={false} />
                        <Bar dataKey="amount" fill="#6366f1" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Claims Approval Ratio */}
                <div
                  className={`p-2 rounded border ${
                    isDarkMode ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-slate-200/60"
                  }`}
                >
                  <div className="text-[9px] font-bold text-zinc-400 truncate mb-1">
                    Claims Approval Ratio
                  </div>
                  <div className="h-12 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={claimsApprovalData}
                          innerRadius={12}
                          outerRadius={20}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {claimsApprovalData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-around text-[7px] font-bold text-zinc-400 mt-1">
                    <span className="text-emerald-500">Approved</span>
                    <span className="text-amber-500">Pending</span>
                    <span className="text-rose-500">Rejected</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

        </div>
      </section>

      {/* CTA BANNER */}
      <section
        className={`py-12 px-6 text-center border-t border-b transition-colors ${
          isDarkMode
            ? "bg-zinc-900/40 border-zinc-800"
            : "bg-indigo-100/40 border-indigo-100"
        }`}
      >
        <div className="max-w-2xl mx-auto">
          <h2
            className={`text-2xl md:text-3xl font-extrabold tracking-tight ${
              isDarkMode ? "text-white" : "text-indigo-950"
            }`}
          >
            Ready to unify your finances?
          </h2>
          <p
            className={`mt-2 text-xs md:text-sm ${
              isDarkMode ? "text-zinc-400" : "text-indigo-900/80"
            }`}
          >
            Join thousands of users and organizations streamlining their financial operations with CashCompass.
          </p>
          <Button
            onClick={() => navigate("/signup")}
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 h-10 text-sm rounded-lg shadow-md"
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* FOOTER WITH LOGO */}
      <footer
        className={`border-t py-6 px-6 text-xs transition-colors ${
          isDarkMode
            ? "bg-[#09090b] border-zinc-900 text-zinc-600"
            : "bg-[#f5f5fe] border-indigo-100/80 text-slate-500"
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Footer Logo */}
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