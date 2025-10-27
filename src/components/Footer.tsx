import { Facebook, Instagram, Mail, Twitter } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const Footer = () => {
  return (
    <footer className="bg-muted mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 mb-8">
          {/* Newsletter/Comment Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Stay Connected</h3>
            <p className="text-muted-foreground mb-4">
              Get gentle parenting wisdom delivered to your inbox
            </p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="bg-background"
              />
              <Button variant="default" className="bg-primary hover:bg-primary-dark text-foreground">
                Subscribe
              </Button>
            </div>
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
              CrayonEdge is a space for parents seeking gentle, evidence-based guidance through the beautiful chaos of raising little humans.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CrayonEdge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
