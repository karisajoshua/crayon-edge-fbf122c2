import { useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Download, Save, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Import background images
import playgroundBg from "@/assets/creative/backgrounds/playground.png";
import underwaterBg from "@/assets/creative/backgrounds/underwater.png";
import spaceBg from "@/assets/creative/backgrounds/space.png";
import farmBg from "@/assets/creative/backgrounds/farm.png";

// Import element images
import sunImg from "@/assets/creative/elements/sun.png";
import cloudImg from "@/assets/creative/elements/cloud.png";
import treeImg from "@/assets/creative/elements/tree.png";
import flowerImg from "@/assets/creative/elements/flower.png";
import rainbowImg from "@/assets/creative/elements/rainbow.png";
import butterflyImg from "@/assets/creative/elements/butterfly.png";
import birdImg from "@/assets/creative/elements/bird.png";
import rocketImg from "@/assets/creative/elements/rocket.png";
import houseImg from "@/assets/creative/elements/house.png";
import carImg from "@/assets/creative/elements/car.png";
import fishImg from "@/assets/creative/elements/fish.png";

// Import character images
import girlImg from "@/assets/creative/characters/girl.png";
import boyImg from "@/assets/creative/characters/boy.png";
import dogImg from "@/assets/creative/characters/dog.png";
import catImg from "@/assets/creative/characters/cat.png";
import princessImg from "@/assets/creative/characters/princess.png";
import superheroImg from "@/assets/creative/characters/superhero.png";

interface PlacedItem {
  id: string;
  image: string;
  x: number;
  y: number;
  scale: number;
}

const BACKGROUNDS = [
  { id: "playground", name: "Playground", image: playgroundBg },
  { id: "underwater", name: "Underwater", image: underwaterBg },
  { id: "space", name: "Space", image: spaceBg },
  { id: "farm", name: "Farm", image: farmBg },
];

const ITEMS = [
  // Nature elements
  { id: "sun", image: sunImg, label: "Sun", category: "nature" },
  { id: "cloud", image: cloudImg, label: "Cloud", category: "nature" },
  { id: "tree", image: treeImg, label: "Tree", category: "nature" },
  { id: "flower", image: flowerImg, label: "Flower", category: "nature" },
  { id: "rainbow", image: rainbowImg, label: "Rainbow", category: "nature" },
  { id: "butterfly", image: butterflyImg, label: "Butterfly", category: "nature" },
  { id: "bird", image: birdImg, label: "Bird", category: "nature" },
  // Objects
  { id: "rocket", image: rocketImg, label: "Rocket", category: "objects" },
  { id: "house", image: houseImg, label: "House", category: "objects" },
  { id: "car", image: carImg, label: "Car", category: "objects" },
  { id: "fish", image: fishImg, label: "Fish", category: "objects" },
  // Characters
  { id: "girl", image: girlImg, label: "Girl", category: "characters" },
  { id: "boy", image: boyImg, label: "Boy", category: "characters" },
  { id: "dog", image: dogImg, label: "Dog", category: "characters" },
  { id: "cat", image: catImg, label: "Cat", category: "characters" },
  { id: "princess", image: princessImg, label: "Princess", category: "characters" },
  { id: "superhero", image: superheroImg, label: "Superhero", category: "characters" },
];

const DragDropPlay = () => {
  const [searchParams] = useSearchParams();
  const childId = searchParams.get("child");
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleItemSelect = (itemId: string) => {
    setSelectedItem(itemId);
  };

  const handleSceneClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedItem) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const item = ITEMS.find((i) => i.id === selectedItem);
    if (item) {
      const newPlacedItem: PlacedItem = {
        id: `${item.id}-${Date.now()}`,
        image: item.image,
        x,
        y,
        scale: 1,
      };
      setPlacedItems((prev) => [...prev, newPlacedItem]);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setPlacedItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const handleReset = () => {
    setPlacedItems([]);
    setSelectedItem(null);
  };

  const handlePrevBg = () => {
    setCurrentBgIndex((prev) => (prev === 0 ? BACKGROUNDS.length - 1 : prev - 1));
  };

  const handleNextBg = () => {
    setCurrentBgIndex((prev) => (prev + 1) % BACKGROUNDS.length);
  };

  const handleSave = async () => {
    if (!childId) {
      toast({
        title: "Cannot save",
        description: "Please select a child profile first.",
        variant: "destructive",
      });
      return;
    }

    if (!sceneRef.current) return;

    setIsSaving(true);
    try {
      // Use html2canvas approach - create canvas from the scene
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      canvas.width = 800;
      canvas.height = 600;

      // Draw background
      const bgImg = new Image();
      bgImg.crossOrigin = "anonymous";
      await new Promise<void>((resolve) => {
        bgImg.onload = () => {
          ctx.drawImage(bgImg, 0, 0, 800, 600);
          resolve();
        };
        bgImg.src = BACKGROUNDS[currentBgIndex].image;
      });

      // Draw placed items
      for (const item of placedItems) {
        const itemImg = new Image();
        itemImg.crossOrigin = "anonymous";
        await new Promise<void>((resolve) => {
          itemImg.onload = () => {
            const x = (item.x / 100) * 800 - 40;
            const y = (item.y / 100) * 600 - 40;
            ctx.drawImage(itemImg, x, y, 80, 80);
            resolve();
          };
          itemImg.src = item.image;
        });
      }

      // Convert to blob and upload
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), "image/png");
      });

      const fileName = `play-scene-${Date.now()}.png`;
      const { error: uploadError } = await supabase.storage
        .from("creative-content")
        .upload(`artworks/${childId}/${fileName}`, blob, {
          contentType: "image/png",
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("creative-content")
        .getPublicUrl(`artworks/${childId}/${fileName}`);

      const { error: dbError } = await supabase.from("creative_artworks").insert({
        child_profile_id: childId,
        title: "My Play Scene",
        artwork_type: "play-scene",
        image_url: urlData.publicUrl,
      });

      if (dbError) throw dbError;

      toast({
        title: "Saved! 🎨",
        description: "Your scene has been saved to your gallery.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    if (!sceneRef.current) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    // Draw background
    const bgImg = new Image();
    bgImg.crossOrigin = "anonymous";
    await new Promise<void>((resolve) => {
      bgImg.onload = () => {
        ctx.drawImage(bgImg, 0, 0, 800, 600);
        resolve();
      };
      bgImg.src = BACKGROUNDS[currentBgIndex].image;
    });

    // Draw placed items
    for (const item of placedItems) {
      const itemImg = new Image();
      itemImg.crossOrigin = "anonymous";
      await new Promise<void>((resolve) => {
        itemImg.onload = () => {
          const x = (item.x / 100) * 800 - 40;
          const y = (item.y / 100) * 600 - 40;
          ctx.drawImage(itemImg, x, y, 80, 80);
          resolve();
        };
        itemImg.src = item.image;
      });
    }

    const link = document.createElement("a");
    link.download = "my-play-scene.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-amber-50">
      {/* Header */}
      <header className="py-4 px-4 bg-blue-200/50">
        <div className="container mx-auto flex items-center justify-between">
          <Link
            to={`/creative/minis${childId ? `?child=${childId}` : ""}`}
            className="p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="w-6 h-6 text-blue-700" />
          </Link>
          <h1 className="text-2xl font-bold text-blue-800">Play!</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            className="rounded-full bg-white"
          >
            <RotateCcw className="w-5 h-5 text-blue-700" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Background Selector */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevBg}
            className="rounded-full bg-white"
          >
            <ChevronLeft className="w-5 h-5 text-blue-700" />
          </Button>
          <span className="text-blue-700 font-medium">
            {BACKGROUNDS[currentBgIndex].name}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextBg}
            className="rounded-full bg-white"
          >
            <ChevronRight className="w-5 h-5 text-blue-700" />
          </Button>
        </div>

        {/* Item Palette */}
        <div className="mb-6">
          <p className="text-center text-lg text-blue-700 mb-4 font-medium">
            Tap something to add it! 👇
          </p>
          <div className="flex justify-center gap-2 flex-wrap max-w-2xl mx-auto">
            {ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemSelect(item.id)}
                className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl transition-all overflow-hidden ${
                  selectedItem === item.id
                    ? "bg-yellow-200 scale-110 shadow-xl ring-4 ring-yellow-400"
                    : "bg-white shadow-lg hover:shadow-xl hover:scale-105"
                }`}
                aria-label={`Select ${item.label}`}
              >
                <img
                  src={item.image}
                  alt={item.label}
                  className="w-full h-full object-contain p-1"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Scene Canvas */}
        <div className="flex justify-center">
          <div
            ref={sceneRef}
            onClick={handleSceneClick}
            className="relative w-full max-w-2xl aspect-[4/3] rounded-3xl overflow-hidden shadow-xl cursor-pointer"
            style={{
              backgroundImage: `url(${BACKGROUNDS[currentBgIndex].image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Placed items */}
            {placedItems.map((item) => (
              <button
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveItem(item.id);
                }}
                className="absolute w-16 h-16 md:w-20 md:h-20 transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform cursor-pointer animate-bounce-in"
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                }}
              >
                <img
                  src={item.image}
                  alt="Placed item"
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </button>
            ))}

            {/* Instruction overlay */}
            {selectedItem && placedItems.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white/80 rounded-2xl px-6 py-3 text-lg text-blue-700 font-medium animate-pulse">
                  Tap here to place it!
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-3 mt-6 flex-wrap">
          <Button
            onClick={handleSave}
            disabled={isSaving || placedItems.length === 0}
            className="rounded-xl bg-green-500 hover:bg-green-600 gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button
            onClick={handleDownload}
            disabled={placedItems.length === 0}
            className="rounded-xl bg-purple-500 hover:bg-purple-600 gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>

        {/* Helpful text */}
        <div className="text-center mt-6">
          <p className="text-lg text-blue-600">
            {selectedItem
              ? "Tap the scene to place it! Tap again to remove. 🎨"
              : "Pick something to add to your scene! 🌈"}
          </p>
          {placedItems.length > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              You've added {placedItems.length} item{placedItems.length !== 1 ? "s" : ""}!
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default DragDropPlay;
