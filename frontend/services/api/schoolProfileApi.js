const BASE_URL = "http://localhost:5000/api/school-profile";

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

export const schoolProfileApi = {
  fetchProfile: async () => {
    const res = await fetch(BASE_URL, { cache: "no-store" });
    return parseJson(res);
  },
  updateProfile: async (payload) => {
    const res = await fetch(`${BASE_URL}/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return parseJson(res);
  },
  uploadLogo: async (url) => {
    const res = await fetch(`${BASE_URL}/upload-logo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    return parseJson(res);
  },
};
