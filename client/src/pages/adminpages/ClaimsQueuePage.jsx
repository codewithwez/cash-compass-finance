import React, { useEffect, useState } from "react";
import { useAdminStore } from "@/store/useAdminStore";
import { useTheme } from "@/context/ThemeContext";
import {
  Receipt,
  Search,
  Check,
  X,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  User,
  Building,
  Calendar,
  AlertCircle,
} from "lucide-react";

export default function ClaimsQueuePage() {
  const { isDarkMode } = useTheme();
  const { claims = [], fetchAdminData, updateClaimStatus } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedClaim, setSelectedClaim] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchAdminData().catch((error) => {
      console.error("Failed to load claim queue:", error);
    });
  }, [fetchAdminData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleUpdateStatus = async (claimId, newStatus) => {
    const updated = await updateClaimStatus(claimId, newStatus);
    if (selectedClaim && selectedClaim.id === claimId) {
      setSelectedClaim(updated);
    }
  };

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch =
      claim.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || claim.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredClaims.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClaims = filteredClaims.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const totalPendingCount = claims.filter((c) => c.status === "Pending").length;
  const totalPendingAmount = claims
    .filter((c) => c.status === "Pending")
    .reduce((acc, c) => acc + c.amount, 0);

  const totalApprovedAmount = claims
    .filter((c) => c.status === "Approved")
    .reduce((acc, c) => acc + c.amount, 0);

  const surface = isDarkMode
    ? "bg-[#121215] border-zinc-800/80 text-zinc-100"
    : "bg-white border-slate-200/80 text-slate-800";
  const subtleText = isDarkMode ? "text-zinc-400" : "text-slate-400";

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* TOP METRICS SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`rounded-2xl shadow-sm flex items-center justify-between ${surface} p-4`}>
          <div>
            <p className={`text-[11px] font-bold uppercase tracking-wider ${subtleText}`}>
              Pending Review
            </p>
            <h3 className={`text-lg font-extrabold mt-1 ${isDarkMode ? "text-amber-300" : "text-amber-600"}`}>
              {totalPendingCount} Claims (${totalPendingAmount.toFixed(2)})
            </h3>
          </div>
          <div className={`p-2.5 rounded-xl ${isDarkMode ? "bg-amber-950/40 text-amber-300" : "bg-amber-50 text-amber-600"}`}>
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className={`rounded-2xl shadow-sm flex items-center justify-between ${surface} p-4`}>
          <div>
            <p className={`text-[11px] font-bold uppercase tracking-wider ${subtleText}`}>
              Approved (Total)
            </p>
            <h3 className={`text-lg font-extrabold mt-1 ${isDarkMode ? "text-emerald-300" : "text-emerald-600"}`}>
              ${totalApprovedAmount.toFixed(2)}
            </h3>
          </div>
          <div className={`p-2.5 rounded-xl ${isDarkMode ? "bg-emerald-950/40 text-emerald-300" : "bg-emerald-50 text-emerald-600"}`}>
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className={`rounded-2xl shadow-sm flex items-center justify-between ${surface} p-4`}>
          <div>
            <p className={`text-[11px] font-bold uppercase tracking-wider ${subtleText}`}>
              Total Requests
            </p>
            <h3 className={`text-lg font-extrabold mt-1 ${isDarkMode ? "text-zinc-100" : "text-slate-900"}`}>
              {claims.length} Claims
            </h3>
          </div>
          <div className={`p-2.5 rounded-xl ${isDarkMode ? "bg-indigo-950/40 text-indigo-300" : "bg-indigo-50 text-indigo-600"}`}>
            <Receipt className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* CLAIMS QUEUE MAIN CONTAINER */}
      <div className={`${surface} rounded-2xl shadow-sm overflow-hidden w-full`}>
        {/* HEADER BAR & CONTROLS */}
        <div className={`p-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-3 ${isDarkMode ? "border-zinc-800" : "border-slate-100"}`}>
          <div className="flex items-center gap-2 shrink-0">
            <Receipt className={`w-4 h-4 ${isDarkMode ? "text-indigo-300" : "text-indigo-600"}`} />
            <h2 className={`text-sm font-bold ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>
              Claims & Reimbursement Queue
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 sm:w-56">
              <Search className={`absolute left-2.5 top-2.5 w-3.5 h-3.5 ${subtleText}`} />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full rounded-xl pl-8 pr-2.5 py-1 text-xs outline-none focus:border-indigo-500 transition border ${isDarkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-slate-50 border-slate-200 text-slate-800"}`}
              />
            </div>

            <div className={`flex items-center p-0.5 rounded-xl text-xs font-semibold ${isDarkMode ? "bg-zinc-900 text-zinc-300" : "bg-slate-100 text-slate-600"}`}>
              {["All", "Pending", "Approved", "Rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] transition ${
                    statusFilter === status
                      ? isDarkMode ? "bg-zinc-800 text-zinc-100 shadow-sm" : "bg-white text-slate-900 shadow-sm"
                      : isDarkMode ? "hover:text-zinc-100" : "hover:text-slate-900"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CLAIMS TABLE */}
        <div className="w-full overflow-hidden">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className={`border-b text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "border-zinc-800 bg-zinc-900/40 text-zinc-500" : "border-slate-100 bg-slate-50/50 text-slate-400"}`}>
                <th className="py-2.5 px-3 w-[26%]">Claim Info</th>
                <th className="py-2.5 px-2 w-[18%]">Employee</th>
                <th className="py-2.5 px-2 w-[11%]">Amount</th>
                <th className="py-2.5 px-2 w-[13%]">Date</th>
                <th className="py-2.5 px-2 w-[13%]">Status</th>
                <th className="py-2.5 px-3 w-[19%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={isDarkMode ? "divide-y divide-zinc-800 text-xs" : "divide-y divide-slate-100 text-xs"}>
              {paginatedClaims.length > 0 ? (
                paginatedClaims.map((claim) => (
                  <tr
                    key={claim.id}
                    className={isDarkMode ? "hover:bg-zinc-900/60 transition-colors" : "hover:bg-slate-50/60 transition-colors"}
                  >
                    {/* CLAIM DETAILS */}
                    <td className="py-3 px-3">
                      <p className={`font-bold text-xs truncate ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>
                        {claim.title}
                      </p>
                      <div className={`flex items-center gap-1.5 text-[10px] mt-0.5 ${subtleText}`}>
                        <span className="font-mono text-[9px]">{claim.id}</span>
                        <span>•</span>
                        <span className={`px-1.5 py-0.5 rounded-md font-medium truncate max-w-[100px] ${isDarkMode ? "bg-zinc-800 text-zinc-300" : "bg-slate-100 text-slate-600"}`}>
                          {claim.category}
                        </span>
                      </div>
                    </td>

                    {/* EMPLOYEE INFO */}
                    <td className="py-3 px-2">
                      <p className={`font-semibold text-xs truncate ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>
                        {claim.employeeName}
                      </p>
                      <p className={`text-[10px] truncate ${subtleText}`}>
                        {claim.department}
                      </p>
                    </td>

                    {/* AMOUNT */}
                    <td className={`py-3 px-2 font-extrabold text-xs whitespace-nowrap ${isDarkMode ? "text-zinc-100" : "text-slate-900"}`}>
                      ${claim.amount.toFixed(2)}
                    </td>

                    {/* DATE */}
                    <td className={`py-3 px-2 font-medium text-[11px] whitespace-nowrap ${subtleText}`}>
                      {claim.requestedDate}
                    </td>

                    {/* STATUS TAG */}
                    <td className="py-3 px-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                          claim.status === "Approved"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                            : claim.status === "Rejected"
                            ? "bg-rose-50 text-rose-700 border border-rose-200/60"
                            : "bg-amber-50 text-amber-700 border border-amber-200/60"
                        }`}
                      >
                        {claim.status === "Approved" && <CheckCircle2 className="w-3 h-3" />}
                        {claim.status === "Rejected" && <XCircle className="w-3 h-3" />}
                        {claim.status === "Pending" && <Clock className="w-3 h-3" />}
                        {claim.status}
                      </span>
                    </td>

                    {/* ACTION BUTTONS */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedClaim(claim)}
                          className={`p-1 rounded-md transition ${isDarkMode ? "text-zinc-500 hover:text-indigo-300 hover:bg-indigo-950/40" : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"}`}
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {claim.status === "Pending" ? (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(claim.id, "Approved")}
                              className="p-1 sm:px-2 sm:py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md text-[10px] flex items-center gap-0.5 transition"
                              title="Approve"
                            >
                              <Check className="w-3 h-3" />
                              <span className="hidden sm:inline">Approve</span>
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(claim.id, "Rejected")}
                              className={`p-1 sm:px-2 sm:py-0.5 font-semibold rounded-md text-[10px] transition flex items-center gap-0.5 ${isDarkMode ? "bg-rose-950/40 text-rose-300 hover:bg-rose-950/60" : "bg-rose-50 text-rose-600 hover:bg-rose-100"}`}
                              title="Reject"
                            >
                              <X className="w-3 h-3" />
                              <span className="hidden sm:inline">Reject</span>
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleUpdateStatus(claim.id, "Pending")}
                            className={`text-[10px] underline font-medium px-1 ${isDarkMode ? "text-zinc-400 hover:text-zinc-200" : "text-slate-400 hover:text-slate-600"}`}
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className={`py-8 text-center text-xs ${subtleText}`}
                  >
                    No claims match your selected filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* BASIC PAGINATION BAR */}
        <div
          className={`px-4 py-3 border-t flex items-center justify-between text-xs ${
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
              className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition ${
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
              className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition ${
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

      {/* CLAIM DETAIL MODAL */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${surface} rounded-2xl shadow-xl max-w-md w-full p-6 space-y-5`}>
            <div className={`flex justify-between items-start border-b pb-3 ${isDarkMode ? "border-zinc-800" : "border-slate-100"}`}>
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${subtleText}`}>
                  Claim Details • {selectedClaim.id}
                </span>
                <h3 className={`font-extrabold text-base mt-0.5 ${isDarkMode ? "text-zinc-100" : "text-slate-900"}`}>
                  {selectedClaim.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedClaim(null)}
                className={`p-1 rounded-lg ${isDarkMode ? "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className={`p-3.5 rounded-xl space-y-2 border ${isDarkMode ? "bg-zinc-900/60 border-zinc-800" : "bg-slate-50 border-slate-100"}`}>
                <div className="flex items-center justify-between">
                  <span className={`flex items-center gap-1.5 font-medium ${subtleText}`}>
                    <User className={`w-3.5 h-3.5 ${subtleText}`} /> Employee:
                  </span>
                  <span className={`font-bold ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>
                    {selectedClaim.employeeName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`flex items-center gap-1.5 font-medium ${subtleText}`}>
                    <Building className={`w-3.5 h-3.5 ${subtleText}`} /> Dept / Role:
                  </span>
                  <span className={isDarkMode ? "text-zinc-300" : "text-slate-700"}>
                    {selectedClaim.department} • {selectedClaim.role}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`flex items-center gap-1.5 font-medium ${subtleText}`}>
                    <Calendar className={`w-3.5 h-3.5 ${subtleText}`} /> Submitted:
                  </span>
                  <span className={isDarkMode ? "text-zinc-300" : "text-slate-700"}>
                    {selectedClaim.requestedDate}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100">
                <div>
                  <p className="text-[10px] font-bold text-indigo-400 uppercase">
                    Requested Amount
                  </p>
                  <p className="text-lg font-extrabold text-indigo-900 mt-0.5">
                    ${selectedClaim.amount.toFixed(2)}
                  </p>
                </div>
                <span className="bg-indigo-100 text-indigo-700 font-bold px-2.5 py-1 rounded-lg">
                  {selectedClaim.category}
                </span>
              </div>

              <div className="space-y-1">
                <p className={`font-bold ${isDarkMode ? "text-zinc-200" : "text-slate-700"}`}>Reason / Details:</p>
                <p className={`p-3 rounded-xl border leading-relaxed ${isDarkMode ? "bg-zinc-900/60 border-zinc-800 text-zinc-300" : "bg-slate-50 border-slate-200/60 text-slate-600"}`}>
                  {selectedClaim.description}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                {selectedClaim.receiptAttached ? (
                  <span className="text-emerald-600 flex items-center gap-1 font-semibold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Itemized Receipt Verified
                  </span>
                ) : (
                  <span className="text-rose-600 flex items-center gap-1 font-semibold text-[11px]">
                    <AlertCircle className="w-3.5 h-3.5" /> Receipt Not Attached
                  </span>
                )}
              </div>
            </div>

            <div className={`pt-3 border-t flex items-center justify-between gap-3 ${isDarkMode ? "border-zinc-800" : "border-slate-100"}`}>
              <span className={`text-xs ${subtleText}`}>
                Status: <strong className={isDarkMode ? "text-zinc-200" : "text-slate-700"}>{selectedClaim.status}</strong>
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedClaim.id, "Rejected")}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl text-xs transition"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedClaim.id, "Approved")}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition"
                >
                  Approve Claim
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}