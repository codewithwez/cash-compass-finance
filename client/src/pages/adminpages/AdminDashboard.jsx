import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "@/store/useAdminStore";
import { useStudentStore } from "@/store/useStudentStore";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";
import StudentsPage from "./StudentsPage";
import ReportsPage from "./ReportsPage";
import SettingsPage from "./SettingsPage";
import {
  PanelLeft,
  LayoutDashboard,
  GraduationCap,
  Users,
  Clock,
  BarChart3,
  Settings,
  Search,
  Check,
  X,
  Pencil,
  Trash2,
  TrendingUp,
  AlertTriangle,
  LogOut,
  Bell,
} from "lucide-react";
import EmployeePage from "./EmployeePage";
import ClaimsQueuePage from "./ClaimsQueuePage";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const surface = isDarkMode ? "bg-[#121215] border-zinc-800/80 text-zinc-100" : "bg-white border-slate-200/80 text-slate-800";
  const subtleText = isDarkMode ? "text-zinc-400" : "text-slate-500";
  const {
    students = [],
    employees = [],
    claims = [],
    deleteStudent,
    updateClaimStatus,
    logoutAdmin,
    fetchAdminData,
  } = useAdminStore();
  const logoutAuth = useStudentStore((state) => state.logout);

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAdminData().catch((error) => {
      console.error("Failed to load admin data:", error);
    });
  }, [fetchAdminData]);

  const handleSignOut = () => {
    if (logoutAdmin) logoutAdmin();
    logoutAuth();
    navigate("/");
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingClaims = claims.filter((c) => c.status === "Pending");

  const sidebarItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Students", icon: GraduationCap },
    { name: "Employees", icon: Users },
    { name: "Claims Queue", icon: Clock },
    { name: "Reports", icon: BarChart3 },
  ];

  return (
    <div
      className={`flex h-screen w-full font-sans overflow-hidden relative transition-colors duration-300 ${
        isDarkMode ? "bg-[#09090b] text-zinc-100" : "bg-[#f8f9fe] text-slate-800"
      }`}
    >
      {/* 🟢 SIDEBAR */}
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
                <div className={`w-9 h-9 rounded-full border shadow-[0_0_15px_rgba(99,102,241,0.12)] p-1 flex items-center justify-center shrink-0 ${isDarkMode ? "bg-indigo-950/50 border-indigo-900/40" : "bg-indigo-50/60 border-indigo-100"}`}>
                  <img
                    src="/logofnl.png"
                    alt="CashCompass Logo"
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <button
                  onClick={() => setIsSidebarCollapsed(false)}
                  className={`p-1.5 rounded-lg transition shrink-0 ${isDarkMode ? "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900" : "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"}`}
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
                  className={`p-1.5 rounded-lg transition shrink-0 ${isDarkMode ? "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900" : "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"}`}
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
              const isClaims = item.name === "Claims Queue";

              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  title={isSidebarCollapsed ? item.name : undefined}
                  className={`w-full flex items-center justify-between py-2.5 rounded-xl text-xs font-semibold transition-all ${
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

                  {!isSidebarCollapsed && isClaims && pendingClaims.length > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                      {pendingClaims.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* SIDEBAR FOOTER */}
        <div className={`pt-4 space-y-1 ${isDarkMode ? "border-t border-zinc-800" : "border-t border-slate-100"}`}>
          <button
            onClick={() => setActiveTab("Settings")}
            title={isSidebarCollapsed ? "Settings" : undefined}
            className={`w-full flex items-center gap-3 py-2 rounded-xl text-xs font-semibold transition ${
              isSidebarCollapsed ? "justify-center px-0" : "px-3"
            } ${
              activeTab === "Settings"
                ? (isDarkMode ? "bg-indigo-950/50 text-indigo-300 shadow-sm" : "bg-indigo-50 text-indigo-600 shadow-sm")
                : (isDarkMode ? "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800")
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

      {/* 🟢 MAIN CONTENT AREA */}
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
            Admin Workspace
          </span>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setActiveTab("Claims Queue")}
              className={`p-2 rounded-lg transition relative ${
                isDarkMode
                  ? "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
              title="Pending Claims"
            >
              <Bell className="w-4 h-4" />
              {pendingClaims.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
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
              A
            </button>
          </div>
        </header>

        {/* DYNAMIC CONTENT CONTAINER */}
        <main className="p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* HEADER TITLE BAR */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? "text-zinc-100" : "text-slate-900"}`}>
                {
  {
    Dashboard: "Admin Dashboard",
    Students: "Manage Students",
    Employees: "Manage Employees",
    "Claims Queue": "Manage Claims",
    Reports: "Manage Reports"
  }[activeTab] || activeTab
}
              </h1>
              <p className={`text-xs mt-0.5 ${subtleText}`}>
      {activeTab === "Dashboard" && "System administration and organizational management dashboard."}
      {activeTab === "Students" && "Update student records, enrollments, and status updates."}
      {activeTab === "Employees" && "Manage staff directory and access permissions."}
      {activeTab === "Claims Queue" && "Review and approve pending employee reimbursement claims."}
      {activeTab === "Reports" && "View system analytics and financial metrics."}
      {activeTab === "Settings" && "Configure admin preferences and application settings."}
    </p>
            </div>
          </div>

          {/* DASHBOARD TAB VIEW */}
          {activeTab === "Dashboard" && (
            <>
              {/* TOP KPI METRICS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className={`${surface} p-5 rounded-2xl shadow-sm flex flex-col justify-between`}>
                  <div className="flex justify-between items-start">
                    <span className={`text-[11px] font-bold tracking-wider uppercase ${subtleText}`}>
                      Active Students
                    </span>
                    <span className={`p-1.5 rounded-lg ${isDarkMode ? "bg-indigo-950/60 text-indigo-300" : "bg-indigo-50 text-indigo-600"}`}>
                      <GraduationCap className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className={`text-2xl font-extrabold tracking-tight ${isDarkMode ? "text-zinc-100" : "text-slate-900"}`}>
                      {students.length}
                    </div>
                  </div>
                </div>

                <div className={`${surface} p-5 rounded-2xl shadow-sm flex flex-col justify-between`}>
                  <div className="flex justify-between items-start">
                    <span className={`text-[11px] font-bold tracking-wider uppercase ${subtleText}`}>
                      Employees
                    </span>
                    <span className={`p-1.5 rounded-lg ${isDarkMode ? "bg-indigo-950/60 text-indigo-300" : "bg-indigo-50 text-indigo-600"}`}>
                      <Users className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className={`text-2xl font-extrabold tracking-tight ${isDarkMode ? "text-zinc-100" : "text-slate-900"}`}>
                      {employees.length}
                    </div>
                  </div>
                </div>

                <div className={`${surface} p-5 rounded-2xl shadow-sm flex flex-col justify-between`}>
                  <div className="flex justify-between items-start">
                    <span className={`text-[11px] font-bold tracking-wider uppercase ${subtleText}`}>
                      Pending Claims
                    </span>
                    <span className={`p-1.5 rounded-lg ${isDarkMode ? "bg-amber-950/40 text-amber-300" : "bg-amber-50 text-amber-600"}`}>
                      <Clock className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className={`text-2xl font-extrabold tracking-tight ${isDarkMode ? "text-zinc-100" : "text-slate-900"}`}>
                      {pendingClaims.length}
                    </div>
                    
                  </div>
                </div>
              </div>


              {/* MAIN SPLIT TABLES VIEW */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* STUDENT DIRECTORY TABLE */}
                <div className={`lg:col-span-7 rounded-2xl shadow-sm flex flex-col justify-between overflow-hidden ${surface}`}>
                  <div>
                    <div className={`p-5 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${isDarkMode ? "border-zinc-800" : "border-slate-100"}`}>
                      <div className={`flex items-center gap-2 ${isDarkMode ? "text-indigo-300" : "text-indigo-600"}`}>
                        <GraduationCap className="w-4 h-4" />
                        <h3 className={`text-sm font-bold ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>
                          Student Directory
                        </h3>
                      </div>
                      <div className="relative w-full sm:w-52">
                        <Search className={`absolute left-3 top-2.5 w-3.5 h-3.5 ${isDarkMode ? "text-zinc-500" : "text-slate-400"}`} />
                        <input
                          type="text"
                          placeholder="Search"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className={`w-full rounded-xl pl-8 pr-3 py-1.5 text-xs outline-none focus:border-indigo-500 transition placeholder:text-slate-400 border ${
                            isDarkMode
                              ? "bg-zinc-900 border-zinc-800 text-zinc-100"
                              : "bg-slate-50 border-slate-200 text-slate-800"
                          }`}
                        />
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className={`border-b text-[11px] font-bold uppercase tracking-wider ${isDarkMode ? "border-zinc-800 bg-zinc-900/40 text-zinc-500" : "border-slate-100 bg-slate-50/50 text-slate-400"}`}>
                            <th className="py-3 px-5">Student</th>
                            <th className="py-3 px-3">ID</th>
                            <th className="py-3 px-3">Status</th>
                            <th className="py-3 px-5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className={isDarkMode ? "divide-y divide-zinc-800 text-xs" : "divide-y divide-slate-100 text-xs"}>
                          {filteredStudents.map((student) => (
                            <tr key={student.id} className={isDarkMode ? "hover:bg-zinc-900/60 transition-colors" : "hover:bg-slate-50/60 transition-colors"}>
                              <td className="py-3 px-5">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs ${isDarkMode ? "bg-indigo-950/60 text-indigo-300" : "bg-indigo-100 text-indigo-700"}`}>
                                    {student.name.split(" ").map((n) => n[0]).join("")}
                                  </div>
                                  <div>
                                    <p className={`font-semibold ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>{student.name}</p>
                                    <p className={`text-[11px] ${subtleText}`}>{student.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className={`py-3 px-3 font-mono ${subtleText}`}>{student.id}</td>
                              <td className="py-3 px-3">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                    student.status === "Active"
                                      ? (isDarkMode ? "bg-emerald-950/40 text-emerald-300" : "bg-emerald-50 text-emerald-600")
                                      : (isDarkMode ? "bg-zinc-800 text-zinc-400" : "bg-slate-100 text-slate-500")
                                  }`}
                                >
                                  {student.status}
                                </span>
                              </td>
                              <td className="py-3 px-5 text-right">
                                <button
                                  onClick={() => deleteStudent(student.id)}
                                  className={`p-1.5 rounded-lg transition ${isDarkMode ? "text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30" : "text-slate-400 hover:text-rose-600 hover:bg-rose-50"}`}
                                  title="Delete Student"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className={`p-3 border-t text-center ${isDarkMode ? "border-zinc-800" : "border-slate-100"}`}>
                    <button
                      onClick={() => setActiveTab("Students")}
                      className={`text-xs font-semibold ${isDarkMode ? "text-indigo-300 hover:underline" : "text-indigo-600 hover:underline"}`}
                    >
                      View All Students
                    </button>
                  </div>
                </div>

                {/* REIMBURSEMENT QUEUE */}
                <div className={`lg:col-span-5 rounded-2xl shadow-sm flex flex-col justify-between overflow-hidden ${surface}`}>
                  <div>
                    <div className={`p-5 border-b flex items-center justify-between ${isDarkMode ? "border-zinc-800" : "border-slate-100"}`}>
                      <div className={`flex items-center gap-2 ${isDarkMode ? "text-indigo-300" : "text-indigo-600"}`}>
                        <Clock className="w-4 h-4" />
                        <h3 className={`text-sm font-bold ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>
                          Claims Queue
                        </h3>
                      </div>
                      <span className={`text-xs ${subtleText}`}>
                        {pendingClaims.length} Pending
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className={`border-b text-[11px] font-bold uppercase tracking-wider ${isDarkMode ? "border-zinc-800 bg-zinc-900/40 text-zinc-500" : "border-slate-100 bg-slate-50/50 text-slate-400"}`}>
                            <th className="py-3 px-4">Employee</th>
                            <th className="py-3 px-3">Amount</th>
                            <th className="py-3 px-4 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className={isDarkMode ? "divide-y divide-zinc-800 text-xs" : "divide-y divide-slate-100 text-xs"}>
                          {pendingClaims.slice(0, 4).map((claim) => (
                            <tr key={claim.id} className={isDarkMode ? "hover:bg-zinc-900/60 transition-colors" : "hover:bg-slate-50/60 transition-colors"}>
                              <td className="py-3 px-4">
                                <p className={`font-semibold ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>{claim.employee}</p>
                                <p className={`text-[10px] ${subtleText}`}>{claim.title}</p>
                              </td>
                              <td className={`py-3 px-3 font-semibold ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>
                                ${claim.amount.toFixed(2)}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    onClick={() => updateClaimStatus(claim.id, "Approved")}
                                    className={`p-1 rounded-lg transition ${isDarkMode ? "bg-emerald-950/40 text-emerald-300 hover:bg-emerald-950/60" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"}`}
                                    title="Approve"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => updateClaimStatus(claim.id, "Rejected")}
                                    className={`p-1 rounded-lg transition ${isDarkMode ? "bg-rose-950/40 text-rose-300 hover:bg-rose-950/60" : "bg-rose-50 text-rose-600 hover:bg-rose-100"}`}
                                    title="Reject"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className={`p-3 border-t text-center ${isDarkMode ? "border-zinc-800" : "border-slate-100"}`}>
                    <button
                      onClick={() => setActiveTab("Claims Queue")}
                      className={`text-xs font-semibold ${isDarkMode ? "text-indigo-300 hover:underline" : "text-indigo-600 hover:underline"}`}
                    >
                      Manage All Claims
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 🟢 RENDER STUDENTS PAGE HERE */}
          {activeTab === "Students" && <StudentsPage />}

          {/* 🟢 RENDER EMPLOYEES PAGE HERE */}
          {activeTab === "Employees" && <EmployeePage />}

          {/* 🟢 RENDER CLAIMS QUEUE PAGE HERE */}
          {activeTab === "Claims Queue" && <ClaimsQueuePage />}

          {activeTab === "Reports" && <ReportsPage />}

          {activeTab === "Settings" && <SettingsPage />}

      
        </main>
      </div>
    </div>
  );
}
