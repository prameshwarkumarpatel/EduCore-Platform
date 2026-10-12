const BASE_URL = "http://localhost:5000/api/staff-attendance";

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

export const staffAttendanceApi = {
  fetchMeta: async () => parseJson(await fetch(`${BASE_URL}/meta`, { cache: "no-store" })),
  fetchDailyAttendance: async (params) => parseJson(await fetch(`${BASE_URL}/daily${toQuery(params)}`, { cache: "no-store" })),
  fetchMonthlyAttendance: async (params) => parseJson(await fetch(`${BASE_URL}/monthly${toQuery(params)}`, { cache: "no-store" })),
  markAttendance: async (payload) =>
    parseJson(
      await fetch(`${BASE_URL}/mark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload || {}),
      })
    ),
  generateReport: async (params) => parseJson(await fetch(`${BASE_URL}/report${toQuery(params)}`, { cache: "no-store" })),
  fetchLeaveData: async (params) => parseJson(await fetch(`${BASE_URL}/leave${toQuery(params)}`, { cache: "no-store" })),
  fetchAlerts: async (params) => parseJson(await fetch(`${BASE_URL}/alerts${toQuery(params)}`, { cache: "no-store" })),
};
