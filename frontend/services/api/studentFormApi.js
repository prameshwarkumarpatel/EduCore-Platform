const BASE_URL = "http://localhost:5000/api/student-form";

async function parseJson(res) {
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

export const studentFormApi = {
  fetchClasses: async () => {
    const res = await fetch(`${BASE_URL}/classes`, { cache: "no-store" });
    return parseJson(res);
  },
  fetchStudentDetails: async (id) => {
    const res = await fetch(`${BASE_URL}/students/${id}`, { cache: "no-store" });
    return parseJson(res);
  },
  validateStudentForm: async (payload, mode) => {
    const res = await fetch(`${BASE_URL}/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, mode }),
    });
    return parseJson(res);
  },
  createStudent: async (payload, mode) => {
    const res = await fetch(`${BASE_URL}/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, mode }),
    });
    return parseJson(res);
  },
  updateStudent: async (id, payload, mode) => {
    const res = await fetch(`${BASE_URL}/students/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, mode }),
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

