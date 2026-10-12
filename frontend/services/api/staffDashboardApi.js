const BASE_URL = "http://localhost:5000/api/staff";

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

export const staffDashboardApi = {
  fetchStaffStats: async () => parseJson(await fetch(`${BASE_URL}/stats`, { cache: "no-store" })),
  fetchWorkload: async () => parseJson(await fetch(`${BASE_URL}/workload`, { cache: "no-store" })),
  fetchAttendance: async () => parseJson(await fetch(`${BASE_URL}/attendance`, { cache: "no-store" })),
  fetchPayrollSummary: async () => parseJson(await fetch(`${BASE_URL}/payroll-summary`, { cache: "no-store" })),
  fetchActivities: async () => parseJson(await fetch(`${BASE_URL}/activities`, { cache: "no-store" })),
  fetchPendingTasks: async () => parseJson(await fetch(`${BASE_URL}/pending-tasks`, { cache: "no-store" })),
};

