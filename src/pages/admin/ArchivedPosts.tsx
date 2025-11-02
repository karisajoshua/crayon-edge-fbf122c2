import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ArchivedPosts = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoreId, setRestoreId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchArchivedPosts();
  }, []);

  const fetchArchivedPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .select(`
        *,
        categories (name)
      `)
      .eq("archived", true)
      .order("archived_at", { ascending: false });

    if (error) {
      toast.error("Failed to load archived posts");
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  const handleRestore = async () => {
    if (!restoreId) return;

    const { error } = await supabase
      .from("blog_posts")
      .update({ 
        archived: false, 
        archived_at: null 
      })
      .eq("id", restoreId);

    if (error) {
      toast.error("Failed to restore post");
    } else {
      toast.success("Post restored successfully");
      fetchArchivedPosts();
    }
    setRestoreId(null);
  };

  const handleDeletePermanently = async () => {
    if (!deleteId) return;

    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", deleteId);

    if (error) {
      toast.error("Failed to delete post permanently");
    } else {
      toast.success("Post deleted permanently");
      fetchArchivedPosts();
    }
    setDeleteId(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Archived Posts</h1>
          <p className="text-muted-foreground">Manage your archived blog posts</p>
        </div>
        <Link to="/admin/posts">
          <Button variant="outline">
            Back to Posts
          </Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No archived posts</p>
        </div>
      ) : (
        <div className="bg-background rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4">Title</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Archived Date</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b last:border-0">
                    <td className="p-4 font-medium">{post.title}</td>
                    <td className="p-4">
                      {post.categories?.name || "Uncategorized"}
                    </td>
                    <td className="p-4">
                      {post.published ? (
                        <Badge>Published</Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {post.archived_at 
                        ? new Date(post.archived_at).toLocaleDateString()
                        : "N/A"
                      }
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setRestoreId(post.id)}
                          title="Restore post"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(post.id)}
                          title="Delete permanently"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AlertDialog open={!!restoreId} onOpenChange={() => setRestoreId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This post will be moved back to your active posts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestore}>Restore</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete permanently?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePermanently} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ArchivedPosts;