import { Link } from "react-router-dom";
import logo from "@/assets/crayonedge_logo.webp";

interface CreativeLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const CreativeLayout = ({ children, className = "" }: CreativeLayoutProps) => {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      {/* Main content */}
      <div className="flex-1">
        {children}
      </div>

      {/* Footer */}
      <footer className="py-6 px-4 text-center border-t bg-white/50">
        <div className="container mx-auto space-y-3">
          <Link to="/creative">
            <img
              src={logo}
              alt="CrayonEdge Creative"
              className="h-8 mx-auto"
            />
          </Link>
          <p className="text-xs text-muted-foreground">
            Powered by Texcortech Systems
          </p>
          <p className="text-xs text-muted-foreground">
            Part of the <Link to="/" className="text-primary hover:underline">CrayonEdge</Link> family
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CreativeLayout;
