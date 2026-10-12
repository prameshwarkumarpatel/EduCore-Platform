const BASE_URL = "http://localhost:5000/api/staff-directory";

async function parseJson(res) {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("text/csv")) {
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    return res.text();
  }
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

export const staffDirectoryApi = {
  fetchStaffList: async (params) => parseJson(await fetch(`${BASE_URL}${toQuery(params)}`, { cache: "no-store" })),
  fetchStaffDetails: async (id) => parseJson(await fetch(`${BASE_URL}/${id}`, { cache: "no-store" })),
  searchStaff: async (q) => parseJson(await fetch(`${BASE_URL}/search${toQuery({ q })}`, { cache: "no-store" })),
  exportStaffData: async (params) => parseJson(await fetch(`${BASE_URL}/export${toQuery(params)}`, { cache: "no-store" })),
  updateStaff: async (id, payload) => parseJson(await fetch(`${BASE_URL}/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })),
  deleteStaff: async (id) => parseJson(await fetch(`${BASE_URL}/${id}`, { method: "DELETE" })),
};

