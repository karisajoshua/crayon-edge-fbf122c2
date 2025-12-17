import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Briefcase, Image, BookOpen, Palette, Trash2, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PortfolioItem {
  id: string;
  type: "artwork" | "story" | "journal";
  title: string;
  image_url?: string | null;
  created_at: string;
}

const Portfolio = () => {
  const [searchParams] = useSearchParams();
  const childId = searchParams.get("child");
  const [artworks, setArtworks] = useState<PortfolioItem[]>([]);
  const [stories, setStories] = useState<PortfolioItem[]>([]);
  const [journals, setJournals] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (childId) {
      fetchPortfolio();
    } else {
      setIsLoading(false);
    }
  }, [childId]);

  const fetchPortfolio = async () => {
    try {
      // Fetch artworks
      const { data: artworkData, error: artworkError } = await supabase
        .from("creative_artworks")
        .select("id, title, image_url, created_at")
        .eq("child_profile_id", childId)
        .order("created_at", { ascending: false });

      if (artworkError) throw artworkError;
      setArtworks(
        (artworkData || []).map((a) => ({
          ...a,
          title: a.title || "Untitled Artwork",
          type: "artwork" as const,
        }))
      );

      // Fetch stories
      const { data: storyData, error: storyError } = await supabase
        .from("creative_stories")
        .select("id, title, created_at")
        .eq("child_profile_id", childId)
        .order("created_at", { ascending: false });

      if (storyError) throw storyError;
      setStories(
        (storyData || []).map((s) => ({
          ...s,
          type: "story" as const,
        }))
      );

      // Fetch journal entries
      const { data: journalData, error: journalError } = await supabase
        .from("creative_journal_entries")
        .select("id, title, created_at")
        .eq("child_profile_id", childId)
        .eq("is_private", false)
        .order("created_at", { ascending: false });

      if (journalError) throw journalError;
      setJournals(
        (journalData || []).map((j) => ({
          ...j,
          title: j.title || "Untitled Entry",
          type: "journal" as const,
        }))
      );
    } catch (error: any) {
      toast({
        title: "Error loading portfolio",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteArtwork = async (id: string) => {
    if (!confirm("Remove this from your portfolio?")) return;
    
    try {
      const { error } = await supabase
        .from("creative_artworks")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setArtworks(artworks.filter((a) => a.id !== id));
      toast({ title: "Removed from portfolio" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (imageUrl: string, title: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title.replace(/\s+/g, "-")}.png`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not download the image",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-100 via-emerald-50 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-700">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-100 via-emerald-50 to-slate-50">
      <header className="py-4 px-4 bg-emerald-200/50">
        <div className="container mx-auto flex items-center justify-between">
          <Link
            to={`/creative/studio${childId ? `?child=${childId}` : ""}`}
            className="p-2 bg-white rounded-full shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-5 h-5 text-emerald-700" />
          </Link>
          <div className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-emerald-700" />
            <h1 className="text-xl font-bold text-emerald-800">My Portfolio</h1>
          </div>
          <div className="w-10" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!childId ? (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-medium mb-2">No profile selected</h2>
            <p className="text-muted-foreground mb-4">
              Please select a child profile to view their portfolio.
            </p>
            <Link to="/creative/parent/dashboard">
              <Button className="rounded-xl">Go to Parent Dashboard</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-emerald-900 mb-2">
                Your Creative Collection ✨
              </h2>
              <p className="text-emerald-600">
                All your amazing creations in one place
              </p>
            </div>

            <Tabs defaultValue="artworks" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-3 rounded-xl">
                <TabsTrigger value="artworks" className="rounded-lg gap-2">
                  <Palette className="w-4 h-4" />
                  Artworks ({artworks.length})
                </TabsTrigger>
                <TabsTrigger value="stories" className="rounded-lg gap-2">
                  <BookOpen className="w-4 h-4" />
                  Stories ({stories.length})
                </TabsTrigger>
                <TabsTrigger value="journals" className="rounded-lg gap-2">
                  <BookOpen className="w-4 h-4" />
                  Journal ({journals.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="artworks" className="mt-6">
                {artworks.length === 0 ? (
                  <div className="text-center py-12">
                    <Image className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No artworks yet</p>
                    <Link to={`/creative/creators/draw?child=${childId}`}>
                      <Button className="mt-4 rounded-xl">Start Drawing</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {artworks.map((artwork) => (
                      <Card key={artwork.id} className="rounded-2xl overflow-hidden group relative">
                        {artwork.image_url ? (
                          <img
                            src={artwork.image_url}
                            alt={artwork.title}
                            className="w-full aspect-square object-cover"
                          />
                        ) : (
                          <div className="w-full aspect-square bg-emerald-50 flex items-center justify-center">
                            <Image className="w-12 h-12 text-emerald-200" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {artwork.image_url && (
                            <Button
                              variant="secondary"
                              size="icon"
                              onClick={() => handleDownload(artwork.image_url!, artwork.title)}
                              className="rounded-full"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteArtwork(artwork.id)}
                            className="rounded-full"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <CardContent className="p-3">
                          <p className="font-medium truncate">{artwork.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(artwork.created_at).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="stories" className="mt-6">
                {stories.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No stories yet</p>
                    <Link to={`/creative/creators/story?child=${childId}`}>
                      <Button className="mt-4 rounded-xl">Create a Story</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {stories.map((story) => (
                      <Card key={story.id} className="rounded-2xl">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <p className="font-medium">{story.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(story.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Link to={`/creative/creators/story?child=${childId}&id=${story.id}`}>
                            <Button variant="outline" className="rounded-lg">
                              View
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="journals" className="mt-6">
                {journals.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No public journal entries</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Private entries won't appear here
                    </p>
                    <Link to={`/creative/studio/journal?child=${childId}`}>
                      <Button className="mt-4 rounded-xl">Write in Journal</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {journals.map((entry) => (
                      <Card key={entry.id} className="rounded-2xl">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <p className="font-medium">{entry.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(entry.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Link to={`/creative/studio/journal?child=${childId}`}>
                            <Button variant="outline" className="rounded-lg">
                              View
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  );
};

export default Portfolio;
