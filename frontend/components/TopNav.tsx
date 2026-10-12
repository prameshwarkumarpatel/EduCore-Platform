"use client";
import { Bell, Search, Menu, UserCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useSchoolProfile } from '@/context/SchoolProfileContext';

export default function TopNav() {
  const { profile } = useSchoolProfile();
  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
        <div className="hidden md:flex items-center gap-2 min-w-0">
          {profile?.logo_url ? (
            <img
              src={profile.logo_url}
              alt="School Logo"
              className="h-8 w-8 rounded-lg border border-border object-contain bg-background p-1"
            />
          ) : (
            <div className="h-8 w-8 rounded-lg border border-border bg-muted flex items-center justify-center text-muted-foreground">
              <UserCircle className="h-5 w-5" />
            </div>
          )}
          <div className="min-w-0">
            <div className="text-sm font-semibold leading-none truncate">{profile?.name || "School"}</div>
            <div className="text-[11px] text-muted-foreground truncate">{profile?.motto || "School Management System"}</div>
          </div>
        </div>
        <div className="relative hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search students, teachers, or classes..." 
            className="w-[300px] pl-9 bg-muted/50 border-transparent focus:bg-background transition-colors"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full animate-pulse" />
        </Button>
        
        <div className="h-8 w-[1px] bg-border mx-1" />
        
        <div className="flex items-center gap-2 cursor-pointer hover:bg-muted p-1.5 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm border border-primary/30">
            AD
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-semibold leading-none">Admin User</span>
            <span className="text-xs text-muted-foreground mt-0.5">Super Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}
