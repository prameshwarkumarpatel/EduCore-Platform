const BASE_URL = 'http://localhost:5000/api/administration';

export const administrationApi = {
  fetchDashboardData: async () => {
    const res = await fetch(`${BASE_URL}/dashboard-data`);
    return res.json();
  }
};
