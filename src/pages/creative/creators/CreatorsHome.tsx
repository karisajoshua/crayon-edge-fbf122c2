import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Pencil, BookOpen, Trophy, Image } from "lucide-react";

const CreatorsHome = () => {
  const [searchParams] = useSearchParams();
  const childId = searchParams.get("child");

  const activities = [
    {
      title: "Draw",
      description: "Create your own artwork with pencils and brushes",
      icon: Pencil,
      path: "draw",
      color: "orange",
      bgClass: "bg-orange-50",
      borderClass: "border-orange-300",
      iconBgClass: "bg-orange-200",
      iconClass: "text-orange-600",
      btnClass: "bg-orange-500 hover:bg-orange-600",
    },
    {
      title: "Story Builder",
      description: "Create your own stories with characters and scenes",
      icon: BookOpen,
      path: "story",
      color: "teal",
      bgClass: "bg-teal-50",
      borderClass: "border-teal-300",
      iconBgClass: "bg-teal-200",
      iconClass: "text-teal-600",
      btnClass: "bg-teal-500 hover:bg-teal-600",
    },
    {
      title: "Challenges",
      description: "Complete fun creative challenges and earn badges!",
      icon: Trophy,
      path: "challenges",
      color: "purple",
      bgClass: "bg-purple-50",
      borderClass: "border-purple-300",
      iconBgClass: "bg-purple-200",
      iconClass: "text-purple-600",
      btnClass: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "My Gallery",
      description: "View all your amazing creations",
      icon: Image,
      path: "gallery",
      color: "pink",
      bgClass: "bg-pink-50",
      borderClass: "border-pink-300",
      iconBgClass: "bg-pink-200",
      iconClass: "text-pink-600",
      btnClass: "bg-pink-500 hover:bg-pink-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="py-6 px-4 bg-blue-200/50">
        <div className="container mx-auto flex items-center justify-between">
          <Link
            to="/creative/parent/dashboard"
            className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-blue-700" />
          </Link>
          <h1 className="text-2xl font-bold text-blue-800">Creators</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Welcome Message */}
      <section className="py-8 px-4 text-center">
        <h2 className="text-3xl font-bold text-blue-900 mb-2">Welcome, Creator! ✨</h2>
        <p className="text-blue-600">What would you like to create today?</p>
      </section>

      {/* Activity Cards */}
      <main className="container mx-auto px-4 pb-12">
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {activities.map((activity) => (
            <Card
              key={activity.path}
              className={`border-2 ${activity.borderClass} rounded-3xl overflow-hidden hover:shadow-xl transition-all hover:scale-[1.02] ${activity.bgClass}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 ${activity.iconBgClass} rounded-2xl flex items-center justify-center`}>
                    <activity.icon className={`w-7 h-7 ${activity.iconClass}`} />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{activity.title}</CardTitle>
                    <CardDescription>{activity.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link to={`/creative/creators/${activity.path}${childId ? `?child=${childId}` : ""}`}>
                  <Button className={`w-full rounded-xl ${activity.btnClass}`}>
                    Start Creating
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Encouraging message */}
        <div className="text-center mt-12">
          <div className="inline-block bg-white rounded-2xl px-6 py-4 shadow-lg">
            <p className="text-lg font-medium text-blue-800">
              🎨 Every creation is amazing - there's no wrong way to be creative!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatorsHome;
