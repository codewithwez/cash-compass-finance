import { create } from "zustand";
import {
  apiRequest,
  clearAuthSession,
  getStoredUser,
  getToken,
  setAuthSession as persistAuthSession,
} from "@/api/client";

const storedUser = getStoredUser();

export const useAdminStore = create((set, get) => ({
  isAdminAuthenticated: Boolean(getToken() && storedUser?.role === "Admin"),
  students: [],
  employees: [],
  claims: [],

  setAdminAuthenticated: (status) => set({ isAdminAuthenticated: status }),

  setStudents: (studentsList) =>
    set({ students: Array.isArray(studentsList) ? studentsList : [] }),

  setEmployees: (employeesList) =>
    set({ employees: Array.isArray(employeesList) ? employeesList : [] }),

  setClaims: (claimsList) =>
    set({ claims: Array.isArray(claimsList) ? claimsList : [] }),

  loginAdmin: async (email, password) => {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (data.user?.role !== "Admin") {
      throw new Error("This account does not have admin access.");
    }

    persistAuthSession(data);
    set({ isAdminAuthenticated: true });
    await get().fetchAdminData();
    return true;
  },

  fetchAdminData: async () => {
    const [students, employees, claims] = await Promise.all([
      apiRequest("/users/students"),
      apiRequest("/users/employees"),
      apiRequest("/claims"),
    ]);

    set({ students, employees, claims });
    return { students, employees, claims };
  },

  logoutAdmin: () => {
    clearAuthSession();
    set({
      isAdminAuthenticated: false,
      students: [],
      employees: [],
      claims: [],
    });
  },

  addStudent: async (student) => {
    const created = await apiRequest("/users/students", {
      method: "POST",
      body: JSON.stringify(student),
    });

    set((state) => ({ students: [created, ...state.students] }));
    return created;
  },

  updateStudent: async (id, updatedData) => {
    const updated = await apiRequest(`/users/students/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updatedData),
    });

    set((state) => ({
      students: state.students.map((student) =>
        student.id === id ? updated : student
      ),
    }));

    return updated;
  },

  deleteStudent: async (id) => {
    await apiRequest(`/users/students/${id}`, { method: "DELETE" });
    set((state) => ({
      students: state.students.filter((student) => student.id !== id),
    }));
  },

  addEmployee: async (employee) => {
    const created = await apiRequest("/users/employees", {
      method: "POST",
      body: JSON.stringify(employee),
    });

    set((state) => ({ employees: [created, ...state.employees] }));
    return created;
  },

  updateEmployee: async (id, updatedData) => {
    const updated = await apiRequest(`/users/employees/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updatedData),
    });

    set((state) => ({
      employees: state.employees.map((employee) =>
        employee.id === id ? updated : employee
      ),
    }));

    return updated;
  },

  deleteEmployee: async (id) => {
    await apiRequest(`/users/employees/${id}`, { method: "DELETE" });
    set((state) => ({
      employees: state.employees.filter((employee) => employee.id !== id),
    }));
  },

  updateClaimStatus: async (id, newStatus) => {
    const updated = await apiRequest(`/claims/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus }),
    });

    set((state) => ({
      claims: state.claims.map((claim) => (claim.id === id ? updated : claim)),
    }));

    return updated;
  },
}));
