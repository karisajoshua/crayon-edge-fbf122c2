import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash2, Plus, Image, FileDown } from "lucide-react";
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

const ToolkitManager = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "General",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [downloadFile, setDownloadFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const uploadFile = async (file: File, folder: string) => {
    const ext = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("blog-images").upload(path, file);
    if (error) throw error;
    const { data: urlData } = supabase.storage.from("blog-images").getPublicUrl(path);
    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let image_url: string | null = null;
      let file_url: string | null = null;

      if (imageFile) image_url = await uploadFile(imageFile, "toolkit-images");
      if (downloadFile) file_url = await uploadFile(downloadFile, "toolkit-files");

      const { error } = await supabase.from("toolkit_items").insert([
        {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          image_url,
          file_url,
        },
      ]);

      if (error) throw error;

      toast.success("Resource added successfully!");
      setFormData({ title: "", description: "", category: "General" });
      setImageFile(null);
      setDownloadFile(null);
      setImagePreview(null);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
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
                <Label htmlFor="image">Cover Image</Label>
                <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg mt-2" />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="download">Downloadable File (PDF, etc.)</Label>
                <Input
                  id="download"
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip"
                  onChange={(e) => setDownloadFile(e.target.files?.[0] || null)}
                />
                {downloadFile && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <FileDown className="w-4 h-4" />
                    {downloadFile.name}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Uploading..." : "Add Resource"}
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToolkitManager;
