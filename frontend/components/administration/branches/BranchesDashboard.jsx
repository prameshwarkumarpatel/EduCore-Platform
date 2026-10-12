"use client";
import React, { useState, useEffect } from 'react';
import { branchesApi } from '@/services/api/branchesApi';
import BranchListPanel from './BranchListPanel';
import AddBranchForm from './AddBranchForm';
import BranchUserAssignment from './BranchUserAssignment';
import BranchLocationPanel from './BranchLocationPanel';
import EditBranchForm from './EditBranchForm';
import ViewBranchProfile from './ViewBranchProfile';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Search, Edit3, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function BranchesDashboard() {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      const data = await branchesApi.fetchBranches();
      setBranches(data);
      if (data.length > 0 && !selectedBranch) setSelectedBranch(data[0]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Confirm destruction of this campus node? All linked data will be decentralized.")) return;
    try {
      await branchesApi.deleteBranch(id);
      loadBranches();
      setSelectedBranch(null);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredBranches = branches.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center animate-pulse">Initializing Multi-Campus Infrastructure...</div>;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-card p-4 rounded-xl border shadow-sm">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search campuses / codes..." 
              className="pl-10" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Initialize New Branch
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left: Branch List */}
        <div className="xl:col-span-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
          <BranchListPanel 
            branches={filteredBranches} 
            selectedId={selectedBranch?.id} 
            onSelect={setSelectedBranch} 
          />
        </div>

        {/* Right: Branch Details / Forms */}
        <div className="xl:col-span-8 space-y-6">
          {showAddForm ? (
            <AddBranchForm onCancel={() => setShowAddForm(false)} onSuccess={() => { setShowAddForm(false); loadBranches(); }} />
          ) : selectedBranch ? (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex justify-between items-center bg-card p-4 rounded-xl border border-blue-100 shadow-sm">
                 <div className="flex gap-4">
                   <Button 
                    variant={isEditing ? "default" : "outline"} 
                    onClick={() => setIsEditing(!isEditing)}
                    className="gap-2"
                   >
                     {isEditing ? <><Search className="w-4 h-4" /> View Hub</> : <><Edit3 className="w-4 h-4" /> Modify Node</>}
                   </Button>
                   <Button variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(selectedBranch.id)}>
                     <Trash2 className="w-4 h-4" />
                   </Button>
                 </div>
                 <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Active Connection: {selectedBranch.code}</p>
              </div>

              {isEditing ? (
                <EditBranchForm 
                  branch={selectedBranch} 
                  onCancel={() => setIsEditing(false)} 
                  onSuccess={() => { setIsEditing(false); loadBranches(); }} 
                />
              ) : (
                <>
                  <ViewBranchProfile branch={selectedBranch} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <BranchLocationPanel branch={selectedBranch} />
                    <BranchUserAssignment branch={selectedBranch} />
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="text-center p-20 bg-muted/20 rounded-2xl border-2 border-dashed">
              <p className="text-muted-foreground">Select a branch to view configurations or initialize a new one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
