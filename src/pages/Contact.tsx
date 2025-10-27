import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Instagram, Facebook, Twitter } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <section className="gradient-hero py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              I'd love to hear from you. Whether you have questions, suggestions, or just want to say hi.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold mb-6">Send a Message</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Name</label>
                    <Input placeholder="Jane Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <Input type="email" placeholder="jane@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <Input placeholder="What's this about?" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <Textarea 
                      placeholder="Share your thoughts..." 
                      className="min-h-[150px]"
                    />
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary-dark text-foreground" size="lg">
                    Send Message
                  </Button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Connect With Me</h2>
                  <p className="text-muted-foreground mb-6">
                    I try to respond to all messages within 48 hours. For urgent matters, 
                    please reach out via email directly.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-lg">
                    <Mail className="w-6 h-6 text-primary" />
                    <a href="mailto:hello@crayonedge.com" className="hover:text-primary transition-smooth">
                      hello@crayonedge.com
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-4">Follow Along</h3>
                  <div className="flex gap-4">
                    <a 
                      href="#" 
                      className="w-12 h-12 rounded-full bg-gradient-soft flex items-center justify-center hover:scale-110 transition-smooth"
                    >
                      <Instagram className="w-6 h-6" />
                    </a>
                    <a 
                      href="#" 
                      className="w-12 h-12 rounded-full bg-gradient-soft flex items-center justify-center hover:scale-110 transition-smooth"
                    >
                      <Facebook className="w-6 h-6" />
                    </a>
                    <a 
                      href="#" 
                      className="w-12 h-12 rounded-full bg-gradient-soft flex items-center justify-center hover:scale-110 transition-smooth"
                    >
                      <Twitter className="w-6 h-6" />
                    </a>
                  </div>
                </div>

                <div className="bg-secondary-light rounded-xl p-6">
                  <h3 className="font-bold mb-3">Interested in Collaborating?</h3>
                  <p className="text-sm text-muted-foreground">
                    I'm open to partnerships with brands that align with gentle parenting values. 
                    Please include "Partnership" in your subject line.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
