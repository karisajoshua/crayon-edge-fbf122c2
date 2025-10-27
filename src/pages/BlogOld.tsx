import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { Button } from "@/components/ui/button";

const Blog = () => {
  const posts = [
    {
      id: "1",
      title: "Understanding Toddler Tantrums: A Gentle Approach",
      excerpt: "Tantrums are a normal part of development. Learn how to respond with empathy while maintaining healthy boundaries that help your child feel safe and understood.",
      image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
      date: "March 15, 2024",
      category: "Tantrums"
    },
    {
      id: "2",
      title: "The Power of Play: Why Unstructured Time Matters",
      excerpt: "Discover why free play is essential for your child's development and how to create space for it in busy schedules without guilt or pressure.",
      image: "https://images.unsplash.com/photo-1587616211892-579fcd6f23e9?w=800&q=80",
      date: "March 12, 2024",
      category: "Play"
    },
    {
      id: "3",
      title: "First Trimester: What to Expect When You're Expecting",
      excerpt: "A comprehensive guide to navigating the exciting and challenging first three months of pregnancy with practical tips and emotional support.",
      image: "https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?w=800&q=80",
      date: "March 8, 2024",
      category: "Pregnancy & Newborn"
    },
    {
      id: "4",
      title: "Positive Discipline: Teaching Without Shaming",
      excerpt: "Explore discipline methods that build connection, teach important lessons, and preserve your child's sense of self-worth and dignity.",
      image: "https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=800&q=80",
      date: "March 5, 2024",
      category: "Discipline"
    },
    {
      id: "5",
      title: "The 18-Month Sleep Regression: Survival Guide",
      excerpt: "Understanding why sleep suddenly becomes challenging again and practical strategies to navigate this developmental phase with less stress.",
      image: "https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=800&q=80",
      date: "March 1, 2024",
      category: "Child Developmental Milestones"
    },
    {
      id: "6",
      title: "Managing Mom Guilt: Finding Balance and Self-Compassion",
      excerpt: "The internal struggle every parent faces and how to give yourself grace while still showing up for your children with presence and love.",
      image: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&q=80",
      date: "February 28, 2024",
      category: "Parenting Challenges"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <section className="gradient-hero py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse all articles on parenting, child development, and navigating the beautiful chaos of raising little humans
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <p className="text-muted-foreground">Showing {posts.length} articles</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Filter by Category</Button>
                <Button variant="outline" size="sm">Sort by Date</Button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <BlogCard key={post.id} {...post} />
              ))}
            </div>

            <div className="flex justify-center mt-12">
              <Button variant="outline" size="lg">
                Load More Articles
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
