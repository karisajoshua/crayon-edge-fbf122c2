import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, ChevronLeft, ChevronRight, Save, Sparkles, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CHARACTERS = ["👧", "👦", "🧙", "🦸", "🐕", "🐱", "🐻", "🦄", "🐉", "👸", "🤴", "🧚"];
const SCENES = ["🏠", "🏰", "🌳", "🏖️", "🌙", "🌈", "🎪", "🚀", "🏔️", "🌊", "🎢", "🏫"];
const OBJECTS = ["⭐", "🎁", "🗝️", "📚", "🎈", "🍎", "🌺", "🔮", "💎", "🎭", "🎪", "🎨"];

interface StoryPage {
  id: string;
  characters: string[];
  scene: string;
  objects: string[];
  text: string;
}

const StoryBuilder = () => {
  const [searchParams] = useSearchParams();
  const childId = searchParams.get("child");
  const [title, setTitle] = useState("My Story");
  const [pages, setPages] = useState<StoryPage[]>([
    { id: "1", characters: [], scene: "🏠", objects: [], text: "" },
  ]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const currentPage = pages[currentPageIndex];

  const updateCurrentPage = (updates: Partial<StoryPage>) => {
    setPages((prev) =>
      prev.map((page, i) => (i === currentPageIndex ? { ...page, ...updates } : page))
    );
  };

  const toggleItem = (type: "characters" | "objects", item: string) => {
    const current = currentPage[type];
    const updated = current.includes(item)
      ? current.filter((i) => i !== item)
      : [...current, item];
    updateCurrentPage({ [type]: updated });
  };

  const addPage = () => {
    const newPage: StoryPage = {
      id: Date.now().toString(),
      characters: [],
      scene: "🏠",
      objects: [],
      text: "",
    };
    setPages([...pages, newPage]);
    setCurrentPageIndex(pages.length);
  };

  const deletePage = () => {
    if (pages.length <= 1) return;
    const newPages = pages.filter((_, i) => i !== currentPageIndex);
    setPages(newPages);
    setCurrentPageIndex(Math.min(currentPageIndex, newPages.length - 1));
  };

  const generateSuggestion = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("creative-ai", {
        body: {
          type: "story",
          context: {
            title,
            currentPage: currentPageIndex + 1,
            totalPages: pages.length,
            scene: currentPage.scene,
            characters: currentPage.characters,
            objects: currentPage.objects,
            previousText: pages.slice(0, currentPageIndex).map((p) => p.text).join(" "),
          },
        },
      });

      if (error) throw error;

      if (data?.suggestion) {
        updateCurrentPage({ text: currentPage.text + (currentPage.text ? " " : "") + data.suggestion });
      }
    } catch (error: any) {
      toast({
        title: "Couldn't get suggestion",
        description: "Try again in a moment!",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!childId) {
      toast({
        title: "Can't save",
        description: "Please select a child profile first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("creative_stories").insert({
        child_profile_id: childId,
        title,
        pages: JSON.parse(JSON.stringify(pages)),
      } as any);

      if (error) throw error;

      toast({
        title: "Story saved!",
        description: "Your story has been saved.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-100 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="py-4 px-4 bg-teal-200/50">
        <div className="container mx-auto flex items-center justify-between">
          <Link
            to={`/creative/creators${childId ? `?child=${childId}` : ""}`}
            className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-teal-700" />
          </Link>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="max-w-[200px] text-center font-bold bg-white/50 border-none rounded-xl"
          />
          <Button onClick={handleSave} size="sm" className="rounded-xl bg-teal-600 hover:bg-teal-700">
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Page Navigation */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPageIndex((i) => Math.max(0, i - 1))}
            disabled={currentPageIndex === 0}
            className="rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="text-lg font-medium">
            Page {currentPageIndex + 1} of {pages.length}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPageIndex((i) => Math.min(pages.length - 1, i + 1))}
            disabled={currentPageIndex === pages.length - 1}
            className="rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={addPage} className="rounded-full">
            <Plus className="w-5 h-5" />
          </Button>
          {pages.length > 1 && (
            <Button variant="ghost" size="icon" onClick={deletePage} className="rounded-full text-red-500">
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Story Preview */}
          <Card className="p-6 rounded-3xl bg-white min-h-[400px]">
            <div className="text-6xl mb-4 text-center">{currentPage.scene}</div>
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              {currentPage.characters.map((char, i) => (
                <span key={i} className="text-5xl">{char}</span>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {currentPage.objects.map((obj, i) => (
                <span key={i} className="text-3xl">{obj}</span>
              ))}
            </div>
            <p className="text-center text-lg leading-relaxed">
              {currentPage.text || <span className="text-muted-foreground italic">Your story will appear here...</span>}
            </p>
          </Card>

          {/* Controls */}
          <div className="space-y-6">
            {/* Scene Selection */}
            <div>
              <h3 className="font-semibold mb-2">Choose a Scene:</h3>
              <div className="flex flex-wrap gap-2">
                {SCENES.map((scene) => (
                  <button
                    key={scene}
                    onClick={() => updateCurrentPage({ scene })}
                    className={`text-3xl p-2 rounded-xl transition-all ${
                      currentPage.scene === scene
                        ? "bg-teal-200 ring-2 ring-teal-500"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {scene}
                  </button>
                ))}
              </div>
            </div>

            {/* Character Selection */}
            <div>
              <h3 className="font-semibold mb-2">Add Characters:</h3>
              <div className="flex flex-wrap gap-2">
                {CHARACTERS.map((char) => (
                  <button
                    key={char}
                    onClick={() => toggleItem("characters", char)}
                    className={`text-3xl p-2 rounded-xl transition-all ${
                      currentPage.characters.includes(char)
                        ? "bg-teal-200 ring-2 ring-teal-500"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {char}
                  </button>
                ))}
              </div>
            </div>

            {/* Object Selection */}
            <div>
              <h3 className="font-semibold mb-2">Add Objects:</h3>
              <div className="flex flex-wrap gap-2">
                {OBJECTS.map((obj) => (
                  <button
                    key={obj}
                    onClick={() => toggleItem("objects", obj)}
                    className={`text-3xl p-2 rounded-xl transition-all ${
                      currentPage.objects.includes(obj)
                        ? "bg-teal-200 ring-2 ring-teal-500"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {obj}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Write Your Story:</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateSuggestion}
                  disabled={isGenerating}
                  className="rounded-xl"
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  {isGenerating ? "Thinking..." : "Get Ideas"}
                </Button>
              </div>
              <Textarea
                value={currentPage.text}
                onChange={(e) => updateCurrentPage({ text: e.target.value })}
                placeholder="Once upon a time..."
                className="min-h-[120px] rounded-xl"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StoryBuilder;
