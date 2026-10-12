const BASE_URL = "http://localhost:5000/api/approval";

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

export const approvalApi = {
  fetchApprovalQueue: async (params) => {
    const res = await fetch(`${BASE_URL}/queue${toQuery(params)}`, { cache: "no-store" });
    return parseJson(res);
  },
  fetchApplicationReview: async (id) => {
    const res = await fetch(`${BASE_URL}/applications/${id}`, { cache: "no-store" });
    return parseJson(res);
  },
  fetchClasses: async () => {
    const res = await fetch(`${BASE_URL}/classes`, { cache: "no-store" });
    return parseJson(res);
  },
  assignClassSection: async (id, payload) => {
    const res = await fetch(`${BASE_URL}/applications/${id}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return parseJson(res);
  },
  approveApplication: async (id, remarks) => {
    const res = await fetch(`${BASE_URL}/applications/${id}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ remarks }),
    });
    return parseJson(res);
  },
  rejectApplication: async (id, remarks) => {
    const res = await fetch(`${BASE_URL}/applications/${id}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ remarks }),
    });
    return parseJson(res);
  },
  generateConfirmation: async (id) => {
    const res = await fetch(`${BASE_URL}/applications/${id}/confirmation`, { method: "POST" });
    return parseJson(res);
  },
  sendNotification: async (id, payload) => {
    const res = await fetch(`${BASE_URL}/applications/${id}/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return parseJson(res);
  },
  fetchApprovalHistory: async (id) => {
    const res = await fetch(`${BASE_URL}/applications/${id}/history`, { cache: "no-store" });
    return parseJson(res);
  },
};

