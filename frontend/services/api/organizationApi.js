const BASE_URL = "http://localhost:5000/api/organization";

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

export const organizationApi = {
  fetchSetupData: async () => {
    const res = await fetch(`${BASE_URL}/setup-data`, { cache: "no-store" });
    return parseJson(res);
  },
  updateDetails: async (payload) => {
    const res = await fetch(`${BASE_URL}/update-details`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return parseJson(res);
  },
  addHierarchy: async (levelName) => {
    const res = await fetch(`${BASE_URL}/hierarchy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level: levelName }),
    });
    return parseJson(res);
  },
  addPolicy: async (title, content) => {
    const res = await fetch(`${BASE_URL}/policies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    return parseJson(res);
  },
};
