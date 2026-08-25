import React, { useState } from "react";
import { useAdminStore } from "@/store/useAdminStore";
import { useTheme } from "@/context/ThemeContext";
import {
  adminStudentSchema,
  getValidationMessage,
} from "@/lib/validationSchemas";
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  DollarSign,
  UserCheck,
} from "lucide-react";

export default function StudentsPage() {
  const { isDarkMode } = useTheme();
  const { students = [], addStudent, updateStudent, deleteStudent } = useAdminStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    allowance: "",
    status: "Active",
  });
  const [formError, setFormError] = useState("");

  // Open modal for Adding
  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setFormData({ name: "", email: "", allowance: "", status: "Active" });
    setIsModalOpen(true);
  };

  // Open modal for Editing
  const handleOpenEditModal = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      allowance: student.allowance,
      status: student.status || "Active",
    });
    setIsModalOpen(true);
  };

  // Save Student (Add or Edit)
  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = adminStudentSchema.safeParse(formData);
    const validationMessage = getValidationMessage(validation);
    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }
    setFormError("");

    if (editingStudent) {
      updateStudent(editingStudent.id, {
        name: validation.data.name,
        email: validation.data.email,
        allowance: validation.data.allowance,
        status: validation.data.status,
      });
    } else {
      addStudent({
        name: validation.data.name,
        email: validation.data.email,
        allowance: validation.data.allowance,
        status: validation.data.status,
      });
    }
    setIsModalOpen(false);
  };

  // Filter Logic
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // KPI Calculations
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === "Active").length;
  const totalAllowanceAllocated = students.reduce(
    (sum, s) => sum + (Number(s.allowance) || 0),
    0
  );

  const surface = isDarkMode ? "bg-[#121215] border-zinc-800/80 text-zinc-100" : "bg-white border-slate-200/80 text-slate-800";
  const mutedSurface = isDarkMode ? "bg-zinc-900/60 border-zinc-800/70" : "bg-slate-50/80 border-slate-100";
  const subtleText = isDarkMode ? "text-zinc-400" : "text-slate-400";

  return (
    <div className="space-y-6">
      {/* 🟢 TOP METRICS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`${surface} p-5 rounded-2xl shadow-sm flex items-center justify-between`}>
          <div>
            <p className={`text-[11px] font-bold uppercase tracking-wider ${subtleText}`}>
              Total Enrolled
            </p>
            <p className={`text-2xl font-extrabold mt-1 ${isDarkMode ? "text-zinc-100" : "text-slate-900"}`}>{totalStudents}</p>
          </div>
          <div className={`p-3 rounded-xl ${isDarkMode ? "bg-indigo-950/60 text-indigo-300" : "bg-indigo-50 text-indigo-600"}`}>
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>

        <div className={`${surface} p-5 rounded-2xl shadow-sm flex items-center justify-between`}>
          <div>
            <p className={`text-[11px] font-bold uppercase tracking-wider ${subtleText}`}>
              Active Accounts
            </p>
            <p className={`text-2xl font-extrabold mt-1 ${isDarkMode ? "text-emerald-300" : "text-emerald-600"}`}>{activeStudents}</p>
          </div>
          <div className={`p-3 rounded-xl ${isDarkMode ? "bg-emerald-950/40 text-emerald-300" : "bg-emerald-50 text-emerald-600"}`}>
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className={`${surface} p-5 rounded-2xl shadow-sm flex items-center justify-between`}>
          <div>
            <p className={`text-[11px] font-bold uppercase tracking-wider ${subtleText}`}>
              Total Allowance Pool
            </p>
            <p className={`text-2xl font-extrabold mt-1 ${isDarkMode ? "text-zinc-100" : "text-slate-900"}`}>
              ${totalAllowanceAllocated.toFixed(2)}
            </p>
          </div>
          <div className={`p-3 rounded-xl ${isDarkMode ? "bg-indigo-950/60 text-indigo-300" : "bg-indigo-50 text-indigo-600"}`}>
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 🟢 ACTION & FILTER BAR */}
      <div className={`${surface} p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4`}>
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-md">
          {/* Search */}
          <div className="relative w-full">
            <Search className={`absolute left-3 top-2.5 w-4 h-4 ${subtleText}`} />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full rounded-xl pl-9 pr-3 py-2 text-xs outline-none focus:border-indigo-500 transition placeholder:text-slate-400 border ${
                isDarkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-slate-50 border-slate-200 text-slate-800"
              }`}
            />
          </div>

          {/* Status Filter */}
          <div className={`relative flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs border ${isDarkMode ? "bg-zinc-900 border-zinc-800 text-zinc-300" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
            <Filter className={`w-3.5 h-3.5 shrink-0 ${subtleText}`} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`bg-transparent outline-none cursor-pointer font-medium text-xs ${isDarkMode ? "text-zinc-200" : "text-slate-700"}`}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Add Student Button */}
        <button
          onClick={handleOpenAddModal}
        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-sm"
      >
          <Plus className="w-4 h-4" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* 🟢 STUDENT TABLE */}
      <div className={`${surface} rounded-2xl shadow-sm overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[11px] font-bold uppercase tracking-wider ${isDarkMode ? "border-zinc-800 bg-zinc-900/40 text-zinc-500" : "border-slate-100 bg-slate-50/50 text-slate-400"}`}>
                <th className="py-3.5 px-6">Student Info</th>
                <th className="py-3.5 px-4">Student ID</th>
                <th className="py-3.5 px-4">Allowance</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={isDarkMode ? "divide-y divide-zinc-800 text-xs" : "divide-y divide-slate-100 text-xs"}>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className={isDarkMode ? "hover:bg-zinc-900/60 transition-colors" : "hover:bg-slate-50/60 transition-colors"}>
                    {/* Name & Email */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full font-bold flex items-center justify-center text-xs shrink-0 ${isDarkMode ? "bg-indigo-950/60 text-indigo-300" : "bg-indigo-100 text-indigo-700"}`}>
                          {student.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className={`font-semibold ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>{student.name}</p>
                          <p className={`text-[11px] ${subtleText}`}>{student.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* ID */}
                    <td className={`py-3.5 px-4 font-mono ${subtleText}`}>{student.id}</td>

                    {/* Allowance */}
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      ${(Number(student.allowance) || 0).toFixed(2)}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          student.status === "Active"
                            ? (isDarkMode ? "bg-emerald-950/40 text-emerald-300" : "bg-emerald-50 text-emerald-600")
                            : (isDarkMode ? "bg-zinc-800 text-zinc-400" : "bg-slate-100 text-slate-500")
                        }`}
                      >
                        {student.status === "Active" ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {student.status || "Active"}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEditModal(student)}
                          className={`p-2 rounded-lg transition ${isDarkMode ? "text-zinc-500 hover:text-indigo-300 hover:bg-indigo-950/40" : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"}`}
                          title="Edit Student"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteStudent(student.id)}
                          className={`p-2 rounded-lg transition ${isDarkMode ? "text-zinc-500 hover:text-rose-300 hover:bg-rose-950/30" : "text-slate-400 hover:text-rose-600 hover:bg-rose-50"}`}
                          title="Delete Student"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className={`py-8 text-center text-xs ${subtleText}`}>
                    No students found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🟢 ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${surface} rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 border`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isDarkMode ? "border-zinc-800" : "border-slate-100"}`}>
              <h3 className={`text-sm font-bold ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>
                {editingStudent ? "Edit Student Details" : "Add New Student"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className={`p-1 rounded-lg transition ${isDarkMode ? "text-zinc-400 hover:text-zinc-100" : "text-slate-400 hover:text-slate-600"}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className={`block text-[11px] font-semibold mb-1 ${isDarkMode ? "text-zinc-300" : "text-slate-600"}`}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  className={`w-full rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 transition placeholder:text-slate-400 border ${isDarkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-slate-50 border-slate-200 text-slate-800"}`}
                />
              </div>

              <div>
                <label className={`block text-[11px] font-semibold mb-1 ${isDarkMode ? "text-zinc-300" : "text-slate-600"}`}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. alex@university.edu"
                  className={`w-full rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 transition placeholder:text-slate-400 border ${isDarkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-slate-50 border-slate-200 text-slate-800"}`}
                />
              </div>

              <div>
                <label className={`block text-[11px] font-semibold mb-1 ${isDarkMode ? "text-zinc-300" : "text-slate-600"}`}>
                  Allowance Amount ($)
                </label>
                <input
                  type="number"
                  value={formData.allowance}
                  onChange={(e) => setFormData({ ...formData, allowance: e.target.value })}
                  placeholder="0.00"
                  className={`w-full rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 transition placeholder:text-slate-400 border ${isDarkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-slate-50 border-slate-200 text-slate-800"}`}
                />
              </div>

              <div>
                <label className={`block text-[11px] font-semibold mb-1 ${isDarkMode ? "text-zinc-300" : "text-slate-600"}`}>
                  Account Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className={`w-full rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 transition cursor-pointer border ${isDarkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-slate-50 border-slate-200 text-slate-800"}`}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {formError && <p className="text-xs text-red-500">{formError}</p>}

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-xs transition"
                >
                  {editingStudent ? "Update Record" : "Add Student"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                className={`px-4 font-semibold py-2.5 rounded-xl text-xs transition border ${isDarkMode ? "border-zinc-800 text-zinc-300 hover:bg-zinc-900" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
              >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
