const orgService = require('../services/organizationService');

exports.getOrganizationSetupData = async (req, res) => {
  try {
    const [details, hierarchy, settings, policies] = await Promise.all([
      orgService.fetchOrganizationDetails(),
      orgService.fetchHierarchy(),
      orgService.fetchSettings(),
      orgService.fetchPolicies()
    ]);

    res.status(200).json({
      details,
      hierarchy,
      settings,
      policies
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrganizationDetails = async (req, res) => {
  try {
    const payload = req.body;
    const updated = await orgService.updateOrganizationDetailsState(payload);
    res.status(200).json({ message: "Organization details updated successfully!", data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addHierarchy = async (req, res) => {
  try {
    const newNode = await orgService.addHierarchyNode(req.body);
    res.status(201).json({ message: "Branch added!", data: newNode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addPolicy = async (req, res) => {
  try {
    const newPolicy = await orgService.addPolicy(req.body);
    res.status(201).json({ message: "Policy Enforced!", data: newPolicy });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
