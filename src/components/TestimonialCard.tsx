import { Quote } from "lucide-react";

interface TestimonialCardProps {
  text: string;
  author: string;
}

const TestimonialCard = ({ text, author }: TestimonialCardProps) => {
  return (
    <div className="bg-card rounded-lg p-8 shadow-sm border border-border">
      <Quote className="w-8 h-8 text-primary mb-4" />
      <p className="text-lg mb-4 italic">"{text}"</p>
      <p className="text-sm text-muted-foreground font-medium">— {author}</p>
    </div>
  );
};

export default TestimonialCard;
