import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Save, Sparkles, Plus, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const DigitalJournal = () => {
  const [searchParams] = useSearchParams();
  const childId = searchParams.get("child");
  const [entries, setEntries] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (childId) fetchEntries();
  }, [childId]);

  const fetchEntries = async () => {
    const { data } = await supabase
      .from("creative_journal_entries")
      .select("*")
      .eq("child_profile_id", childId)
      .order("created_at", { ascending: false })
      .limit(10);
    setEntries(data || []);
  };

  const generatePrompt = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("creative-ai", {
        body: { type: "journal", context: {} },
      });
      if (error) throw error;
      setPrompt(data?.suggestion || "What made you smile today?");
    } catch {
      setPrompt("What's something you're looking forward to?");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!childId || !content.trim()) return;
    try {
      const { error } = await supabase.from("creative_journal_entries").insert({
        child_profile_id: childId,
        title: title || "Untitled Entry",
        content,
        prompt_used: prompt || null,
      } as any);
      if (error) throw error;
      toast({ title: "Entry saved!" });
      setTitle("");
      setContent("");
      setPrompt("");
      fetchEntries();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-zinc-50">
      <header className="py-4 px-4 bg-slate-200/50">
        <div className="container mx-auto flex items-center justify-between">
          <Link to={`/creative/studio${childId ? `?child=${childId}` : ""}`} className="p-2 bg-white rounded-full shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">Journal</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <Card className="p-6 rounded-2xl mb-6">
          <div className="flex gap-2 mb-4">
            <Button variant="outline" onClick={generatePrompt} disabled={isGenerating} className="rounded-xl">
              <Sparkles className="w-4 h-4 mr-2" />
              {isGenerating ? "Thinking..." : "Get Prompt"}
            </Button>
          </div>
          {prompt && (
            <div className="bg-slate-100 rounded-xl p-4 mb-4 text-slate-700 italic">
              "{prompt}"
            </div>
          )}
          <Input
            placeholder="Entry title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-4 rounded-xl"
          />
          <Textarea
            placeholder="Start writing..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px] rounded-xl mb-4"
          />
          <Button onClick={handleSave} disabled={!content.trim() || !childId} className="rounded-xl">
            <Save className="w-4 h-4 mr-2" />
            Save Entry
          </Button>
        </Card>

        {entries.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Recent Entries</h2>
            <div className="space-y-3">
              {entries.map((entry) => (
                <Card key={entry.id} className="p-4 rounded-xl">
                  <h3 className="font-medium">{entry.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{entry.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DigitalJournal;
