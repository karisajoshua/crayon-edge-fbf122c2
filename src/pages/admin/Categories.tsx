import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import slugify from "slugify";
import { Trash2, Image as ImageIcon, Pencil, X, Upload, Save } from "lucide-react";
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
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({ name: "", description: "", color: "" });
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("name");
    if (data) setCategories(data);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File) => {
    const ext = file.name.split(".").pop();
    const path = `category-images/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("blog-images").upload(path, file);
    if (error) throw error;
    const { data: urlData } = supabase.storage.from("blog-images").getPublicUrl(path);
    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let image_url: string | null = null;
      if (imageFile) image_url = await uploadImage(imageFile);

      const { error } = await supabase.from("categories").insert([{
        ...formData,
        slug: slugify(formData.name, { lower: true, strict: true }),
        image_url,
      }]);

      if (error) {
        toast.error(error.message || "Failed to create category");
      } else {
        toast.success("Category created successfully!");
        setFormData({ name: "", slug: "", description: "", color: "#A3C7E5" });
        setImageFile(null);
        setImagePreview(null);
        fetchCategories();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create category");
    } finally {
      setUploading(false);
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
    setEditFormData({ name: category.name, description: category.description || "", color: category.color || "#A3C7E5" });
    setEditImageFile(null);
    setEditImagePreview(category.image_url || null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditImageFile(null);
    setEditImagePreview(null);
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImageFile(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = async (categoryId: string) => {
    setSaving(true);
    const { error } = await supabase.from("categories").update({ image_url: null }).eq("id", categoryId);
    if (error) toast.error("Failed to remove image");
    else { toast.success("Image removed!"); setEditImagePreview(null); fetchCategories(); }
    setSaving(false);
  };

  const handleUpdate = async (categoryId: string) => {
    setSaving(true);
    try {
      let image_url: string | undefined = undefined;
      if (editImageFile) image_url = await uploadImage(editImageFile);

      const updateData: any = {
        name: editFormData.name,
        description: editFormData.description,
        color: editFormData.color,
        slug: slugify(editFormData.name, { lower: true, strict: true }),
      };
      if (image_url) updateData.image_url = image_url;

      const { error } = await supabase.from("categories").update(updateData).eq("id", categoryId);
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
                <Label htmlFor="category-image">Featured Image</Label>
                <Input id="category-image" type="file" accept="image/*" onChange={handleImageChange} />
                {imagePreview && <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg mt-2" />}
              </div>
              <Button type="submit" disabled={uploading}>{uploading ? "Creating..." : "Create Category"}</Button>
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
                      <Label>Featured Image</Label>
                      {editImagePreview && (
                        <div className="relative">
                          <img src={editImagePreview} alt="Current" className="w-full h-32 object-cover rounded-lg" />
                          <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => handleRemoveImage(category.id)} disabled={saving}>
                            <X className="w-3 h-3 mr-1" /> Remove
                          </Button>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Input type="file" accept="image/*" onChange={handleEditImageChange} />
                      </div>
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
