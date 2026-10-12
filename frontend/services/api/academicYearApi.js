const BASE_URL = "http://localhost:5000/api/academic-years";

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

export const academicYearApi = {
  fetchAcademicYears: async (params) => {
    const res = await fetch(`${BASE_URL}${toQuery(params)}`, { cache: "no-store" });
    return parseJson(res);
  },

  createAcademicYear: async (payload) => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return parseJson(res);
  },

  editAcademicYear: async (id, payload) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return parseJson(res);
  },

  deleteAcademicYear: async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    return parseJson(res);
  },

  configureSemesters: async (id, semesters) => {
    const res = await fetch(`${BASE_URL}/${id}/semesters`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ semesters }),
    });
    return parseJson(res);
  },

  toggleAcademicYearStatus: async (id, isActive) => {
    const res = await fetch(`${BASE_URL}/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    return parseJson(res);
  },

  fetchAcademicYearDetails: async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`, { cache: "no-store" });
    return parseJson(res);
  },
};

