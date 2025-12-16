import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Sparkles, Palette, PenTool, Lightbulb, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const CATEGORIES = [
  { id: "writing", label: "Writing", icon: PenTool, color: "blue" },
  { id: "art", label: "Art", icon: Palette, color: "pink" },
  { id: "design", label: "Design", icon: Lightbulb, color: "amber" },
];

const IdeaPrompts = () => {
  const [searchParams] = useSearchParams();
  const childId = searchParams.get("child");
  const [selectedCategory, setSelectedCategory] = useState("writing");
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generatePrompt = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("creative-ai", {
        body: { type: "idea", context: { category: selectedCategory } },
      });
      if (error) throw error;
      setPrompt(data?.suggestion || "Create something that represents who you are.");
    } catch {
      setPrompt("Design something that makes you happy.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <header className="py-4 px-4 bg-amber-100/50">
        <div className="container mx-auto flex items-center justify-between">
          <Link to={`/creative/studio${childId ? `?child=${childId}` : ""}`} className="p-2 bg-white rounded-full shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">Idea Prompts</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-xl">
        <div className="flex justify-center gap-3 mb-8">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat.id)}
              className="rounded-xl"
            >
              <cat.icon className="w-4 h-4 mr-2" />
              {cat.label}
            </Button>
          ))}
        </div>

        <Card className="p-8 rounded-3xl text-center">
          {prompt ? (
            <>
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-amber-500" />
              <p className="text-xl font-medium mb-6">{prompt}</p>
              <Button onClick={generatePrompt} variant="outline" className="rounded-xl" disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                New Prompt
              </Button>
            </>
          ) : (
            <>
              <Lightbulb className="w-16 h-16 mx-auto mb-4 text-amber-400" />
              <p className="text-lg text-muted-foreground mb-6">
                Ready for creative inspiration?
              </p>
              <Button onClick={generatePrompt} size="lg" className="rounded-xl" disabled={isLoading}>
                <Sparkles className="w-4 h-4 mr-2" />
                {isLoading ? "Generating..." : "Generate Prompt"}
              </Button>
            </>
          )}
        </Card>
      </main>
    </div>
  );
};

export default IdeaPrompts;
