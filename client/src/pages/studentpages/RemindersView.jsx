import { useMemo } from "react";
import { useStudentStore } from "@/store/useStudentStore";
import { useTheme } from "@/context/ThemeContext";
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle2,
  Trash2,
  CheckCheck,
  Check,
  AlertCircle,
} from "lucide-react";

export default function RemindersView() {
  const { isDarkMode } = useTheme();
  const surface = isDarkMode ? "bg-[#121215] border-zinc-800/80 text-zinc-100" : "bg-white border-slate-200/80 text-slate-800";
  const subtleText = isDarkMode ? "text-zinc-400" : "text-slate-500";
  const {
    user,
    expenses = [],
    reminders = [],
    discardReminder,
    markAllAsRead,
    markAsRead, // Assuming store has individual markAsRead or fallback provided inline
  } = useStudentStore();

  // 1. Calculate dynamic budget alerts based on real transaction data
  const dynamicAlerts = useMemo(() => {
    const alerts = [];
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlySpent = expenses.reduce((sum, item) => {
      const d = new Date(item.date);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        return sum + Number(item.amount || 0);
      }
      return sum;
    }, 0);

    const allowance = Number(user?.monthlyAllowance || 0);

    if (allowance > 0) {
      const percentageUsed = (monthlySpent / allowance) * 100;

      if (percentageUsed >= 100) {
        alerts.push({
          id: "dyn-budget-exceeded",
          title: "Monthly Budget Exceeded!",
          message: `You've spent $${monthlySpent.toFixed(
            2
          )}, which exceeds your $${allowance.toFixed(2)} monthly allowance.`,
          type: "warning",
          date: "Just now",
          isRead: false,
          isDynamic: true,
        });
      } else if (percentageUsed >= 80) {
        alerts.push({
          id: "dyn-budget-near",
          title: "Approaching Monthly Allowance",
          message: `You've used ${Math.round(
            percentageUsed
          )}% ($${monthlySpent.toFixed(2)}) of your $${allowance.toFixed(
            2
          )} allowance.`,
          type: "info",
          date: "Just now",
          isRead: false,
          isDynamic: true,
        });
      }
    }

    return alerts;
  }, [expenses, user]);

  // Combine store reminders with generated alerts (avoid duplicates)
  const allReminders = useMemo(() => {
    const storeIds = new Set(reminders.map((r) => r.id));
    const filteredDynamic = dynamicAlerts.filter((a) => !storeIds.has(a.id));
    return [...filteredDynamic, ...reminders];
  }, [reminders, dynamicAlerts]);

  const unreadCount = allReminders.filter((r) => !r.isRead).length;

  return (
    <div className="space-y-6">
      {/* Title & Top Bar Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? "text-zinc-100" : "text-slate-900"}`}>
            Overspending & Reminders
          </h1>
          <p className={`text-xs mt-0.5 ${subtleText}`}>
            Automated alerts for high category spending and allowance thresholds.
          </p>
        </div>

        {allReminders.length > 0 && (
          <button
            onClick={() => markAllAsRead && markAllAsRead()}
            disabled={unreadCount === 0}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              unreadCount > 0
                ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 cursor-pointer shadow-xs"
                : isDarkMode ? "bg-zinc-900 text-zinc-500 cursor-not-allowed opacity-60" : "bg-slate-100 text-slate-400 cursor-not-allowed opacity-60"
            }`}
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* REMINDERS CONTAINER */}
      <div className={`p-6 rounded-2xl border shadow-sm space-y-4 ${surface}`}>
        <div className={`flex items-center justify-between border-b pb-4 ${isDarkMode ? "border-zinc-800" : "border-slate-100"}`}>
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600" />
            <h2 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>
              Active Alerts ({allReminders.length})
            </h2>
          </div>
          {unreadCount > 0 && (
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${isDarkMode ? "text-amber-300 bg-amber-950/30 border-amber-900/40" : "text-amber-700 bg-amber-50 border-amber-200"}`}>
              {unreadCount} Unread
            </span>
          )}
        </div>

        {allReminders.length === 0 ? (
          <div className={`py-12 text-center ${subtleText}`}>
            <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-500 opacity-80" />
            <h3 className={`text-sm font-bold ${isDarkMode ? "text-zinc-200" : "text-slate-700"}`}>All Clear!</h3>
            <p className={`text-xs mt-0.5 ${subtleText}`}>
              No overspending warnings or pending reminders right now.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {allReminders.map((reminder) => {
              const isWarning = reminder.type === "warning";
              const isUnread = !reminder.isRead;

              return (
                <div
                  key={reminder.id}
                  className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                    isUnread
                      ? isWarning
                        ? "bg-amber-50/60 border-amber-200 shadow-xs"
                        : "bg-indigo-50/40 border-indigo-100 shadow-xs"
                      : isDarkMode ? "bg-zinc-900/50 border-zinc-800/60 opacity-75" : "bg-slate-50/50 border-slate-200/60 opacity-75"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                        isWarning
                          ? isDarkMode ? "bg-amber-950/40 text-amber-300" : "bg-amber-100 text-amber-700"
                          : isDarkMode ? "bg-indigo-950/40 text-indigo-300" : "bg-indigo-100 text-indigo-700"
                      }`}
                    >
                      {isWarning ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : (
                        <Info className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4
                          className={`text-xs font-bold ${
                            isUnread ? (isDarkMode ? "text-zinc-100" : "text-slate-900") : (isDarkMode ? "text-zinc-400" : "text-slate-600")
                          }`}
                        >
                          {reminder.title}
                        </h4>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                        )}
                        {reminder.isDynamic && (
                          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${isDarkMode ? "bg-zinc-800/80 text-zinc-300" : "bg-slate-200/70 text-slate-600"}`}>
                            Auto
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-1 leading-relaxed ${isDarkMode ? "text-zinc-300" : "text-slate-600"}`}>
                        {reminder.message}
                      </p>
                      <span className={`text-[10px] mt-2 block font-medium ${subtleText}`}>
                        {reminder.date}
                      </span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isUnread && markAsRead && (
                      <button
                        onClick={() => markAsRead(reminder.id)}
                        className={`p-1.5 border rounded-lg text-xs transition ${isDarkMode ? "bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300" : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"}`}
                        title="Mark as Read"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {!reminder.isDynamic && (
                      <button
                        onClick={() =>
                          discardReminder && discardReminder(reminder.id)
                        }
                        className={`flex items-center gap-1 border p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold transition ${isDarkMode ? "bg-zinc-900 border-zinc-800 hover:border-rose-700 text-zinc-300 hover:text-rose-300" : "bg-white border-slate-200 hover:border-rose-300 text-slate-500 hover:text-rose-600"}`}
                        title="Dismiss Alert"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Dismiss</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
