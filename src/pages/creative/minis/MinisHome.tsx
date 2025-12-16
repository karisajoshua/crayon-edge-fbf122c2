import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Palette, Shapes, Move } from "lucide-react";

const MinisHome = () => {
  const [searchParams] = useSearchParams();
  const childId = searchParams.get("child");

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 via-amber-50 to-yellow-50">
      {/* Header - Large, friendly */}
      <header className="py-6 px-4 bg-amber-200/50">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/creative/parent/dashboard" className="p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow">
            <ArrowLeft className="w-6 h-6 text-amber-700" />
          </Link>
          <h1 className="text-3xl font-bold text-amber-800">Minis</h1>
          <div className="w-12" /> {/* Spacer */}
        </div>
      </header>

      {/* Activity Cards - Extra large and friendly */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid gap-8 max-w-2xl mx-auto">
          {/* Color Activity */}
          <Link to={`/creative/minis/color${childId ? `?child=${childId}` : ""}`}>
            <Card className="border-4 border-pink-300 rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all hover:scale-[1.02] bg-pink-50">
              <CardContent className="p-8 flex items-center gap-6">
                <div className="w-24 h-24 bg-pink-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <Palette className="w-12 h-12 text-pink-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-pink-700 mb-2">Color!</h2>
                  <p className="text-pink-600 text-lg">Tap to fill with pretty colors</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Shapes Activity */}
          <Link to={`/creative/minis/match${childId ? `?child=${childId}` : ""}`}>
            <Card className="border-4 border-green-300 rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all hover:scale-[1.02] bg-green-50">
              <CardContent className="p-8 flex items-center gap-6">
                <div className="w-24 h-24 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shapes className="w-12 h-12 text-green-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-green-700 mb-2">Shapes!</h2>
                  <p className="text-green-600 text-lg">Match the shapes together</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Play Activity */}
          <Link to={`/creative/minis/play${childId ? `?child=${childId}` : ""}`}>
            <Card className="border-4 border-blue-300 rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all hover:scale-[1.02] bg-blue-50">
              <CardContent className="p-8 flex items-center gap-6">
                <div className="w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <Move className="w-12 h-12 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-blue-700 mb-2">Play!</h2>
                  <p className="text-blue-600 text-lg">Drag things into the scene</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Friendly message */}
        <div className="text-center mt-12">
          <p className="text-2xl text-amber-700 font-medium">
            What do you want to do today? 🎨
          </p>
        </div>
      </main>
    </div>
  );
};

export default MinisHome;
