import { useState } from "react";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { useTheme } from "@/context/ThemeContext";
import { getValidationMessage, salarySchema } from "@/lib/validationSchemas";
import {
  DollarSign,
  Download,
  Calendar,
  CheckCircle2,
  FileText,
  Eye,
  Plus,
  X,
  Upload,
} from "lucide-react";

export default function PayrollView() {
  const { isDarkMode } = useTheme();
  const { user, payslips = [], updateSalary, uploadPayslip } = useEmployeeStore();

  const [isEditingSalary, setIsEditingSalary] = useState(false);
  const [newSalary, setNewSalary] = useState(user?.monthlySalary || 0);
  const [salaryError, setSalaryError] = useState("");

  // Modal & File Upload States
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    period: "",
    date: new Date().toISOString().split("T")[0],
    netPay: "",
    status: "Paid",
    fileUrl: "",
  });

  const handleSalarySubmit = async (e) => {
    e.preventDefault();
    const validation = salarySchema.safeParse({ salary: newSalary });
    const validationMessage = getValidationMessage(validation);
    if (validationMessage) {
      setSalaryError(validationMessage);
      return;
    }

    setSalaryError("");
    await updateSalary(validation.data.salary);
    setIsEditingSalary(false);
  };

  // Convert uploaded file to base64 string for easy storage & immediate preview
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, fileUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!formData.period || !formData.netPay) return;

    try {
      await uploadPayslip({
        period: formData.period,
        date: formData.date,
        netPay: Number(formData.netPay),
        status: formData.status,
        fileUrl: formData.fileUrl,
      });

      // Reset form & close modal
      setIsUploadModalOpen(false);
      setFormData({
        period: "",
        date: new Date().toISOString().split("T")[0],
        netPay: "",
        status: "Paid",
        fileUrl: "",
      });
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER TITLE */}
      <div>
        <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? "text-zinc-100" : "text-slate-900"}`}>
          Payroll & Receipts
        </h1>
        <p className={`text-xs mt-0.5 ${isDarkMode ? "text-zinc-400" : "text-slate-500"}`}>
          View net earnings, payment schedules, and historic payslips.
        </p>
      </div>

      {/* TOP SALARY SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* Monthly Net Salary Card */}
        <div className={`p-5 rounded-2xl border shadow-sm transition-colors ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-slate-200"}`}>
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">Monthly Net Salary</span>
            <span className={`p-1.5 rounded-lg ${isDarkMode ? "bg-indigo-950 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}>
              <DollarSign className="w-4 h-4" />
            </span>
          </div>

          <div className="mt-3">
            {isEditingSalary ? (
              <form onSubmit={handleSalarySubmit} className="flex gap-2">
                <input
                  type="number"
                  value={newSalary}
                  onChange={(e) => setNewSalary(e.target.value)}
                  className={`w-full rounded-xl px-3 py-1.5 text-sm border outline-none ${
                    isDarkMode ? "bg-zinc-950 border-slate-700 text-slate-100" : "bg-zinc-900 border-slate-300 text-zinc-100"
                  }`}
                />
                <button type="submit" className="px-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl">
                  Save
                </button>
              </form>
            ) : (
              <div className="flex items-baseline justify-between">
                <div className={`text-2xl font-extrabold tracking-tight ${isDarkMode ? "text-zinc-100" : "text-slate-900"}`}>
                  ${user?.monthlySalary?.toFixed(2) || "0.00"}
                </div>
                <button onClick={() => setIsEditingSalary(true)} className="text-[11px] text-indigo-500 font-semibold hover:underline">
                  Update
                </button>
              </div>
            )}
            {salaryError && <p className="mt-1 text-xs text-red-500">{salaryError}</p>}
          </div>
        </div>

        {/* Next Deposit Date */}
        <div className={`p-5 rounded-2xl border shadow-sm transition-colors ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-slate-200"}`}>
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">Next Payday</span>
            <span className={`p-1.5 rounded-lg ${isDarkMode ? "bg-emerald-950/60 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className={`text-2xl font-extrabold tracking-tight ${isDarkMode ? "text-zinc-100" : "text-slate-900"}`}>
              {user?.nextPayDate || "-"}
            </div>
            <div className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-semibold mt-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Payroll Processing On Schedule</span>
            </div>
          </div>
        </div>
      </div>

      {/* PAYSLIPS HISTORY TABLE */}
      <div className={`p-5 rounded-2xl border shadow-sm transition-colors ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-slate-200"}`}>
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center mb-4">
          <div>
            <h3 className={`text-sm font-bold ${isDarkMode ? "text-zinc-100" : "text-slate-900"}`}>
              Payslip Statements
            </h3>
            <p className="text-[11px] text-zinc-500">Download and review prior pay period statements.</p>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Payslip</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`text-[11px] uppercase tracking-wider border-b ${isDarkMode ? "border-slate-800 text-zinc-500" : "border-zinc-200 text-zinc-400"}`}>
                <th className="px-3 py-3 font-semibold">Pay Period</th>
                <th className="px-3 py-3 font-semibold">Payment Date</th>
                <th className="px-3 py-3 font-semibold">Net Pay</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/10">
              {payslips.map((pay) => (
                <tr key={pay.id || pay._id} className={`text-xs transition ${isDarkMode ? "hover:bg-zinc-950/40 text-slate-200" : "hover:bg-slate-50 text-zinc-800"}`}>
                  <td className="py-3.5 px-3 font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>{pay.period}</span>
                  </td>
                  <td className="py-3.5 px-3 text-zinc-500">{pay.date}</td>
                  <td className="py-3.5 px-3 font-bold text-emerald-500">
                    ${Number(pay.netPay || 0).toFixed(2)}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {pay.status || "Paid"}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setPreviewUrl(pay.fileUrl)}
                        disabled={!pay.fileUrl}
                        className={`p-1.5 rounded-lg border transition ${
                          isDarkMode ? "border-slate-800 hover:bg-slate-800 text-zinc-300" : "border-zinc-200 hover:bg-slate-100 text-zinc-600"
                        } disabled:opacity-40`}
                        title="View Statement"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={pay.fileUrl || "#"}
                        download={`Payslip_${pay.period}.pdf`}
                        className={`p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition ${!pay.fileUrl ? "pointer-events-none opacity-40" : ""}`}
                        title="Download Document"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: UPLOAD NEW PAYSLIP */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-md p-6 rounded-2xl shadow-2xl ${isDarkMode ? "bg-zinc-900 border border-zinc-800 text-white" : "bg-white text-slate-900"}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold">Upload Payslip Statement</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block mb-1 font-semibold text-zinc-400">Pay Period</label>
                <input
                  type="text"
                  placeholder="e.g. October 2026"
                  required
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border outline-none ${isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-slate-50 border-slate-200"}`}
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-zinc-400">Payment Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border outline-none ${isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-slate-50 border-slate-200"}`}
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-zinc-400">Net Pay ($)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  required
                  value={formData.netPay}
                  onChange={(e) => setFormData({ ...formData, netPay: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border outline-none ${isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-slate-50 border-slate-200"}`}
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-zinc-400">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border outline-none ${isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-slate-50 border-slate-200"}`}
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-semibold text-zinc-400">Upload File (PDF/Image)</label>
                <div className={`p-3 rounded-xl border border-dashed flex items-center justify-center gap-2 cursor-pointer ${isDarkMode ? "border-zinc-700 bg-zinc-950" : "border-slate-300 bg-slate-50"}`}>
                  <Upload className="w-4 h-4 text-indigo-500" />
                  <input type="file" accept=".pdf,image/*" onChange={handleFileChange} className="text-xs" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold"
                >
                  Save Payslip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PREVIEW STATEMENT */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className={`relative w-full max-w-4xl h-[80vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col ${isDarkMode ? "bg-zinc-900 border border-zinc-800" : "bg-white"}`}>
            <div className="flex justify-between items-center p-4 border-b border-zinc-800">
              <h3 className={`text-sm font-bold ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>Payslip Statement Preview</h3>
              <button onClick={() => setPreviewUrl(null)} className="p-1 text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 w-full h-full p-2 bg-zinc-950">
              <iframe src={previewUrl} className="w-full h-full rounded-lg border-0" title="Payslip Preview" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}