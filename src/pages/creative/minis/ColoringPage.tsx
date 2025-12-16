import { useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Download } from "lucide-react";

const COLORS = [
  { name: "Red", value: "#FF6B6B" },
  { name: "Orange", value: "#FFA94D" },
  { name: "Yellow", value: "#FFE066" },
  { name: "Green", value: "#69DB7C" },
  { name: "Blue", value: "#74C0FC" },
  { name: "Purple", value: "#B197FC" },
  { name: "Pink", value: "#F783AC" },
  { name: "Brown", value: "#A0866B" },
];

// Simple SVG shapes for coloring
const SHAPES = [
  { id: "circle1", d: "M 150 100 A 50 50 0 1 1 150 99.9", fill: "#E5E5E5" },
  { id: "square1", d: "M 50 180 H 130 V 260 H 50 Z", fill: "#E5E5E5" },
  { id: "triangle1", d: "M 250 260 L 200 180 L 300 180 Z", fill: "#E5E5E5" },
  { id: "star1", d: "M 100 320 L 115 360 L 160 360 L 125 385 L 140 425 L 100 400 L 60 425 L 75 385 L 40 360 L 85 360 Z", fill: "#E5E5E5" },
  { id: "heart1", d: "M 250 340 C 250 320 270 310 285 310 C 310 310 320 340 320 340 C 320 340 330 310 355 310 C 370 310 390 320 390 340 C 390 380 320 420 320 420 C 320 420 250 380 250 340 Z", fill: "#E5E5E5" },
];

const ColoringPage = () => {
  const [searchParams] = useSearchParams();
  const childId = searchParams.get("child");
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [shapeFills, setShapeFills] = useState<Record<string, string>>(
    SHAPES.reduce((acc, shape) => ({ ...acc, [shape.id]: shape.fill }), {})
  );
  const svgRef = useRef<SVGSVGElement>(null);

  const handleShapeClick = (shapeId: string) => {
    setShapeFills((prev) => ({
      ...prev,
      [shapeId]: selectedColor,
    }));
  };

  const handleReset = () => {
    setShapeFills(
      SHAPES.reduce((acc, shape) => ({ ...acc, [shape.id]: shape.fill }), {})
    );
  };

  const handleDownload = () => {
    if (!svgRef.current) return;
    
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    canvas.width = 400;
    canvas.height = 500;
    
    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      const link = document.createElement("a");
      link.download = "my-coloring.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-pink-50 to-amber-50">
      {/* Header */}
      <header className="py-4 px-4 bg-pink-200/50">
        <div className="container mx-auto flex items-center justify-between">
          <Link 
            to={`/creative/minis${childId ? `?child=${childId}` : ""}`}
            className="p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="w-6 h-6 text-pink-700" />
          </Link>
          <h1 className="text-2xl font-bold text-pink-800">Color!</h1>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleReset}
              className="rounded-full bg-white"
            >
              <RotateCcw className="w-5 h-5 text-pink-700" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleDownload}
              className="rounded-full bg-white"
            >
              <Download className="w-5 h-5 text-pink-700" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Color Palette - Extra large buttons */}
        <div className="flex justify-center gap-3 mb-6 flex-wrap">
          {COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => setSelectedColor(color.value)}
              className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-4 transition-all ${
                selectedColor === color.value
                  ? "border-gray-800 scale-110 shadow-lg"
                  : "border-white shadow-md hover:scale-105"
              }`}
              style={{ backgroundColor: color.value }}
              aria-label={`Select ${color.name}`}
            />
          ))}
        </div>

        {/* Canvas Area */}
        <div className="flex justify-center">
          <div className="bg-white rounded-3xl shadow-xl p-4 max-w-md w-full">
            <svg
              ref={svgRef}
              viewBox="0 0 400 500"
              className="w-full h-auto"
              style={{ touchAction: "none" }}
            >
              {/* Background */}
              <rect width="400" height="500" fill="#FFFFFF" />
              
              {/* Shapes */}
              {SHAPES.map((shape) => (
                <path
                  key={shape.id}
                  d={shape.d}
                  fill={shapeFills[shape.id]}
                  stroke="#333"
                  strokeWidth="3"
                  onClick={() => handleShapeClick(shape.id)}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Friendly instruction */}
        <div className="text-center mt-8">
          <p className="text-xl text-pink-700 font-medium">
            Tap a color, then tap a shape! 🌈
          </p>
        </div>
      </main>
    </div>
  );
};

export default ColoringPage;
