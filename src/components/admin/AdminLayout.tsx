import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, FileText, Image, FolderOpen, LogOut, Users, Archive, MessageSquare } from "lucide-react";
import logo from "@/assets/crayonedge_logo.webp";

const AdminLayout = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-muted">
      <nav className="bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center">
                <img 
                  src={logo} 
                  alt="CrayonEdge Admin Dashboard" 
                  className="h-10 w-auto"
                />
              </Link>
              <div className="hidden md:flex gap-4">
                <Link to="/admin">
                  <Button variant="ghost" size="sm">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/admin/posts">
                  <Button variant="ghost" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Posts
                  </Button>
                </Link>
                <Link to="/admin/media">
                  <Button variant="ghost" size="sm">
                    <Image className="w-4 h-4 mr-2" />
                    Media
                  </Button>
                </Link>
                <Link to="/admin/categories">
                  <Button variant="ghost" size="sm">
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Categories
                  </Button>
                </Link>
                <Link to="/admin/archive">
                  <Button variant="ghost" size="sm">
                    <Archive className="w-4 h-4 mr-2" />
                    Archive
                  </Button>
                </Link>
                <Link to="/admin/comments">
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Comments
                  </Button>
                </Link>
                <Link to="/admin/users">
                  <Button variant="ghost" size="sm">
                    <Users className="w-4 h-4 mr-2" />
                    Users
                  </Button>
                </Link>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
