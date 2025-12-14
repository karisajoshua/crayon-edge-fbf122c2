import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DOMPurify from "dompurify";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CommentSection from "@/components/CommentSection";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("blog_posts")
      .select("*, categories(name, slug)")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error || !data) {
      setLoading(false);
      return;
    }

    setPost(data);

    // Fetch related posts from same category
    if (data.category_id) {
      const { data: related } = await supabase
        .from("blog_posts")
        .select("*, categories(name)")
        .eq("category_id", data.category_id)
        .eq("published", true)
        .neq("id", data.id)
        .limit(3);

      if (related) {
        setRelatedPosts(related);
      }
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
            <p className="mt-4 text-muted-foreground">Loading post...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-8">The post you're looking for doesn't exist.</p>
            <Link to="/blog" className="font-medium text-[#99d1e6] hover:text-[#5da3c0] transition-smooth">
              ← Back to Blog
            </Link>
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
        <article className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <Link to="/blog" className="mb-8 inline-block font-medium text-[#99d1e6] hover:text-[#5da3c0] transition-smooth">
              ← Back to Blog
            </Link>

            <header className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                {post.categories && (
                  <Link to={`/blog/category/${post.categories.slug}`}>
                    <Badge variant="secondary" className="text-sm">
                      {post.categories.name}
                    </Badge>
                  </Link>
                )}
                <div className="flex items-center text-muted-foreground text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(post.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
              
              {post.excerpt && (
                <p className="text-xl text-muted-foreground">{post.excerpt}</p>
              )}
            </header>

            {post.featured_image && (
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full md:w-3/4 lg:w-2/3 mx-auto rounded-3xl mb-8 shadow-lg"
              />
            )}

            <div 
              className="prose prose-lg max-w-none blog-content [&_p]:mb-6 [&_p]:leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: DOMPurify.sanitize(post.content, {
                  ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'br', 'span', 'div'],
                  ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'style', 'target', 'rel']
                })
              }}
            />

            {/* Comment Section */}
            <CommentSection postId={post.id} />

            {relatedPosts.length > 0 && (
              <div className="mt-16 pt-16 border-t">
                <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedPosts.map((related) => (
                    <Link
                      key={related.id}
                      to={`/blog/${related.slug}`}
                      className="group"
                    >
                      {related.featured_image && (
                        <img
                          src={related.featured_image}
                          alt={related.title}
                          className="w-full h-48 object-cover rounded-2xl mb-3 group-hover:opacity-90 transition border-2 border-border"
                        />
                      )}
                      <h3 className="font-bold group-hover:text-primary transition">
                        {related.title}
                      </h3>
                      {related.excerpt && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {related.excerpt}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
