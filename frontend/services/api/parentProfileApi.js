const BASE_URL = "http://localhost:5000/api/parents";

async function parseJson(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error || data?.message || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const parentProfileApi = {
  fetchParentProfile: async (id) => {
    const res = await fetch(`${BASE_URL}/directory/${id}`, { cache: "no-store" });
    return parseJson(res);
  },

  updateParentProfile: async (id, payload) => {
    const res = await fetch(`${BASE_URL}/profile/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return parseJson(res);
  },

  fetchLinkedStudents: async (id) => {
    const profile = await parentProfileApi.fetchParentProfile(id);
    return profile?.linkedStudents || [];
  },
};
