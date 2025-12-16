import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Layout, Lightbulb, Briefcase } from "lucide-react";
import CreativeLayout from "@/components/creative/CreativeLayout";

const StudioHome = () => {
  const [searchParams] = useSearchParams();
  const childId = searchParams.get("child");

  const activities = [
    { title: "Journal", description: "Private space for your thoughts", icon: BookOpen, path: "journal", color: "slate" },
    { title: "Mood Boards", description: "Visualize your ideas", icon: Layout, path: "moodboard", color: "indigo" },
    { title: "Idea Prompts", description: "AI-powered creative sparks", icon: Lightbulb, path: "prompts", color: "amber" },
    { title: "Portfolio", description: "Showcase your best work", icon: Briefcase, path: "portfolio", color: "emerald" },
  ];

  return (
    <CreativeLayout className="bg-gradient-to-b from-slate-100 via-slate-50 to-zinc-50">
      <header className="py-6 px-4 bg-slate-200/50">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/creative/parent/dashboard" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Studio</h1>
          <div className="w-10" />
        </div>
      </header>

      <section className="py-8 px-4 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Your Creative Space</h2>
        <p className="text-slate-600">Express yourself. No judgment, just creativity.</p>
      </section>

      <main className="container mx-auto px-4 pb-12">
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {activities.map((activity) => (
            <Card key={activity.path} className="rounded-2xl hover:shadow-lg transition-all hover:scale-[1.02]">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                    <activity.icon className="w-6 h-6 text-slate-700" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{activity.title}</CardTitle>
                    <CardDescription>{activity.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link to={`/creative/studio/${activity.path}${childId ? `?child=${childId}` : ""}`}>
                  <Button className="w-full rounded-xl">Open</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </CreativeLayout>
  );
};

export default StudioHome;
