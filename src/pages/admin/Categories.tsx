import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import slugify from "slugify";
import { Trash2, Image as ImageIcon, Pencil, X, Save } from "lucide-react";
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

const Categories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    color: "#A3C7E5",
    image_url: "",
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({ name: "", description: "", color: "", image_url: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("name");
    if (data) setCategories(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("categories").insert([{
        name: formData.name,
        description: formData.description,
        color: formData.color,
        slug: slugify(formData.name, { lower: true, strict: true }),
        image_url: formData.image_url || null,
      }]);

      if (error) {
        toast.error(error.message || "Failed to create category");
      } else {
        toast.success("Category created successfully!");
        setFormData({ name: "", slug: "", description: "", color: "#A3C7E5", image_url: "" });
        fetchCategories();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create category");
    }
  };

  const handleDelete = async (categoryId: string, categoryName: string) => {
    setDeletingId(categoryId);
    const { data: posts } = await supabase.from("blog_posts").select("id").eq("category_id", categoryId).limit(1);
    if (posts && posts.length > 0) {
      toast.error(`Cannot delete "${categoryName}" - it has associated blog posts.`);
      setDeletingId(null);
      return;
    }
    const { error } = await supabase.from("categories").delete().eq("id", categoryId);
    if (error) toast.error("Failed to delete category");
    else { toast.success("Category deleted!"); fetchCategories(); }
    setDeletingId(null);
  };

  const startEditing = (category: any) => {
    setEditingId(category.id);
    setEditFormData({
      name: category.name,
      description: category.description || "",
      color: category.color || "#A3C7E5",
      image_url: category.image_url || "",
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const handleRemoveImage = async (categoryId: string) => {
    setSaving(true);
    const { error } = await supabase.from("categories").update({ image_url: null }).eq("id", categoryId);
    if (error) toast.error("Failed to remove image");
    else {
      toast.success("Image removed!");
      setEditFormData({ ...editFormData, image_url: "" });
      fetchCategories();
    }
    setSaving(false);
  };

  const handleUpdate = async (categoryId: string) => {
    setSaving(true);
    try {
      const { error } = await supabase.from("categories").update({
        name: editFormData.name,
        description: editFormData.description,
        color: editFormData.color,
        slug: slugify(editFormData.name, { lower: true, strict: true }),
        image_url: editFormData.image_url || null,
      }).eq("id", categoryId);
      if (error) toast.error(error.message);
      else { toast.success("Category updated!"); cancelEditing(); fetchCategories(); }
    } catch (err: any) {
      toast.error(err.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Categories</h1>
        <p className="text-muted-foreground">Manage blog categories</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader><CardTitle>Add New Category</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input id="color" type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-image">Featured Image URL</Label>
                <Input
                  id="category-image"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="Paste image URL from Media library"
                />
                {formData.image_url && <img src={formData.image_url} alt="Preview" className="w-full h-32 object-cover rounded-lg mt-2" />}
              </div>
              <Button type="submit">Create Category</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Existing Categories</h2>
          {categories.map((category) => (
            <Card key={category.id}>
              <CardContent className="pt-6">
                {editingId === category.id ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input value={editFormData.description} onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Color</Label>
                      <Input type="color" value={editFormData.color} onChange={(e) => setEditFormData({ ...editFormData, color: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Featured Image URL</Label>
                      <Input
                        type="url"
                        value={editFormData.image_url}
                        onChange={(e) => setEditFormData({ ...editFormData, image_url: e.target.value })}
                        placeholder="Paste image URL from Media library"
                      />
                      {editFormData.image_url && (
                        <div className="relative">
                          <img src={editFormData.image_url} alt="Current" className="w-full h-32 object-cover rounded-lg" />
                          <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => handleRemoveImage(category.id)} disabled={saving}>
                            <X className="w-3 h-3 mr-1" /> Remove
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleUpdate(category.id)} disabled={saving}>
                        <Save className="w-4 h-4 mr-1" /> {saving ? "Saving..." : "Save"}
                      </Button>
                      <Button variant="outline" onClick={cancelEditing}><X className="w-4 h-4 mr-1" /> Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {category.image_url ? (
                        <img src={category.image_url} alt={category.name} className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: category.color || '#A3C7E5' }}>
                          <ImageIcon className="w-5 h-5 text-white/70" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => startEditing(category)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" disabled={deletingId === category.id}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Category</AlertDialogTitle>
                            <AlertDialogDescription>Are you sure you want to delete "{category.name}"? This action cannot be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(category.id, category.name)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
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

export default Categories;
