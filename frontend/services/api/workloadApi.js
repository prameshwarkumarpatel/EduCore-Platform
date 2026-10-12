const BASE_URL = "http://localhost:5000/api/workload";

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

export const workloadApi = {
  fetchMeta: async () => parseJson(await fetch(`${BASE_URL}/meta`, { cache: "no-store" })),
  fetchWorkloadData: async (params) => parseJson(await fetch(`${BASE_URL}/data${toQuery(params)}`, { cache: "no-store" })),
  fetchTeachingHours: async (params) => parseJson(await fetch(`${BASE_URL}/teaching-hours${toQuery(params)}`, { cache: "no-store" })),
  updateWorkload: async (payload) =>
    parseJson(
      await fetch(`${BASE_URL}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload || {}),
      })
    ),
  analyzeWorkload: async (params) => parseJson(await fetch(`${BASE_URL}/analysis${toQuery(params)}`, { cache: "no-store" })),
  generateWorkloadReport: async (params) => parseJson(await fetch(`${BASE_URL}/report${toQuery(params)}`, { cache: "no-store" })),
};

