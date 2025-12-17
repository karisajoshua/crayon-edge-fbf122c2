import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Trash2, Layout, Save, Palette } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MoodBoardItem {
  id: string;
  type: "color" | "text" | "image";
  content: string;
  x: number;
  y: number;
}

interface MoodBoard {
  id: string;
  title: string;
  board_data: MoodBoardItem[];
  created_at: string;
}

const PRESET_COLORS = [
  "#FF6B6B", "#FFA94D", "#FFE066", "#69DB7C", "#74C0FC",
  "#B197FC", "#F783AC", "#A0866B", "#66D9E8", "#A9E34B",
];

const MoodBoardEditor = () => {
  const [searchParams] = useSearchParams();
  const childId = searchParams.get("child");
  const [boards, setBoards] = useState<MoodBoard[]>([]);
  const [currentBoard, setCurrentBoard] = useState<MoodBoard | null>(null);
  const [items, setItems] = useState<MoodBoardItem[]>([]);
  const [boardTitle, setBoardTitle] = useState("My Mood Board");
  const [newText, setNewText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (childId) {
      fetchBoards();
    } else {
      setIsLoading(false);
    }
  }, [childId]);

  const fetchBoards = async () => {
    try {
      const { data, error } = await supabase
        .from("creative_mood_boards")
        .select("*")
        .eq("child_profile_id", childId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      const formattedBoards = (data || []).map(board => ({
        ...board,
        board_data: (board.board_data as unknown as MoodBoardItem[]) || []
      }));
      
      setBoards(formattedBoards);
    } catch (error: any) {
      toast({
        title: "Error loading boards",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddColor = (color: string) => {
    const newItem: MoodBoardItem = {
      id: `color-${Date.now()}`,
      type: "color",
      content: color,
      x: Math.random() * 70,
      y: Math.random() * 70,
    };
    setItems([...items, newItem]);
  };

  const handleAddText = () => {
    if (!newText.trim()) return;
    const newItem: MoodBoardItem = {
      id: `text-${Date.now()}`,
      type: "text",
      content: newText,
      x: Math.random() * 60,
      y: Math.random() * 60,
    };
    setItems([...items, newItem]);
    setNewText("");
  };

  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId));
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
      if (currentBoard) {
        // Update existing board
        const { error } = await supabase
          .from("creative_mood_boards")
          .update({
            title: boardTitle,
            board_data: items as unknown as any,
            updated_at: new Date().toISOString(),
          })
          .eq("id", currentBoard.id);

        if (error) throw error;
      } else {
        // Create new board
        const { error } = await supabase
          .from("creative_mood_boards")
          .insert({
            child_profile_id: childId,
            title: boardTitle,
            board_data: items as unknown as any,
          });

        if (error) throw error;
      }

      toast({
        title: "Saved! 🎨",
        description: "Your mood board has been saved.",
      });

      fetchBoards();
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

  const handleNewBoard = () => {
    setCurrentBoard(null);
    setItems([]);
    setBoardTitle("My Mood Board");
  };

  const handleLoadBoard = (board: MoodBoard) => {
    setCurrentBoard(board);
    setItems(board.board_data || []);
    setBoardTitle(board.title);
  };

  const handleDeleteBoard = async (boardId: string) => {
    if (!confirm("Are you sure you want to delete this mood board?")) return;

    try {
      const { error } = await supabase
        .from("creative_mood_boards")
        .delete()
        .eq("id", boardId);

      if (error) throw error;

      setBoards(boards.filter((b) => b.id !== boardId));
      if (currentBoard?.id === boardId) {
        handleNewBoard();
      }

      toast({
        title: "Deleted",
        description: "Mood board has been deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-indigo-50 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-indigo-700">Loading mood boards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-indigo-50 to-slate-50">
      <header className="py-4 px-4 bg-indigo-200/50">
        <div className="container mx-auto flex items-center justify-between">
          <Link
            to={`/creative/studio${childId ? `?child=${childId}` : ""}`}
            className="p-2 bg-white rounded-full shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-5 h-5 text-indigo-700" />
          </Link>
          <div className="flex items-center gap-2">
            <Layout className="w-6 h-6 text-indigo-700" />
            <h1 className="text-xl font-bold text-indigo-800">Mood Boards</h1>
          </div>
          <div className="w-10" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {!childId ? (
          <div className="text-center py-12">
            <Layout className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-medium mb-2">No profile selected</h2>
            <p className="text-muted-foreground mb-4">
              Please select a child profile to create mood boards.
            </p>
            <Link to="/creative/parent/dashboard">
              <Button className="rounded-xl">Go to Parent Dashboard</Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar - Saved Boards */}
            <div className="lg:col-span-1">
              <Card className="rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>My Boards</span>
                    <Button size="sm" onClick={handleNewBoard} className="rounded-lg">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-[300px] overflow-y-auto">
                  {boards.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No boards yet</p>
                  ) : (
                    boards.map((board) => (
                      <div
                        key={board.id}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-indigo-50 ${
                          currentBoard?.id === board.id ? "bg-indigo-100" : ""
                        }`}
                        onClick={() => handleLoadBoard(board)}
                      >
                        <span className="text-sm truncate">{board.title}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBoard(board.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Main Editor */}
            <div className="lg:col-span-3">
              <Card className="rounded-2xl">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-4 flex-wrap">
                    <Input
                      value={boardTitle}
                      onChange={(e) => setBoardTitle(e.target.value)}
                      placeholder="Board title"
                      className="w-48 rounded-lg"
                    />
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="rounded-lg bg-indigo-500 hover:bg-indigo-600 gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? "Saving..." : "Save Board"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Color Palette */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Palette className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm font-medium">Add Colors</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {PRESET_COLORS.map((color) => (
                        <button
                          key={color}
                          onClick={() => handleAddColor(color)}
                          className="w-8 h-8 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Text Input */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <Input
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        placeholder="Add a word or phrase..."
                        className="flex-1 rounded-lg"
                        onKeyDown={(e) => e.key === "Enter" && handleAddText()}
                      />
                      <Button onClick={handleAddText} className="rounded-lg">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Board Canvas */}
                  <div
                    className="relative w-full aspect-[16/9] bg-white rounded-xl border-2 border-dashed border-indigo-200 overflow-hidden"
                  >
                    {items.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <p>Add colors and words to your mood board!</p>
                      </div>
                    )}
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="absolute cursor-pointer group"
                        style={{
                          left: `${item.x}%`,
                          top: `${item.y}%`,
                        }}
                      >
                        {item.type === "color" && (
                          <div
                            className="w-16 h-16 rounded-lg shadow-lg hover:scale-110 transition-transform"
                            style={{ backgroundColor: item.content }}
                          />
                        )}
                        {item.type === "text" && (
                          <div className="bg-white px-3 py-1 rounded-lg shadow-lg text-indigo-800 font-medium hover:scale-105 transition-transform">
                            {item.content}
                          </div>
                        )}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MoodBoardEditor;
