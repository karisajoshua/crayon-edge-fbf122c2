import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, User } from "lucide-react";

interface Comment {
  id: string;
  author_name: string;
  comment_text: string;
  created_at: string;
}

interface CommentSectionProps {
  postId: string;
}

const CommentSection = ({ postId }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .eq("approved", true)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setComments(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !comment.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("comments")
      .insert({
        post_id: postId,
        author_name: name.trim(),
        author_email: email.trim(),
        comment_text: comment.trim(),
      });

    setLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit comment. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Comment submitted!",
        description: "Your comment is awaiting approval and will appear soon.",
      });
      setName("");
      setEmail("");
      setComment("");
    }
  };

  return (
    <div className="mt-16 pt-16 border-t border-border">
      <div className="flex items-center gap-3 mb-8">
        <MessageCircle className="w-8 h-8 text-primary" />
        <h2 className="text-3xl font-bold">Join the Conversation</h2>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-12 bg-secondary-light rounded-3xl p-6 md:p-8 border-4 border-secondary">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="name" className="text-base">Your Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="mt-2 rounded-xl"
              required
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-base">Your Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="mt-2 rounded-xl"
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <Label htmlFor="comment" className="text-base">Your Comment *</Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts, experiences, or questions..."
            className="mt-2 min-h-[120px] rounded-xl"
            required
          />
        </div>
        <Button 
          type="submit" 
          disabled={loading}
          className="rounded-2xl"
        >
          {loading ? "Submitting..." : "Share Your Thoughts"}
        </Button>
        <p className="text-sm text-muted-foreground mt-3">
          Your email won't be published. All comments are moderated.
        </p>
      </form>

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-6">
            {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
          </h3>
          {comments.map((comment) => (
            <div key={comment.id} className="bg-accent rounded-2xl p-6 border-2 border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-bold text-lg">{comment.author_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(comment.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                </div>
              </div>
              <p className="text-foreground leading-relaxed">{comment.comment_text}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-muted rounded-2xl">
          <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-lg">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
