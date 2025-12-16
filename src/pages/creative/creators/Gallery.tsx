import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Image, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Artwork {
  id: string;
  title: string | null;
  artwork_type: string;
  image_url: string | null;
  created_at: string;
}

const Gallery = () => {
  const [searchParams] = useSearchParams();
  const childId = searchParams.get("child");
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (childId) {
      fetchArtworks();
    } else {
      setIsLoading(false);
    }
  }, [childId]);

  const fetchArtworks = async () => {
    try {
      const { data, error } = await supabase
        .from("creative_artworks")
        .select("*")
        .eq("child_profile_id", childId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setArtworks(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading gallery",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (artworkId: string) => {
    if (!confirm("Are you sure you want to delete this artwork?")) return;

    try {
      const { error } = await supabase
        .from("creative_artworks")
        .delete()
        .eq("id", artworkId);

      if (error) throw error;

      setArtworks(artworks.filter((a) => a.id !== artworkId));
      toast({
        title: "Artwork deleted",
        description: "The artwork has been removed.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-100 via-pink-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-pink-700">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-pink-50 to-rose-50">
      {/* Header */}
      <header className="py-4 px-4 bg-pink-200/50">
        <div className="container mx-auto flex items-center justify-between">
          <Link
            to={`/creative/creators${childId ? `?child=${childId}` : ""}`}
            className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-pink-700" />
          </Link>
          <div className="flex items-center gap-2">
            <Image className="w-6 h-6 text-pink-700" />
            <h1 className="text-xl font-bold text-pink-800">My Gallery</h1>
          </div>
          <div className="w-10" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!childId ? (
          <div className="text-center py-12">
            <Image className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-medium mb-2">No profile selected</h2>
            <p className="text-muted-foreground mb-4">
              Please select a child profile to view their gallery.
            </p>
            <Link to="/creative/parent/dashboard">
              <Button className="rounded-xl">Go to Parent Dashboard</Button>
            </Link>
          </div>
        ) : artworks.length === 0 ? (
          <div className="text-center py-12">
            <Image className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-medium mb-2">No artworks yet!</h2>
            <p className="text-muted-foreground mb-4">
              Start creating and your artwork will appear here.
            </p>
            <Link to={`/creative/creators/draw?child=${childId}`}>
              <Button className="rounded-xl bg-pink-500 hover:bg-pink-600">
                Start Drawing
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-pink-900 mb-6 text-center">
              Your Amazing Creations! 🎨
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {artworks.map((artwork) => (
                <Card key={artwork.id} className="rounded-2xl overflow-hidden group relative">
                  {artwork.image_url ? (
                    <img
                      src={artwork.image_url}
                      alt={artwork.title || "Artwork"}
                      className="w-full aspect-square object-cover"
                    />
                  ) : (
                    <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                      <Image className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(artwork.id)}
                      className="rounded-full"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="p-3">
                    <p className="font-medium truncate">{artwork.title || "Untitled"}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(artwork.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Gallery;
