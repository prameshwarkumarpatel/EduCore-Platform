const BASE_URL = "http://localhost:5000/api/document-verification";

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

export const documentVerificationApi = {
  fetchDocuments: async (params) => {
    const res = await fetch(`${BASE_URL}/documents${toQuery(params)}`, { cache: "no-store" });
    return parseJson(res);
  },
  fetchPendingAlerts: async () => {
    const res = await fetch(`${BASE_URL}/documents/pending-alerts`, { cache: "no-store" });
    return parseJson(res);
  },
  fetchDocumentDetails: async (id) => {
    const res = await fetch(`${BASE_URL}/documents/${id}`, { cache: "no-store" });
    return parseJson(res);
  },
  approveDocument: async (id, remarks) => {
    const res = await fetch(`${BASE_URL}/documents/${id}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ remarks }),
    });
    return parseJson(res);
  },
  rejectDocument: async (id, remarks) => {
    const res = await fetch(`${BASE_URL}/documents/${id}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ remarks }),
    });
    return parseJson(res);
  },
  updateVerificationStatus: async (id, status, remarks) => {
    const res = await fetch(`${BASE_URL}/documents/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, remarks }),
    });
    return parseJson(res);
  },
  addVerificationRemarks: async (id, remarks) => {
    const res = await fetch(`${BASE_URL}/documents/${id}/remarks`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ remarks }),
    });
    return parseJson(res);
  },
};

