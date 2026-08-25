import { apiRequest } from "./client";

export const fetchUpcomingExpenses = async () => {
  return apiRequest("/transactions/upcoming");
};


export const addUpcomingExpense = async (newExpense) => {
  return apiRequest("/transactions/upcoming", {
    method: "POST",
    body: JSON.stringify(newExpense),
  });
};

export const deleteUpcomingExpense = async (id) => {
  return apiRequest(`/transactions/upcoming/${id}`, {
    method: "DELETE",
  });
};
