import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { Button } from "@/components/ui/button";

const Blog = () => {
  const { category } = useParams();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [category]);

  const fetchPosts = async () => {
    setLoading(true);
    
    let query = supabase
      .from("blog_posts")
      .select("*, categories(name, slug)")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (category) {
      // Fetch category first
      const { data: categoryData } = await supabase
        .from("categories")
        .select("id, name")
        .eq("slug", category)
        .single();
      
      if (categoryData) {
        setCurrentCategory(categoryData.name);
        query = query.eq("category_id", categoryData.id);
      }
    }

    const { data, error } = await query;

    if (!error && data) {
      setPosts(data.map(post => ({
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
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading posts...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <section className="gradient-hero py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {currentCategory ? `${currentCategory} Articles` : "Blog"}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {currentCategory 
                ? `Explore articles about ${currentCategory.toLowerCase()}`
                : "Browse all articles on parenting, child development, and navigating the beautiful chaos of raising little humans"}
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <p className="text-muted-foreground">
                {posts.length === 0 ? "No articles found" : `Showing ${posts.length} article${posts.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            
            {posts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <BlogCard key={post.id} {...post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">No articles found in this category yet.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
