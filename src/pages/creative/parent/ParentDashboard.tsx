import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Plus, Settings, LogOut, User, Clock, Palette, Sparkles, PenTool, Trash2 } from "lucide-react";

type AgeGroup = "minis" | "creators" | "studio";

interface ChildProfile {
  id: string;
  name: string;
  age: number;
  age_group: AgeGroup;
  avatar_url: string | null;
  created_at: string;
}

interface ParentSettings {
  sound_enabled: boolean;
  session_limit_minutes: number;
}

const getAgeGroup = (age: number): AgeGroup => {
  if (age <= 5) return "minis";
  if (age <= 11) return "creators";
  return "studio";
};

const getAgeGroupIcon = (ageGroup: AgeGroup) => {
  switch (ageGroup) {
    case "minis": return <Palette className="w-6 h-6 text-amber-600" />;
    case "creators": return <Sparkles className="w-6 h-6 text-blue-600" />;
    case "studio": return <PenTool className="w-6 h-6 text-purple-600" />;
  }
};

const getAgeGroupColor = (ageGroup: AgeGroup) => {
  switch (ageGroup) {
    case "minis": return "bg-amber-100 border-amber-300";
    case "creators": return "bg-blue-100 border-blue-300";
    case "studio": return "bg-purple-100 border-purple-300";
  }
};

const getAgeGroupPath = (ageGroup: AgeGroup) => {
  return `/creative/${ageGroup}`;
};

const ParentDashboard = () => {
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [settings, setSettings] = useState<ParentSettings>({ sound_enabled: true, session_limit_minutes: 30 });
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [newChildName, setNewChildName] = useState("");
  const [newChildAge, setNewChildAge] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate("/creative/parent/login");
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch children
      const { data: childrenData, error: childrenError } = await supabase
        .from("creative_child_profiles")
        .select("*")
        .order("created_at", { ascending: true });

      if (childrenError) throw childrenError;
      setChildren(childrenData || []);

      // Fetch or create parent settings
      const { data: settingsData, error: settingsError } = await supabase
        .from("creative_parent_settings")
        .select("*")
        .single();

      if (settingsError && settingsError.code !== "PGRST116") {
        throw settingsError;
      }

      if (settingsData) {
        setSettings({
          sound_enabled: settingsData.sound_enabled,
          session_limit_minutes: settingsData.session_limit_minutes || 30,
        });
      } else {
        // Create default settings
        await supabase.from("creative_parent_settings").insert({
          user_id: user?.id,
          sound_enabled: true,
          session_limit_minutes: 30,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddChild = async () => {
    if (!newChildName.trim() || !newChildAge) return;
    
    setIsAddingChild(true);
    try {
      const age = parseInt(newChildAge);
      const ageGroup = getAgeGroup(age);

      const { error } = await supabase.from("creative_child_profiles").insert({
        parent_id: user?.id,
        name: newChildName.trim(),
        age,
        age_group: ageGroup,
      });

      if (error) throw error;

      toast({
        title: "Child profile created!",
        description: `${newChildName} can now access ${ageGroup === "minis" ? "Minis" : ageGroup === "creators" ? "Creators" : "Studio"}.`,
      });

      setNewChildName("");
      setNewChildAge("");
      setDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error creating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsAddingChild(false);
    }
  };

  const handleDeleteChild = async (childId: string, childName: string) => {
    if (!confirm(`Are you sure you want to delete ${childName}'s profile? This will also delete all their saved work.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("creative_child_profiles")
        .delete()
        .eq("id", childId);

      if (error) throw error;

      toast({
        title: "Profile deleted",
        description: `${childName}'s profile has been removed.`,
      });
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error deleting profile",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateSettings = async (newSettings: Partial<ParentSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);

    try {
      const { error } = await supabase
        .from("creative_parent_settings")
        .update(updatedSettings)
        .eq("user_id", user?.id);

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/creative");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="py-6 px-4 border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/creative" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold">Parent Dashboard</h1>
          </div>
          <Button variant="ghost" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Children Profiles Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Children's Profiles</h2>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Child
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl">
                <DialogHeader>
                  <DialogTitle>Add a Child</DialogTitle>
                  <DialogDescription>
                    Create a profile for your child. They'll be placed in the appropriate age group automatically.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="child-name">Child's Name</Label>
                    <Input
                      id="child-name"
                      placeholder="Enter name"
                      value={newChildName}
                      onChange={(e) => setNewChildName(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="child-age">Age</Label>
                    <Select value={newChildAge} onValueChange={setNewChildAge}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select age" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 17 }, (_, i) => i + 2).map((age) => (
                          <SelectItem key={age} value={age.toString()}>
                            {age} years old {age <= 5 ? "(Minis)" : age <= 11 ? "(Creators)" : "(Studio)"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={handleAddChild} 
                    className="w-full rounded-xl"
                    disabled={isAddingChild || !newChildName.trim() || !newChildAge}
                  >
                    {isAddingChild ? "Creating..." : "Create Profile"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {children.length === 0 ? (
            <Card className="border-2 border-dashed rounded-3xl">
              <CardContent className="py-12 text-center">
                <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No children yet</h3>
                <p className="text-muted-foreground mb-4">Add your first child to get started!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {children.map((child) => (
                <Card 
                  key={child.id} 
                  className={`border-2 rounded-3xl overflow-hidden ${getAgeGroupColor(child.age_group)}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                          {getAgeGroupIcon(child.age_group)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{child.name}</CardTitle>
                          <CardDescription>
                            {child.age} years old • {child.age_group.charAt(0).toUpperCase() + child.age_group.slice(1)}
                          </CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteChild(child.id, child.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Link to={`${getAgeGroupPath(child.age_group)}?child=${child.id}`}>
                      <Button className="w-full rounded-xl mt-2">
                        Start Playing
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Settings Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5" />
            <h2 className="text-2xl font-bold">Settings</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-2xl">🔊</span> Sound Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Sounds</p>
                    <p className="text-sm text-muted-foreground">Soft, friendly sounds during activities</p>
                  </div>
                  <Switch
                    checked={settings.sound_enabled}
                    onCheckedChange={(checked) => handleUpdateSettings({ sound_enabled: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" /> Session Limits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Maximum session time (minutes)</Label>
                  <Select
                    value={settings.session_limit_minutes.toString()}
                    onValueChange={(value) => handleUpdateSettings({ session_limit_minutes: parseInt(value) })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    A gentle reminder will appear when the session limit is reached.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ParentDashboard;
