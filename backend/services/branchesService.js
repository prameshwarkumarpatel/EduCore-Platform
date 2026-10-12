let branches = [
  { 
    id: "br-1", 
    name: "Main Campus (San Francisco)", 
    code: "CAMP-01", 
    status: "Active", 
    address: { street: "101 Market St", city: "San Francisco", state: "CA", zip: "94105" },
    contact: { phone: "+1 (555) 111-2222", email: "sf-campus@edupro.edu" }
  },
  { 
    id: "br-2", 
    name: "Sub-Campus (Los Angeles)", 
    code: "CAMP-02", 
    status: "Active", 
    address: { street: "505 Wilshire Blvd", city: "Los Angeles", state: "CA", zip: "90001" },
    contact: { phone: "+1 (555) 333-4444", email: "la-campus@edupro.edu" }
  },
  { 
    id: "br-3", 
    name: "Regional Wing (Chicago)", 
    code: "CAMP-03", 
    status: "Inactive", 
    address: { street: "303 Michigan Ave", city: "Chicago", state: "IL", zip: "60601" },
    contact: { phone: "+1 (555) 555-6666", email: "chi-campus@edupro.edu" }
  }
];

let assignments = [];

exports.getAllBranches = async () => branches;

exports.createBranch = async (payload) => {
  const newBranch = { 
    id: `br-${Date.now()}`, 
    ...payload, 
    status: payload.status || 'Active' 
  };
  branches.push(newBranch);
  return newBranch;
};

exports.updateBranch = async (id, payload) => {
  const index = branches.findIndex(b => b.id === id);
  if (index !== -1) {
    branches[index] = { ...branches[index], ...payload };
    return branches[index];
  }
  throw new Error("Branch not found");
};

exports.deleteBranch = async (id) => {
  branches = branches.filter(b => b.id !== id);
  return { success: true };
};

exports.assignUser = async (branchId, userId, role) => {
  const assignment = { branchId, userId, role, id: Date.now() };
  assignments.push(assignment);
  return assignment;
};

exports.getAssignments = async () => assignments;
