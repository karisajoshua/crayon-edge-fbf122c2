import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Trash2, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const CommentModeration = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ["pending-comments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          blog_posts (
            title,
            slug
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from("comments")
        .update({ approved: true })
        .eq("id", commentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-comments"] });
      toast({
        title: "Comment approved",
        description: "The comment is now visible on the blog.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve comment.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-comments"] });
      toast({
        title: "Comment deleted",
        description: "The comment has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete comment.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Loading comments...</p>
        </div>
      </div>
    );
  }

  const pendingComments = comments?.filter((c) => !c.approved) || [];
  const approvedComments = comments?.filter((c) => c.approved) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Comment Moderation</h1>
        <p className="text-muted-foreground">
          Review and approve comments before they appear on your blog
        </p>
      </div>

      {/* Pending Comments */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-2xl font-bold">Pending Approval</h2>
          <Badge variant="secondary">{pendingComments.length}</Badge>
        </div>

        {pendingComments.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No pending comments</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingComments.map((comment) => (
              <Card key={comment.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{comment.author_name}</h3>
                      <Badge variant="outline">{comment.author_email}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      On: {comment.blog_posts?.title || "Unknown Post"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(comment.created_at), "PPp")}
                    </p>
                  </div>
                  <Badge variant="secondary">Pending</Badge>
                </div>

                <p className="text-foreground mb-4 whitespace-pre-wrap">
                  {comment.comment_text}
                </p>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => approveMutation.mutate(comment.id)}
                    disabled={approveMutation.isPending}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(comment.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Approved Comments */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-2xl font-bold">Approved Comments</h2>
          <Badge variant="secondary">{approvedComments.length}</Badge>
        </div>

        {approvedComments.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No approved comments yet</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {approvedComments.map((comment) => (
              <Card key={comment.id} className="p-6 bg-muted/50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{comment.author_name}</h3>
                      <Badge variant="outline">{comment.author_email}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      On: {comment.blog_posts?.title || "Unknown Post"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(comment.created_at), "PPp")}
                    </p>
                  </div>
                  <Badge className="bg-green-500">Approved</Badge>
                </div>

                <p className="text-foreground mb-4 whitespace-pre-wrap">
                  {comment.comment_text}
                </p>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(comment.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentModeration;
