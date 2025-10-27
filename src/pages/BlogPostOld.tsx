import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { Calendar, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const BlogPost = () => {
  const { id } = useParams();

  const relatedPosts = [
    {
      id: "2",
      title: "The Power of Play: Why Unstructured Time Matters",
      excerpt: "Discover why free play is essential for your child's development and how to create space for it in busy schedules.",
      image: "https://images.unsplash.com/photo-1587616211892-579fcd6f23e9?w=800&q=80",
      date: "March 12, 2024",
      category: "Play"
    },
    {
      id: "4",
      title: "Positive Discipline: Teaching Without Shaming",
      excerpt: "Explore discipline methods that build connection, teach important lessons, and preserve your child's sense of self-worth.",
      image: "https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=800&q=80",
      date: "March 5, 2024",
      category: "Discipline"
    },
    {
      id: "6",
      title: "Managing Mom Guilt: Finding Balance",
      excerpt: "The internal struggle every parent faces and how to give yourself grace while showing up for your children.",
      image: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&q=80",
      date: "February 28, 2024",
      category: "Parenting Challenges"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <article className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-smooth">Home</Link>
            {" / "}
            <Link to="/blog" className="hover:text-primary transition-smooth">Blog</Link>
            {" / "}
            <span>Understanding Toddler Tantrums</span>
          </nav>

          {/* Post Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="inline-block px-4 py-2 bg-secondary-light rounded-full text-secondary-foreground font-medium">
                Tantrums
              </span>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>March 15, 2024</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Understanding Toddler Tantrums: A Gentle Approach
            </h1>
            
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Linkedin className="w-4 h-4" />
              </Button>
            </div>
          </header>

          {/* Featured Image */}
          <div className="rounded-2xl overflow-hidden mb-12">
            <img 
              src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&q=80" 
              alt="Understanding Toddler Tantrums"
              className="w-full"
            />
          </div>

          {/* Post Content */}
          <div className="prose prose-lg max-w-none space-y-6">
            <p className="text-xl leading-relaxed">
              It's 4 PM on a Tuesday. You're at the grocery store. Your toddler wants the blue 
              cereal box. You say no. And suddenly, you're in the middle of a full-blown meltdown — 
              your child's, not yours (though yours might come later).
            </p>

            <p>
              If you've been there, you're not alone. Toddler tantrums are one of the most challenging 
              aspects of parenting young children. But here's what I've learned: tantrums aren't 
              manipulation. They're communication. And understanding that changes everything.
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-6">What's Really Happening During a Tantrum</h2>
            
            <div className="bg-primary-light rounded-xl p-8 my-8 border-l-4 border-primary">
              <h3 className="text-xl font-bold mb-3">Key Takeaway</h3>
              <p className="mb-0">
                Tantrums happen because your toddler's emotional regulation system is still developing. 
                They literally don't have the brain capacity to "calm down" the way we can as adults.
              </p>
            </div>

            <p>
              The prefrontal cortex — the part of the brain responsible for emotional regulation, 
              impulse control, and rational thinking — doesn't fully develop until we're in our 
              mid-twenties. Your toddler is working with a brain that simply can't process big 
              emotions yet.
            </p>

            <p className="pl-8 border-l-4 border-secondary italic">
              When your child melts down because their banana broke, they're not being dramatic. 
              They're experiencing genuine distress that they don't know how to handle.
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-6">How to Respond With Empathy</h2>

            <p>
              Here's where gentle parenting comes in. Instead of punishing the tantrum or trying 
              to "fix" it immediately, we can be present with our child through their big feelings.
            </p>

            <ol className="space-y-4 list-decimal list-inside">
              <li className="pl-4">
                <strong>Stay calm yourself.</strong> Your nervous system regulates theirs. Take deep breaths.
              </li>
              <li className="pl-4">
                <strong>Validate their feelings.</strong> "You're really upset that you can't have the blue cereal."
              </li>
              <li className="pl-4">
                <strong>Keep them safe.</strong> If they're in danger of hurting themselves or others, gently intervene.
              </li>
              <li className="pl-4">
                <strong>Offer connection.</strong> Some kids want a hug. Others need space. Follow their lead.
              </li>
              <li className="pl-4">
                <strong>Hold the boundary.</strong> You can validate feelings while still saying no to the request.
              </li>
            </ol>

            <h2 className="text-3xl font-bold mt-12 mb-6">What About in Public?</h2>

            <p>
              Public tantrums add a layer of stress because of judgment from others. But remember: 
              anyone who judges you has either never parented a toddler or has forgotten what it's like.
            </p>

            <div className="bg-secondary-light rounded-xl p-8 my-8">
              <p className="mb-4 font-medium">
                Your job isn't to stop the tantrum to make other people comfortable. Your job is to 
                be present with your child.
              </p>
              <p className="mb-0">
                Sometimes that means leaving the store. Sometimes it means sitting on the floor with 
                them. Sometimes it means both of you crying in the parking lot. And all of that is okay.
              </p>
            </div>

            <h2 className="text-3xl font-bold mt-12 mb-6">Prevention Strategies</h2>

            <p>
              While you can't prevent all tantrums (they're a normal part of development), you can 
              reduce their frequency:
            </p>

            <ul className="space-y-3 list-disc list-inside">
              <li className="pl-4">Ensure adequate sleep and regular meals</li>
              <li className="pl-4">Give advance warnings about transitions</li>
              <li className="pl-4">Offer limited choices to give them a sense of control</li>
              <li className="pl-4">Watch for early signs of frustration and intervene before escalation</li>
              <li className="pl-4">Make sure their emotional cup is full with connection time</li>
            </ul>

            <h2 className="text-3xl font-bold mt-12 mb-6">Final Thoughts</h2>

            <p>
              Tantrums are hard. They test our patience, trigger our own big feelings, and sometimes 
              make us question everything. But they're also temporary. Your toddler will develop 
              emotional regulation skills. Your job is to be the calm, loving presence while they learn.
            </p>

            <p>
              And on the days when you lose your patience (because you will, you're human), remember 
              that repair is always possible. Apologize, reconnect, and try again tomorrow.
            </p>

            <p className="text-xl font-medium text-primary pt-4">
              You're doing better than you think. ❤️
            </p>
          </div>

          {/* Share Again */}
          <div className="border-t border-border pt-8 mt-12 flex items-center justify-between">
            <span className="font-medium">Share this article:</span>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Linkedin className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        <section className="bg-muted py-16 mt-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedPosts.map((post) => (
                <BlogCard key={post.id} {...post} />
              ))}
            </div>
          </div>
        </section>

        {/* Comments Section */}
        <section className="container mx-auto px-4 py-16 max-w-4xl">
          <h2 className="text-3xl font-bold mb-8">Leave a Comment</h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input placeholder="Your Name" />
              <Input type="email" placeholder="Your Email" />
            </div>
            <Textarea 
              placeholder="Share your thoughts..." 
              className="min-h-[150px]"
            />
            <Button className="bg-primary hover:bg-primary-dark text-foreground">
              Post Comment
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
