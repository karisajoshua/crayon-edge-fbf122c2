import { useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Star, Shuffle } from "lucide-react";
import { useSoundSettings } from "@/hooks/useSoundSettings";
import CreativeLayout from "@/components/creative/CreativeLayout";

type ShapeType = "circle" | "square" | "triangle" | "star" | "heart" | "diamond" | "hexagon" | "pentagon";

interface Shape {
  id: string;
  type: ShapeType;
  color: string;
  matched: boolean;
}

const ALL_SHAPE_TYPES: ShapeType[] = ["circle", "square", "triangle", "star", "heart", "diamond", "hexagon", "pentagon"];
const COLORS = ["#FF6B6B", "#69DB7C", "#74C0FC", "#FAB005", "#DA77F2", "#FF8787", "#63E6BE", "#748FFC"];

const getRandomShapes = (count: number = 3): Shape[] => {
  const shuffledTypes = [...ALL_SHAPE_TYPES].sort(() => Math.random() - 0.5);
  const shuffledColors = [...COLORS].sort(() => Math.random() - 0.5);
  
  return shuffledTypes.slice(0, count).map((type, index) => ({
    id: String(index + 1),
    type,
    color: shuffledColors[index],
    matched: false,
  }));
};

const ShapeMatch = () => {
  const [searchParams] = useSearchParams();
  const childId = searchParams.get("child");
  const [shapes, setShapes] = useState<Shape[]>(() => getRandomShapes(3));
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const { playClick, playMatch, playCelebration } = useSoundSettings();

  const allMatched = shapes.every((s) => s.matched);

  const handleShapeSelect = (shapeId: string) => {
    if (shapes.find((s) => s.id === shapeId)?.matched) return;
    playClick();
    setSelectedShape(shapeId);
  };

  const handleOutlineClick = (outlineType: ShapeType) => {
    if (!selectedShape) return;
    
    const shape = shapes.find((s) => s.id === selectedShape);
    if (shape && shape.type === outlineType && !shape.matched) {
      playMatch();
      setShapes((prev) =>
        prev.map((s) => (s.id === selectedShape ? { ...s, matched: true } : s))
      );
      setSelectedShape(null);

      // Check if all matched
      const newShapes = shapes.map((s) =>
        s.id === selectedShape ? { ...s, matched: true } : s
      );
      if (newShapes.every((s) => s.matched)) {
        playCelebration();
        setShowCelebration(true);
      }
    }
  };

  const handleReset = () => {
    setShapes((prev) => prev.map((s) => ({ ...s, matched: false })));
    setSelectedShape(null);
    setShowCelebration(false);
  };

  const handleNewShapes = () => {
    setShapes(getRandomShapes(3));
    setSelectedShape(null);
    setShowCelebration(false);
    playClick();
  };

  const renderShape = (type: ShapeType, filled: boolean, color: string, size: number = 80) => {
    const fill = filled ? color : "transparent";
    const stroke = color;
    const strokeWidth = filled ? 0 : 4;

    switch (type) {
      case "circle":
        return (
          <svg width={size} height={size} viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeDasharray={filled ? "0" : "8 4"}
            />
          </svg>
        );
      case "square":
        return (
          <svg width={size} height={size} viewBox="0 0 100 100">
            <rect
              x="5"
              y="5"
              width="90"
              height="90"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeDasharray={filled ? "0" : "8 4"}
            />
          </svg>
        );
      case "triangle":
        return (
          <svg width={size} height={size} viewBox="0 0 100 100">
            <polygon
              points="50,5 95,95 5,95"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeDasharray={filled ? "0" : "8 4"}
            />
          </svg>
        );
      case "star":
        return (
          <svg width={size} height={size} viewBox="0 0 100 100">
            <polygon
              points="50,5 61,39 97,39 68,61 79,95 50,73 21,95 32,61 3,39 39,39"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeDasharray={filled ? "0" : "8 4"}
            />
          </svg>
        );
      case "heart":
        return (
          <svg width={size} height={size} viewBox="0 0 100 100">
            <path
              d="M50,88 C20,60 5,40 15,25 C25,10 45,15 50,30 C55,15 75,10 85,25 C95,40 80,60 50,88"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeDasharray={filled ? "0" : "8 4"}
            />
          </svg>
        );
      case "diamond":
        return (
          <svg width={size} height={size} viewBox="0 0 100 100">
            <polygon
              points="50,5 95,50 50,95 5,50"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeDasharray={filled ? "0" : "8 4"}
            />
          </svg>
        );
      case "hexagon":
        return (
          <svg width={size} height={size} viewBox="0 0 100 100">
            <polygon
              points="50,5 90,27 90,73 50,95 10,73 10,27"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeDasharray={filled ? "0" : "8 4"}
            />
          </svg>
        );
      case "pentagon":
        return (
          <svg width={size} height={size} viewBox="0 0 100 100">
            <polygon
              points="50,5 95,38 77,93 23,93 5,38"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeDasharray={filled ? "0" : "8 4"}
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const shapeTypes = shapes.map(s => s.type);

  return (
    <CreativeLayout className="bg-gradient-to-b from-green-100 via-green-50 to-amber-50">
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-12 text-center animate-bounce-in">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-green-600 mb-4">Great Job!</h2>
            <p className="text-xl text-muted-foreground mb-6">You matched all the shapes!</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={handleReset} size="lg" className="rounded-2xl" variant="outline">
                Play Again
              </Button>
              <Button onClick={handleNewShapes} size="lg" className="rounded-2xl">
                <Shuffle className="w-5 h-5 mr-2" />
                New Shapes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="py-4 px-4 bg-green-200/50">
        <div className="container mx-auto flex items-center justify-between">
          <Link
            to={`/creative/minis${childId ? `?child=${childId}` : ""}`}
            className="p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="w-6 h-6 text-green-700" />
          </Link>
          <h1 className="text-2xl font-bold text-green-800">Shapes!</h1>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNewShapes}
              className="rounded-full bg-white"
              title="New Shapes"
            >
              <Shuffle className="w-5 h-5 text-green-700" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              className="rounded-full bg-white"
            >
              <RotateCcw className="w-5 h-5 text-green-700" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Shapes to tap */}
        <div className="mb-12">
          <p className="text-center text-lg text-green-700 mb-4 font-medium">
            Tap a shape below:
          </p>
          <div className="flex justify-center gap-6 flex-wrap">
            {shapes
              .filter((s) => !s.matched)
              .map((shape) => (
                <button
                  key={shape.id}
                  onClick={() => handleShapeSelect(shape.id)}
                  className={`p-4 rounded-2xl transition-all ${
                    selectedShape === shape.id
                      ? "bg-yellow-200 scale-110 shadow-xl ring-4 ring-yellow-400"
                      : "bg-white shadow-lg hover:shadow-xl hover:scale-105"
                  }`}
                >
                  {renderShape(shape.type, true, shape.color, 100)}
                </button>
              ))}
          </div>
        </div>

        {/* Outlines to match */}
        <div>
          <p className="text-center text-lg text-green-700 mb-4 font-medium">
            {selectedShape ? "Now tap where it goes!" : "Then tap the matching outline!"}
          </p>
          <div className="flex justify-center gap-8 flex-wrap">
            {shapeTypes.map((type) => {
              const matchedShape = shapes.find((s) => s.type === type && s.matched);
              return (
                <button
                  key={type}
                  onClick={() => handleOutlineClick(type)}
                  disabled={!!matchedShape}
                  className={`p-6 rounded-3xl transition-all ${
                    matchedShape
                      ? "bg-green-100 shadow-inner"
                      : selectedShape
                      ? "bg-white shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer"
                      : "bg-white shadow-lg opacity-70"
                  }`}
                >
                  {matchedShape
                    ? renderShape(type, true, matchedShape.color, 100)
                    : renderShape(type, false, "#9CA3AF", 100)}
                  {matchedShape && (
                    <div className="flex justify-center mt-2">
                      <Star className="w-6 h-6 text-yellow-500 fill-yellow-400" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Progress */}
        <div className="text-center mt-12">
          <div className="inline-flex gap-2">
            {shapes.map((shape) => (
              <Star
                key={shape.id}
                className={`w-8 h-8 transition-all ${
                  shape.matched
                    ? "text-yellow-500 fill-yellow-400 scale-110"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </main>
    </CreativeLayout>
  );
};

export default ShapeMatch;
