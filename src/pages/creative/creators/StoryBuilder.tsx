import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, ChevronLeft, ChevronRight, Save, Sparkles, Trash2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import CreativeLayout from "@/components/creative/CreativeLayout";

// Import character images
import girlImg from "@/assets/creative/characters/girl.png";
import boyImg from "@/assets/creative/characters/boy.png";
import wizardImg from "@/assets/creative/characters/wizard.png";
import superheroImg from "@/assets/creative/characters/superhero.png";
import dogImg from "@/assets/creative/characters/dog.png";
import catImg from "@/assets/creative/characters/cat.png";
import princessImg from "@/assets/creative/characters/princess.png";
import princeImg from "@/assets/creative/characters/prince.png";

// Import scene images
import houseImg from "@/assets/creative/scenes/house.png";
import castleImg from "@/assets/creative/scenes/castle.png";
import forestImg from "@/assets/creative/scenes/forest.png";
import beachImg from "@/assets/creative/scenes/beach.png";

// Import object images
import starImg from "@/assets/creative/objects/star.png";
import treasureImg from "@/assets/creative/objects/treasure.png";
import wandImg from "@/assets/creative/objects/wand.png";
import balloonImg from "@/assets/creative/objects/balloon.png";

const CHARACTERS = [
  { id: "girl", name: "Girl", img: girlImg },
  { id: "boy", name: "Boy", img: boyImg },
  { id: "wizard", name: "Wizard", img: wizardImg },
  { id: "superhero", name: "Superhero", img: superheroImg },
  { id: "dog", name: "Dog", img: dogImg },
  { id: "cat", name: "Cat", img: catImg },
  { id: "princess", name: "Princess", img: princessImg },
  { id: "prince", name: "Prince", img: princeImg },
];

const SCENES = [
  { id: "house", name: "House", img: houseImg },
  { id: "castle", name: "Castle", img: castleImg },
  { id: "forest", name: "Forest", img: forestImg },
  { id: "beach", name: "Beach", img: beachImg },
];

const OBJECTS = [
  { id: "star", name: "Star", img: starImg },
  { id: "treasure", name: "Treasure", img: treasureImg },
  { id: "wand", name: "Magic Wand", img: wandImg },
  { id: "balloon", name: "Balloon", img: balloonImg },
];

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
    { id: "1", characters: [], scene: "house", objects: [], text: "" },
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
      scene: "house",
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
      const sceneData = SCENES.find(s => s.id === currentPage.scene);
      const characterNames = currentPage.characters.map(c => 
        CHARACTERS.find(char => char.id === c)?.name || c
      );
      const objectNames = currentPage.objects.map(o => 
        OBJECTS.find(obj => obj.id === o)?.name || o
      );

      const { data, error } = await supabase.functions.invoke("creative-ai", {
        body: {
          type: "story",
          context: {
            title,
            currentPage: currentPageIndex + 1,
            totalPages: pages.length,
            scene: sceneData?.name || currentPage.scene,
            characters: characterNames,
            objects: objectNames,
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
        description: "Your story has been saved to your gallery.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const storyContent = pages.map((page, index) => {
      const sceneData = SCENES.find(s => s.id === page.scene);
      const characterNames = page.characters.map(c => 
        CHARACTERS.find(char => char.id === c)?.name || c
      ).join(", ");
      const objectNames = page.objects.map(o => 
        OBJECTS.find(obj => obj.id === o)?.name || o
      ).join(", ");
      
      return `Page ${index + 1}\n` +
        `Scene: ${sceneData?.name || page.scene}\n` +
        `Characters: ${characterNames || "None"}\n` +
        `Objects: ${objectNames || "None"}\n\n` +
        `${page.text || "(No text yet)"}\n\n` +
        "---\n\n";
    }).join("");

    const fullContent = `${title}\n${"=".repeat(title.length)}\n\n${storyContent}`;
    
    const blob = new Blob([fullContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Story downloaded!",
      description: "Check your downloads folder.",
    });
  };

  const getSceneImage = () => {
    const scene = SCENES.find(s => s.id === currentPage.scene);
    return scene?.img || houseImg;
  };

  return (
    <CreativeLayout className="bg-gradient-to-b from-teal-100 via-teal-50 to-cyan-50">
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
          <div className="flex gap-2">
            <Button onClick={handleDownload} size="sm" variant="outline" className="rounded-xl">
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
            <Button onClick={handleSave} size="sm" className="rounded-xl bg-teal-600 hover:bg-teal-700">
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
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
          <Card className="p-6 rounded-3xl bg-white min-h-[400px] relative overflow-hidden">
            <img
              src={getSceneImage()}
              alt="Scene"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div className="relative z-10">
              <div className="flex flex-wrap justify-center gap-4 mb-4">
                {currentPage.characters.map((charId) => {
                  const char = CHARACTERS.find(c => c.id === charId);
                  return char ? (
                    <img
                      key={charId}
                      src={char.img}
                      alt={char.name}
                      className="w-20 h-20 object-contain"
                    />
                  ) : null;
                })}
              </div>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {currentPage.objects.map((objId) => {
                  const obj = OBJECTS.find(o => o.id === objId);
                  return obj ? (
                    <img
                      key={objId}
                      src={obj.img}
                      alt={obj.name}
                      className="w-12 h-12 object-contain"
                    />
                  ) : null;
                })}
              </div>
              <div className="bg-white/90 rounded-xl p-4 min-h-[100px]">
                <p className="text-center text-lg leading-relaxed">
                  {currentPage.text || <span className="text-muted-foreground italic">Your story will appear here...</span>}
                </p>
              </div>
            </div>
          </Card>

          {/* Controls */}
          <div className="space-y-6">
            {/* Scene Selection */}
            <div>
              <h3 className="font-semibold mb-2">Choose a Scene:</h3>
              <div className="flex flex-wrap gap-2">
                {SCENES.map((scene) => (
                  <button
                    key={scene.id}
                    onClick={() => updateCurrentPage({ scene: scene.id })}
                    className={`p-2 rounded-xl transition-all ${
                      currentPage.scene === scene.id
                        ? "bg-teal-200 ring-2 ring-teal-500"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    <img
                      src={scene.img}
                      alt={scene.name}
                      className="w-16 h-16 object-contain rounded-lg"
                    />
                    <span className="text-xs block mt-1">{scene.name}</span>
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
                    key={char.id}
                    onClick={() => toggleItem("characters", char.id)}
                    className={`p-2 rounded-xl transition-all ${
                      currentPage.characters.includes(char.id)
                        ? "bg-teal-200 ring-2 ring-teal-500"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    <img
                      src={char.img}
                      alt={char.name}
                      className="w-12 h-12 object-contain"
                    />
                    <span className="text-xs block mt-1">{char.name}</span>
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
                    key={obj.id}
                    onClick={() => toggleItem("objects", obj.id)}
                    className={`p-2 rounded-xl transition-all ${
                      currentPage.objects.includes(obj.id)
                        ? "bg-teal-200 ring-2 ring-teal-500"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    <img
                      src={obj.img}
                      alt={obj.name}
                      className="w-12 h-12 object-contain"
                    />
                    <span className="text-xs block mt-1">{obj.name}</span>
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
    </CreativeLayout>
  );
};

export default StoryBuilder;
