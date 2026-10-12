const BASE_URL = "http://localhost:5000/api/admissions";

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

function toQuery(params = {}) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v == null) return;
    const s = String(v).trim();
    if (!s) return;
    sp.set(k, s);
  });
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const admissionsApi = {
  fetchDashboard: async (params) => {
    const res = await fetch(`${BASE_URL}/dashboard${toQuery(params)}`, { cache: "no-store" });
    return parseJson(res);
  },

  createApplication: async (payload) => {
    const res = await fetch(`${BASE_URL}/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return parseJson(res);
  },

  updateApplicationStatus: async (id, status) => {
    const res = await fetch(`${BASE_URL}/applications/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    return parseJson(res);
  },
};

