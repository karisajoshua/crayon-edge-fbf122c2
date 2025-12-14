import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Instagram, Facebook, Twitter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  subject: z.string().trim().min(1, "Subject is required").max(200, "Subject must be less than 200 characters"),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message must be less than 2000 characters"),
});

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: result.data.name,
      email: result.data.email,
      subject: result.data.subject,
      message: result.data.message,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <section className="gradient-hero py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              I'd love to hear from you. Whether you have a question, a suggestion, or simply want to say hi!
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Name</label>
                    <Input 
                      name="name"
                      placeholder="Jane Doe" 
                      value={formData.name}
                      onChange={handleChange}
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <Input 
                      name="email"
                      type="email" 
                      placeholder="jane@example.com" 
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <Input 
                      name="subject"
                      placeholder="What's this about?" 
                      value={formData.subject}
                      onChange={handleChange}
                      className={errors.subject ? "border-destructive" : ""}
                    />
                    {errors.subject && <p className="text-sm text-destructive mt-1">{errors.subject}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <Textarea 
                      name="message"
                      placeholder="Share your thoughts..." 
                      className={`min-h-[150px] ${errors.message ? "border-destructive" : ""}`}
                      value={formData.message}
                      onChange={handleChange}
                    />
                    {errors.message && <p className="text-sm text-destructive mt-1">{errors.message}</p>}
                  </div>
                  <Button 
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-dark text-foreground" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Connect with me</h2>
                  <p className="text-muted-foreground mb-6">
                    I respond to messages within 48 hrs. For anything urgent, please reach out directly via email.
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
                    I'm open to partnerships with brands that share the values of intentional parenting, child development, and mindful family living. Please include "partnership" in your subject line.
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
