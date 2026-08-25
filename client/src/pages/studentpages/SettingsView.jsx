import { useState } from "react";
import { useStudentStore } from "@/store/useStudentStore";
import { User, ShieldCheck, Save, Check, Lock, Loader2, AlertCircle } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsView() {
  const { user, updateProfileName, changePassword } = useStudentStore();
  const { isDarkMode } = useTheme();

  // --- Profile Form State ---
  const [name, setName] = useState(user?.name || "");
  const [nameSuccess, setNameSuccess] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // --- Password Form State ---
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passStatus, setPassStatus] = useState({ type: "", message: "" });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Clear password status message after 4 seconds
  const setTimedPassStatus = (status) => {
    setPassStatus(status);
    setTimeout(() => setPassStatus({ type: "", message: "" }), 4000);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName === user?.name) return;

    setIsUpdatingProfile(true);
    try {
      await updateProfileName(trimmedName);
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassStatus({ type: "", message: "" });

    if (!currentPassword) {
      setTimedPassStatus({ type: "error", message: "Please enter your current password." });
      return;
    }

    if (newPassword.length < 6) {
      setTimedPassStatus({ type: "error", message: "New password must be at least 6 characters." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setTimedPassStatus({ type: "error", message: "New passwords do not match." });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await changePassword(currentPassword, newPassword);
      if (res?.success) {
        setTimedPassStatus({ type: "success", message: res.message || "Password updated successfully!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setTimedPassStatus({ type: "error", message: res?.message || "Failed to change password." });
      }
    } catch (error) {
      setTimedPassStatus({ type: "error", message: "An error occurred while updating password." });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const cardBaseStyle = `p-6 rounded-2xl border shadow-xs transition-colors ${
    isDarkMode ? "bg-[#111827] border-slate-800" : "bg-white border-slate-200/80"
  }`;

  const inputBaseStyle = `w-full rounded-xl px-3 py-2 text-xs border outline-none transition ${
    isDarkMode
      ? "bg-slate-900 border-slate-800 text-slate-100 focus:border-indigo-500"
      : "bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500"
  }`;

  const labelBaseStyle = `block text-[11px] font-semibold mb-1 ${
    isDarkMode ? "text-slate-300" : "text-slate-600"
  }`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* HEADER TITLE */}
      <div>
        <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
          Student Account Settings
        </h1>
        <p className={`text-xs mt-0.5 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
          Manage your personal details and secure your account.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PERSONAL DETAILS CARD */}
        <div className={cardBaseStyle}>
          <div className="flex items-center gap-2 mb-4 text-indigo-500">
            <User className="w-4 h-4" />
            <h3 className={`text-sm font-bold ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>
              Personal Details
            </h3>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className={labelBaseStyle}>Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                className={inputBaseStyle}
              />
            </div>

            <div>
              <label className={labelBaseStyle}>Student Email</label>
              <input
                type="email"
                value={user?.email || "john@student.edu"}
                disabled
                className={`w-full rounded-xl px-3 py-2 text-xs border outline-none cursor-not-allowed ${
                  isDarkMode
                    ? "bg-slate-900/50 border-slate-800 text-slate-500"
                    : "bg-slate-100 border-slate-200 text-slate-400"
                }`}
              />
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                disabled={isUpdatingProfile || !name.trim() || name.trim() === user?.name}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-5 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                {isUpdatingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : nameSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Profile</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* SECURITY & CHANGE PASSWORD CARD */}
        <div className={cardBaseStyle}>
          <div className="flex items-center gap-2 mb-4 text-emerald-500">
            <ShieldCheck className="w-4 h-4" />
            <h3 className={`text-sm font-bold ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>
              Security
            </h3>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className={labelBaseStyle}>Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={inputBaseStyle}
              />
            </div>

            <div>
              <label className={labelBaseStyle}>New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputBaseStyle}
              />
            </div>

            <div>
              <label className={labelBaseStyle}>Confirm New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputBaseStyle}
              />
            </div>

            {/* STATUS ALERT BANNER */}
            {passStatus.message && (
              <div
                className={`p-3 rounded-xl border text-[11px] font-medium flex items-center gap-2 ${
                  passStatus.type === "error"
                    ? isDarkMode
                      ? "bg-rose-950/30 border-rose-800/50 text-rose-400"
                      : "bg-rose-50 border-rose-200 text-rose-600"
                    : isDarkMode
                    ? "bg-emerald-950/30 border-emerald-800/50 text-emerald-400"
                    : "bg-emerald-50 border-emerald-200 text-emerald-600"
                }`}
              >
                {passStatus.type === "error" ? (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                ) : (
                  <Check className="w-4 h-4 shrink-0 text-emerald-500" />
                )}
                <span>{passStatus.message}</span>
              </div>
            )}

            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-5 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                {isUpdatingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
