const BASE_URL = "http://localhost:5000/api/attendance";

async function parseJson(res) {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("text/csv") || contentType.includes("text/plain")) {
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      const err = new Error(text || `Request failed (${res.status})`);
      err.status = res.status;
      throw err;
    }
    return res.text();
  }

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

export const attendanceApi = {
  fetchFilters: async () => {
    const res = await fetch(`${BASE_URL}/filters`, { cache: "no-store" });
    return parseJson(res);
  },
  fetchStudents: async ({ assignedClass, assignedSection } = {}) => {
    const res = await fetch(
      `${BASE_URL}/students${toQuery({ assignedClass, assignedSection })}`,
      { cache: "no-store" }
    );
    return parseJson(res);
  },
  fetchLogs: async ({ date, assignedClass, assignedSection } = {}) => {
    const res = await fetch(
      `${BASE_URL}/logs${toQuery({ date, assignedClass, assignedSection })}`,
      { cache: "no-store" }
    );
    return parseJson(res);
  },
  fetchSummary: async ({ start, end, assignedClass, assignedSection } = {}) => {
    const res = await fetch(
      `${BASE_URL}/summary${toQuery({ start, end, assignedClass, assignedSection })}`,
      { cache: "no-store" }
    );
    return parseJson(res);
  },
  fetchTrends: async ({ start, end, assignedClass, assignedSection, period } = {}) => {
    const res = await fetch(
      `${BASE_URL}/trends${toQuery({ start, end, assignedClass, assignedSection, period })}`,
      { cache: "no-store" }
    );
    return parseJson(res);
  },
  fetchLowAlerts: async ({ start, end, threshold, assignedClass, assignedSection } = {}) => {
    const res = await fetch(
      `${BASE_URL}/alerts/low${toQuery({ start, end, threshold, assignedClass, assignedSection })}`,
      { cache: "no-store" }
    );
    return parseJson(res);
  },
  exportReportCsv: async ({ start, end, assignedClass, assignedSection } = {}) => {
    const res = await fetch(
      `${BASE_URL}/report${toQuery({ start, end, assignedClass, assignedSection })}`,
      { cache: "no-store" }
    );
    return parseJson(res);
  },
  markAttendance: async ({ date, assignedClass, assignedSection, records } = {}) => {
    const res = await fetch(`${BASE_URL}/mark`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, assignedClass, assignedSection, records }),
    });
    return parseJson(res);
  },
};

