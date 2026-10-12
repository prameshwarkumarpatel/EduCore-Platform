const BASE_URL = "http://localhost:5000/api/academic-history";

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

export const academicHistoryApi = {
  fetchDashboard: async (studentId, params = {}) => {
    const qs = toQuery(params);
    const res = await fetch(`${BASE_URL}/students/${studentId}/dashboard${qs}`, { cache: "no-store" });
    return parseJson(res);
  },
  generateTranscript: async (studentId, payload = {}) => {
    const res = await fetch(`${BASE_URL}/students/${studentId}/transcript`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return parseJson(res);
  },
  exportAcademicData: async (studentId, params = {}) => {
    const qs = toQuery(params);
    const res = await fetch(`${BASE_URL}/students/${studentId}/export${qs}`, { cache: "no-store" });
    const text = await res.text().catch(() => "");
    if (!res.ok) {
      throw new Error(text || `Export failed (${res.status})`);
    }
    return text;
  },
};

