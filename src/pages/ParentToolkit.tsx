import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/toolkit-hero.jpg";
import defaultReading from "@/assets/toolkit-reading.jpg";
import defaultCrafts from "@/assets/toolkit-crafts.jpg";
import defaultChecklist from "@/assets/toolkit-checklist.jpg";
import defaultPlay from "@/assets/toolkit-play.jpg";

const fallbackImages = [defaultReading, defaultCrafts, defaultChecklist, defaultPlay];

interface ToolkitItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  image_url: string | null;
  file_url: string | null;
  created_at: string;
}

const ParentToolkit = () => {
  const [items, setItems] = useState<ToolkitItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [flippedId, setFlippedId] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data } = await supabase
      .from("toolkit_items")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  };

  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category)))];
  const filtered = activeCategory === "All" ? items : items.filter((i) => i.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img src={heroImg} alt="Parent Toolkit" className="w-full h-full object-cover" width={1920} height={600} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white">Parent Toolkit</h1>
            <p className="text-white/90 mt-2 max-w-lg text-base md:text-lg">
              Downloadable resources, guides, and printables to support your child's creative journey.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium heading-font transition-smooth ${
                activeCategory === cat
                  ? "bg-[#5da3c0] text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <main className="container mx-auto px-4 pb-16 flex-1">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5da3c0] mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            No resources available yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item, idx) => {
              const isFlipped = flippedId === item.id;
              const img = item.image_url || fallbackImages[idx % fallbackImages.length];
              return (
                <div
                  key={item.id}
                  className="perspective-1000 h-72 cursor-pointer"
                  onClick={() => setFlippedId(isFlipped ? null : item.id)}
                >
                  <div
                    className={`relative w-full h-full transition-transform duration-500 ${
                      isFlipped ? "[transform:rotateY(180deg)]" : ""
                    }`}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Front */}
                    <div
                      className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <img
                        src={img}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        width={800}
                        height={600}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <span className="text-xs font-medium text-white/80 bg-white/20 px-2 py-1 rounded-full heading-font">
                          {item.category}
                        </span>
                        <h3 className="text-lg font-bold text-white mt-2 heading-font">{item.title}</h3>
                      </div>
                    </div>

                    {/* Back */}
                    <div
                      className="absolute inset-0 rounded-2xl bg-card border border-border shadow-lg p-6 flex flex-col justify-between"
                      style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                    >
                      <div>
                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full heading-font">
                          {item.category}
                        </span>
                        <h3 className="text-lg font-bold mt-3 heading-font">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-4">
                          {item.description || "A helpful resource for parents."}
                        </p>
                      </div>
                      {item.file_url && (
                        <Button
                          className="w-full mt-4 bg-[#5da3c0] hover:bg-[#4a8da7] text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(item.file_url!, "_blank");
                          }}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ParentToolkit;
