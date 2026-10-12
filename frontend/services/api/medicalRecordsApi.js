const BASE_URL = "http://localhost:5000/api/medical";

async function parseJson(res) {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("text/csv") || contentType.includes("text/plain")) {
    const text = await res.text().catch(() => "");
    if (!res.ok) {
      const err = new Error(text || `Request failed (${res.status})`);
      err.status = res.status;
      throw err;
    }
    return text;
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error || data?.message || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.details = data?.details;
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

export const medicalRecordsApi = {
  fetchDashboard: async (studentId) => {
    const res = await fetch(`${BASE_URL}/students/${encodeURIComponent(studentId)}/dashboard`, { cache: "no-store" });
    return parseJson(res);
  },

  historyAdd: async (studentId, payload) => {
    const res = await fetch(`${BASE_URL}/students/${encodeURIComponent(studentId)}/history`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {}),
    });
    return parseJson(res);
  },
  historyUpdate: async (studentId, recordId, payload) => {
    const res = await fetch(`${BASE_URL}/students/${encodeURIComponent(studentId)}/history/${encodeURIComponent(recordId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {}),
    });
    return parseJson(res);
  },
  historyDelete: async (studentId, recordId) => {
    const res = await fetch(`${BASE_URL}/students/${encodeURIComponent(studentId)}/history/${encodeURIComponent(recordId)}`, {
      method: "DELETE",
    });
    return parseJson(res);
  },

  immunizationAdd: async (studentId, payload) => {
    const res = await fetch(`${BASE_URL}/students/${encodeURIComponent(studentId)}/immunizations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {}),
    });
    return parseJson(res);
  },
  immunizationUpdate: async (studentId, immunizationId, payload) => {
    const res = await fetch(`${BASE_URL}/students/${encodeURIComponent(studentId)}/immunizations/${encodeURIComponent(immunizationId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {}),
    });
    return parseJson(res);
  },
  immunizationDelete: async (studentId, immunizationId) => {
    const res = await fetch(`${BASE_URL}/students/${encodeURIComponent(studentId)}/immunizations/${encodeURIComponent(immunizationId)}`, {
      method: "DELETE",
    });
    return parseJson(res);
  },

  allergyAdd: async (studentId, payload) => {
    const res = await fetch(`${BASE_URL}/students/${encodeURIComponent(studentId)}/allergies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {}),
    });
    return parseJson(res);
  },
  allergyUpdate: async (studentId, allergyId, payload) => {
    const res = await fetch(`${BASE_URL}/students/${encodeURIComponent(studentId)}/allergies/${encodeURIComponent(allergyId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {}),
    });
    return parseJson(res);
  },
  allergyDelete: async (studentId, allergyId) => {
    const res = await fetch(`${BASE_URL}/students/${encodeURIComponent(studentId)}/allergies/${encodeURIComponent(allergyId)}`, {
      method: "DELETE",
    });
    return parseJson(res);
  },

  emergencyAdd: async (studentId, payload) => {
    const res = await fetch(`${BASE_URL}/students/${encodeURIComponent(studentId)}/emergency-contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {}),
    });
    return parseJson(res);
  },
  emergencyDelete: async (studentId, contactId) => {
    const res = await fetch(`${BASE_URL}/students/${encodeURIComponent(studentId)}/emergency-contacts/${encodeURIComponent(contactId)}`, {
      method: "DELETE",
    });
    return parseJson(res);
  },

  uploadDocument: async (studentId, payload) => {
    const res = await fetch(`${BASE_URL}/students/${encodeURIComponent(studentId)}/documents/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {}),
    });
    return parseJson(res);
  },
};

