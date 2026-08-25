import { useState, useRef } from "react";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { useTheme } from "@/context/ThemeContext";
import { claimSchema, getValidationMessage } from "@/lib/validationSchemas";
import {
  FilePlus,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Plus,
  UploadCloud,
  X,
  Eye,
} from "lucide-react";

export default function ClaimsView() {
  const { isDarkMode } = useTheme();
  const { claims, addClaim } = useEmployeeStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hidden file input reference
  const fileInputRef = useRef(null);

  // New Claim Form State
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Meals & Entertainment");
  
  // File upload states
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("PDF"); // "PDF" or "IMG"
  const [isUploading, setIsUploading] = useState(false);
  const [formError, setFormError] = useState("");

  // Handle local file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Determine type
    if (selectedFile.type.includes("pdf")) {
      setFileType("PDF");
    } else if (selectedFile.type.includes("image")) {
      setFileType("IMG");
    } else {
      alert("Invalid file type. Please upload a PDF or an Image.");
      return;
    }

    setFile(selectedFile);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCreateClaim = async (e) => {
    e.preventDefault();
    const validation = claimSchema.safeParse({ description, amount, category });
    const validationMessage = getValidationMessage(validation);
    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }
    setFormError("");
    setIsUploading(true);

    
    let receiptUrl = "";
    // no Cloudinary 
    if (!receiptUrl && file) {
      receiptUrl = URL.createObjectURL(file);
    }

    await addClaim({
      description: validation.data.description,
      amount: validation.data.amount,
      category: validation.data.category,
      receiptType: fileType,
      receiptUrl: receiptUrl || null,
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
    });

    // Reset State
    setDescription("");
    setAmount("");
    setFile(null);
    setIsUploading(false);
    setIsModalOpen(false);
  };

  const getReceiptIcon = (type) => {
    if (type === "IMG") {
      return <ImageIcon className="w-3.5 h-3.5 text-blue-500" />;
    }
    return <FileText className="w-3.5 h-3.5 text-rose-500" />;
  };

  return (
    <div className="space-y-6">
      {/* HEADER TITLE & ACTION BUTTON */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`text-2xl font-bold tracking-tight ${
            isDarkMode ? "text-zinc-100" : "text-slate-900"
            }`}
          >
            Reimbursement Claims
          </h1>
          <p
            className={`text-xs mt-0.5 ${
              isDarkMode ? "text-zinc-400" : "text-slate-500"
            }`}
          >
            Submit PDF or image receipts for company expenses and track claims.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl text-xs shadow-sm transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Claim & Upload</span>
        </button>
      </div>

      {/* CLAIMS TABLE CONTAINER */}
      <div
        className={`p-6 rounded-2xl border shadow-sm transition-colors ${
            isDarkMode
              ? "bg-[#121215] border-zinc-800/80 text-zinc-100"
              : "bg-white border-slate-200/80 text-slate-800"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className={`text-[11px] uppercase tracking-wider border-b ${
                  isDarkMode
                  ? "border-zinc-800 text-zinc-500"
                    : "border-slate-200 text-slate-400"
                }`}
              >
                <th className="py-3 px-3 font-semibold">Claim ID</th>
                <th className="py-3 px-3 font-semibold">Date</th>
                <th className="py-3 px-3 font-semibold">Description</th>
                <th className="py-3 px-3 font-semibold">Category</th>
                <th className="py-3 px-3 font-semibold">Amount</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-3 font-semibold text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/10">
              {claims?.map((claim) => (
                <tr
                  key={claim.id}
                  className={`text-xs transition ${
                    isDarkMode
                      ? "hover:bg-zinc-900/40 text-zinc-200"
                      : "hover:bg-slate-50/80 text-slate-800"
                  }`}
                >
                  <td className="py-3.5 px-3 font-mono font-bold text-indigo-500">
                    {claim.id}
                  </td>
                  <td className="py-3.5 px-3 text-zinc-500">{claim.date}</td>
                  <td className="py-3.5 px-3 font-semibold">{claim.description}</td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        isDarkMode
                          ? "bg-zinc-800 text-zinc-300"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {claim.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-bold text-zinc-500 ">
                    ${claim.amount?.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-3">
                    {claim.status === "Approved" ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    {claim.receiptUrl ? (
                      <a
                        href={claim.receiptUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-bold transition ${
                          isDarkMode
                            ? "border-slate-800 hover:bg-slate-800 text-indigo-400"
                            : "border-zinc-800 hover:bg-zinc-800 text-indigo-600"
                        }`}
                      >
                        {getReceiptIcon(claim.receiptType)}
                        <span>View {claim.receiptType}</span>
                        <Eye className="w-3 h-3 ml-0.5" />
                      </a>
                    ) : (
                    <span className="text-[10px] text-slate-500 italic">No File</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEW CLAIM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div
            className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border transition-all ${
              isDarkMode
                ? "bg-[#121215] border-zinc-800/80 text-zinc-100"
                : "bg-white border-slate-200/80 text-slate-800"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold flex items-center gap-2">
                <FilePlus className="w-5 h-5 text-indigo-500" />
                <span>Submit New Claim</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-zinc-9000/10 text-zinc-500 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClaim} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold mb-1">
                  Description / Vendor
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flight ticket to NY Conference"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 text-xs border outline-none transition placeholder:text-zinc-400 ${
                    isDarkMode
                      ? "bg-zinc-950 border-slate-800 text-slate-100 focus:border-indigo-500"
                      : "bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-indigo-500"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold mb-1">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2 text-xs border outline-none transition placeholder:text-zinc-400 ${
                      isDarkMode
                        ? "bg-zinc-950 border-slate-800 text-slate-100 focus:border-indigo-500"
                        : "bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-indigo-500"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full rounded-xl px-2 py-2 text-xs border outline-none cursor-pointer ${
                      isDarkMode
                        ? "bg-zinc-950 border-slate-800 text-slate-100 focus:border-indigo-500"
                        : "bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-indigo-500"
                    }`}
                  >
                    <option value="Meals & Entertainment">Meals & Ent.</option>
                    <option value="Travel">Travel</option>
                    <option value="Supplies">Supplies</option>
                    <option value="Software">Software</option>
                  </select>
                </div>
              </div>

              {/* REAL FILE ATTACHMENT AREA */}
              <div>
                <label className="block text-[11px] font-semibold mb-1">
                  Attach Receipt (PDF or Image only)
                </label>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="application/pdf, image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                />

                <div
                  onClick={triggerFileInput}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition ${
                    isDarkMode
                      ? "border-slate-800 hover:border-indigo-500/50 bg-zinc-950/40"
                      : "border-zinc-800 hover:border-indigo-500/50 bg-zinc-900"
                  }`}
                >
                  {file ? (
                    <div className="flex items-center justify-center gap-2">
                      {fileType === "IMG" ? (
                        <ImageIcon className="w-5 h-5 text-blue-500" />
                      ) : (
                        <FileText className="w-5 h-5 text-rose-500" />
                      )}
                      <span className="text-xs font-bold text-indigo-500 truncate max-w-[200px]">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                        }}
                        className="text-zinc-500 hover:text-rose-500 p-0.5"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="w-6 h-6 text-indigo-500 mx-auto mb-1" />
                      <span className="text-xs font-semibold block">
                        Click to upload receipt
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        Supports PDF, PNG, JPG (Max 10MB)
                      </span>
                    </>
                  )}
                </div>
              </div>

              {formError && <p className="text-xs text-red-500">{formError}</p>}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`w-1/2 py-2.5 rounded-xl text-xs font-semibold transition border ${
                    isDarkMode
                      ? "border-slate-800 text-zinc-300 hover:bg-slate-800"
                      : "border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-xs shadow-sm transition disabled:opacity-50"
                >
                  {isUploading ? "Uploading..." : "Submit Claim"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}




