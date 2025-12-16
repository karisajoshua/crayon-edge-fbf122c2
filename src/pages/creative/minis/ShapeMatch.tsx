import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Star } from "lucide-react";

interface Shape {
  id: string;
  type: "circle" | "square" | "triangle";
  color: string;
  matched: boolean;
}

const SHAPES: Shape[] = [
  { id: "1", type: "circle", color: "#FF6B6B", matched: false },
  { id: "2", type: "square", color: "#69DB7C", matched: false },
  { id: "3", type: "triangle", color: "#74C0FC", matched: false },
];

const ShapeMatch = () => {
  const [searchParams] = useSearchParams();
  const childId = searchParams.get("child");
  const [shapes, setShapes] = useState<Shape[]>(SHAPES);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const allMatched = shapes.every((s) => s.matched);

  const handleShapeSelect = (shapeId: string) => {
    if (shapes.find((s) => s.id === shapeId)?.matched) return;
    setSelectedShape(shapeId);
  };

  const handleOutlineClick = (outlineType: string) => {
    if (!selectedShape) return;
    
    const shape = shapes.find((s) => s.id === selectedShape);
    if (shape && shape.type === outlineType && !shape.matched) {
      setShapes((prev) =>
        prev.map((s) => (s.id === selectedShape ? { ...s, matched: true } : s))
      );
      setSelectedShape(null);

      // Check if all matched
      const newShapes = shapes.map((s) =>
        s.id === selectedShape ? { ...s, matched: true } : s
      );
      if (newShapes.every((s) => s.matched)) {
        setShowCelebration(true);
      }
    }
  };

  const handleReset = () => {
    setShapes(SHAPES.map((s) => ({ ...s, matched: false })));
    setSelectedShape(null);
    setShowCelebration(false);
  };

  const renderShape = (type: string, filled: boolean, color: string, size: number = 80) => {
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
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 via-green-50 to-amber-50">
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-12 text-center animate-bounce-in">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-green-600 mb-4">Great Job!</h2>
            <p className="text-xl text-muted-foreground mb-6">You matched all the shapes!</p>
            <Button onClick={handleReset} size="lg" className="rounded-2xl">
              Play Again
            </Button>
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
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            className="rounded-full bg-white"
          >
            <RotateCcw className="w-5 h-5 text-green-700" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Shapes to drag */}
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
            {["circle", "square", "triangle"].map((type) => {
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
    </div>
  );
};

export default ShapeMatch;
