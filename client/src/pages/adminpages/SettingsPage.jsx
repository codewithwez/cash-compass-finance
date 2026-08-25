import React, { useState } from "react";
import {
  User,
  Building,
  ShieldCheck,
  Bell,
  Save,
  CheckCircle2,
  Lock,
  DollarSign,
  FileText,
  Mail,
  Moon,
  Globe,
} from "lucide-react";

import { useTheme } from "@/context/ThemeContext";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { isDarkMode } = useTheme();
  const surface = isDarkMode ? "bg-[#121215] border-zinc-800/80 text-zinc-100" : "bg-white border-slate-200/80 text-slate-800";
  const subtleText = isDarkMode ? "text-zinc-400" : "text-slate-400";
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Simple Form State
  const [formData, setFormData] = useState({
    // Profile
    adminName: "Alex Morgan",
    adminEmail: "admin@cashcompass.org",
    adminRole: "Super Admin",
    
    // System & Policies
    orgName: "CashCompass Financial",
    currency: "USD ($)",
    autoApproveLimit: 25,
    requireReceiptAbove: 10,

    
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 rounded-2xl shadow-sm ${surface}`}>
        <div>
          <h1 className={`text-xl font-extrabold ${isDarkMode ? "text-zinc-100" : "text-slate-900"}`}>Do want want to Save Settings?</h1>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-slate-600 hover:bg-indigo-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-sm"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      {/* SUCCESS TOAST */}
      {savedSuccess && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold animate-in fade-in duration-200 ${isDarkMode ? "bg-emerald-950/40 border border-emerald-900/40 text-emerald-300" : "bg-emerald-50 border border-emerald-200 text-emerald-700"}`}>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Settings updated successfully!
        </div>
      )}

      {/* TAB NAVIGATION */}
      <div className={`flex gap-2 border-b text-xs font-semibold ${isDarkMode ? "border-zinc-800" : "border-slate-200"}`}>
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 transition ${
            activeTab === "profile"
              ? "border-indigo-600 text-indigo-300 font-bold"
              : "border-transparent text-zinc-400 hover:text-zinc-100"
          }`}
        >
          <User className="w-4 h-4" />
          Admin Profile
        </button>

        <button
          onClick={() => setActiveTab("system")}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 transition ${
            activeTab === "system"
              ? "border-indigo-600 text-indigo-300 font-bold"
              : "border-transparent text-zinc-400 hover:text-zinc-100"
          }`}
        >
          <Building className="w-4 h-4" />
          System & Policies
        </button>

        
      </div>

      {/* TAB CONTENT */}
      <div className={`p-6 rounded-2xl shadow-sm space-y-6 ${surface}`}>
        
        {/* TAB 1: ADMIN PROFILE */}
        {activeTab === "profile" && (
          <div className="space-y-5">
            <h3 className={`text-sm font-bold border-b pb-2 ${isDarkMode ? "text-zinc-100 border-zinc-800" : "text-slate-800 border-slate-100"}`}>
              Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isDarkMode ? "text-zinc-300" : "text-slate-600"}`}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleChange}
                  className={`w-full rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 border ${isDarkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-slate-50 border-slate-200 text-slate-800"}`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${isDarkMode ? "text-zinc-300" : "text-slate-600"}`}>
                  Work Email Address
                </label>
                <input
                  type="email"
                  name="adminEmail"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  className={`w-full rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 border ${isDarkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-slate-50 border-slate-200 text-slate-800"}`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${isDarkMode ? "text-zinc-300" : "text-slate-600"}`}>
                  Role Permission Level
                </label>
                <input
                  type="text"
                  name="adminRole"
                  value={formData.adminRole}
                  disabled
                  className={`w-full rounded-xl px-3 py-2 text-xs cursor-not-allowed border ${isDarkMode ? "bg-zinc-900 border-zinc-800 text-zinc-500" : "bg-slate-100 border-slate-200 text-slate-400"}`}
                />
              </div>
            </div>

            <div className={`pt-4 border-t ${isDarkMode ? "border-zinc-800" : "border-slate-100"}`}>
              <button
                type="button"
                className={`flex items-center gap-1.5 text-xs font-semibold ${isDarkMode ? "text-indigo-300 hover:text-indigo-200" : "text-indigo-600 hover:text-indigo-800"}`}
              >
                <Lock className="w-3.5 h-3.5" />
                Change Account Password
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: SYSTEM & CLAIMS POLICIES */}
        {activeTab === "system" && (
          <div className="space-y-5">
            <h3 className={`text-sm font-bold border-b pb-2 ${isDarkMode ? "text-zinc-100 border-zinc-800" : "text-slate-800 border-slate-100"}`}>
              Organization & Claim Rules
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isDarkMode ? "text-zinc-300" : "text-slate-600"}`}>
                  Organization Name
                </label>
                <input
                  type="text"
                  name="orgName"
                  value={formData.orgName}
                  onChange={handleChange}
                  className={`w-full rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 border ${isDarkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-slate-50 border-slate-200 text-slate-800"}`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${isDarkMode ? "text-zinc-300" : "text-slate-600"}`}>
                  Default Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className={`w-full rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 border ${isDarkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-slate-50 border-slate-200 text-slate-800"}`}
                >
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                  <option>PKR (Rs)</option>
                </select>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${isDarkMode ? "text-zinc-300" : "text-slate-600"}`}>
                  Auto-Approval Limit ($)
                </label>
                <input
                  type="number"
                  name="autoApproveLimit"
                  value={formData.autoApproveLimit}
                  onChange={handleChange}
                  className={`w-full rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 border ${isDarkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-slate-50 border-slate-200 text-slate-800"}`}
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Claims under this amount approve automatically.
                </p>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${isDarkMode ? "text-zinc-300" : "text-slate-600"}`}>
                  Require Receipt Above ($)
                </label>
                <input
                  type="number"
                  name="requireReceiptAbove"
                  value={formData.requireReceiptAbove}
                  onChange={handleChange}
                  className={`w-full rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 border ${isDarkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-slate-50 border-slate-200 text-slate-800"}`}
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Cloudinary receipt upload is mandatory above this value.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <div className="space-y-4">
            <h3 className={`text-sm font-bold border-b pb-2 ${isDarkMode ? "text-zinc-100 border-zinc-800" : "text-slate-800 border-slate-100"}`}>
              Alerts & System Preferences
            </h3>

            <div className="space-y-3">
              <label className={`flex items-center gap-3 cursor-pointer p-2 rounded-xl transition ${isDarkMode ? "hover:bg-zinc-900" : "hover:bg-slate-50"}`}>
                <input
                  type="checkbox"
                  name="emailAlerts"
                  checked={formData.emailAlerts}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <div>
                  <div className={`text-xs font-bold ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>Email Alerts on New Claims</div>
                  <div className={`text-[11px] ${subtleText}`}>
                    Get an email whenever an employee submits a new reimbursement request.
                  </div>
                </div>
              </label>

              <label className={`flex items-center gap-3 cursor-pointer p-2 rounded-xl transition ${isDarkMode ? "hover:bg-zinc-900" : "hover:bg-slate-50"}`}>
                <input
                  type="checkbox"
                  name="weeklyDigest"
                  checked={formData.weeklyDigest}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <div>
                  <div className={`text-xs font-bold ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>Weekly Summary Email</div>
                  <div className={`text-[11px] ${subtleText}`}>
                    Receive a financial overview report every Monday morning.
                  </div>
                </div>
              </label>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
