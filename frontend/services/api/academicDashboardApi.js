const BASE_URL = "http://localhost:5000/api/academic-dashboard";

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

export const academicDashboardApi = {
  fetchAcademicOverview: async () => parseJson(await fetch(`${BASE_URL}/overview`, { cache: "no-store" })),
  fetchCurriculumProgress: async () => parseJson(await fetch(`${BASE_URL}/curriculum`, { cache: "no-store" })),
  fetchLessonPlanningStats: async () => parseJson(await fetch(`${BASE_URL}/lesson-planning`, { cache: "no-store" })),
  fetchHomeworkStatus: async () => parseJson(await fetch(`${BASE_URL}/homework`, { cache: "no-store" })),
  fetchAcademicActivities: async () => parseJson(await fetch(`${BASE_URL}/activities`, { cache: "no-store" })),
  fetchPerformanceInsights: async () => parseJson(await fetch(`${BASE_URL}/insights`, { cache: "no-store" })),
  fetchStudyMaterialSummary: async () => parseJson(await fetch(`${BASE_URL}/materials`, { cache: "no-store" })),
};
