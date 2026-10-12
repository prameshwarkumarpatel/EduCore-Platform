"use client";
import React from "react";
import ClassCapacityBadge from "./ClassCapacityBadge";
import EditClassButton from "../actions/EditClassButton";
import DeleteClassButton from "../actions/DeleteClassButton";

export default function ClassRow({ row, onEdit, onDelete }) {
  return (
    <tr className="border-b">
      <td className="py-2 font-medium">{row.name}</td>
      <td className="py-2">{row.sectionsCount}</td>
      <td className="py-2"><ClassCapacityBadge studentCount={row.studentCount} sectionsCount={row.sectionsCount} /></td>
      <td className="py-2 flex gap-2 justify-end">
        <EditClassButton onClick={() => onEdit(row)} />
        <DeleteClassButton onClick={() => onDelete(row)} />
      </td>
    </tr>
  );
}
