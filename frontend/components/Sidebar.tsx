"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, Building, UserPlus, Users, UsersRound, GraduationCap, 
  BookOpen, CalendarClock, CalendarDays, FileText, Banknote, BadgeCheck, 
  MessageSquare, PartyPopper, LifeBuoy, BarChart, Bot, Link2, ShieldCheck, 
  Settings, UserCircle, HelpCircle, LogOut, ChevronDown, ChevronRight, Menu
} from 'lucide-react';
import { useSchoolProfile } from '@/context/SchoolProfileContext';

const MENU_ITEMS = [
  {
    title: 'Dashboard', icon: LayoutDashboard, href: '/dashboard',
    subItems: [
      { title: 'Overview', href: '/dashboard' },
      { title: 'KPI Metrics', href: '/dashboard#kpi' },
      { title: 'Recent Activities', href: '/dashboard#activities' },
      { title: 'Notifications', href: '/dashboard#notifications' },
      { title: 'Quick Actions', href: '/dashboard#actions' }
    ]
  },
  {
    title: 'Administration', icon: Building, href: '/dashboard/administration',
    subItems: [
      { title: 'Organization Setup', href: '/dashboard/administration/organization-setup' },
      { title: 'School Profile', href: '/dashboard/administration/school-profile' },
      { title: 'Branches/Campuses', href: '/dashboard/administration/branches' },
      { title: 'User Management', href: '/dashboard/administration/users' },
      { title: 'Roles & Permissions', href: '/dashboard/administration/roles-permissions' },
      { title: 'Academic Year Setup', href: '/dashboard/administration/academic-year' }
    ]
  },
  {
    title: 'Admissions', icon: UserPlus, href: '/admissions/dashboard',
    subItems: [
      { title: 'Admission Dashboard', href: '/admissions/dashboard' },
      { title: 'New Application', href: '/admissions/new-application' },
      { title: 'Application Tracking', href: '/admissions/application-tracking' },
      { title: 'Document Verification', href: '/admissions/document-verification' },
      { title: 'Approval', href: '/admissions/approval' },
      { title: 'Enrollment Records', href: '/admissions/enrollment' }
    ]
  },
  {
    title: 'Student Mgmt', icon: Users, href: '/students/dashboard',
    subItems: [
      { title: 'Dashboard', href: '/students/dashboard' },
      { title: 'Directory', href: '/students/directory' },
      { title: 'Add/Edit', href: '/students/add-edit' },
      { title: 'Profile', href: '#' },
      { title: 'Academic History', href: '/students/academic-history' },
      { title: 'Attendance', href: '/students/attendance' },
      { title: 'Behavior/Discipline', href: '/students/behavior' },
      { title: 'Medical Records', href: '/students/medical' },
      { title: 'Leave Requests', href: '/students/leave' }
    ]
  },
  {
    title: 'Parent Mgmt', icon: UsersRound,
    href: '/parents/dashboard',
    subItems: [
      { title: 'Directory', href: '/parents/directory' },
      { title: 'Profile', href: '/parents/profile' },
      { title: 'Linked Students', href: '/parents/linked-students' },
      { title: 'Communication Logs', href: '/parents/communication' }
    ]
  },
  {
    title: 'Teacher & Staff', icon: GraduationCap, href: '/staff/dashboard',
    subItems: [
      { title: 'Dashboard', href: '/staff/dashboard' },
      { title: 'Directory', href: '/staff/directory' },
      { title: 'Add Staff', href: '/staff/add' },
      { title: 'Departments', href: '/staff/departments' },
      { title: 'Subject Allocation', href: '/staff/subject-allocation' },
      { title: 'Workload', href: '/staff/workload' },
      { title: 'Attendance', href: '/staff/attendance' },
      { title: 'Payroll', href: '/staff/dashboard' }
    ]
  },
  {
    title: 'Academic Mgmt', icon: BookOpen, href: '/academic/dashboard',
    subItems: [
      { title: 'Dashboard', href: '/academic/dashboard' },
      { title: 'Classes & Sections', href: '/academic/dashboard' },
      { title: 'Subjects', href: '/academic/dashboard' },
      { title: 'Curriculum/Syllabus', href: '/academic/dashboard' },
      { title: 'Lesson Planning', href: '/academic/dashboard' },
      { title: 'Study Materials', href: '/academic/dashboard' },
      { title: 'Homework/Assignments', href: '/academic/dashboard' },
      { title: 'Online Resources', href: '/academic/dashboard' }
    ]
  },
  {
    title: 'Timetable & Scheduling', icon: CalendarClock,
    subItems: [
      { title: 'Class Timetable', href: '#' },
      { title: 'Teacher Schedule', href: '#' },
      { title: 'Room Allocation', href: '#' },
      { title: 'Substitute Mgmt', href: '#' },
      { title: 'Calendar View', href: '#' }
    ]
  },
  {
    title: 'Attendance Mgmt', icon: CalendarDays,
    subItems: [
      { title: 'Mark Attendance', href: '/students/attendance' },
      { title: 'Bulk Attendance', href: '/students/attendance' },
      { title: 'Student Reports', href: '/students/attendance' },
      { title: 'Staff Attendance', href: '/students/attendance' },
      { title: 'Absentee Alerts', href: '/students/attendance' }
    ]
  },
  {
    title: 'Exam & Results', icon: FileText,
    subItems: [
      { title: 'Exam Planning', href: '#' },
      { title: 'Schedule', href: '#' },
      { title: 'Hall Tickets', href: '#' },
      { title: 'Marks Entry', href: '#' },
      { title: 'Grading System', href: '#' },
      { title: 'Result Processing', href: '#' },
      { title: 'Report Cards', href: '#' },
      { title: 'Rank List', href: '#' }
    ]
  },
  {
    title: 'Fees & Finance', icon: Banknote,
    subItems: [
      { title: 'Fee Structure', href: '#' },
      { title: 'Fee Assignment', href: '#' },
      { title: 'Fee Collection', href: '#' },
      { title: 'Payment Methods', href: '#' },
      { title: 'Scholarships/Discounts', href: '#' },
      { title: 'Refund Mgmt', href: '#' },
      { title: 'Expense Tracking', href: '#' },
      { title: 'Financial Reports', href: '#' }
    ]
  },
  {
    title: 'ID Card Mgmt', icon: BadgeCheck, href: '/dashboard/id-cards',
    subItems: [
      { title: 'Generate ID Card', href: '/dashboard/id-cards' },
      { title: 'Bulk ID Generation', href: '#' },
      { title: 'Upload Photos', href: '#' },
      { title: 'Template Design', href: '#' },
      { title: 'QR/Barcode Setup', href: '#' },
      { title: 'Print/Download', href: '#' },
      { title: 'Reissue Cards', href: '#' }
    ]
  },
  {
    title: 'Communication', icon: MessageSquare,
    subItems: [
      { title: 'Send Notifications', href: '#' },
      { title: 'SMS/Email Broadcast', href: '#' },
      { title: 'Announcements', href: '#' },
      { title: 'Circulars', href: '#' },
      { title: 'Chat/Messaging', href: '#' },
      { title: 'Parent-Teacher Comm', href: '#' }
    ]
  },
  {
    title: 'Events & Activities', icon: PartyPopper,
    subItems: [
      { title: 'Event Creation', href: '#' },
      { title: 'Event Calendar', href: '#' },
      { title: 'Participation', href: '#' },
      { title: 'Competitions', href: '#' },
      { title: 'Clubs/Activities', href: '#' }
    ]
  },
  {
    title: 'Support Systems', icon: LifeBuoy,
    subItems: [
      { title: 'Library Mgmt', href: '#' },
      { title: 'Transport (Routes, Tracking)', href: '#' },
      { title: 'Hostel (Rooms, Attendance)', href: '#' },
      { title: 'Inventory (Assets, Stock)', href: '#' }
    ]
  },
  {
    title: 'Reports & Analytics', icon: BarChart,
    subItems: [
      { title: 'Student Reports', href: '#' },
      { title: 'Attendance', href: '#' },
      { title: 'Academic Performance', href: '#' },
      { title: 'Financial', href: '#' },
      { title: 'Custom', href: '#' },
      { title: 'Data Export', href: '#' }
    ]
  },
  {
    title: 'Automation', icon: Bot,
    subItems: [
      { title: 'Workflow Builder', href: '#' },
      { title: 'Auto Notifications', href: '#' },
      { title: 'Auto Timetable', href: '#' },
      { title: 'Auto ID Generation', href: '#' },
      { title: 'Scheduled Tasks', href: '#' }
    ]
  },
  {
    title: 'Integrations', icon: Link2,
    subItems: [
      { title: 'Payment Gateway', href: '#' },
      { title: 'SMS Gateway', href: '#' },
      { title: 'Email Services', href: '#' },
      { title: 'Third-party APIs', href: '#' }
    ]
  },
  {
    title: 'Security & Access', icon: ShieldCheck,
    subItems: [
      { title: 'Role-based Access', href: '#' },
      { title: 'User Permissions', href: '#' },
      { title: 'Login Activity', href: '#' },
      { title: 'Audit Logs', href: '#' },
      { title: 'Data Backup', href: '#' }
    ]
  },
  {
    title: 'Settings', icon: Settings,
    subItems: [
      { title: 'General Settings', href: '#' },
      { title: 'School Branding', href: '#' },
      { title: 'ID Card Design Settings', href: '#' },
      { title: 'System Preferences', href: '#' },
      { title: 'Localization', href: '#' }
    ]
  },
  {
    title: 'User Profile', icon: UserCircle,
    subItems: [
      { title: 'My Profile', href: '#' },
      { title: 'Account Settings', href: '#' },
      { title: 'Change Password', href: '#' },
      { title: 'Notifications Settings', href: '#' }
    ]
  },
  {
    title: 'Help & Support', icon: HelpCircle,
    subItems: [
      { title: 'Help Center', href: '#' },
      { title: 'Tutorials', href: '#' },
      { title: 'Contact Support', href: '#' },
      { title: 'Feedback', href: '#' }
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useSchoolProfile();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(MENU_ITEMS.map(m => m.title));

  const toggleMenu = (title: string) => {
    setExpandedMenus(prev => 
      prev.includes(title) ? prev.filter(m => m !== title) : [...prev, title]
    );
    if (isCollapsed) setIsCollapsed(false);
  };

  return (
    <motion.aside 
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="border-r bg-card flex flex-col h-full shadow-sm relative z-30 transition-all duration-300 ease-in-out"
    >
      <div className="p-4 border-b flex items-center justify-between h-16 shrink-0">
        <div className={cn("flex items-center gap-3 overflow-hidden", isCollapsed && "justify-center w-full")}>
          <div className="bg-primary text-primary-foreground p-2 rounded-lg shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          {!isCollapsed && (
            <h1 className="font-bold text-xl tracking-tight text-foreground whitespace-nowrap">
              {profile?.name ? profile.name : "EduPro ERP"}
            </h1>
          )}
        </div>
        {!isCollapsed && (
          <button 
            onClick={() => setIsCollapsed(true)} 
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {isCollapsed && (
        <button 
          onClick={() => setIsCollapsed(false)} 
          className="absolute top-4 right-[-12px] bg-card border shadow-sm rounded-full p-1 z-40 text-primary hover:bg-primary/10"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {!isCollapsed && <div className="text-[10px] font-bold text-muted-foreground mb-3 uppercase tracking-widest px-3 mt-2">Core Modules</div>}
        
        {MENU_ITEMS.map((item) => {
          const isExpanded = expandedMenus.includes(item.title);
          const hasActiveChild = item.href ? pathname === item.href : false; // basic check, expand in real app based on nested routes
          const Icon = item.icon;

          return (
            <div key={item.title} className="mb-1">
              {item.href && !item.subItems ? (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                    hasActiveChild 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    isCollapsed && "justify-center px-0"
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  <Icon className={cn("w-5 h-5 shrink-0", hasActiveChild ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground transition-colors")} />
                  {!isCollapsed && <span className="truncate">{item.title}</span>}
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => {
                      toggleMenu(item.title);
                      if (item.href) router.push(item.href);
                    }}
                    className={cn(
                      "flex items-center w-full gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                      isExpanded && !isCollapsed ? "text-primary bg-primary/5" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      isCollapsed && "justify-center px-0"
                    )}
                    title={isCollapsed ? item.title : undefined}
                  >
                    <Icon className={cn("w-5 h-5 shrink-0", isExpanded && !isCollapsed ? "text-primary" : "text-muted-foreground group-hover:text-foreground transition-colors")} />
                    {!isCollapsed && (
                      <span className="flex-1 text-left truncate">{item.title}</span>
                    )}
                    {!isCollapsed && (
                      <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isExpanded ? "rotate-180" : "")} />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {isExpanded && !isCollapsed && item.subItems && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-11 pr-3 py-1 space-y-1 mt-1 border-l-2 border-muted ml-5">
                          {item.subItems.map((sub, idx) => (
                            <Link
                              key={idx}
                              href={sub.href}
                              className="block py-1.5 px-2 text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 rounded transition-colors truncate"
                            >
                              {sub.title}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          );
        })}

        <div className="mt-8 mb-4 border-t pt-4">
          <button className={cn("flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-all", isCollapsed && "justify-center px-0")} title={isCollapsed ? "Logout" : undefined}>
            <LogOut className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </nav>
    </motion.aside>
  );
}
