const BASE = "http://localhost:5000/api/subject-allocation";

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

export const subjectAllocationApi = {
  fetchAllocations: async (params) => parseJson(await fetch(`${BASE}${toQuery(params)}`, { cache: "no-store" })),
  fetchMeta: async () => parseJson(await fetch(`${BASE}/meta`, { cache: "no-store" })),
  fetchWorkload: async () => parseJson(await fetch(`${BASE}/workload`, { cache: "no-store" })),
  createAllocation: async (payload) => parseJson(await fetch(`${BASE}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload || {}) })),
  updateAllocation: async (id, payload) => parseJson(await fetch(`${BASE}/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload || {}) })),
  deleteAllocation: async (id) => parseJson(await fetch(`${BASE}/${id}`, { method: "DELETE" })),
  checkConflicts: async (payload) => parseJson(await fetch(`${BASE}/check-conflicts`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload || {}) })),
};

