import { useState, useEffect } from 'react';
import { DataTable } from '@/components/DataTable';
import { initialData, DataRow } from '@/lib/mockData';
import { LayoutDashboard, Database, Settings, User, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Home() {
  const STORAGE_KEY = 'excel-data-manager:data';

  const [data, setData] = useState<DataRow[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as DataRow[]) : initialData;
    } catch (e) {
      return initialData;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      // ignore localStorage write errors
    }
  }, [data]);

  return (
    <div className="min-h-screen flex bg-background font-sans text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Sidebar */}
      <aside className="w-64 hidden md:flex flex-col border-r border-sidebar-border bg-sidebar/50 backdrop-blur-xl fixed h-full z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20">
            E
          </div>
          <span className="font-bold text-lg tracking-tight">Excel Manager</span>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-3 font-medium text-muted-foreground hover:text-primary hover:bg-primary/5">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="secondary" className="w-full justify-start gap-3 font-medium bg-primary/10 text-primary hover:bg-primary/15 shadow-none border-0">
            <Database className="h-4 w-4" />
            Data Management
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 font-medium text-muted-foreground hover:text-primary hover:bg-primary/5">
            <User className="h-4 w-4" />
            Team Members
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 font-medium text-muted-foreground hover:text-primary hover:bg-primary/5">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors cursor-pointer">
            <Avatar className="h-9 w-9 border border-border">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Admin User</span>
              <span className="text-xs text-muted-foreground">admin@example.com</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
            <img 
                src="/images/hero-background.png" 
                alt="Background" 
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background"></div>
        </div>

        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-background/60 backdrop-blur-md border-b border-border/40">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Data Management</h1>
            <p className="text-sm text-muted-foreground">Manage your organization's data efficiently.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background"></span>
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 relative z-10 max-w-[1600px] mx-auto">
          <div className="glass-panel rounded-2xl p-6 shadow-xl shadow-black/5 ring-1 ring-black/5">
            <DataTable data={data} onUpdate={setData} />
          </div>
        </div>
      </main>
    </div>
  );
}
