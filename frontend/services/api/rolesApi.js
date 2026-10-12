const BASE_URL = "http://localhost:5000/api/roles";

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

export const rolesApi = {
  fetchRoles: async (params) => {
    const res = await fetch(`${BASE_URL}${toQuery(params)}`, { cache: "no-store" });
    return parseJson(res);
  },

  createRole: async (payload) => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return parseJson(res);
  },

  editRole: async (id, payload) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return parseJson(res);
  },

  deleteRole: async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    return parseJson(res);
  },

  fetchPermissions: async () => {
    const res = await fetch(`${BASE_URL}/permissions`, { cache: "no-store" });
    return parseJson(res);
  },

  assignPermissions: async (id, permissions) => {
    const res = await fetch(`${BASE_URL}/${id}/permissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ permissions }),
    });
    return parseJson(res);
  },

  fetchRoleDetails: async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`, { cache: "no-store" });
    return parseJson(res);
  },
};

