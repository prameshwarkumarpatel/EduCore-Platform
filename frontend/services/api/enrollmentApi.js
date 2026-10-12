const BASE_URL = "http://localhost:5000/api/enrollment";

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

export const enrollmentApi = {
  fetchEnrolledStudents: async (params) => {
    const res = await fetch(`${BASE_URL}/enrollments${toQuery(params)}`, { cache: "no-store" });
    return parseJson(res);
  },
  fetchClasses: async () => {
    const res = await fetch(`${BASE_URL}/classes`, { cache: "no-store" });
    return parseJson(res);
  },
  generateEnrollmentId: async () => {
    const res = await fetch(`${BASE_URL}/enrollments/generate-id`, { method: "POST" });
    return parseJson(res);
  },
  convertApplicationToStudent: async (applicationId) => {
    const res = await fetch(`${BASE_URL}/enrollments/convert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId }),
    });
    return parseJson(res);
  },
  assignClassSection: async (enrollmentId, payload) => {
    const res = await fetch(`${BASE_URL}/enrollments/${enrollmentId}/assign`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return parseJson(res);
  },
  exportEnrollmentData: async (params) => {
    const res = await fetch(`${BASE_URL}/enrollments/export${toQuery(params)}`, { cache: "no-store" });
    return parseJson(res);
  },
};

