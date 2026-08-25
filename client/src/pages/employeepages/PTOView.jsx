import { useState } from "react";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { useTheme } from "@/context/ThemeContext";
import { getValidationMessage, leaveSchema } from "@/lib/validationSchemas";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  CheckCircle2,
  CalendarDays,
  FileText,
  AlertCircle,
} from "lucide-react";

export default function PTOView() {
  const { isDarkMode } = useTheme();
  const { pto, requestLeave } = useEmployeeStore();

  const [leaveDays, setLeaveDays] = useState(1);
  const [leaveType, setLeaveType] = useState("Vacation");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const validation = leaveSchema.safeParse({ leaveDays, leaveType });
    const validationMessage = getValidationMessage(validation);
    if (validationMessage) {
      setErrorMsg(validationMessage);
      return;
    }

    const days = validation.data.leaveDays;

    if (days > pto.availableDays) {
      setErrorMsg(`You only have ${pto.availableDays} available days left.`);
      return;
    }

    await requestLeave(days, validation.data.leaveType);
    setSuccessMsg(`Successfully submitted ${days} day(s) of ${validation.data.leaveType} leave!`);
    setLeaveDays(1);
  };

  return (
    <div className="space-y-6">
      {/* HEADER TITLE */}
      <div>
        <h1
          className={`text-2xl font-bold tracking-tight ${
            isDarkMode ? "text-zinc-100" : "text-slate-900"
          }`}
        >
          Request Leave
        </h1>
        <p
          className={`text-xs mt-0.5 ${
            isDarkMode ? "text-zinc-400" : "text-slate-500"
          }`}
        >
          Monitor available PTO balance and view request history.
        </p>
      </div>

      {/* BALANCE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Available PTO Card */}
        <div
          className={`p-5 rounded-2xl border shadow-sm transition-colors ${
  isDarkMode
    ? "bg-zinc-900 border-zinc-800"
    : "bg-white border-slate-200"
}`}
        >
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
              Available Balance
            </span>
            <span
              className={`p-1.5 rounded-lg ${
                isDarkMode
                  ? "bg-indigo-950 text-indigo-400"
                  : "bg-indigo-50 text-indigo-600"
              }`}
            >
              <CalendarDays className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div
              className={`text-3xl font-extrabold tracking-tight ${
                isDarkMode ? "text-zinc-100" : "text-slate-900"
              }`}
            >
              {pto.availableDays}{" "}
              <span className="text-sm font-semibold text-zinc-500">
                Days
              </span>
            </div>
            <span className="text-[10px] text-emerald-500 font-medium mt-1 block">
              Ready to use this year
            </span>
          </div>
        </div>

        {/* Used PTO Card */}
        <div
          className={`p-5 rounded-2xl border shadow-sm transition-colors ${
  isDarkMode
    ? "bg-zinc-900 border-zinc-800"
    : "bg-white border-slate-200"
}`}
        >
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
              Used Balance
            </span>
            <span
              className={`p-1.5 rounded-lg ${
                isDarkMode
                  ? "bg-amber-950/60 text-amber-400"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div
              className={`text-3xl font-extrabold tracking-tight ${
                isDarkMode ? "text-zinc-100" : "text-slate-900"
              }`}
            >
              {pto.usedDays}{" "}
              <span className="text-sm font-semibold text-zinc-500">
                Days
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 mt-1 block">
              Taken so far
            </span>
          </div>
        </div>

        {/* Total Annual Entitlement */}
        <div
          className={`p-5 rounded-2xl border shadow-sm transition-colors ${
  isDarkMode
    ? "bg-zinc-900 border-zinc-800"
    : "bg-white border-slate-200"
}`}
        >
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
              Annual Leaves
            </span>
            <span
              className={`p-1.5 rounded-lg ${
                isDarkMode
                  ? "bg-slate-800 text-zinc-500"
                  : "bg-zinc-800 text-zinc-300"
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div
              className={`text-3xl font-extrabold tracking-tight ${
                isDarkMode ? "text-zinc-100" : "text-slate-900"
              }`}
            >
              {pto.availableDays + pto.usedDays}{" "}
              <span className="text-sm font-semibold text-zinc-500">
                Days
              </span>
            </div>
           
          </div>
        </div>
      </div>

      {/* FORM AND HISTORY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEAVE REQUEST FORM */}
        <div
          className={`p-5 rounded-2xl border shadow-sm transition-colors ${
  isDarkMode
    ? "bg-zinc-900 border-zinc-800"
    : "bg-white border-slate-200"
}`}
        >
          <div className="flex items-center gap-2 mb-4 text-indigo-500">
            <Plus className="w-4 h-4" />
            <h3
              className={`text-sm font-bold ${
                isDarkMode ? "text-zinc-100" : "text-slate-900"
              }`}
            >
              Request Time Off
            </h3>
          </div>

          {errorMsg && (
            <div className="p-3 mb-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 mb-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleLeaveSubmit} className="space-y-4">
            <div>
              <label
                className={`block text-[11px] font-semibold mb-1 ${
                  isDarkMode ? "text-zinc-300" : "text-zinc-900"
                }`}
              >
                Leave Type
              </label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className={`w-full rounded-xl px-3 py-2 text-xs border outline-none transition cursor-pointer ${
                  isDarkMode
                    ? "bg-zinc-950 border-slate-800 text-slate-100 focus:border-indigo-500"
                    : "bg-zinc-100 border-zinc-800 text-zinc-900 focus:border-indigo-500"
                }`}
              >
                <option value="Vacation">Vacation / Paid Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Personal Day">Personal Day</option>
                <option value="Unpaid Leave">Unpaid Leave</option>
              </select>
            </div>

            <div>
              <label
                className={`block text-[11px] font-semibold mb-1 ${
                  isDarkMode ? "text-zinc-300" : "text-zinc-900"
                }`}
              >
                Duration (Days)
              </label>
              <input
                type="number"
                min="1"
                max={pto.availableDays}
                value={leaveDays}
                onChange={(e) => setLeaveDays(e.target.value)}
                className={`w-full rounded-xl px-3 py-2 text-xs border outline-none transition ${
                  isDarkMode
                    ? "bg-zinc-950 border-slate-800 text-slate-100 focus:border-indigo-500"
                    : "bg-zinc-100 border-zinc-800 text-zinc-900 focus:border-indigo-500"
                }`}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Mark Leave</span>
            </button>
          </form>
        </div>

        {/* PTO HISTORY LIST */}
        <div
          className={`p-5 rounded-2xl border shadow-sm transition-colors ${
  isDarkMode
    ? "bg-zinc-900 border-zinc-800"
    : "bg-white border-slate-200"
}`}
        >
          <h3
            className={`text-sm font-bold mb-4 ${
              isDarkMode ? "text-zinc-100" : "text-slate-900"
            }`}
          >
            Leave History
          </h3>

          <div className="space-y-3">
            {pto.history.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border flex items-center justify-between transition ${
                  isDarkMode
                    ? "bg-zinc-950/60 border-slate-800 hover:border-slate-700"
                    : "bg-zinc-100/70 border-slate-300 hover:border-zinc-800/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isDarkMode
                        ? "bg-indigo-950 text-indigo-400"
                        : "bg-indigo-50 text-indigo-600"
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4
                      className={`text-xs font-bold ${
                        isDarkMode ? "text-slate-200" : "text-zinc-900"
                      }`}
                    >
                      {item.type}
                    </h4>
                    <span className="text-[10px] text-zinc-500 block mt-0.5">
                      {item.startDate} 
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs font-extrabold block ${
                      isDarkMode ? "text-zinc-100" : "text-slate-900"
                    }`}
                  >
                    {item.days} {item.days === 1 ? "Day" : "Days"}
                  </span>
                  <span className="inline-block px-2 py-0.5 text-[9px] font-bold rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mt-1">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}




