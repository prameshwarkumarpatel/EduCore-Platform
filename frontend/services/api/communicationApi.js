const BASE = "http://localhost:5000/api/parents";

async function parseJson(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error || data?.message || `Request failed (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return data;
}

function toQuery(params = {}) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    const s = String(v).trim();
    if (!s) return;
    sp.set(k, s);
  });
  const q = sp.toString();
  return q ? `?${q}` : "";
}

function listUrl(parentId, suffix, params) {
  return `${BASE}/${parentId}${suffix}${toQuery(params)}`;
}

export const communicationApi = {
  fetchMessages: async (parentId, { channel, from, to } = {}) => {
    const res = await fetch(listUrl(parentId, "/communication/messages", { channel, from, to }), {
      cache: "no-store",
    });
    return parseJson(res);
  },

  fetchCalls: async (parentId, { from, to, status } = {}) => {
    const res = await fetch(listUrl(parentId, "/communication/calls", { from, to, status }), {
      cache: "no-store",
    });
    return parseJson(res);
  },

  fetchNotifications: async (parentId, { from, to, severity } = {}) => {
    const res = await fetch(
      listUrl(parentId, "/communication/notifications", { from, to, severity }),
      { cache: "no-store" }
    );
    return parseJson(res);
  },

  sendMessage: async (parentId, { channel, message, severity } = {}) => {
    const res = await fetch(`${BASE}/${parentId}/communication/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel, message, severity }),
    });
    return parseJson(res);
  },

  sendBroadcast: async ({ parentIds, channel, message, severity } = {}) => {
    const res = await fetch(`${BASE}/communication/broadcast`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parentIds, channel, message, severity }),
    });
    return parseJson(res);
  },
};

