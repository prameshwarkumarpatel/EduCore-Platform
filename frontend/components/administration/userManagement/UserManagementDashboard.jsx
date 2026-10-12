"use client";
import React, { useEffect, useMemo, useState } from "react";
import { userApi } from "@/services/api/userApi";
import UserLayout from "./layout/UserLayout";
import UserTopbar from "./layout/UserTopbar";
import UserSidebar from "./layout/UserSidebar";
import UserSearchFilter from "./UserSearchFilter";
import UserListPanel from "./UserListPanel";
import AddUserForm from "./AddUserForm";
import EditUserForm from "./EditUserForm";
import AssignRolePanel from "./AssignRolePanel";
import UserProfilePanel from "./UserProfilePanel";
import UserStatusToggle from "./UserStatusToggle";
import ViewUserDetails from "./ViewUserDetails";
import DeleteUserModal from "./DeleteUserModal";
import { Button } from "@/components/ui/button";
import { Edit3, Trash2 } from "lucide-react";

export default function UserManagementDashboard() {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [activeSection, setActiveSection] = useState("list");
  const [mode, setMode] = useState("view"); // view | add | edit

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [deleteOpen, setDeleteOpen] = useState(false);

  const activeCount = useMemo(() => users.filter((u) => u.isActive).length, [users]);

  const loadAll = async () => {
    setError("");
    setLoading(true);
    try {
      const [rolesData, usersData] = await Promise.all([userApi.fetchRoles(), userApi.fetchUsers()]);
      setRoles(Array.isArray(rolesData) ? rolesData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
      if (!selectedUser && Array.isArray(usersData) && usersData.length) setSelectedUser(usersData[0]);
    } catch (e) {
      setError(e?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshUsers = async () => {
    const usersData = await userApi.fetchUsers({
      search: searchQuery,
      role: roleFilter,
      status: statusFilter,
    });
    setUsers(Array.isArray(usersData) ? usersData : []);
  };

  useEffect(() => {
    if (loading) return;
    refreshUsers().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, roleFilter, statusFilter]);

  const filteredUsers = users;

  const selectUser = async (u) => {
    setError("");
    setSelectedUser(u);
    try {
      const details = await userApi.fetchUserDetails(u.id);
      setSelectedUser(details);
    } catch {
      // keep list item as fallback
    }
  };

  const handleCreateUser = async (payload) => {
    setBusy(true);
    setError("");
    try {
      await userApi.addUser(payload);
      setMode("view");
      setActiveSection("list");
      await refreshUsers();
    } catch (e) {
      setError(e?.message || "Failed to create user.");
      throw e;
    } finally {
      setBusy(false);
    }
  };

  const handleUpdateUser = async (id, payload) => {
    setBusy(true);
    setError("");
    try {
      await userApi.editUser(id, payload);
      await refreshUsers();
      const details = await userApi.fetchUserDetails(id);
      setSelectedUser(details);
      setMode("view");
    } catch (e) {
      setError(e?.message || "Failed to update user.");
      throw e;
    } finally {
      setBusy(false);
    }
  };

  const handleToggleStatus = async (nextActive) => {
    if (!selectedUser) return;
    setBusy(true);
    setError("");
    try {
      await userApi.toggleUserStatus(selectedUser.id, nextActive);
      await refreshUsers();
      const details = await userApi.fetchUserDetails(selectedUser.id);
      setSelectedUser(details);
    } catch (e) {
      setError(e?.message || "Failed to update status.");
    } finally {
      setBusy(false);
    }
  };

  const handleAssignRole = async (id, role) => {
    setBusy(true);
    setError("");
    try {
      await userApi.assignUserRole(id, role);
      await refreshUsers();
      const details = await userApi.fetchUserDetails(id);
      setSelectedUser(details);
    } catch (e) {
      setError(e?.message || "Failed to assign role.");
    } finally {
      setBusy(false);
    }
  };

  const handleUpdateProfile = async (id, payload) => {
    return handleUpdateUser(id, payload);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    setBusy(true);
    setError("");
    try {
      await userApi.deleteUser(selectedUser.id);
      setDeleteOpen(false);
      setSelectedUser(null);
      await refreshUsers();
    } catch (e) {
      setError(e?.message || "Failed to delete user.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center animate-pulse text-primary">Loading user management console...</div>;
  }

  return (
    <>
      <UserLayout
        topbar={
          <UserTopbar
            total={filteredUsers.length}
            activeCount={activeCount}
            onAddUser={() => {
              setMode("add");
              setActiveSection("addEdit");
            }}
          />
        }
        sidebar={<UserSidebar activeSection={activeSection} onSelectSection={setActiveSection} />}
      >
        {error ? (
          <div className="mb-6 rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div>
        ) : null}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-5 space-y-4">
            <UserSearchFilter
              roles={roles}
              searchQuery={searchQuery}
              onSearchQuery={setSearchQuery}
              role={roleFilter}
              onRole={setRoleFilter}
              status={statusFilter}
              onStatus={setStatusFilter}
            />
            <UserListPanel users={filteredUsers} selectedUserId={selectedUser?.id} onSelect={selectUser} />
          </div>

          <div className="xl:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border bg-card p-4 shadow-sm">
              <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">
                {selectedUser ? `Selected: ${selectedUser.email}` : "No user selected"}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="gap-2"
                  disabled={!selectedUser}
                  onClick={() => {
                    setMode("edit");
                    setActiveSection("addEdit");
                  }}
                >
                  <Edit3 className="h-4 w-4" /> Edit
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 text-destructive hover:bg-destructive/10"
                  disabled={!selectedUser}
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              </div>
            </div>

            {activeSection === "addEdit" ? (
              mode === "add" ? (
                <AddUserForm
                  roles={roles}
                  loading={busy}
                  onCancel={() => {
                    setMode("view");
                    setActiveSection("list");
                  }}
                  onSubmit={handleCreateUser}
                />
              ) : (
                <EditUserForm
                  key={selectedUser?.id || "no-user"}
                  user={selectedUser}
                  roles={roles}
                  loading={busy}
                  onSubmit={handleUpdateUser}
                />
              )
            ) : null}

            {activeSection === "roles" ? (
              <AssignRolePanel user={selectedUser} roles={roles} loading={busy} onAssignRole={handleAssignRole} />
            ) : null}

            {activeSection === "profile" ? (
              <UserProfilePanel
                key={selectedUser?.id || "no-user"}
                user={selectedUser}
                loading={busy}
                onUpdateProfile={handleUpdateProfile}
              />
            ) : null}

            {activeSection === "status" ? (
              <UserStatusToggle
                isActive={Boolean(selectedUser?.isActive)}
                disabled={!selectedUser || busy}
                onToggle={handleToggleStatus}
              />
            ) : null}

            {activeSection === "list" ? <ViewUserDetails user={selectedUser} /> : null}
          </div>
        </div>
      </UserLayout>

      <DeleteUserModal
        open={deleteOpen}
        user={selectedUser}
        loading={busy}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}

