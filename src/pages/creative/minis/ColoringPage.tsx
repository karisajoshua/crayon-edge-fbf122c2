import { useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Download, Shuffle, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const COLORS = [
  { name: "Red", value: "#FF6B6B" },
  { name: "Orange", value: "#FFA94D" },
  { name: "Yellow", value: "#FFE066" },
  { name: "Green", value: "#69DB7C" },
  { name: "Blue", value: "#74C0FC" },
  { name: "Purple", value: "#B197FC" },
  { name: "Pink", value: "#F783AC" },
  { name: "Brown", value: "#A0866B" },
  { name: "Cyan", value: "#66D9E8" },
  { name: "Lime", value: "#A9E34B" },
];

// Shape templates with different layouts
const SHAPE_TEMPLATES = [
  // Template 1: Basic shapes
  [
    { id: "circle1", d: "M 150 100 A 50 50 0 1 1 150 99.9", fill: "#E5E5E5" },
    { id: "square1", d: "M 50 180 H 130 V 260 H 50 Z", fill: "#E5E5E5" },
    { id: "triangle1", d: "M 250 260 L 200 180 L 300 180 Z", fill: "#E5E5E5" },
    { id: "star1", d: "M 100 320 L 115 360 L 160 360 L 125 385 L 140 425 L 100 400 L 60 425 L 75 385 L 40 360 L 85 360 Z", fill: "#E5E5E5" },
    { id: "heart1", d: "M 250 340 C 250 320 270 310 285 310 C 310 310 320 340 320 340 C 320 340 330 310 355 310 C 370 310 390 320 390 340 C 390 380 320 420 320 420 C 320 420 250 380 250 340 Z", fill: "#E5E5E5" },
  ],
  // Template 2: Animals
  [
    { id: "cat_body", d: "M 100 200 Q 60 200 60 250 Q 60 300 100 300 Q 140 300 140 250 Q 140 200 100 200 Z", fill: "#E5E5E5" },
    { id: "cat_head", d: "M 100 150 A 40 40 0 1 1 100 149.9", fill: "#E5E5E5" },
    { id: "cat_ear1", d: "M 70 115 L 60 80 L 90 105 Z", fill: "#E5E5E5" },
    { id: "cat_ear2", d: "M 130 115 L 140 80 L 110 105 Z", fill: "#E5E5E5" },
    { id: "fish", d: "M 280 150 Q 320 130 350 150 Q 320 170 280 150 L 250 150 Q 230 170 250 190 Q 270 170 250 150 Z", fill: "#E5E5E5" },
    { id: "fish_tail", d: "M 350 150 L 380 130 L 380 170 Z", fill: "#E5E5E5" },
    { id: "butterfly_left", d: "M 280 280 Q 230 240 260 300 Q 230 360 280 320 Z", fill: "#E5E5E5" },
    { id: "butterfly_right", d: "M 320 280 Q 370 240 340 300 Q 370 360 320 320 Z", fill: "#E5E5E5" },
    { id: "butterfly_body", d: "M 290 250 L 310 250 L 310 350 L 290 350 Z", fill: "#E5E5E5" },
  ],
  // Template 3: Nature
  [
    { id: "sun", d: "M 320 80 A 40 40 0 1 1 320 79.9", fill: "#E5E5E5" },
    { id: "sun_ray1", d: "M 320 20 L 315 40 L 325 40 Z", fill: "#E5E5E5" },
    { id: "sun_ray2", d: "M 380 80 L 360 75 L 360 85 Z", fill: "#E5E5E5" },
    { id: "sun_ray3", d: "M 320 140 L 315 120 L 325 120 Z", fill: "#E5E5E5" },
    { id: "sun_ray4", d: "M 260 80 L 280 75 L 280 85 Z", fill: "#E5E5E5" },
    { id: "cloud1", d: "M 60 100 Q 40 100 40 80 Q 40 60 70 60 Q 80 40 110 60 Q 140 50 140 80 Q 140 100 120 100 Z", fill: "#E5E5E5" },
    { id: "tree_trunk", d: "M 80 280 L 120 280 L 110 400 L 90 400 Z", fill: "#E5E5E5" },
    { id: "tree_leaves", d: "M 100 180 Q 30 200 60 260 Q 30 260 100 300 Q 170 260 140 260 Q 170 200 100 180 Z", fill: "#E5E5E5" },
    { id: "flower1", d: "M 250 350 A 25 25 0 1 1 250 349.9", fill: "#E5E5E5" },
    { id: "flower_petal1", d: "M 250 300 A 15 15 0 1 1 250 299.9", fill: "#E5E5E5" },
    { id: "flower_petal2", d: "M 200 350 A 15 15 0 1 1 200 349.9", fill: "#E5E5E5" },
    { id: "flower_petal3", d: "M 300 350 A 15 15 0 1 1 300 349.9", fill: "#E5E5E5" },
    { id: "flower_petal4", d: "M 250 400 A 15 15 0 1 1 250 399.9", fill: "#E5E5E5" },
    { id: "flower_stem", d: "M 245 420 L 255 420 L 255 480 L 245 480 Z", fill: "#E5E5E5" },
  ],
  // Template 4: House scene
  [
    { id: "house_body", d: "M 50 250 H 200 V 400 H 50 Z", fill: "#E5E5E5" },
    { id: "house_roof", d: "M 30 250 L 125 150 L 220 250 Z", fill: "#E5E5E5" },
    { id: "house_door", d: "M 100 320 H 150 V 400 H 100 Z", fill: "#E5E5E5" },
    { id: "house_window", d: "M 60 270 H 95 V 310 H 60 Z", fill: "#E5E5E5" },
    { id: "house_window2", d: "M 155 270 H 190 V 310 H 155 Z", fill: "#E5E5E5" },
    { id: "car_body", d: "M 260 350 H 380 V 400 H 260 Z", fill: "#E5E5E5" },
    { id: "car_top", d: "M 280 300 H 360 V 350 H 280 Z", fill: "#E5E5E5" },
    { id: "wheel1", d: "M 290 400 A 20 20 0 1 1 290 399.9", fill: "#E5E5E5" },
    { id: "wheel2", d: "M 350 400 A 20 20 0 1 1 350 399.9", fill: "#E5E5E5" },
  ],
  // Template 5: Space
  [
    { id: "rocket_body", d: "M 180 100 L 220 100 L 220 280 L 180 280 Z", fill: "#E5E5E5" },
    { id: "rocket_nose", d: "M 200 50 L 180 100 L 220 100 Z", fill: "#E5E5E5" },
    { id: "rocket_fin1", d: "M 180 250 L 150 300 L 180 300 Z", fill: "#E5E5E5" },
    { id: "rocket_fin2", d: "M 220 250 L 250 300 L 220 300 Z", fill: "#E5E5E5" },
    { id: "rocket_window", d: "M 200 150 A 15 15 0 1 1 200 149.9", fill: "#E5E5E5" },
    { id: "planet1", d: "M 320 120 A 50 50 0 1 1 320 119.9", fill: "#E5E5E5" },
    { id: "planet_ring", d: "M 260 120 Q 320 90 380 120 Q 320 130 260 120", fill: "#E5E5E5" },
    { id: "star_small1", d: "M 80 80 L 85 95 L 100 95 L 88 105 L 92 120 L 80 110 L 68 120 L 72 105 L 60 95 L 75 95 Z", fill: "#E5E5E5" },
    { id: "star_small2", d: "M 350 250 L 355 265 L 370 265 L 358 275 L 362 290 L 350 280 L 338 290 L 342 275 L 330 265 L 345 265 Z", fill: "#E5E5E5" },
    { id: "moon", d: "M 60 200 A 40 40 0 1 1 60 199.9", fill: "#E5E5E5" },
  ],
];

const ColoringPage = () => {
  const [searchParams] = useSearchParams();
  const childId = searchParams.get("child");
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);
  const [shapeFills, setShapeFills] = useState<Record<string, string>>(
    SHAPE_TEMPLATES[0].reduce((acc, shape) => ({ ...acc, [shape.id]: shape.fill }), {})
  );
  const [isSaving, setIsSaving] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const { toast } = useToast();

  const currentShapes = SHAPE_TEMPLATES[currentTemplateIndex];

  const handleShapeClick = (shapeId: string) => {
    setShapeFills((prev) => ({
      ...prev,
      [shapeId]: selectedColor,
    }));
  };

  const handleReset = () => {
    setShapeFills(
      currentShapes.reduce((acc, shape) => ({ ...acc, [shape.id]: shape.fill }), {})
    );
  };

  const handleNewShapes = () => {
    const nextIndex = (currentTemplateIndex + 1) % SHAPE_TEMPLATES.length;
    setCurrentTemplateIndex(nextIndex);
    setShapeFills(
      SHAPE_TEMPLATES[nextIndex].reduce((acc, shape) => ({ ...acc, [shape.id]: shape.fill }), {})
    );
  };

  const getSvgDataUrl = (): Promise<string> => {
    return new Promise((resolve) => {
      if (!svgRef.current) {
        resolve("");
        return;
      }
      
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      
      canvas.width = 400;
      canvas.height = 500;
      
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    });
  };

  const handleDownload = async () => {
    const dataUrl = await getSvgDataUrl();
    if (dataUrl) {
      const link = document.createElement("a");
      link.download = "my-coloring.png";
      link.href = dataUrl;
      link.click();
    }
  };

  const handleDownloadPDF = async () => {
    const dataUrl = await getSvgDataUrl();
    if (!dataUrl) return;

    // Create a simple PDF with the image
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>My Coloring Art</title>
            <style>
              body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
              img { max-width: 100%; height: auto; }
              @media print {
                body { margin: 0; }
                img { max-width: 100%; page-break-inside: avoid; }
              }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" alt="My Coloring Art" />
            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
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

    setIsSaving(true);
    try {
      const dataUrl = await getSvgDataUrl();
      
      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      // Upload to storage
      const fileName = `coloring-${Date.now()}.png`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("creative-content")
        .upload(`artworks/${childId}/${fileName}`, blob, {
          contentType: "image/png",
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("creative-content")
        .getPublicUrl(`artworks/${childId}/${fileName}`);

      // Save to database
      const { error: dbError } = await supabase.from("creative_artworks").insert({
        child_profile_id: childId,
        title: "My Coloring",
        artwork_type: "coloring",
        image_url: urlData.publicUrl,
      });

      if (dbError) throw dbError;

      toast({
        title: "Saved! 🎨",
        description: "Your coloring has been saved to your gallery.",
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
              onClick={handleNewShapes}
              className="rounded-full bg-white"
              title="New Shapes"
            >
              <Shuffle className="w-5 h-5 text-pink-700" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleReset}
              className="rounded-full bg-white"
              title="Reset"
            >
              <RotateCcw className="w-5 h-5 text-pink-700" />
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
              className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-4 transition-all ${
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
              {currentShapes.map((shape) => (
                <path
                  key={shape.id}
                  d={shape.d}
                  fill={shapeFills[shape.id] || shape.fill}
                  stroke="#333"
                  strokeWidth="3"
                  onClick={() => handleShapeClick(shape.id)}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-3 mt-6 flex-wrap">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-xl bg-green-500 hover:bg-green-600 gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button
            onClick={handleDownload}
            className="rounded-xl bg-blue-500 hover:bg-blue-600 gap-2"
          >
            <Download className="w-4 h-4" />
            Download PNG
          </Button>
          <Button
            onClick={handleDownloadPDF}
            className="rounded-xl bg-purple-500 hover:bg-purple-600 gap-2"
          >
            <Download className="w-4 h-4" />
            Print/PDF
          </Button>
        </div>

        {/* Friendly instruction */}
        <div className="text-center mt-6">
          <p className="text-xl text-pink-700 font-medium">
            Tap a color, then tap a shape! 🌈
          </p>
          <p className="text-sm text-pink-500 mt-2">
            Tap the shuffle button for new shapes!
          </p>
        </div>
      </main>
    </div>
  );
};

export default ColoringPage;
