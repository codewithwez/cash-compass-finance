import { apiRequest } from "./client";
 
export const fetchReimbursements = async (page=1, limit=2) => {
  const data = await apiRequest("/claims");
  const start = (page - 1) * limit;
  return data.slice(start, start + limit);
}

export const addReimbursement = async (newClaim) => {
  return apiRequest("/claims", {
    method: "POST",
    body: JSON.stringify(newClaim)
  });
}

    

export const deleteReimbursement = async (id) => {
  return apiRequest(`/claims/${id}`, {
    method: "DELETE"
  });
};
