import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash2, Plus, Image, FileDown, Pencil, X, Save } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type ToolkitForm = {
  title: string;
  description: string;
  category: string;
  image_url: string;
  file_url: string;
};

const emptyForm: ToolkitForm = {
  title: "",
  description: "",
  category: "General",
  image_url: "",
  file_url: "",
};

const ToolkitManager = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ToolkitForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<ToolkitForm>(emptyForm);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data } = await supabase
      .from("toolkit_items")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setItems(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("toolkit_items").insert([
        {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          image_url: formData.image_url || null,
          file_url: formData.file_url || null,
        },
      ]);

      if (error) throw error;

      toast.success("Resource added successfully!");
      setFormData(emptyForm);
      fetchItems();
    } catch (err: any) {
      toast.error(err.message || "Failed to add resource");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("toolkit_items").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete resource");
    } else {
      toast.success("Resource deleted!");
      fetchItems();
    }
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setEditFormData({
      title: item.title || "",
      description: item.description || "",
      category: item.category || "General",
      image_url: item.image_url || "",
      file_url: item.file_url || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditFormData(emptyForm);
  };

  const handleUpdate = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("toolkit_items")
        .update({
          title: editFormData.title,
          description: editFormData.description,
          category: editFormData.category,
          image_url: editFormData.image_url || null,
          file_url: editFormData.file_url || null,
        })
        .eq("id", id);

      if (error) throw error;
      toast.success("Resource updated!");
      cancelEdit();
      fetchItems();
    } catch (err: any) {
      toast.error(err.message || "Failed to update resource");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Parent Toolkit</h1>
        <p className="text-muted-foreground">Manage downloadable resources for parents</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Resource
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Checklists, Guides, Printables"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="Paste image URL from Media library"
                />
                {formData.image_url && (
                  <img src={formData.image_url} alt="Preview" className="w-full h-32 object-cover rounded-lg mt-2" />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="file_url">Downloadable File URL</Label>
                <Input
                  id="file_url"
                  type="url"
                  value={formData.file_url}
                  onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                  placeholder="Paste file URL (PDF, etc.)"
                />
                {formData.file_url && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <FileDown className="w-4 h-4" />
                    File URL set
                  </p>
                )}
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Adding..." : "Add Resource"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Existing Resources ({items.length})</h2>
          {items.length === 0 && (
            <p className="text-muted-foreground">No resources added yet.</p>
          )}
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="pt-6">
                {editingId === item.id ? (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label>Title</Label>
                      <Input
                        value={editFormData.title}
                        onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Description</Label>
                      <Textarea
                        rows={2}
                        value={editFormData.description}
                        onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Category</Label>
                      <Input
                        value={editFormData.category}
                        onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Image URL</Label>
                      <Input
                        type="url"
                        value={editFormData.image_url}
                        onChange={(e) => setEditFormData({ ...editFormData, image_url: e.target.value })}
                        placeholder="Paste image URL"
                      />
                      {editFormData.image_url && (
                        <img
                          src={editFormData.image_url}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg mt-2"
                        />
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label>File URL</Label>
                      <Input
                        type="url"
                        value={editFormData.file_url}
                        onChange={(e) => setEditFormData({ ...editFormData, file_url: e.target.value })}
                        placeholder="Paste file URL"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button onClick={() => handleUpdate(item.id)} disabled={loading} size="sm">
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button onClick={cancelEdit} variant="outline" size="sm">
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <Image className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{item.title}</h3>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                      )}
                      <div className="flex gap-2 mt-1">
                        {item.file_url && (
                          <span className="text-xs text-green-600 flex items-center gap-1">
                            <FileDown className="w-3 h-3" /> File attached
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEdit(item)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Resource</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{item.title}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(item.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToolkitManager;
