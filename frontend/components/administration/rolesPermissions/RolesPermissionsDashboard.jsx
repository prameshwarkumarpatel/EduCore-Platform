"use client";
import React, { useEffect, useState } from "react";
import { rolesApi } from "@/services/api/rolesApi";
import RolesLayout from "./layout/RolesLayout";
import RolesTopbar from "./layout/RolesTopbar";
import RolesSidebar from "./layout/RolesSidebar";
import RolesListPanel from "./RolesListPanel";
import CreateRoleForm from "./CreateRoleForm";
import EditRoleForm from "./EditRoleForm";
import PermissionMatrix from "./PermissionMatrix";
import ModuleAccessControl from "./ModuleAccessControl";
import RoleRestrictionsPanel from "./RoleRestrictionsPanel";
import ViewRoleDetails from "./ViewRoleDetails";
import DeleteRoleModal from "./DeleteRoleModal";
import { Button } from "@/components/ui/button";
import { Edit3, Trash2 } from "lucide-react";

export default function RolesPermissionsDashboard() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState("list");
  const [mode, setMode] = useState("view"); // view | create | edit
  const [deleteOpen, setDeleteOpen] = useState(false);

  const loadAll = async () => {
    setError("");
    setLoading(true);
    try {
      const [roleList, perms] = await Promise.all([rolesApi.fetchRoles(), rolesApi.fetchPermissions()]);
      setRoles(Array.isArray(roleList) ? roleList : []);
      setPermissions(Array.isArray(perms) ? perms : []);
      if (!selectedRole && roleList && roleList.length) {
        setSelectedRole(roleList[0]);
      }
    } catch (e) {
      setError(e?.message || "Failed to load roles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshRoles = async (query) => {
    const list = await rolesApi.fetchRoles({ search: query ?? search });
    setRoles(Array.isArray(list) ? list : []);
  };

  const selectRole = async (role) => {
    setError("");
    setSelectedRole(role);
    try {
      const details = await rolesApi.fetchRoleDetails(role.id);
      setSelectedRole(details);
    } catch {
      // keep list copy
    }
  };

  const handleCreateRole = async (payload) => {
    setBusy(true);
    setError("");
    try {
      await rolesApi.createRole(payload);
      setMode("view");
      setActiveSection("list");
      await refreshRoles("");
    } catch (e) {
      setError(e?.message || "Failed to create role.");
      throw e;
    } finally {
      setBusy(false);
    }
  };

  const handleUpdateRole = async (id, payload) => {
    setBusy(true);
    setError("");
    try {
      await rolesApi.editRole(id, payload);
      await refreshRoles();
      const details = await rolesApi.fetchRoleDetails(id);
      setSelectedRole(details);
      setMode("view");
    } catch (e) {
      setError(e?.message || "Failed to update role.");
      throw e;
    } finally {
      setBusy(false);
    }
  };

  const handleAssignPermissions = async (id, permissionKeys) => {
    setBusy(true);
    setError("");
    try {
      await rolesApi.assignPermissions(id, permissionKeys);
      await refreshRoles();
      const details = await rolesApi.fetchRoleDetails(id);
      setSelectedRole(details);
    } catch (e) {
      setError(e?.message || "Failed to update permissions.");
    } finally {
      setBusy(false);
    }
  };

  const handleUpdateModules = async (id, modules) => {
    return handleUpdateRole(id, { modules });
  };

  const handleUpdateRestrictions = async (id, restrictions) => {
    return handleUpdateRole(id, { restrictions });
  };

  const handleDeleteRole = async () => {
    if (!selectedRole) return;
    setBusy(true);
    setError("");
    try {
      await rolesApi.deleteRole(selectedRole.id);
      setDeleteOpen(false);
      setSelectedRole(null);
      await refreshRoles();
    } catch (e) {
      setError(e?.message || "Failed to delete role.");
    } finally {
      setBusy(false);
    }
  };

  const filteredRoles = roles;

  if (loading) {
    return <div className="p-10 text-center animate-pulse text-primary">Loading roles &amp; permissions grid...</div>;
  }

  return (
    <>
      <RolesLayout
        topbar={
          <RolesTopbar
            total={filteredRoles.length}
            onCreateRole={() => {
              setMode("create");
              setActiveSection("edit");
            }}
          />
        }
        sidebar={<RolesSidebar activeSection={activeSection} onSelectSection={setActiveSection} />}
      >
        {error ? (
          <div className="mb-6 rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4 text-sm text-rose-300">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-5 space-y-4">
            <RolesListPanel
              roles={filteredRoles}
              selectedRoleId={selectedRole?.id}
              onSelect={selectRole}
              search={search}
              onSearch={(value) => {
                setSearch(value);
                refreshRoles(value).catch(() => {});
              }}
            />
          </div>

          <div className="xl:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border bg-card p-4 shadow-sm">
              <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">
                {selectedRole ? `Selected: ${selectedRole.name}` : "No role selected"}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="gap-2"
                  disabled={!selectedRole}
                  onClick={() => {
                    setMode("edit");
                    setActiveSection("edit");
                  }}
                >
                  <Edit3 className="h-4 w-4" /> Edit
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 text-destructive hover:bg-destructive/10"
                  disabled={!selectedRole}
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              </div>
            </div>

            {activeSection === "edit" ? (
              mode === "create" ? (
                <CreateRoleForm
                  loading={busy}
                  onCancel={() => {
                    setMode("view");
                    setActiveSection("list");
                  }}
                  onSubmit={handleCreateRole}
                />
              ) : (
                <EditRoleForm role={selectedRole} loading={busy} onSubmit={handleUpdateRole} />
              )
            ) : null}

            {activeSection === "matrix" ? (
              <PermissionMatrix
                permissions={permissions}
                selectedKeys={selectedRole?.permissions || []}
                onChange={(keys) => selectedRole && handleAssignPermissions(selectedRole.id, keys)}
              />
            ) : null}

            {activeSection === "modules" ? (
              <ModuleAccessControl
                modules={selectedRole?.modules || []}
                loading={busy}
                onChange={(mods) => selectedRole && handleUpdateModules(selectedRole.id, mods)}
              />
            ) : null}

            {activeSection === "restrictions" ? (
              <RoleRestrictionsPanel
                role={selectedRole}
                loading={busy}
                onUpdateRestrictions={handleUpdateRestrictions}
              />
            ) : null}

            {activeSection === "list" ? (
              <ViewRoleDetails role={selectedRole} permissions={permissions} />
            ) : null}
          </div>
        </div>
      </RolesLayout>

      <DeleteRoleModal
        open={deleteOpen}
        role={selectedRole}
        loading={busy}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteRole}
      />
    </>
  );
}

