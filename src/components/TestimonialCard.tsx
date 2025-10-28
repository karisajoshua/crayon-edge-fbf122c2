import { Quote } from "lucide-react";

interface TestimonialCardProps {
  text: string;
  author: string;
  colorIndex: number;
}

const TestimonialCard = ({ text, author, colorIndex }: TestimonialCardProps) => {
  const colors = ["#e4f2ea", "#fbe4ec", "#fee5d2"];
  const bgColor = colors[colorIndex % colors.length];
  
  return (
    <div className="p-8 shadow-sm border border-border" style={{ backgroundColor: bgColor }}>
      <Quote className="w-8 h-8 text-foreground mb-4" />
      <p className="text-lg mb-4 italic">"{text}"</p>
      <p className="text-sm text-muted-foreground font-medium">— {author}</p>
    </div>
  );
};

export default TestimonialCard;
