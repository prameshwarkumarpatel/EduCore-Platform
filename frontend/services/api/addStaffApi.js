const BASE_URL = "http://localhost:5000/api/staff";

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

export const addStaffApi = {
  createStaff: async (payload) =>
    parseJson(
      await fetch(`${BASE_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload || {}),
      })
    ),

  updateStaff: async (id, payload) =>
    parseJson(
      await fetch(`${BASE_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload || {}),
      })
    ),

  uploadProfilePhoto: async (id, dataUrl) =>
    parseJson(
      await fetch(`${BASE_URL}/${id}/photo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl }),
      })
    ),

  fetchDepartments: async () =>
    parseJson(await fetch(`${BASE_URL}/departments`, { cache: "no-store" })),
};

