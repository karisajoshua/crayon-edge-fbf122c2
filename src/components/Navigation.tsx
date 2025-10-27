import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBlogOpen, setIsBlogOpen] = useState(false);

  const categories = [
    "Play",
    "Pregnancy & Newborn",
    "Tantrums",
    "Child Developmental Milestones",
    "Parenting Challenges",
    "Discipline",
    "Parenting Tips",
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="font-bold text-2xl heading-font text-primary-dark hover:text-primary transition-smooth">
            CrayonEdge
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="heading-font font-medium hover:text-primary transition-smooth">
              Home
            </Link>
            <Link to="/about" className="heading-font font-medium hover:text-primary transition-smooth">
              About
            </Link>
            
            {/* Blog Dropdown */}
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
                <div className="absolute top-full left-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                  <Link
                    to="/blog"
                    className="block px-4 py-2 hover:bg-muted transition-smooth text-sm"
                  >
                    All Articles
                  </Link>
                  <div className="border-t border-border my-2"></div>
                  {categories.map((category) => (
                    <Link
                      key={category}
                      to={`/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block px-4 py-2 hover:bg-muted transition-smooth text-sm"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/contact" className="heading-font font-medium hover:text-primary transition-smooth">
              Contact
            </Link>
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
                    key={category}
                    to={`/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block text-sm text-muted-foreground hover:text-primary transition-smooth"
                  >
                    {category}
                  </Link>
                ))}
              </div>
              <Link to="/contact" className="heading-font font-medium hover:text-primary transition-smooth">
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
