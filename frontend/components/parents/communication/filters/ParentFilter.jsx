"use client";
import React from "react";
import RecipientSelector from "../send/RecipientSelector";

export default function ParentFilter({ valueIds, onChange }) {
  const ids = Array.isArray(valueIds) ? valueIds : valueIds ? [valueIds] : [];
  return (
    <RecipientSelector
      valueIds={ids}
      onChange={(next) => onChange?.(next?.slice(0, 1))}
      allowMultiple={false}
      placeholder="Search parent to view logs..."
    />
  );
}

