const BASE_URL = "http://localhost:5000/api/parents";

async function parseJson(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error || data?.message || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.details = data?.details;
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

export const parentDashboardApi = {
  fetchParentStats: async () => {
    const res = await fetch(`${BASE_URL}/stats`, { cache: "no-store" });
    return parseJson(res);
  },

  fetchLinkedStudents: async () => {
    const res = await fetch(`${BASE_URL}/linked-students`, { cache: "no-store" });
    return parseJson(res);
  },

  fetchRecentActivities: async () => {
    const res = await fetch(`${BASE_URL}/recent-activities`, { cache: "no-store" });
    return parseJson(res);
  },

  fetchCommunicationSummary: async () => {
    const res = await fetch(`${BASE_URL}/communication-summary`, { cache: "no-store" });
    return parseJson(res);
  },

  fetchPendingRequests: async () => {
    const res = await fetch(`${BASE_URL}/pending-requests`, { cache: "no-store" });
    return parseJson(res);
  },

  fetchAlerts: async () => {
    const res = await fetch(`${BASE_URL}/alerts`, { cache: "no-store" });
    return parseJson(res);
  },

  searchParents: async (query) => {
    const qs = toQuery({ q: query });
    const res = await fetch(`${BASE_URL}/search${qs}`, { cache: "no-store" });
    return parseJson(res);
  },
};

