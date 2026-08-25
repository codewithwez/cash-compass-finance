import { create } from "zustand";
import {
  apiRequest,
  clearAuthSession,
  getStoredUser,
  updateStoredUser,
} from "@/api/client";

const defaultUser = {
  name: "",
  email: "",
  role: "",
  department: "",
  monthlySalary: 0,
  nextPayDate: "",
};

const defaultPolicy = {
  limit: 0,
  spent: 0,
};

const defaultPto = {
  availableDays: 0,
  usedDays: 0,
  history: [],
};

const storedUser = getStoredUser();

const employeeFromUser = (user) => ({
  ...defaultUser,
  ...(user || {}),
  role: user?.position || user?.role || "",
  department: user?.department || "",
  monthlySalary: user?.monthlySalary || 0,
  nextPayDate: user?.nextPayDate || "",
});

export const useEmployeeStore = create((set, get) => ({
  user: storedUser?.role === "Employee" ? employeeFromUser(storedUser) : defaultUser,
  expensePolicy:
    storedUser?.role === "Employee"
      ? { ...defaultPolicy, ...(storedUser.expensePolicy || {}) }
      : defaultPolicy,
  pto:
    storedUser?.role === "Employee"
      ? { ...defaultPto, ...(storedUser.pto || {}) }
      : defaultPto,
  claims: [],
  payslips: [],

  setUser: (userData) =>
    set((state) => ({
      user: { ...state.user, ...employeeFromUser(userData) },
      expensePolicy: {
        ...state.expensePolicy,
        ...(userData?.expensePolicy || {}),
      },
      pto: { ...state.pto, ...(userData?.pto || {}) },
    })),

  setExpensePolicy: (policyData) =>
    set((state) => ({
      expensePolicy: { ...state.expensePolicy, ...policyData },
    })),

  setPto: (ptoData) =>
    set((state) => ({
      pto: { ...state.pto, ...ptoData },
    })),

  setClaims: (claimsList) => set({ claims: Array.isArray(claimsList) ? claimsList : [] }),

  setPayslips: (payslipsList) =>
    set({ payslips: Array.isArray(payslipsList) ? payslipsList : [] }),

  logout: () => {
    clearAuthSession();
    set({
      user: defaultUser,
      expensePolicy: defaultPolicy,
      pto: defaultPto,
      claims: [],
      payslips: [],
    });
  },

  fetchEmployeeData: async () => {
    const [payroll, claims, pto] = await Promise.all([
      apiRequest("/payroll/me"),
      apiRequest("/claims/mine"),
      apiRequest("/leaves/mine"),
    ]);

    updateStoredUser(payroll.user);
    set({
      user: employeeFromUser(payroll.user),
      expensePolicy: {
        ...defaultPolicy,
        ...(payroll.user?.expensePolicy || {}),
      },
      claims,
      pto,
      payslips: payroll.payslips || [],
    });

    return { payroll, claims, pto };
  },

  updateSalary: async (newSalary) => {
    const data = await apiRequest("/payroll/salary", {
      method: "PATCH",
      body: JSON.stringify({ monthlySalary: Number(newSalary) }),
    });

    updateStoredUser(data.user);
    set({ user: employeeFromUser(data.user) });
    return data.user;
  },

  requestLeave: async (daysCount, leaveType) => {
    const pto = await apiRequest("/leaves", {
      method: "POST",
      body: JSON.stringify({ days: Number(daysCount), leaveType }),
    });

    set({ pto });
    return pto;
  },

  addClaim: async (claimData) => {
    const created = await apiRequest("/claims", {
      method: "POST",
      body: JSON.stringify(claimData),
    });

    set((state) => ({
      claims: [created, ...state.claims],
      expensePolicy: {
        ...state.expensePolicy,
        spent: state.expensePolicy.spent + Number(created.amount || 0),
      },
    }));

    return created;
  },

  updateProfile: async (profileData) => {
    const data = await apiRequest("/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(profileData),
    });

    updateStoredUser(data.user);
    set({ user: employeeFromUser(data.user) });
    return data.user;
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const data = await apiRequest("/auth/password", {
        method: "PATCH",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
 
uploadPayslip: async (payslipPayload) => {
  const newPayslip = await apiRequest("/payroll/upload", {
    method: "POST",
    body: JSON.stringify(payslipPayload),
  });

  set((state) => ({
    payslips: [newPayslip, ...state.payslips],
  }));

  return newPayslip;
},

}));
