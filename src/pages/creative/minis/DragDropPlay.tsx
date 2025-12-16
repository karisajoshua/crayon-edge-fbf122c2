import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";

interface PlacedItem {
  id: string;
  emoji: string;
  x: number;
  y: number;
}

const ITEMS = [
  { id: "sun", emoji: "☀️", label: "Sun" },
  { id: "tree", emoji: "🌳", label: "Tree" },
  { id: "flower", emoji: "🌸", label: "Flower" },
  { id: "bird", emoji: "🐦", label: "Bird" },
  { id: "butterfly", emoji: "🦋", label: "Butterfly" },
  { id: "house", emoji: "🏠", label: "House" },
  { id: "dog", emoji: "🐕", label: "Dog" },
  { id: "cat", emoji: "🐱", label: "Cat" },
];

const DragDropPlay = () => {
  const [searchParams] = useSearchParams();
  const childId = searchParams.get("child");
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

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
        emoji: item.emoji,
        x,
        y,
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
        {/* Item Palette */}
        <div className="mb-6">
          <p className="text-center text-lg text-blue-700 mb-4 font-medium">
            Tap something to add it! 👇
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            {ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemSelect(item.id)}
                className={`w-16 h-16 md:w-20 md:h-20 text-4xl md:text-5xl rounded-2xl transition-all ${
                  selectedItem === item.id
                    ? "bg-yellow-200 scale-110 shadow-xl ring-4 ring-yellow-400"
                    : "bg-white shadow-lg hover:shadow-xl hover:scale-105"
                }`}
                aria-label={`Select ${item.label}`}
              >
                {item.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Scene Canvas */}
        <div className="flex justify-center">
          <div
            onClick={handleSceneClick}
            className="relative w-full max-w-2xl aspect-[4/3] rounded-3xl overflow-hidden shadow-xl cursor-pointer"
            style={{
              background: `linear-gradient(to bottom, 
                #87CEEB 0%, 
                #87CEEB 60%, 
                #90EE90 60%, 
                #228B22 100%
              )`,
            }}
          >
            {/* Sky decoration */}
            <div className="absolute top-4 left-4 text-4xl opacity-50">☁️</div>
            <div className="absolute top-8 right-8 text-3xl opacity-50">☁️</div>
            <div className="absolute top-2 left-1/3 text-2xl opacity-50">☁️</div>

            {/* Placed items */}
            {placedItems.map((item) => (
              <button
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveItem(item.id);
                }}
                className="absolute text-5xl md:text-6xl transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform cursor-pointer animate-bounce-in"
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                }}
              >
                {item.emoji}
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
