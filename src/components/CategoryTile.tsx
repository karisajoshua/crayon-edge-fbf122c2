import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface CategoryTileProps {
  name: string;
  icon: LucideIcon;
  slug: string;
}

const CategoryTile = ({ name, icon: Icon, slug }: CategoryTileProps) => {
  return (
    <Link 
      to={`/blog/category/${slug}`}
      className="group bg-gradient-soft rounded-lg p-6 hover:shadow-lg transition-smooth border border-border/50"
    >
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-background/80 flex items-center justify-center group-hover:scale-110 transition-smooth">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-bold text-foreground group-hover:text-primary transition-smooth">
          {name}
        </h3>
      </div>
    </Link>
  );
};

export default CategoryTile;
