const BASE_URL = "http://localhost:5000/api/behavior";

async function parseJson(res) {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("text/csv") || contentType.includes("text/plain")) {
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Request failed (${res.status})`);
    }
    return res.text();
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error || data?.message || `Request failed (${res.status})`;
    throw new Error(message);
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

export const behaviorApi = {
  fetchFilters: async () => {
    const res = await fetch(`${BASE_URL}/filters`, { cache: "no-store" });
    return parseJson(res);
  },
  fetchStudents: async ({ search } = {}) => {
    const res = await fetch(`${BASE_URL}/students${toQuery({ search })}`, { cache: "no-store" });
    return parseJson(res);
  },
  fetchIncidents: async ({ start, end, severity, studentId } = {}) => {
    const res = await fetch(`${BASE_URL}/incidents${toQuery({ start, end, severity, studentId })}`, { cache: "no-store" });
    return parseJson(res);
  },
  fetchHistory: async ({ studentId, start, end } = {}) => {
    const res = await fetch(`${BASE_URL}/history${toQuery({ studentId, start, end })}`, { cache: "no-store" });
    return parseJson(res);
  },
  logIncident: async (payload) => {
    const res = await fetch(`${BASE_URL}/incidents/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {}),
    });
    return parseJson(res);
  },
  fetchNotifications: async ({ studentId } = {}) => {
    const res = await fetch(`${BASE_URL}/notifications${toQuery({ studentId })}`, { cache: "no-store" });
    return parseJson(res);
  },
  notifyParent: async (payload) => {
    const res = await fetch(`${BASE_URL}/notify-parent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {}),
    });
    return parseJson(res);
  },
  generateBehaviorReport: async ({ start, end, severity, studentId } = {}) => {
    const res = await fetch(`${BASE_URL}/report/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ start, end, severity, studentId }),
    });
    return parseJson(res);
  },
  exportBehaviorReportCsv: async ({ start, end, severity, studentId } = {}) => {
    const res = await fetch(`${BASE_URL}/report/export${toQuery({ start, end, severity, studentId })}`, {
      cache: "no-store",
    });
    return parseJson(res);
  },
};

