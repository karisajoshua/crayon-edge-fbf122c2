import { Link } from "react-router-dom";
import { Baby, BookOpen, Heart, MessageCircle, Palette, Smile, Target } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import CategoryTile from "@/components/CategoryTile";
import TestimonialCard from "@/components/TestimonialCard";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";

const Home = () => {
  const categories = [
    { name: "Play", icon: Palette, slug: "play" },
    { name: "Pregnancy & Newborn", icon: Baby, slug: "pregnancy-newborn" },
    { name: "Tantrums", icon: MessageCircle, slug: "tantrums" },
    { name: "Developmental Milestones", icon: Target, slug: "child-developmental-milestones" },
    { name: "Parenting Challenges", icon: Heart, slug: "parenting-challenges" },
    { name: "Discipline", icon: Smile, slug: "discipline" },
    { name: "Parenting Tips", icon: BookOpen, slug: "parenting-tips" },
  ];

  const latestPosts = [
    {
      id: "1",
      title: "Understanding Toddler Tantrums: A Gentle Approach",
      excerpt: "Tantrums are a normal part of development. Learn how to respond with empathy while maintaining healthy boundaries.",
      image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
      date: "March 15, 2024",
      category: "Tantrums"
    },
    {
      id: "2",
      title: "The Power of Play: Why Unstructured Time Matters",
      excerpt: "Discover why free play is essential for your child's development and how to create space for it in busy schedules.",
      image: "https://images.unsplash.com/photo-1587616211892-579fcd6f23e9?w=800&q=80",
      date: "March 12, 2024",
      category: "Play"
    },
    {
      id: "3",
      title: "First Trimester: What to Expect When You're Expecting",
      excerpt: "A comprehensive guide to navigating the exciting and challenging first three months of pregnancy.",
      image: "https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?w=800&q=80",
      date: "March 8, 2024",
      category: "Pregnancy & Newborn"
    }
  ];

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
        <section className="gradient-hero py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  Gentle wisdom for modern parenting
                </h1>
                <p className="text-xl text-muted-foreground">
                  A calm, supportive space for real-life parenting insights — from tantrums to milestones, all in one place.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/blog">
                    <Button size="lg" className="bg-primary hover:bg-primary-dark text-foreground">
                      Explore the Blog
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                      Learn More About Me
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={heroImage} 
                  alt="Gentle parenting moment" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* About Preview */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Welcome to CrayonEdge</h2>
              <p className="text-lg">
                Hi, I'm a parent navigating the ups and downs of raising little humans — just like you. 
                CrayonEdge is my journal of lessons, laughter, and loving boundaries. This is a space where 
                imperfect parenting is celebrated, and where we grow together, one crayon stroke at a time.
              </p>
              <Link to="/about">
                <Button variant="outline" size="lg">
                  Read My Story →
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Explore Parenting Topics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <CategoryTile key={category.slug} {...category} />
              ))}
            </div>
          </div>
        </section>

        {/* Latest Posts */}
        <section className="py-16 bg-muted">
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
                <TestimonialCard key={index} {...testimonial} />
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
