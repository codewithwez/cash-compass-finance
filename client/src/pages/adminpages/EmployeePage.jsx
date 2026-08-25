import React, { useEffect, useState } from "react";
import { useAdminStore } from "@/store/useAdminStore";
import { useTheme } from "@/context/ThemeContext";
import {
  adminLeaveSchema,
  adminPayrollSchema,
  getValidationMessage,
} from "@/lib/validationSchemas";
import {
  DollarSign,
  Calendar,
  Search,
  X,
  Pencil,
  Building2,
} from "lucide-react";

export default function EmployeesPage() {
  const { isDarkMode } = useTheme();
  const { employees, fetchAdminData, updateEmployee } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmp, setSelectedEmp] = useState(null);

  const [activeModal, setActiveModal] = useState(null);
  const [formData, setFormData] = useState({});
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchAdminData().catch((error) => {
      console.error("Failed to load employees:", error);
    });
  }, [fetchAdminData]);

  const calculateNetSalary = (employee) => employee.monthlySalary || 0;

  // Handlers to update records
  const handleSavePayroll = async (e) => {
    e.preventDefault();
    const validation = adminPayrollSchema.safeParse(formData);
    const validationMessage = getValidationMessage(validation);
    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }
    setFormError("");
    await updateEmployee(selectedEmp.id, {
      monthlySalary: validation.data.monthlySalary,
      nextPayDate: validation.data.nextPayDate,
    });
    setActiveModal(null);
  };

  const handleSaveLeave = async (e) => {
    e.preventDefault();
    const validation = adminLeaveSchema.safeParse(formData);
    const validationMessage = getValidationMessage(validation);
    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }
    setFormError("");
    await updateEmployee(selectedEmp.id, {
      totalLeave: validation.data.totalLeave,
    });
    setActiveModal(null);
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const surface = isDarkMode ? "bg-[#121215] border-zinc-800/80 text-zinc-100" : "bg-white border-slate-200/80 text-slate-800";
  const mutedSurface = isDarkMode ? "bg-zinc-900/60 border-zinc-800/70" : "bg-slate-50/70 border-slate-200/60";
  const subtleText = isDarkMode ? "text-zinc-400" : "text-slate-400";

  return (
    <div className="space-y-6">
      {/* 🟢 TOP METRICS PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`${surface} p-4 rounded-2xl shadow-sm flex items-center gap-3`}>
          <div className={`p-3 rounded-xl ${isDarkMode ? "bg-emerald-950/40 text-emerald-300" : "bg-emerald-50 text-emerald-600"}`}>
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${subtleText}`}>
              Total Monthly Net Payroll
            </p>
            <h3 className={`text-lg font-extrabold mt-0.5 ${isDarkMode ? "text-zinc-100" : "text-slate-900"}`}>
              $
              {employees
                .reduce((acc, emp) => acc + calculateNetSalary(emp), 0)
                .toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
          </div>
        </div>

      </div>

      {/* 🟢 MAIN DIRECTORY CONTROL */}
      <div className={`${surface} rounded-2xl shadow-sm overflow-hidden`}>
        {/* HEADER BAR */}
        <div className={`p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isDarkMode ? "border-zinc-800" : "border-slate-100"}`}>
          <div className="flex items-center gap-2">
            <Building2 className={`w-5 h-5 ${isDarkMode ? "text-indigo-300" : "text-indigo-600"}`} />
            <h2 className={`text-base font-bold ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>
              Employee Compensation & Leave Management
            </h2>
          </div>

          <div className="relative">
            <Search className={`absolute left-3 top-2.5 w-3.5 h-3.5 ${subtleText}`} />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`rounded-xl pl-8 pr-3 py-1.5 text-xs outline-none focus:border-indigo-500 transition w-56 border ${isDarkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-slate-50 border-slate-200 text-slate-800"}`}
            />
          </div>
        </div>

        {/* DETAILED EMPLOYEE LIST */}
        <div className={isDarkMode ? "divide-y divide-zinc-800" : "divide-y divide-slate-100"}>
          {filteredEmployees.map((emp) => {
            const netSalary = calculateNetSalary(emp);
            const availableLeave = emp.pto?.availableDays || 0;
            const usedLeave = emp.pto?.usedDays || 0;
            const totalLeave = availableLeave + usedLeave;

            return (
              <div key={emp.id} className={`p-6 space-y-6 transition ${isDarkMode ? "hover:bg-zinc-900/60" : "hover:bg-slate-50/40"}`}>
                {/* 1. EMPLOYEE HEADER & PAYDAY */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className={`text-base font-bold ${isDarkMode ? "text-zinc-100" : "text-slate-900"}`}>{emp.name}</h3>
                    <p className={`text-xs ${subtleText}`}>
                      {emp.id} • {emp.position} ({emp.department})
                    </p>
                  </div>

                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border ${isDarkMode ? "bg-indigo-950/40 border-indigo-900/50 text-indigo-300" : "bg-indigo-50/60 border-indigo-100 text-indigo-700"}`}>
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Next Payday: {emp.nextPayDate || "Not set"}</span>
                  </div>
                </div>

                {/* 2. TWO-COLUMN FEATURE GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* A. MONTHLY NET SALARY & DEDUCTIONS */}
                  <div className={`${mutedSurface} rounded-xl p-4 border space-y-3`}>
                    <div className={`flex justify-between items-center border-b pb-2 ${isDarkMode ? "border-zinc-800" : "border-slate-200/60"}`}>
                      <span className={`text-xs font-bold flex items-center gap-1.5 ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>
                        <DollarSign className={`w-3.5 h-3.5 ${isDarkMode ? "text-emerald-300" : "text-emerald-600"}`} /> Payroll Breakdown
                      </span>
                      <button
                        onClick={() => {
                          setSelectedEmp(emp);
                          setFormData({
                            monthlySalary: emp.monthlySalary,
                            nextPayDate: emp.nextPayDate || "",
                          });
                          setActiveModal("payroll");
                        }}
                        className={`text-[11px] font-semibold hover:underline flex items-center gap-1 ${isDarkMode ? "text-indigo-300" : "text-indigo-600"}`}
                      >
                        <Pencil className="w-3 h-3" /> Edit
                      </button>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className={isDarkMode ? "flex justify-between text-zinc-300" : "flex justify-between text-slate-600"}>
                        <span>Monthly Salary:</span>
                        <span className={`font-semibold ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>
                          ${(emp.monthlySalary || 0).toFixed(2)}
                        </span>
                      </div>
                      <div className={`pt-2 border-t flex justify-between font-extrabold text-sm ${isDarkMode ? "border-zinc-800 text-zinc-100" : "border-slate-200 text-slate-900"}`}>
                        <span>Net Take-Home:</span>
                        <span className={isDarkMode ? "text-emerald-300" : "text-emerald-600"}>${netSalary.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* B. LEAVE MANAGEMENT & ENTITLEMENT */}
                  <div className={`${mutedSurface} rounded-xl p-4 border space-y-3`}>
                    <div className={`flex justify-between items-center border-b pb-2 ${isDarkMode ? "border-zinc-800" : "border-slate-200/60"}`}>
                      <span className={`text-xs font-bold flex items-center gap-1.5 ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>
                        <Calendar className={`w-3.5 h-3.5 ${isDarkMode ? "text-amber-300" : "text-amber-600"}`} /> Leave Balance
                      </span>
                      <button
                        onClick={() => {
                          setSelectedEmp(emp);
                          setFormData({
                            totalLeave: availableLeave + usedLeave,
                          });
                          setActiveModal("leave");
                        }}
                        className={`text-[11px] font-semibold hover:underline flex items-center gap-1 ${isDarkMode ? "text-indigo-300" : "text-indigo-600"}`}
                      >
                        <Pencil className="w-3 h-3" /> Edit
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className={`p-2 rounded-lg border ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-slate-200/60"}`}>
                        <span className={`block font-bold ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>
                          {totalLeave}
                        </span>
                        <span className={`text-[10px] ${subtleText}`}>Total</span>
                      </div>
                      <div className={`p-2 rounded-lg border ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-slate-200/60"}`}>
                        <span className={`block font-bold ${isDarkMode ? "text-rose-300" : "text-rose-600"}`}>{usedLeave}</span>
                        <span className={`text-[10px] ${subtleText}`}>Taken</span>
                      </div>
                      <div className={`p-2 rounded-lg border ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-slate-200/60"}`}>
                        <span className={`block font-bold ${isDarkMode ? "text-emerald-300" : "text-emerald-600"}`}>{availableLeave}</span>
                        <span className={`text-[10px] ${subtleText}`}>Left</span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🟢 EDIT PAYROLL & DEDUCTIONS MODAL */}
      {activeModal === "payroll" && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${surface} rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 border`}>
            <div className={`flex justify-between items-center border-b pb-3 ${isDarkMode ? "border-zinc-800" : "border-slate-100"}`}>
              <h3 className={`font-bold text-sm ${isDarkMode ? "text-zinc-100" : "text-slate-900"}`}>
                Edit Payroll & Deductions: {selectedEmp?.name}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className={`text-slate-400 hover:text-slate-600 ${isDarkMode ? "text-zinc-400 hover:text-zinc-100" : ""}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePayroll} className="space-y-3 text-xs">
              <div>
                <label className={`block font-semibold mb-1 ${isDarkMode ? "text-zinc-300" : "text-slate-600"}`}>
                  Gross Monthly Salary ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.monthlySalary || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, monthlySalary: Number(e.target.value) })
                  }
                  className={`w-full rounded-xl px-3 py-2 outline-none focus:border-indigo-500 border ${isDarkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-slate-50 border-slate-200 text-slate-800"}`}
                  required
                />
              </div>

              {formError && <p className="text-xs text-red-500">{formError}</p>}

              <div>
                <label className={`block font-semibold mb-1 ${isDarkMode ? "text-zinc-300" : "text-slate-600"}`}>Next Payday</label>
                <input
                  type="date"
                  value={formData.nextPayDate || ""}
                  onChange={(e) => setFormData({ ...formData, nextPayDate: e.target.value })}
                  className={`w-full rounded-xl px-3 py-2 outline-none focus:border-indigo-500 border ${isDarkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-slate-50 border-slate-200 text-slate-800"}`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className={`px-3 py-1.5 rounded-xl ${isDarkMode ? "text-zinc-300 hover:bg-zinc-900" : "text-slate-500 hover:bg-slate-100"}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-semibold shadow-sm hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === "leave" && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${surface} rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 border`}>
            <div className={`flex justify-between items-center border-b pb-3 ${isDarkMode ? "border-zinc-800" : "border-slate-100"}`}>
              <h3 className={`font-bold text-sm ${isDarkMode ? "text-zinc-100" : "text-slate-900"}`}>
                Edit Leave Balance: {selectedEmp?.name}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className={`text-slate-400 hover:text-slate-600 ${isDarkMode ? "text-zinc-400 hover:text-zinc-100" : ""}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLeave} className="space-y-3 text-xs">
              <div>
                <label className={`block font-semibold mb-1 ${isDarkMode ? "text-zinc-300" : "text-slate-600"}`}>
                  Total Leave Days
                </label>
                <input
                  type="number"
                  min={selectedEmp?.pto?.usedDays || 0}
                  step="0.5"
                  value={formData.totalLeave ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, totalLeave: Number(e.target.value) })
                  }
                  className={`w-full rounded-xl px-3 py-2 outline-none focus:border-indigo-500 border ${isDarkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-slate-50 border-slate-200 text-slate-800"}`}
                  required
                />
                <p className={`text-[11px] mt-1 ${subtleText}`}>
                  Taken days are retained and subtracted from this total.
                </p>
              </div>

              {formError && <p className="text-xs text-red-500">{formError}</p>}

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className={`px-3 py-1.5 rounded-xl ${isDarkMode ? "text-zinc-300 hover:bg-zinc-900" : "text-slate-500 hover:bg-slate-100"}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-semibold shadow-sm hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
