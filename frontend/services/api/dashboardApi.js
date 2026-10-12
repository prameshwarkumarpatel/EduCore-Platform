const BASE_URL = "http://localhost:5000/api/dashboard";

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

export const dashboardApi = {
  fetchOverviewData: async () => {
    const res = await fetch(`${BASE_URL}/overview`, { cache: "no-store" });
    return parseJson(res);
  },
  fetchKPIMetrics: async () => {
    const res = await fetch(`${BASE_URL}/kpi`, { cache: "no-store" });
    return parseJson(res);
  },
  fetchRecentActivities: async () => {
    const res = await fetch(`${BASE_URL}/activities`, { cache: "no-store" });
    return parseJson(res);
  },
  fetchNotifications: async () => {
    const res = await fetch(`${BASE_URL}/notifications`, { cache: "no-store" });
    return parseJson(res);
  },
  markNotificationRead: async (id, isRead) => {
    const res = await fetch(`${BASE_URL}/notifications/${id}/read`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead }),
    });
    return parseJson(res);
  },
  sendQuickAction: async (actionType, payload) => {
    const res = await fetch(`${BASE_URL}/quick-actions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actionType, payload }),
    });
    return parseJson(res);
  },
};
