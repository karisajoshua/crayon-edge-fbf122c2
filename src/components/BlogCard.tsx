import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
}

const BlogCard = ({ id, title, excerpt, image, date, category }: BlogCardProps) => {
  return (
    <article className="group bg-card rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-smooth border-4 border-[#fee5d2] hover:border-[#fbe4ec] hover:scale-[1.02]">
      <Link to={`/blog/${id}`}>
        <div className="aspect-[16/9] overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
          />
        </div>
      </Link>
      
      <div className="p-8">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#fbe4ec] to-[#fee5d2] rounded-full text-secondary-foreground text-xs font-medium shadow-sm">
            {category}
          </span>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </div>
        </div>
        
        <Link to={`/blog/${id}`}>
          <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-smooth">
            {title}
          </h3>
        </Link>
        
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {excerpt}
        </p>
        
        <Link 
          to={`/blog/${id}`}
          className="text-primary hover:text-primary-dark font-medium inline-flex items-center gap-1 transition-smooth"
        >
          Read More →
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;
