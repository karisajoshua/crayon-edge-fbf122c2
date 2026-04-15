import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, FileText, Image, FolderOpen, LogOut, Archive,
  MessageSquare, Mail, Inbox, Wrench, Menu, X, ChevronLeft
} from "lucide-react";
import logo from "@/assets/crayonedge_logo.webp";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/posts", icon: FileText, label: "Posts" },
  { to: "/admin/media", icon: Image, label: "Media" },
  { to: "/admin/categories", icon: FolderOpen, label: "Categories" },
  { to: "/admin/archive", icon: Archive, label: "Archive" },
  { to: "/admin/comments", icon: MessageSquare, label: "Comments" },
  { to: "/admin/subscribers", icon: Mail, label: "Subscribers" },
  { to: "/admin/messages", icon: Inbox, label: "Messages" },
  { to: "/admin/toolkit", icon: Wrench, label: "Toolkit" },
];

const AdminLayout = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isActive = (path: string, end?: boolean) => {
    if (end) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <nav className="flex flex-col gap-1 p-3">
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={() => setMobileOpen(false)}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            isActive(item.to, item.end)
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <item.icon className="w-4 h-4 flex-shrink-0" />
          {sidebarOpen && <span>{item.label}</span>}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      {/* Top bar */}
      <header className="bg-background border-b sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <ChevronLeft className={cn("w-5 h-5 transition-transform", !sidebarOpen && "rotate-180")} />
            </Button>
            <Link to="/" className="flex items-center">
              <img src={logo} alt="CrayonEdge Admin" className="h-8 w-auto" />
            </Link>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <aside className={cn(
          "hidden md:flex flex-col border-r bg-background transition-all duration-200 sticky top-[57px] h-[calc(100vh-57px)]",
          sidebarOpen ? "w-56" : "w-[60px]"
        )}>
          <div className="flex-1 overflow-y-auto">
            <SidebarContent />
          </div>
        </aside>

        {/* Mobile sidebar overlay */}
        {mobileOpen && (
          <>
            <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
            <aside className="fixed left-0 top-[57px] bottom-0 w-56 bg-background border-r z-50 md:hidden overflow-y-auto">
              <SidebarContent />
            </aside>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 p-4 md:p-8 min-w-0">
          <Outlet />
        </main>
      </div>

      <footer className="py-4 text-center text-sm text-muted-foreground border-t bg-background">
        Powered by Texcortech Systems
      </footer>
    </div>
  );
};

export default AdminLayout;
