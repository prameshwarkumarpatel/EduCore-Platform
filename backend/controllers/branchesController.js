const branchService = require('../services/branchesService');

exports.listBranches = async (req, res) => {
  try {
    const branches = await branchService.getAllBranches();
    res.status(200).json(branches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addBranch = async (req, res) => {
  try {
    const newBranch = await branchService.createBranch(req.body);
    res.status(201).json({ message: "Branch successfully added!", data: newBranch });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.editBranch = async (req, res) => {
  try {
    const updated = await branchService.updateBranch(req.params.id, req.body);
    res.status(200).json({ message: "Branch updated!", data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeBranch = async (req, res) => {
  try {
    await branchService.deleteBranch(req.params.id);
    res.status(200).json({ message: "Branch deleted!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.assignUsers = async (req, res) => {
  try {
    const { branchId, userId, role } = req.body;
    const assignment = await branchService.assignUser(branchId, userId, role);
    res.status(201).json({ message: "User assigned to branch!", data: assignment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
