import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/crayonedge_logo.webp";

interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  color: string | null;
}

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBlogOpen, setIsBlogOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { user, isAdmin, signOut } = useAuth();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    
    if (data) {
      setCategories(data);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={logo} 
              alt="CrayonEdge Logo" 
              className="h-10 md:h-12"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="heading-font font-medium hover:text-primary transition-smooth">
              Home
            </Link>
            <Link to="/about" className="heading-font font-medium hover:text-primary transition-smooth">
              About
            </Link>
            
            {/* Blog Mega Menu */}
            <div 
              className="relative"
              onMouseEnter={() => setIsBlogOpen(true)}
              onMouseLeave={() => setIsBlogOpen(false)}
            >
              <button className="heading-font font-medium hover:text-primary transition-smooth flex items-center gap-1">
                Blog
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isBlogOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[800px] bg-card border border-border rounded-lg shadow-xl p-6 z-50">
                  <Link
                    to="/blog"
                    className="block mb-4 pb-4 border-b border-border text-lg font-semibold hover:text-primary transition-smooth"
                  >
                    All Articles
                  </Link>
                  <div className="grid grid-cols-3 gap-4">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/blog/category/${category.slug}`}
                        className="group"
                      >
                        <div className="aspect-video rounded-lg mb-2 overflow-hidden group-hover:opacity-90 transition-smooth">
                          {category.image_url ? (
                            <img 
                              src={category.image_url} 
                              alt={category.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div 
                              className="w-full h-full flex items-center justify-center text-4xl font-bold text-white"
                              style={{ backgroundColor: category.color || '#e4f2ea' }}
                            >
                              {category.name.split(' ')[0][0]}
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-medium group-hover:text-primary transition-smooth">
                          {category.name}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link to="/contact" className="heading-font font-medium hover:text-primary transition-smooth">
              Contact
            </Link>
            
            {isAdmin && (
              <Link to="/admin" className="heading-font font-medium hover:text-primary transition-smooth">
                Admin
              </Link>
            )}
            
            {user ? (
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="heading-font font-medium hover:text-primary transition-smooth">
                Home
              </Link>
              <Link to="/about" className="heading-font font-medium hover:text-primary transition-smooth">
                About
              </Link>
              <Link to="/blog" className="heading-font font-medium hover:text-primary transition-smooth">
                Blog
              </Link>
              <div className="pl-4 space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/blog/category/${category.slug}`}
                    className="block text-sm text-muted-foreground hover:text-primary transition-smooth"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
              <Link to="/contact" className="heading-font font-medium hover:text-primary transition-smooth">
                Contact
              </Link>
              
              {isAdmin && (
                <Link to="/admin" className="heading-font font-medium hover:text-primary transition-smooth">
                  Admin
                </Link>
              )}
              
              {user ? (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
