import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, Star, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Challenge {
  id: string;
  title: string;
  description: string;
  challenge_type: string;
  is_active: boolean;
}

interface Completion {
  challenge_id: string;
  completed_at: string;
}

const ChallengesHub = () => {
  const [searchParams] = useSearchParams();
  const childId = searchParams.get("child");
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [childId]);

  const fetchData = async () => {
    try {
      // Fetch challenges for creators age group
      const { data: challengeData, error: challengeError } = await supabase
        .from("creative_challenges")
        .select("*")
        .eq("age_group", "creators")
        .eq("is_active", true);

      if (challengeError) throw challengeError;
      setChallenges(challengeData || []);

      // Fetch completions if child is selected
      if (childId) {
        const { data: completionData, error: completionError } = await supabase
          .from("creative_challenge_completions")
          .select("challenge_id, completed_at")
          .eq("child_profile_id", childId);

        if (completionError) throw completionError;
        setCompletions(completionData || []);
      }
    } catch (error: any) {
      toast({
        title: "Error loading challenges",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async (challengeId: string) => {
    if (!childId) {
      toast({
        title: "Select a profile",
        description: "Please select a child profile to complete challenges.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("creative_challenge_completions").insert({
        child_profile_id: childId,
        challenge_id: challengeId,
      });

      if (error) throw error;

      setCompletions([...completions, { challenge_id: challengeId, completed_at: new Date().toISOString() }]);
      
      toast({
        title: "🎉 Challenge Complete!",
        description: "Great job! You earned a star!",
      });
    } catch (error: any) {
      if (error.code === "23505") {
        toast({
          title: "Already completed",
          description: "You've already completed this challenge!",
        });
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const isCompleted = (challengeId: string) => {
    return completions.some((c) => c.challenge_id === challengeId);
  };

  // Default challenges if none exist
  const defaultChallenges = [
    {
      id: "default-1",
      title: "Draw Your Hero",
      description: "Create a drawing of your favorite hero - real or imaginary!",
      challenge_type: "weekly",
      is_active: true,
    },
    {
      id: "default-2",
      title: "Design Your Dream School",
      description: "What would your perfect school look like? Draw or describe it!",
      challenge_type: "weekly",
      is_active: true,
    },
    {
      id: "default-3",
      title: "Invent a New Animal",
      description: "Combine features from different animals to create something new!",
      challenge_type: "weekly",
      is_active: true,
    },
  ];

  const displayChallenges = challenges.length > 0 ? challenges : defaultChallenges;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-700">Loading challenges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="py-4 px-4 bg-purple-200/50">
        <div className="container mx-auto flex items-center justify-between">
          <Link
            to={`/creative/creators${childId ? `?child=${childId}` : ""}`}
            className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-purple-700" />
          </Link>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-purple-700" />
            <h1 className="text-xl font-bold text-purple-800">Challenges</h1>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-400" />
            <span className="font-bold text-purple-800">{completions.length}</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Progress */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-purple-900 mb-2">
            {completions.length > 0 ? "Keep Going! You're doing great! 🌟" : "Ready for a Challenge? ✨"}
          </h2>
          <p className="text-purple-600">
            Complete challenges to earn stars. There's no wrong way to be creative!
          </p>
        </div>

        {/* Challenge Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {displayChallenges.map((challenge) => {
            const completed = isCompleted(challenge.id);
            return (
              <Card
                key={challenge.id}
                className={`rounded-3xl overflow-hidden transition-all ${
                  completed
                    ? "bg-green-50 border-green-300"
                    : "bg-white border-purple-200 hover:shadow-lg hover:scale-[1.02]"
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary" className="rounded-full">
                      {challenge.challenge_type}
                    </Badge>
                    {completed && (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                  </div>
                  <CardTitle className="text-lg mt-2">{challenge.title}</CardTitle>
                  <CardDescription>{challenge.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {completed ? (
                    <div className="text-center py-2">
                      <span className="text-green-600 font-medium flex items-center justify-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-400" />
                        Completed!
                      </span>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleComplete(challenge.id)}
                      className="w-full rounded-xl bg-purple-500 hover:bg-purple-600"
                    >
                      Mark as Complete
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Encouragement */}
        <div className="text-center mt-12">
          <div className="inline-block bg-white rounded-2xl px-6 py-4 shadow-lg">
            <p className="text-lg font-medium text-purple-800">
              💡 Remember: Challenges are for fun! There are no wrong answers.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChallengesHub;
