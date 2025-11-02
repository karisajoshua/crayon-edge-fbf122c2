import { Link } from "react-router-dom";
import { Baby, BookOpen, Heart, MessageCircle, Palette, Smile, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import CategoryTile from "@/components/CategoryTile";
import TestimonialCard from "@/components/TestimonialCard";
import WaveDivider from "@/components/WaveDivider";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";

const Home = () => {
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [postsResult, categoriesResult] = await Promise.all([
      supabase
        .from("blog_posts")
        .select("*, categories(name)")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(3),
      supabase
        .from("categories")
        .select("*")
        .order("name")
    ]);

    if (postsResult.data) {
      setLatestPosts(postsResult.data.map(post => ({
        id: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        image: post.featured_image,
        date: new Date(post.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        }),
        category: post.categories?.name || "Uncategorized"
      })));
    }

    if (categoriesResult.data) {
      setCategories(categoriesResult.data.map(cat => ({
        name: cat.name,
        icon: getIconForCategory(cat.name),
        slug: cat.slug
      })));
    }
  };

  const getIconForCategory = (name: string) => {
    const iconMap: Record<string, any> = {
      "Play": Palette,
      "Pregnancy & Newborn": Baby,
      "Tantrums": MessageCircle,
      "Child Developmental Milestones": Target,
      "Parenting Challenges": Heart,
      "Discipline": Smile,
      "Parenting Tips": BookOpen,
    };
    return iconMap[name] || BookOpen;
  };

  const testimonials = [
    { text: "This blog makes me feel seen as a parent.", author: "Sarah M." },
    { text: "I come here when I need a moment of calm.", author: "Jessica L." },
    { text: "Simple advice that actually works.", author: "Michael T." }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section - Full Width */}
        <section 
          className="relative -mt-20 w-full bg-cover bg-center min-h-[80vh]"
          style={{
            backgroundImage: "url('https://qjivusdkfvjrzaqyxxmy.supabase.co/storage/v1/object/public/blog-images/0.019568322083228007.jpeg')"
          }}
        >
          <div className="absolute inset-0 bg-blue-500/30"></div>
          <div className="relative z-10 pt-20 py-20 md:py-32">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h1 className="text-5xl md:text-6xl font-bold leading-tight text-white drop-shadow-lg">
                    Where Parenting Meets Understanding
                  </h1>
                  <p className="text-xl text-white drop-shadow-md">
                    A calm and supportive space for real-life parenting insights grounded in child development and psychology.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link to="/blog">
                      <Button size="lg" className="bg-footer text-white hover:bg-footer/90 shadow-lg">
                        Explore the Blog
                      </Button>
                    </Link>
                    <Link to="/about">
                      <Button size="lg" className="bg-white text-foreground hover:bg-white/90 shadow-lg">
                        Learn More About Me
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Preview */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Welcome to CrayonEdge</h2>
              <p className="text-lg">
                Hi, I am a mother learning my way through the ups and downs of raising two little humans, just like you. CrayonEdge is my journal of lessons, the laughter that keeps me going, and the boundaries that help us all breathe easier. This is a space where the imperfect days are welcomed, and where we grow together while nurturing our children's little steps.
              </p>
              <Link to="/about">
                <Button variant="outline" size="lg">
                  Read My Story →
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Categories Grid - Search by Topic */}
        <section className="relative">
          <WaveDivider position="top" color="#fee5d2" />
          <div className="bg-accent py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Search by Topic
                </h2>
                <p className="text-xl text-muted-foreground">
                  Explore parenting wisdom by category
                </p>
              </div>
              <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    to={`/blog/category/${category.slug}`}
                    className="px-6 py-3 bg-white hover:bg-white/90 border-2 border-white/50 hover:border-white transition-all duration-300 hover:scale-105 hover:shadow-lg font-medium text-lg"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <WaveDivider position="bottom" color="#fee5d2" />
        </section>

        {/* Latest Posts */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Latest Articles</h2>
              <Link to="/blog" className="text-primary hover:text-primary-dark font-medium">
                View All →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <BlogCard key={post.id} {...post} />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              What Parents Are Saying
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} {...testimonial} colorIndex={index} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
