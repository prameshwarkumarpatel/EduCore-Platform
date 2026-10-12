const BASE_URL = "http://localhost:5000/api/parents";

async function parseJson(res) {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("text/csv")) {
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

export const parentDirectoryApi = {
  fetchParents: async (params) => {
    const res = await fetch(`${BASE_URL}/directory${toQuery(params)}`, { cache: "no-store" });
    return parseJson(res);
  },

  fetchParentDetails: async (id) => {
    const res = await fetch(`${BASE_URL}/directory/${id}`, { cache: "no-store" });
    return parseJson(res);
  },

  searchParents: async (query) => {
    const res = await fetch(`${BASE_URL}/search${toQuery({ q: query })}`, { cache: "no-store" });
    const data = await parseJson(res);
    return Array.isArray(data?.results) ? data.results : data || [];
  },

  exportParentData: async (params) => {
    const res = await fetch(`${BASE_URL}/directory/export${toQuery(params)}`, { cache: "no-store" });
    return parseJson(res);
  },
};
