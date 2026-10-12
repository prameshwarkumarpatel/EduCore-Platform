const BASE_URL = "http://localhost:5000/api/leave";

async function parseJson(res) {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("text/csv") || contentType.includes("text/plain")) {
    const text = await res.text().catch(() => "");
    if (!res.ok) throw new Error(text || `Request failed (${res.status})`);
    return text;
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

export const leaveApi = {
  fetchFilters: async () => {
    const res = await fetch(`${BASE_URL}/filters`, { cache: "no-store" });
    return parseJson(res);
  },

  fetchStudents: async ({ search } = {}) => {
    const res = await fetch(`${BASE_URL}/students${toQuery({ search })}`, { cache: "no-store" });
    return parseJson(res);
  },

  fetchRequests: async ({ start, end, status, studentId } = {}) => {
    const res = await fetch(`${BASE_URL}/requests${toQuery({ start, end, status, studentId })}`, { cache: "no-store" });
    return parseJson(res);
  },

  fetchHistory: async ({ start, end, studentId } = {}) => {
    const res = await fetch(`${BASE_URL}/history${toQuery({ start, end, studentId })}`, { cache: "no-store" });
    return parseJson(res);
  },

  submitRequest: async ({ studentId, startDate, endDate, reason } = {}) => {
    const res = await fetch(`${BASE_URL}/requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, startDate, endDate, reason }),
    });
    return parseJson(res);
  },

  approveRequest: async ({ requestId, decisionNotes } = {}) => {
    const res = await fetch(`${BASE_URL}/requests/${encodeURIComponent(requestId)}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decisionNotes }),
    });
    return parseJson(res);
  },

  rejectRequest: async ({ requestId, decisionNotes } = {}) => {
    const res = await fetch(`${BASE_URL}/requests/${encodeURIComponent(requestId)}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decisionNotes }),
    });
    return parseJson(res);
  },

  fetchNotifications: async ({ studentId } = {}) => {
    const res = await fetch(`${BASE_URL}/notifications${toQuery({ studentId })}`, { cache: "no-store" });
    return parseJson(res);
  },

  notify: async ({ studentId, leaveRequestId, channel, message } = {}) => {
    const res = await fetch(`${BASE_URL}/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, leaveRequestId, channel, message }),
    });
    return parseJson(res);
  },

  generateReport: async ({ start, end, status, studentId } = {}) => {
    const res = await fetch(`${BASE_URL}/report/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ start, end, status, studentId }),
    });
    return parseJson(res);
  },

  exportReportCsv: async ({ start, end, status, studentId } = {}) => {
    const res = await fetch(`${BASE_URL}/report/export${toQuery({ start, end, status, studentId })}`, { cache: "no-store" });
    return parseJson(res);
  },
};

