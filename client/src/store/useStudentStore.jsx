import { create } from "zustand";
import {
  apiRequest,
  clearAuthSession,
  getStoredUser,
  getToken,
  setAuthSession as persistAuthSession,
  updateStoredUser,
} from "@/api/client";

const blankUser = {
  name: "",
  email: "",
  role: "",
  picture: null,
  monthlyAllowance: 0,
};

const storedUser = getStoredUser();

const normalizeList = (items) => (Array.isArray(items) ? items : []);

const mergeUser = (currentUser, nextUser) => ({
  ...blankUser,
  ...(currentUser || {}),
  ...(nextUser || {}),
});

export const useStudentStore = create((set, get) => ({
  token: getToken(),
  user: storedUser,
  isAuthenticated: Boolean(getToken() && storedUser),
  expenses: [],
  deposits: [],
  reminders: [],

  setAuthSession: ({ token, user }) => {
    persistAuthSession({ token, user });
    set({ token, user: mergeUser(null, user), isAuthenticated: true });
  },

  setUser: (userData) =>
    set((state) => {
      const user = mergeUser(state.user, userData);
      updateStoredUser(user);
      return {
        user,
        isAuthenticated: Boolean(getToken()) || Boolean(user?.email),
      };
    }),

  logout: () => {
    clearAuthSession();
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      expenses: [],
      deposits: [],
      reminders: [],
    });
  },

  login: async (credentials) => {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    persistAuthSession(data);
    set({
      token: data.token,
      user: mergeUser(null, data.user),
      isAuthenticated: true,
    });

    return data;
  },

  registerUser: async (payload) => {
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    persistAuthSession(data);
    set({
      token: data.token,
      user: mergeUser(null, data.user),
      isAuthenticated: true,
    });

    return data;
  },

  googleAuth: async (payload) => {
    const data = await apiRequest("/auth/google", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    persistAuthSession(data);
    set({
      token: data.token,
      user: mergeUser(null, data.user),
      isAuthenticated: true,
    });

    return data;
  },

  refreshUser: async () => {
    const data = await apiRequest("/auth/me");
    updateStoredUser(data.user);
    set({ user: mergeUser(null, data.user), isAuthenticated: true });
    return data.user;
  },

  fetchDashboard: async () => {
    await Promise.allSettled([
      get().refreshUser(),
      get().fetchExpenses(),
      get().fetchDeposits(),
      get().fetchReminders(),
    ]);
  },

  updateProfileName: async (newName) => {
    const data = await apiRequest("/auth/profile", {
      method: "PATCH",
      body: JSON.stringify({ name: newName }),
    });

    updateStoredUser(data.user);
    set({ user: mergeUser(null, data.user) });
    return data.user;
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const data = await apiRequest("/auth/password", {
        method: "PATCH",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      return {
        success: true,
        message: data.message || "Password updated successfully!",
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  setExpenses: (expenses) => set({ expenses: normalizeList(expenses) }),

  fetchExpenses: async () => {
    const expenses = await apiRequest("/transactions/expenses");
    set({ expenses: normalizeList(expenses) });
    return expenses;
  },

  addExpense: async (newExpense) => {
    const created = await apiRequest("/transactions/expenses", {
      method: "POST",
      body: JSON.stringify(newExpense),
    });

    set((state) => ({ expenses: [created, ...state.expenses] }));
    return created;
  },

  deleteExpense: async (id) => {
    await apiRequest(`/transactions/expenses/${id}`, { method: "DELETE" });
    set((state) => ({
      expenses: state.expenses.filter((expense) => expense.id !== id),
    }));
  },

  fetchDeposits: async () => {
    const deposits = await apiRequest("/transactions/deposits");
    set({ deposits: normalizeList(deposits) });
    return deposits;
  },

  addDeposit: async (newDeposit) => {
    const created = await apiRequest("/transactions/deposits", {
      method: "POST",
      body: JSON.stringify(newDeposit),
    });

    set((state) => ({ deposits: [created, ...state.deposits] }));
    return created;
  },

  deleteDeposit: async (id) => {
    await apiRequest(`/transactions/deposits/${id}`, { method: "DELETE" });
    set((state) => ({
      deposits: state.deposits.filter((deposit) => deposit.id !== id),
    }));
  },

  setReminders: (reminders) => set({ reminders: normalizeList(reminders) }),

  fetchReminders: async () => {
    const reminders = await apiRequest("/reminders");
    set({ reminders: normalizeList(reminders) });
    return reminders;
  },

  markAsRead: async (id) => {
    const updated = await apiRequest(`/reminders/${id}/read`, {
      method: "PATCH",
    });

    set((state) => ({
      reminders: state.reminders.map((reminder) =>
        reminder.id === id ? updated : reminder
      ),
    }));
  },

  markAllAsRead: async () => {
    const reminders = await apiRequest("/reminders/read-all", {
      method: "PATCH",
    });
    set({ reminders: normalizeList(reminders) });
  },

  discardReminder: async (id) => {
    await apiRequest(`/reminders/${id}`, { method: "DELETE" });
    set((state) => ({
      reminders: state.reminders.filter((reminder) => reminder.id !== id),
    }));
  },

  getComparisonData: (comparePeriod = "last_week") => {
    const expenses = get().expenses || [];
    const categories = ["Food", "Education", "Transport", "Entertainment"];

    const currentSpent = categories.map((cat) =>
      expenses
        .filter((expense) => expense.period === "this_week" && expense.category === cat)
        .reduce((sum, expense) => sum + Number(expense.amount || 0), 0)
    );

    const previousSpent = categories.map((cat) =>
      expenses
        .filter((expense) => expense.period === comparePeriod && expense.category === cat)
        .reduce((sum, expense) => sum + Number(expense.amount || 0), 0)
    );

    return {
      categories,
      currentSpent,
      previousSpent,
    };
  },
}));
