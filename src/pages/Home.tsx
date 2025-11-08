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
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center">
          {/* Background Image */}
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url(${heroImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Blue Overlay */}
            <div className="absolute inset-0 bg-blue-500/30"></div>
          </div>

          {/* Content */}
          <div className="w-full relative z-10 px-4">
            <div className="max-w-xl mx-auto md:ml-[10%] text-white text-center md:text-left">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
                Welcome to CrayonEdge
              </h1>
              <p className="text-xl md:text-2xl mb-8 leading-relaxed drop-shadow-md">
                Where parenting meets intention, psychology meets practice, and every family finds their own path to connection and growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to="/blog">
                  <Button size="lg" className="bg-footer hover:bg-footer/90 text-foreground shadow-xl rounded-2xl">
                    Explore Articles
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="secondary" className="bg-white hover:bg-white/90 text-foreground shadow-xl rounded-2xl">
                    Learn More About Me
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Welcome Section with Personal Photo */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex flex-col items-center text-center">
              {/* Personal Photo */}
              <div className="mb-8">
                <img 
                  src="https://qjivusdkfvjrzaqyxxmy.supabase.co/storage/v1/object/public/blog-images/0.7296860073967326.jpg"
                  alt="Flois - CrayonEdge Founder"
                  className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-8 border-[#fbe4ec] shadow-2xl"
                />
              </div>
              
              <h2 className="text-4xl font-bold mb-6 text-[#5da3c0]">Welcome to CrayonEdge</h2>
              <p className="text-xl leading-relaxed">
                A space dedicated to intentional parenting, where guidance is rooted in child development 
                and psychology but shaped by real family life. Here, you'll find support, strategies, and 
                encouragement as you navigate the beautiful, complex journey of raising children.
              </p>
            </div>
          </div>
        </section>

        {/* Categories Grid - Search by Topic */}
        <section className="relative">
          <WaveDivider position="top" color="#99d1e6" />
          <div className="bg-topic py-16">
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
          <WaveDivider position="bottom" color="#99d1e6" />
        </section>

        {/* Latest Posts */}
        <section className="py-16 bg-[#f5faf7]">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#5da3c0]">Latest Articles</h2>
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
        <section className="py-16 bg-secondary-light">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#5da3c0]">
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
