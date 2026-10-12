"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Share2, Network, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { organizationApi } from '@/services/api/organizationApi';

const HierarchyNode = ({ node }) => (
  <div className="ml-6 mt-3 relative before:absolute before:-left-4 before:top-4 before:h-full before:w-px before:bg-purple-300/30 last:before:hidden">
    <div className="flex items-center gap-3">
      <div className="p-1.5 bg-purple-500/20 text-purple-100 rounded-md border border-purple-400/30">
        <Network className="w-4 h-4" />
      </div>
      <p className="text-sm font-semibold tracking-wide">{node.level}</p>
    </div>
    {node.children && (
      <div className="ml-1 relative before:absolute before:-left-[15px] before:top-0 before:h-5 before:w-4 before:-mt-3 before:border-l before:border-b before:border-purple-300/30 before:rounded-bl-xl">
        {node.children.map(child => <HierarchyNode key={child.id} node={child} />)}
      </div>
    )}
  </div>
);

export default function HierarchyConfigPanel({ hierarchy }) {
  const [nodes, setNodes] = useState(hierarchy || []);

  const handleAddBranch = async () => {
    const branchName = prompt("Enter new Branch/Node name:");
    if (!branchName) return;
    try {
      const response = await organizationApi.addHierarchy(branchName);
      if (response && response.data) {
        setNodes([...nodes, response.data]);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to add branch");
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-800 to-indigo-900 border-none shadow-xl text-white relative h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-xl flex items-center gap-2 font-bold tracking-tight">
          <Share2 className="w-5 h-5 text-purple-300" />
          Structural Hierarchy
        </CardTitle>
        <Button onClick={handleAddBranch} size="sm" variant="outline" className="h-8 bg-purple-900/50 text-purple-100 border-purple-500/50 hover:bg-white hover:text-purple-900">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Branch
        </Button>
      </CardHeader>
      <CardContent className="bg-black/20 m-6 mt-0 rounded-xl p-6 border border-purple-500/20 shadow-inner">
        {nodes?.map(h => <HierarchyNode key={h.id} node={h} />)}
      </CardContent>
    </Card>
  );
}
