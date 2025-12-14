import { useState } from "react";
import { Facebook, Instagram, Mail, Twitter } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import footerLogo from "@/assets/crayon_edge_footer_logo.webp";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const emailSchema = z.string().trim().email("Please enter a valid email address").max(255);

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      toast({
        title: "Invalid email",
        description: result.error.errors[0]?.message || "Please enter a valid email",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("newsletter_subscribers").insert({
      email: result.data,
    });

    if (error) {
      if (error.code === "23505") {
        toast({
          title: "Already subscribed",
          description: "This email is already on our list!",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to subscribe. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail("");
    }
    setLoading(false);
  };

  return (
    <footer className="bg-[hsl(var(--footer))] mt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Footer Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src={footerLogo} 
            alt="CrayonEdge" 
            className="h-16 md:h-20"
          />
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 mb-8">
          {/* Newsletter/Comment Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Stay Connected</h3>
            <p className="text-muted-foreground mb-4">
              Get simple, intentional parenting guidance straight to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="bg-background"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <Button 
                type="submit"
                variant="default" 
                className="bg-primary hover:bg-primary-dark text-foreground"
                disabled={loading}
              >
                {loading ? "..." : "Subscribe"}
              </Button>
            </form>
          </div>

          {/* Quick Links & Social */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Connect With Me</h3>
            <div className="flex gap-4 mb-6">
              <a href="#" className="hover:text-primary transition-smooth">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-primary transition-smooth">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-primary transition-smooth">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="mailto:hello@crayonedge.com" className="hover:text-primary transition-smooth">
                <Mail className="w-6 h-6" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              CrayonEdge is a space for parents seeking simple, evidence-based guidance to raise children with purpose.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CrayonEdge. All rights reserved.</p>
          <p className="mt-2">Powered by Texcortech Systems</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
