const BASE = "http://localhost:5000/api/departments";

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

export const departmentsApi = {
  fetchDepartments: async (params) => parseJson(await fetch(`${BASE}${toQuery(params)}`, { cache: "no-store" })),
  fetchDepartmentDetails: async (id) => parseJson(await fetch(`${BASE}/${id}`, { cache: "no-store" })),
  createDepartment: async (payload) => parseJson(await fetch(`${BASE}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload || {}) })),
  updateDepartment: async (id, payload) => parseJson(await fetch(`${BASE}/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload || {}) })),
  deleteDepartment: async (id) => parseJson(await fetch(`${BASE}/${id}`, { method: "DELETE" })),
  assignStaffToDepartment: async (id, staffIds) => parseJson(await fetch(`${BASE}/${id}/assign-staff`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ staffIds }) })),
  fetchStaffPool: async () => parseJson(await fetch(`${BASE}/staff-pool`, { cache: "no-store" })),
};

