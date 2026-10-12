const BASE = "http://localhost:5000/api/classes-sections";

async function parseJson(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error || data?.message || `Request failed (${res.status})`;
    const err = new Error(msg);
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

export const classesSectionsApi = {
  fetchDashboard: async (params) => parseJson(await fetch(`${BASE}/dashboard${toQuery(params)}`, { cache: "no-store" })),
  fetchClasses: async (params) => {
    const data = await classesSectionsApi.fetchDashboard(params);
    return data?.classes || [];
  },
  fetchSections: async (params) => {
    const data = await classesSectionsApi.fetchDashboard(params);
    return data?.sections || [];
  },
  createClass: async (payload) =>
    parseJson(await fetch(`${BASE}/classes`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload || {}) })),
  createSection: async (payload) =>
    parseJson(await fetch(`${BASE}/sections`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload || {}) })),
  assignClassTeacher: async (payload) =>
    parseJson(await fetch(`${BASE}/assign-teacher`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload || {}) })),
  updateSectionCapacity: async (payload) =>
    parseJson(await fetch(`${BASE}/section-capacity`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload || {}) })),
  updateClass: async (id, payload) =>
    parseJson(await fetch(`${BASE}/classes/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload || {}) })),
  updateSection: async (id, payload) =>
    parseJson(await fetch(`${BASE}/sections/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload || {}) })),
  deleteClass: async (id) => parseJson(await fetch(`${BASE}/classes/${id}`, { method: "DELETE" })),
  deleteSection: async (id) => parseJson(await fetch(`${BASE}/sections/${id}`, { method: "DELETE" })),
};
