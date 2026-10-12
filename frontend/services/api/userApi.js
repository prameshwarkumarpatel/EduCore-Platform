const BASE_URL = "http://localhost:5000/api/users";

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

export const userApi = {
  fetchRoles: async () => {
    const res = await fetch(`${BASE_URL}/roles`, { cache: "no-store" });
    return parseJson(res);
  },

  fetchUsers: async (params) => {
    const res = await fetch(`${BASE_URL}${toQuery(params)}`, { cache: "no-store" });
    return parseJson(res);
  },

  addUser: async (payload) => {
    const res = await fetch(`${BASE_URL}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return parseJson(res);
  },

  editUser: async (id, payload) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return parseJson(res);
  },

  deleteUser: async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    return parseJson(res);
  },

  toggleUserStatus: async (id, isActive) => {
    const res = await fetch(`${BASE_URL}/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    return parseJson(res);
  },

  assignUserRole: async (id, role) => {
    const res = await fetch(`${BASE_URL}/${id}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    return parseJson(res);
  },

  fetchUserDetails: async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`, { cache: "no-store" });
    return parseJson(res);
  },
};

