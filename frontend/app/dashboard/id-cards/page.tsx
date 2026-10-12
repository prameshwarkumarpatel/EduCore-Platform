"use client";
import { useState } from 'react';
import { BadgeCheck, CreditCard, Printer, Settings, Users, Download, Plus, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function IdCardManagement() {
  const [activeTab, setActiveTab] = useState('generate');
  
  // Mock data for preview
  const mockPreviewStudent = {
    name: "John Doe",
    id: "SCH2026-001",
    role: "Student",
    class: "Grade 10 - A",
    dob: "12/04/2010",
    blood: "O+",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=John&backgroundColor=c0aede",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">ID Card Management</h2>
          <p className="text-muted-foreground mt-1">Automated student and staff ID card generation system.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Settings className="w-4 h-4" /> Templates
          </Button>
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
            <Plus className="w-4 h-4" /> Batch Generate
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Actions and Selection */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex gap-2 p-1 bg-muted/50 rounded-lg w-fit">
            <button 
              onClick={() => setActiveTab('generate')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'generate' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Generate Cards
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'history' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Print History
            </button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Select Recipients</CardTitle>
              <CardDescription>Search and select students or staff to generate IDs.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search by name, ID, or class..." className="pl-9" />
                </div>
                <Button variant="secondary">Filter</Button>
              </div>

              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="p-3 text-left font-medium w-10"><input type="checkbox" className="rounded border-input" /></th>
                      <th className="p-3 text-left font-medium">User Details</th>
                      <th className="p-3 text-left font-medium">Role / Class</th>
                      <th className="p-3 text-left font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3].map((item) => (
                      <tr key={item} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="p-3"><input type="checkbox" className="rounded border-input" /></td>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item}&backgroundColor=b6e3f4`} alt="avatar" className="w-8 h-8 rounded-full border bg-background" />
                            <div>
                              <p className="font-medium text-foreground">Student Name {item}</p>
                              <p className="text-xs text-muted-foreground">SCH2026-00{item}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-muted-foreground">Grade 10 - A</td>
                        <td className="p-3"><span className="px-2 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-500 rounded-full">Photo Verified</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Data Preview */}
        <div className="space-y-6">
          <Card className="border-2 border-primary/20 bg-gradient-to-b from-background to-muted/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" /> Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Actual ID Card Visualizer Rendering */}
              <div className="relative w-[280px] h-[400px] mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 flex flex-col items-center">
                {/* ID Header / Banner */}
                <div className="w-full h-24 bg-indigo-600 flex flex-col items-center justify-center p-4">
                  <h3 className="text-white font-bold text-lg tracking-wider">EduPro Academy</h3>
                  <p className="text-indigo-100 text-[10px] uppercase tracking-widest mt-0.5">Excellence in Education</p>
                </div>
                
                {/* Profile Picture */}
                <div className="relative -mt-10">
                  <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-100 shadow-md overflow-hidden">
                    <img src={mockPreviewStudent.photo} alt="Student" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 w-full p-5 flex flex-col items-center text-center">
                  <h2 className="text-xl font-bold text-gray-800">{mockPreviewStudent.name}</h2>
                  <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mt-1">{mockPreviewStudent.role}</p>
                  
                  <div className="w-full mt-4 space-y-2 text-left bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 font-medium">ID Number</span>
                      <span className="text-gray-800 font-bold">{mockPreviewStudent.id}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 font-medium">Class/Section</span>
                      <span className="text-gray-800 font-bold">{mockPreviewStudent.class}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 font-medium">DOB / Blood</span>
                      <span className="text-gray-800 font-bold">{mockPreviewStudent.dob} &middot; {mockPreviewStudent.blood}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Bar / QR Space */}
                <div className="w-full p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <div className="w-12 h-12 bg-white border border-gray-200 rounded p-1">
                    {/* Placeholder for QR Code */}
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SCH2026-001" alt="QR Code" className="w-full h-full opacity-80" />
                  </div>
                  <div className="text-right">
                    <div className="h-6 w-16 border-b border-gray-400 mb-1 ml-auto"></div>
                    <p className="text-[9px] text-gray-500 font-medium uppercase">Principal Signature</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Printer className="w-4 h-4" /> Print Selected
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Download className="w-4 h-4" /> Export PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
