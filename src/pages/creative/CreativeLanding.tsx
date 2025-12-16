import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Sparkles, PenTool } from "lucide-react";
import logo from "@/assets/crayonedge_logo.webp";

const CreativeLanding = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-pink-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="py-6 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/creative" className="flex items-center gap-2">
            <img src={logo} alt="CrayonEdge" className="h-10" />
            <span className="text-xl font-bold text-primary">Creative</span>
          </Link>
          <Link to="/creative/parent/login">
            <Button variant="outline">Parent Login</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 text-center">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            A Safe Creative Space for Every Age
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Where children create instead of consume, express instead of compete, 
            and grow confidence through guided creativity.
          </p>
          <Link to="/creative/parent/login">
            <Button size="lg" className="rounded-2xl">
              Get Started as a Parent
            </Button>
          </Link>
        </div>
      </section>

      {/* Age Group Cards */}
      <section className="py-12 px-4 flex-1">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Choose Your Creative Space</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Minis Card */}
            <Card className="border-4 border-amber-200 rounded-3xl overflow-hidden hover:shadow-xl transition-shadow bg-amber-50/50">
              <CardHeader className="text-center pb-2">
                <div className="w-20 h-20 mx-auto mb-4 bg-amber-200 rounded-full flex items-center justify-center">
                  <Palette className="w-10 h-10 text-amber-600" />
                </div>
                <CardTitle className="text-2xl text-amber-700">Minis</CardTitle>
                <CardDescription className="text-amber-600 font-medium">Ages 2-5</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                  Sensory play, tap-to-color, shape matching, and drag-and-drop fun!
                </p>
                <ul className="text-sm text-left space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-400 rounded-full" />
                    Tap-to-Color Pages
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-400 rounded-full" />
                    Shape Matching Games
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-400 rounded-full" />
                    Drag-and-Drop Scenes
                  </li>
                </ul>
                <Link to="/creative/minis">
                  <Button className="w-full rounded-2xl bg-amber-500 hover:bg-amber-600">
                    Explore Minis
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Creators Card */}
            <Card className="border-4 border-blue-200 rounded-3xl overflow-hidden hover:shadow-xl transition-shadow bg-blue-50/50">
              <CardHeader className="text-center pb-2">
                <div className="w-20 h-20 mx-auto mb-4 bg-blue-200 rounded-full flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-blue-600" />
                </div>
                <CardTitle className="text-2xl text-blue-700">Creators</CardTitle>
                <CardDescription className="text-blue-600 font-medium">Ages 6-11</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                  Draw, build stories, complete challenges, and earn badges!
                </p>
                <ul className="text-sm text-left space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full" />
                    Drawing Pad
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full" />
                    Story Builder
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full" />
                    Creative Challenges
                  </li>
                </ul>
                <Link to="/creative/creators">
                  <Button className="w-full rounded-2xl bg-blue-500 hover:bg-blue-600">
                    Explore Creators
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Studio Card */}
            <Card className="border-4 border-purple-200 rounded-3xl overflow-hidden hover:shadow-xl transition-shadow bg-purple-50/50">
              <CardHeader className="text-center pb-2">
                <div className="w-20 h-20 mx-auto mb-4 bg-purple-200 rounded-full flex items-center justify-center">
                  <PenTool className="w-10 h-10 text-purple-600" />
                </div>
                <CardTitle className="text-2xl text-purple-700">Studio</CardTitle>
                <CardDescription className="text-purple-600 font-medium">Ages 12-18</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                  Journal, create mood boards, get AI prompts, and build your portfolio.
                </p>
                <ul className="text-sm text-left space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-400 rounded-full" />
                    Digital Journal
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-400 rounded-full" />
                    Mood Boards
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-400 rounded-full" />
                    AI Idea Prompts
                  </li>
                </ul>
                <Link to="/creative/studio">
                  <Button className="w-full rounded-2xl bg-purple-500 hover:bg-purple-600">
                    Explore Studio
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-10">Safe & Creative By Design</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🔒</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">COPPA Compliant</h3>
                <p className="text-sm text-muted-foreground">Child-safe by design with no ads, no chat, and no violence.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">👨‍👩‍👧</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Parent Controlled</h3>
                <p className="text-sm text-muted-foreground">Full control over access, time limits, and privacy settings.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">⏱️</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Gentle Time Limits</h3>
                <p className="text-sm text-muted-foreground">No infinite loops. Customizable session limits for healthy screen time.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🏆</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Non-Competitive</h3>
                <p className="text-sm text-muted-foreground">Encouraging badges and completion-based rewards. No rankings.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center border-t bg-white/50">
        <div className="container mx-auto space-y-3">
          <Link to="/creative">
            <img src={logo} alt="CrayonEdge" className="h-8 mx-auto" />
          </Link>
          <p className="text-xs text-muted-foreground">
            Powered by Texcortech Systems
          </p>
          <p className="text-sm text-muted-foreground">
            Part of the <Link to="/" className="text-primary hover:underline">CrayonEdge</Link> family
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CreativeLanding;
