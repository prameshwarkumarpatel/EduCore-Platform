const BASE_URL = "http://localhost:5000/api/student-profile";

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

export const studentProfileApi = {
  fetchStudentProfile: async (id) => {
    const res = await fetch(`${BASE_URL}/students/${id}`, { cache: "no-store" });
    return parseJson(res);
  },
  updateStudentProfile: async (id, payload) => {
    const res = await fetch(`${BASE_URL}/students/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return parseJson(res);
  },
  uploadProfilePhoto: async (id, dataUrl) => {
    const res = await fetch(`${BASE_URL}/students/${id}/photo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataUrl }),
    });
    return parseJson(res);
  },
};

