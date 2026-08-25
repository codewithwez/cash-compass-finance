import React, { useState, useEffect } from "react";
import { useAdminStore } from "@/store/useAdminStore";
import {
  FileText,
  Download,
  DollarSign,
  PieChart as PieChartIcon,
  BarChart2,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Image as ImageIcon,
  ExternalLink,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  AlertCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import jsPDF from "jspdf";

import { useTheme } from "@/context/ThemeContext";

export default function ReportsPage() {
  const { students = [], employees = [], claims = [] } = useAdminStore();
  const { isDarkMode } = useTheme();
  const surface = isDarkMode
    ? "bg-[#121215] border-zinc-800/80 text-zinc-100"
    : "bg-white border-slate-200/80 text-slate-800";
  const subtleText = isDarkMode ? "text-zinc-400" : "text-slate-400";
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");

  // ---------------------------------------------------------------------------
  // CLIENT-SIDE PAGINATION STATE FOR DOCUMENTS & RECEIPTS TABLE
  // ---------------------------------------------------------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(claims.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClaims = claims.slice(startIndex, startIndex + itemsPerPage);

  // 🟢 LIGHTBOX MODAL STATE
  const [previewReceipt, setPreviewReceipt] = useState(null); // holds claim object when open
  const [isZoomed, setIsZoomed] = useState(false);

  // Close modal when pressing 'Esc' key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setPreviewReceipt(null);
        setIsZoomed(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ---------------------------------------------------------------------------
  // 1. FINANCIAL & CLAIMS CALCULATIONS
  // ---------------------------------------------------------------------------
  const totalClaimsAmount = claims.reduce(
    (acc, c) => acc + (Number(c.amount) || 0),
    0
  );

  const approvedClaims = claims.filter((c) => c.status === "Approved");
  const pendingClaims = claims.filter((c) => c.status === "Pending");
  const rejectedClaims = claims.filter((c) => c.status === "Rejected");

  const approvedTotal = approvedClaims.reduce(
    (acc, c) => acc + (Number(c.amount) || 0),
    0
  );
  const pendingTotal = pendingClaims.reduce(
    (acc, c) => acc + (Number(c.amount) || 0),
    0
  );
  const rejectedTotal = rejectedClaims.reduce(
    (acc, c) => acc + (Number(c.amount) || 0),
    0
  );

  // Status Distribution for Pie Chart
  const claimStatusData = [
    { name: "Approved", value: approvedClaims.length, color: "#10b981" },
    { name: "Pending", value: pendingClaims.length, color: "#f59e0b" },
    { name: "Rejected", value: rejectedClaims.length, color: "#f43f5e" },
  ];

  // Employee Reimbursements Breakdown for Bar Chart
  const employeeClaimMap = claims.reduce((acc, claim) => {
    const empName = claim.employee || "Unknown Staff";
    acc[empName] = (acc[empName] || 0) + (Number(claim.amount) || 0);
    return acc;
  }, {});

  const employeeBarData = Object.keys(employeeClaimMap).map((emp) => ({
    name: emp,
    amount: employeeClaimMap[emp],
  }));

  const activeStudents = students.filter((s) => s.status === "Active").length;

  // ---------------------------------------------------------------------------
  // 2. PDF STATEMENT GENERATOR
  // ---------------------------------------------------------------------------
  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(79, 70, 229);
    doc.text("CashCompass - Executive Financial & Operational Report", 14, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(
      `Generated on: ${new Date().toLocaleDateString()} | Filter: ${selectedPeriod}`,
      14,
      27
    );
    doc.line(14, 30, 196, 30);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("1. Executive Summary", 14, 40);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `• Total Registered Students: ${students.length} (${activeStudents} Active)`,
      20,
      48
    );
    doc.text(`• Total Staff Employees: ${employees.length}`, 20, 54);
    doc.text(
      `• Total Reimbursement Claims Requested: $${totalClaimsAmount.toFixed(2)}`,
      20,
      60
    );
    doc.text(
      `• Total Approved Expense Payout: $${approvedTotal.toFixed(2)}`,
      20,
      66
    );
    doc.text(
      `• Pending Approvals Value: $${pendingTotal.toFixed(2)} (${pendingClaims.length} items)`,
      20,
      72
    );

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("2. Reimbursements Log Breakdown", 14, 85);

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setFillColor(241, 245, 249);
    doc.rect(14, 90, 182, 8, "F");
    doc.text("Employee", 18, 95);
    doc.text("Title / Reason", 65, 95);
    doc.text("Amount", 130, 95);
    doc.text("Status", 165, 95);

    doc.setFont("helvetica", "normal");
    let yPos = 104;

    claims.forEach((claim) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(String(claim.employee || "N/A"), 18, yPos);
      doc.text(String(claim.title || "Expense Claim"), 65, yPos);
      doc.text(`$${Number(claim.amount || 0).toFixed(2)}`, 130, yPos);
      doc.text(String(claim.status || "Pending"), 165, yPos);
      yPos += 7;
    });

    doc.save(
      `CashCompass_Report_${new Date().toISOString().slice(0, 10)}.pdf`
    );
  };

  return (
    <div className="space-y-6">
      {/* HEADER CONTROLS */}
      <div
        className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-2xl shadow-sm ${surface}`}
      >
        <div
          className={`flex items-center gap-2 ${
            isDarkMode ? "text-zinc-300" : "text-slate-700"
          }`}
        >
          <Calendar className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-semibold">Reporting Window:</span>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className={`bg-transparent border text-xs font-semibold rounded-lg px-2.5 py-1 outline-none focus:border-indigo-500 ${
              isDarkMode
                ? "border-zinc-800 text-zinc-200"
                : "border-slate-200 text-slate-700"
            }`}
          >
            <option>All Time</option>
            <option>This Month</option>
          </select>
        </div>

        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          Export PDF Statement
        </button>
      </div>

      {/* KPI METRICS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`${surface} p-5 rounded-2xl shadow-sm`}>
          <div className={`flex justify-between items-center mb-2 ${subtleText}`}>
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Total Claims Value
            </span>
            <DollarSign className="w-4 h-4 text-indigo-600" />
          </div>
          <div
            className={`text-2xl font-extrabold ${
              isDarkMode ? "text-zinc-100" : "text-zinc-100"
            }`}
          >
            ${totalClaimsAmount.toFixed(2)}
          </div>
          <p className={`text-[10px] mt-1 ${subtleText}`}>
            {claims.length} total claims submitted
          </p>
        </div>

        <div className={`${surface} p-5 rounded-2xl shadow-sm`}>
          <div className={`flex justify-between items-center mb-2 ${subtleText}`}>
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Approved Claims
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div
            className={`text-2xl font-extrabold ${
              isDarkMode ? "text-emerald-300" : "text-emerald-600"
            }`}
          >
            ${approvedTotal.toFixed(2)}
          </div>
          <p className={`text-[10px] mt-1 ${subtleText}`}>
            {approvedClaims.length} claims settled
          </p>
        </div>

        <div className={`${surface} p-5 rounded-2xl shadow-sm`}>
          <div className={`flex justify-between items-center mb-2 ${subtleText}`}>
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Pending Claims
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div
            className={`text-2xl font-extrabold ${
              isDarkMode ? "text-amber-300" : "text-amber-600"
            }`}
          >
            ${pendingTotal.toFixed(2)}
          </div>
          <p className={`text-[10px] mt-1 ${subtleText}`}>
            {pendingClaims.length} awaiting review
          </p>
        </div>

        <div className={`${surface} p-5 rounded-2xl shadow-sm`}>
          <div className={`flex justify-between items-center mb-2 ${subtleText}`}>
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Rejected Value
            </span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div
            className={`text-2xl font-extrabold ${
              isDarkMode ? "text-rose-300" : "text-rose-600"
            }`}
          >
            ${rejectedTotal.toFixed(2)}
          </div>
          <p className={`text-[10px] mt-1 ${subtleText}`}>
            {rejectedClaims.length} denied requests
          </p>
        </div>
      </div>

      {/* RECHARTS VISUAL ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={`lg:col-span-7 p-5 rounded-2xl shadow-sm ${surface}`}>
          <div
            className={`flex items-center gap-2 mb-4 ${
              isDarkMode ? "text-indigo-300" : "text-indigo-600"
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <h3
              className={`text-sm font-bold ${
                isDarkMode ? "text-zinc-100" : "text-slate-800"
              }`}
            >
              Reimbursement Volume by Employee
            </h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={employeeBarData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={isDarkMode ? "#27272a" : "#f1f5f9"}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: isDarkMode ? "#a1a1aa" : "#64748b" }}
                  stroke={isDarkMode ? "#3f3f46" : "#cbd5e1"}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: isDarkMode ? "#a1a1aa" : "#64748b" }}
                  stroke={isDarkMode ? "#3f3f46" : "#cbd5e1"}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(val) => `$${Number(val).toFixed(2)}`}
                  contentStyle={{
                    backgroundColor: isDarkMode ? "#18181b" : "#ffffff",
                    borderColor: isDarkMode ? "#27272a" : "#e2e8f0",
                    borderRadius: "8px",
                    color: isDarkMode ? "#f4f4f5" : "#0f172a",
                  }}
                  labelStyle={{
                    color: isDarkMode ? "#f4f4f5" : "#0f172a",
                    fontWeight: "bold",
                  }}
                  itemStyle={{
                    color: "#6366f1",
                  }}
                />
                <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`lg:col-span-5 p-5 rounded-2xl shadow-sm ${surface}`}>
          <div
            className={`flex items-center gap-2 mb-4 ${
              isDarkMode ? "text-indigo-300" : "text-indigo-600"
            }`}
          >
            <PieChartIcon className="w-4 h-4" />
            <h3
              className={`text-sm font-bold ${
                isDarkMode ? "text-zinc-100" : "text-slate-800"
              }`}
            >
              Claims Approval Ratio
            </h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={claimStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={4}
                >
                  {claimStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CLOUDINARY RECEIPT & DOCUMENT REPOSITORY LOG */}
      <div className={`${surface} rounded-2xl shadow-sm overflow-hidden`}>
        <div
          className={`p-5 border-b flex items-center justify-between ${
            isDarkMode ? "border-zinc-800" : "border-slate-100"
          }`}
        >
          <div className="flex items-center gap-2 text-indigo-600">
            <ImageIcon className="w-4 h-4" />
            <h3
              className={`text-sm font-bold ${
                isDarkMode ? "text-zinc-100" : "text-slate-800"
              }`}
            >
              Documents & Receipts
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className={`border-b text-[11px] font-bold uppercase tracking-wider ${
                  isDarkMode
                    ? "border-zinc-800 bg-zinc-900/40 text-zinc-500"
                    : "border-slate-100 bg-slate-50/50 text-slate-400"
                }`}
              >
                <th className="py-3 px-5">Claim ID</th>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Expense Title</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-4 text-right">Receipt File</th>
              </tr>
            </thead>
            <tbody
              className={
                isDarkMode
                  ? "divide-y divide-zinc-800 text-xs"
                  : "divide-y divide-slate-100 text-xs"
              }
            >
              {paginatedClaims.length === 0 ? (
                <tr>
                  <td colSpan={5} className={`py-6 text-center ${subtleText}`}>
                    No claim records or receipts stored yet.
                  </td>
                </tr>
              ) : (
                paginatedClaims.map((claim) => (
                  <tr
                    key={claim.id}
                    className={
                      isDarkMode
                        ? "hover:bg-zinc-900/60 transition"
                        : "hover:bg-slate-50/60 transition"
                    }
                  >
                    <td className="py-3 px-5 font-mono text-slate-100">
                      {claim.id}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-100">
                      {claim.employee}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{claim.title}</td>
                    <td className="py-3 px-3 font-semibold text-slate-100">
                      ${Number(claim.amount).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {claim.receiptUrl ? (
                        <button
                          onClick={() => {
                            setPreviewReceipt(claim);
                            setIsZoomed(false);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-semibold bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg border border-indigo-100 transition"
                        >
                          <Maximize2 className="w-3 h-3" />
                          View Receipt
                        </button>
                      ) : (
                        <span className={`italic text-[11px] ${subtleText}`}>
                          No Receipt Linked
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* CLIENT-SIDE PAGINATION FOOTER CONTROL */}
        <div
          className={`px-5 py-3 border-t flex items-center justify-between text-xs ${
            isDarkMode ? "border-zinc-800" : "border-slate-100"
          }`}
        >
          <span className={subtleText}>
            Page{" "}
            <strong className={isDarkMode ? "text-zinc-200" : "text-slate-700"}>
              {currentPage}
            </strong>{" "}
            of{" "}
            <strong className={isDarkMode ? "text-zinc-200" : "text-slate-700"}>
              {totalPages}
            </strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-lg border text-xs font-semibold transition ${
                isDarkMode
                  ? "border-zinc-800 hover:bg-zinc-900 text-zinc-300"
                  : "border-slate-200 hover:bg-slate-100 text-slate-600"
              } disabled:opacity-40 disabled:pointer-events-none`}
            >
              Previous
            </button>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage >= totalPages}
              className={`px-3 py-1 rounded-lg border text-xs font-semibold transition ${
                isDarkMode
                  ? "border-zinc-800 hover:bg-zinc-900 text-zinc-300"
                  : "border-slate-200 hover:bg-slate-100 text-slate-600"
              } disabled:opacity-40 disabled:pointer-events-none`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* 🟢 LIGHTBOX MODAL OVERLAY */}
      {previewReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div
            className={`w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${surface}`}
          >
            {/* Modal Header */}
            <div
              className={`p-4 sm:px-6 border-b flex items-center justify-between ${
                isDarkMode
                  ? "border-zinc-800 bg-zinc-900/40"
                  : "border-slate-100 bg-slate-50/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    className={`text-sm font-bold ${
                      isDarkMode ? "text-zinc-100" : "text-slate-900"
                    }`}
                  >
                    {previewReceipt.title}
                  </h3>
                  <p className={`text-xs ${subtleText}`}>
                    Submitted by{" "}
                    <span
                      className={`font-semibold ${
                        isDarkMode ? "text-zinc-200" : "text-slate-700"
                      }`}
                    >
                      {previewReceipt.employee}
                    </span>{" "}
                    • ${Number(previewReceipt.amount).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Modal Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className={`p-2 rounded-lg transition ${
                    isDarkMode
                      ? "text-zinc-400 hover:text-indigo-300 hover:bg-zinc-800"
                      : "text-slate-500 hover:text-indigo-600 hover:bg-slate-100"
                  }`}
                  title={isZoomed ? "Zoom Out" : "Zoom In"}
                >
                  {isZoomed ? (
                    <ZoomOut className="w-4 h-4" />
                  ) : (
                    <ZoomIn className="w-4 h-4" />
                  )}
                </button>

                <a
                  href={previewReceipt.receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg transition ${
                    isDarkMode
                      ? "text-zinc-400 hover:text-indigo-300 hover:bg-zinc-800"
                      : "text-slate-500 hover:text-indigo-600 hover:bg-slate-100"
                  }`}
                  title="Open Original Link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  onClick={() => {
                    setPreviewReceipt(null);
                    setIsZoomed(false);
                  }}
                  className={`p-2 rounded-lg transition ${
                    isDarkMode
                      ? "text-zinc-500 hover:text-rose-300 hover:bg-rose-950/40"
                      : "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  }`}
                  title="Close (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Image Display Area */}
            <div
              className={`p-6 overflow-auto flex items-center justify-center min-h-[350px] relative ${
                isDarkMode ? "bg-black" : "bg-slate-950"
              }`}
            >
              {previewReceipt.receiptUrl.toLowerCase().endsWith(".pdf") ? (
                /* PDF Embed view if uploaded receipt is a PDF document */
                <iframe
                  src={previewReceipt.receiptUrl}
                  title="Receipt PDF"
                  className="w-full h-[500px] rounded-lg border-0"
                />
              ) : (
                /* Image view with zoom toggle */
                <img
                  src={previewReceipt.receiptUrl}
                  alt={`Receipt for ${previewReceipt.title}`}
                  className={`rounded-lg object-contain transition-all duration-300 ${
                    isZoomed
                      ? "max-w-none scale-125 cursor-zoom-out"
                      : "max-h-[60vh] max-w-full cursor-zoom-in"
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                />
              )}
            </div>

            {/* Modal Footer */}
            <div
              className={`p-4 px-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
                isDarkMode
                  ? "bg-zinc-900 border-zinc-800"
                  : "bg-slate-50 border-slate-100"
              }`}
            >
              <div className={`flex items-center gap-2 ${subtleText}`}>
                <AlertCircle className="w-3.5 h-3.5 text-indigo-600" />
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    previewReceipt.status === "Approved"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : previewReceipt.status === "Rejected"
                      ? "bg-rose-50 text-rose-600 border border-rose-200"
                      : "bg-amber-50 text-amber-600 border border-amber-200"
                  }`}
                >
                  {previewReceipt.status}
                </span>

                <button
                  onClick={() => {
                    setPreviewReceipt(null);
                    setIsZoomed(false);
                  }}
                  className={`font-semibold px-4 py-1.5 rounded-xl transition ${
                    isDarkMode
                      ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-100"
                      : "bg-slate-200 hover:bg-slate-300 text-slate-800"
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}