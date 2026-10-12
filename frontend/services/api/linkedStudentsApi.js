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

function url(parentId, path = "") {
  return `${BASE}/${parentId}/linked-students${path ? `/${path}` : ""}`;
}

export const linkedStudentsApi = {
  fetchLinkedStudents: async (parentId) => {
    const res = await fetch(url(parentId), { cache: "no-store" });
    return parseJson(res);
  },

  linkStudent: async (parentId, { studentId, relationshipType }) => {
    const res = await fetch(url(parentId), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, relationshipType: relationshipType || "Guardian" }),
    });
    return parseJson(res);
  },

  unlinkStudent: async (parentId, studentId) => {
    const res = await fetch(url(parentId, studentId), { method: "DELETE" });
    return parseJson(res);
  },

  updateRelationshipType: async (parentId, studentId, relationshipType) => {
    const res = await fetch(url(parentId, `${studentId}/relationship`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ relationshipType }),
    });
    return parseJson(res);
  },

  fetchStudentDetails: async (parentId, studentId) => {
    const res = await fetch(url(parentId, `student/${studentId}`), { cache: "no-store" });
    return parseJson(res);
  },

  searchStudents: async (parentId, { search, class: cls, section } = {}) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (cls) params.set("class", cls);
    if (section) params.set("section", section);
    const q = params.toString();
    const res = await fetch(`${url(parentId)}/search${q ? `?${q}` : ""}`, { cache: "no-store" });
    return parseJson(res);
  },
};
