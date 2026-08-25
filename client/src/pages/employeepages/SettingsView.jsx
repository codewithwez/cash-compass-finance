import { useState } from "react";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { useTheme } from "@/context/ThemeContext";
import {
  changePasswordSchema,
  employeeProfileSchema,
  getValidationMessage,
} from "@/lib/validationSchemas";
import { User, ShieldCheck, Save, Check, Lock } from "lucide-react";

export default function SettingsView() {
  const { isDarkMode } = useTheme();
  const { user, updateProfile, changePassword } = useEmployeeStore();

  // Profile Form State
  const [formData, setFormData] = useState({
    name: user?.name || "Alex Morgan",
    role: user?.role || "Senior Software Engineer",
    department: user?.department || "Engineering",
    email: "user@cashcompass.io",
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isSaved, setIsSaved] = useState(false);
  const [isPasswordSaved, setIsPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [profileError, setProfileError] = useState("");

  const handleProfileSave = async (e) => {
    e.preventDefault();
    const validation = employeeProfileSchema.safeParse(formData);
    const validationMessage = getValidationMessage(validation);
    if (validationMessage) {
      setProfileError(validationMessage);
      return;
    }
    setProfileError("");
    await updateProfile({
      name: validation.data.name,
      department: validation.data.department,
      position: validation.data.role,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");

    const validation = changePasswordSchema.safeParse(passwordData);
    const validationMessage = getValidationMessage(validation);
    if (validationMessage) {
      setPasswordError(validationMessage);
      return;
    }

    const result = await changePassword(
      validation.data.currentPassword,
      validation.data.newPassword
    );

    if (!result.success) {
      setPasswordError(result.message || "Failed to update password.");
      return;
    }

    setIsPasswordSaved(true);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setTimeout(() => setIsPasswordSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* HEADER TITLE */}
      <div>
        <h1
          className={`text-2xl font-bold tracking-tight ${
            isDarkMode ? "text-zinc-100" : "text-slate-900"
          }`}
        >
          Account Settings
        </h1>
        <p
          className={`text-xs mt-0.5 ${
            isDarkMode ? "text-zinc-400" : "text-slate-500"
          }`}
        >
          Manage your personal details, work information, and password security.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PERSONAL & WORK DETAILS CARD */}
        <div
          className={`p-6 rounded-2xl border shadow-sm transition-colors ${
            isDarkMode
              ? "bg-zinc-900 border-zinc-800 text-zinc-100"
              : "bg-white border-slate-200 text-slate-900"
          }`}
        >
          <div className="flex items-center gap-2 mb-4 text-indigo-500">
            <User className="w-4 h-4" />
            <h3
              className={`text-sm font-bold ${
                isDarkMode ? "text-zinc-100" : "text-slate-900"
              }`}
            >
              Personal & Work Details
            </h3>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label
                className={`block text-[11px] font-semibold mb-1 ${
                  isDarkMode ? "text-zinc-300" : "text-slate-700"
                }`}
              >
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`w-full rounded-xl px-3 py-2 text-xs border outline-none transition ${
                  isDarkMode
                    ? "bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-indigo-500"
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500"
                }`}
              />
            </div>

            <div>
              <label
                className={`block text-[11px] font-semibold mb-1 ${
                  isDarkMode ? "text-zinc-300" : "text-slate-700"
                }`}
              >
                Work Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={`w-full rounded-xl px-3 py-2 text-xs border outline-none transition ${
                  isDarkMode
                    ? "bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-indigo-500"
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500"
                }`}
              />
            </div>

            <div>
              <label
                className={`block text-[11px] font-semibold mb-1 ${
                  isDarkMode ? "text-zinc-300" : "text-slate-700"
                }`}
              >
                Role / Position
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className={`w-full rounded-xl px-3 py-2 text-xs border outline-none transition ${
                  isDarkMode
                    ? "bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-indigo-500"
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500"
                }`}
              />
            </div>

            <div>
              <label
                className={`block text-[11px] font-semibold mb-1 ${
                  isDarkMode ? "text-zinc-300" : "text-slate-700"
                }`}
              >
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                className={`w-full rounded-xl px-3 py-2 text-xs border outline-none transition ${
                  isDarkMode
                    ? "bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-indigo-500"
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500"
                }`}
              />
            </div>

            {profileError && <p className="text-xs text-red-500">{profileError}</p>}

            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-xl text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                {isSaved ? (
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
        <div
          className={`p-6 rounded-2xl border shadow-sm transition-colors ${
            isDarkMode
              ? "bg-zinc-900 border-zinc-800 text-zinc-100"
              : "bg-white border-slate-200 text-slate-900"
          }`}
        >
          <div className="flex items-center gap-2 mb-4 text-emerald-500">
            <ShieldCheck className="w-4 h-4" />
            <h3
              className={`text-sm font-bold ${
                isDarkMode ? "text-zinc-100" : "text-slate-900"
              }`}
            >
              Security
            </h3>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label
                className={`block text-[11px] font-semibold mb-1 ${
                  isDarkMode ? "text-zinc-300" : "text-slate-700"
                }`}
              >
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                className={`w-full rounded-xl px-3 py-2 text-xs border outline-none transition ${
                  isDarkMode
                    ? "bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-indigo-500"
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500"
                }`}
              />
            </div>

            <div>
              <label
                className={`block text-[11px] font-semibold mb-1 ${
                  isDarkMode ? "text-zinc-300" : "text-slate-700"
                }`}
              >
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className={`w-full rounded-xl px-3 py-2 text-xs border outline-none transition ${
                  isDarkMode
                    ? "bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-indigo-500"
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500"
                }`}
              />
            </div>

            <div>
              <label
                className={`block text-[11px] font-semibold mb-1 ${
                  isDarkMode ? "text-zinc-300" : "text-slate-700"
                }`}
              >
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className={`w-full rounded-xl px-3 py-2 text-xs border outline-none transition ${
                  isDarkMode
                    ? "bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-indigo-500"
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500"
                }`}
              />
            </div>

            {passwordError && (
              <p className="text-[11px] text-rose-500 font-medium">
                {passwordError}
              </p>
            )}

            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-xl text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                {isPasswordSaved ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Password Updated</span>
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