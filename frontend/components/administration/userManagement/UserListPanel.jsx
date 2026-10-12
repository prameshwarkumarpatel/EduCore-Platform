"use client";
import React from "react";
import UserCard from "./UserCard";

export default function UserListPanel({ users, selectedUserId, onSelect }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-sky-500/10 to-indigo-600/10 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">User List</div>
          <div className="text-sm text-muted-foreground mt-1">
            Showing <span className="font-semibold text-foreground">{users.length}</span> users
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3 max-h-[760px] overflow-y-auto pr-2 custom-scrollbar">
        {users.map((u) => (
          <UserCard key={u.id} user={u} selected={u.id === selectedUserId} onSelect={onSelect} />
        ))}
        {users.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground border-2 border-dashed rounded-2xl p-10 bg-background/30">
            No users found for the current filters.
          </div>
        ) : null}
      </div>
    </div>
  );
}

