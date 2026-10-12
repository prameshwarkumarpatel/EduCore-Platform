const BASE_URL = 'http://localhost:5000/api/branches';

export const branchesApi = {
  fetchBranches: async () => {
    const res = await fetch(BASE_URL);
    return res.json();
  },
  addBranch: async (payload) => {
    const res = await fetch(`${BASE_URL}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },
  editBranch: async (id, payload) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },
  deleteBranch: async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },
  assignUsers: async (payload) => {
    const res = await fetch(`${BASE_URL}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  }
};
