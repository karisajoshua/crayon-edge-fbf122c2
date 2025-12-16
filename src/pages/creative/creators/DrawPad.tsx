import { useState, useRef, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Pencil, Eraser, Download, RotateCcw, Undo } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const COLORS = [
  "#000000", "#FFFFFF", "#FF0000", "#FF7F00", "#FFFF00",
  "#00FF00", "#0000FF", "#4B0082", "#9400D3", "#FF69B4",
  "#8B4513", "#808080",
];

interface Point {
  x: number;
  y: number;
}

interface Line {
  points: Point[];
  color: string;
  width: number;
  isEraser: boolean;
}

const DrawPad = () => {
  const [searchParams] = useSearchParams();
  const childId = searchParams.get("child");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [isEraser, setIsEraser] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const { toast } = useToast();

  // Draw all lines to canvas
  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas with white background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw all lines
    [...lines, currentLine].filter(Boolean).forEach((line) => {
      if (!line || line.points.length < 2) return;
      
      ctx.beginPath();
      ctx.strokeStyle = line.isEraser ? "#FFFFFF" : line.color;
      ctx.lineWidth = line.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.moveTo(line.points[0].x, line.points[0].y);
      for (let i = 1; i < line.points.length; i++) {
        ctx.lineTo(line.points[i].x, line.points[i].y);
      }
      ctx.stroke();
    });
  };

  useEffect(() => {
    redrawCanvas();
  }, [lines, currentLine]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.clientWidth;
      canvas.height = 400;
    }

    redrawCanvas();
  }, []);

  const getPointFromEvent = (e: React.MouseEvent | React.TouchEvent): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ("touches" in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const point = getPointFromEvent(e);
    if (!point) return;

    setIsDrawing(true);
    setCurrentLine({
      points: [point],
      color,
      width: brushSize,
      isEraser,
    });
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !currentLine) return;

    const point = getPointFromEvent(e);
    if (!point) return;

    setCurrentLine({
      ...currentLine,
      points: [...currentLine.points, point],
    });
  };

  const stopDrawing = () => {
    if (currentLine && currentLine.points.length > 1) {
      setLines([...lines, currentLine]);
    }
    setCurrentLine(null);
    setIsDrawing(false);
  };

  const handleUndo = () => {
    setLines(lines.slice(0, -1));
  };

  const handleClear = () => {
    setLines([]);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "my-drawing.png";
    link.href = canvas.toDataURL("image/png");
    link.click();

    toast({
      title: "Drawing saved!",
      description: "Your drawing has been downloaded.",
    });
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

    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), "image/png");
      });

      // Upload to storage
      const filename = `${childId}/${Date.now()}.png`;
      const { error: uploadError } = await supabase.storage
        .from("creative-content")
        .upload(filename, blob);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("creative-content")
        .getPublicUrl(filename);

      // Save to database
      const { error: dbError } = await supabase.from("creative_artworks").insert({
        child_profile_id: childId,
        title: `Drawing - ${new Date().toLocaleDateString()}`,
        artwork_type: "drawing",
        image_url: urlData.publicUrl,
      });

      if (dbError) throw dbError;

      toast({
        title: "Drawing saved!",
        description: "Your artwork has been saved to your gallery.",
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
    <div className="min-h-screen bg-gradient-to-b from-orange-100 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="py-4 px-4 bg-orange-200/50">
        <div className="container mx-auto flex items-center justify-between">
          <Link
            to={`/creative/creators${childId ? `?child=${childId}` : ""}`}
            className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-orange-700" />
          </Link>
          <h1 className="text-xl font-bold text-orange-800">Draw</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleUndo} className="rounded-full bg-white" disabled={lines.length === 0}>
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleClear} className="rounded-full bg-white">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4">
        {/* Tools */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {/* Tool Selection */}
          <div className="flex gap-2">
            <Button
              variant={!isEraser ? "default" : "outline"}
              size="icon"
              onClick={() => setIsEraser(false)}
              className="rounded-xl"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant={isEraser ? "default" : "outline"}
              size="icon"
              onClick={() => setIsEraser(true)}
              className="rounded-xl"
            >
              <Eraser className="w-4 h-4" />
            </Button>
          </div>

          {/* Brush Size */}
          <div className="flex items-center gap-2 flex-1 min-w-[150px] max-w-[200px]">
            <span className="text-sm">Size:</span>
            <Slider
              value={[brushSize]}
              onValueChange={(v) => setBrushSize(v[0])}
              min={2}
              max={30}
              step={1}
              className="flex-1"
            />
          </div>
        </div>

        {/* Color Palette */}
        <div className="flex flex-wrap gap-2 mb-4">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => { setColor(c); setIsEraser(false); }}
              className={`w-10 h-10 rounded-full border-2 transition-all ${
                color === c && !isEraser
                  ? "ring-2 ring-offset-2 ring-orange-500 scale-110"
                  : "hover:scale-105"
              }`}
              style={{
                backgroundColor: c,
                borderColor: c === "#FFFFFF" ? "#E5E5E5" : c,
              }}
            />
          ))}
        </div>

        {/* Canvas */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-4">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full touch-none cursor-crosshair"
            style={{ height: "400px" }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <Button onClick={handleDownload} variant="outline" className="rounded-xl">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          {childId && (
            <Button onClick={handleSave} className="rounded-xl bg-orange-500 hover:bg-orange-600">
              Save to Gallery
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default DrawPad;
