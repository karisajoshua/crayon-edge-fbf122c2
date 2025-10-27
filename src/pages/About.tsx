import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Heart } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <article className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About CrayonEdge</h1>
            <p className="text-xl text-muted-foreground">
              A parent's journey through gentle wisdom and loving boundaries
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <div className="bg-gradient-soft rounded-2xl p-8 md:p-12">
              <div className="flex justify-center mb-6">
                <Heart className="w-16 h-16 text-primary" />
              </div>
              
              <p className="text-lg leading-relaxed">
                Hi, I'm the parent behind CrayonEdge. Like you, I'm navigating the beautiful, 
                messy, overwhelming, and magical journey of raising little humans. Some days I get 
                it right. Many days I don't. But every day, I'm learning.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Why CrayonEdge?</h2>
              <p>
                I started this blog because I needed a space to process my own parenting journey. 
                A place to document what works, what doesn't, and what I'm still figuring out. 
                The name "CrayonEdge" represents the delicate balance we walk as parents — staying 
                creative and playful (like crayons) while also establishing boundaries and structure 
                (the edge).
              </p>
              
              <p>
                Modern parenting is hard. We're bombarded with conflicting advice, comparison culture, 
                and the pressure to be perfect. This blog is the opposite of that. Here, we embrace 
                imperfection. We celebrate small wins. We acknowledge the hard days. And we grow together.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold">What You'll Find Here</h2>
              <ul className="space-y-4 text-lg">
                <li className="flex gap-3">
                  <span className="text-primary">→</span>
                  <span><strong>Evidence-based insights</strong> grounded in child development research</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">→</span>
                  <span><strong>Practical strategies</strong> for everyday parenting challenges</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">→</span>
                  <span><strong>Honest reflections</strong> on the ups and downs of parenthood</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">→</span>
                  <span><strong>Gentle approaches</strong> to discipline and boundaries</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">→</span>
                  <span><strong>Support and encouragement</strong> for the journey</span>
                </li>
              </ul>
            </div>

            <div className="bg-secondary-light rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-6">My Parenting Philosophy</h2>
              <p className="text-lg leading-relaxed">
                I believe in gentle parenting that respects children as whole people, while also 
                acknowledging that parents are human too. I believe in connection over perfection. 
                I believe that understanding child development changes everything. And I believe 
                that the most important thing we can give our children is our presence — not our 
                perfection.
              </p>
            </div>

            <div className="text-center pt-8">
              <p className="text-xl">
                Thank you for being here. Whether you're a first-time parent or raising your fifth, 
                whether you found this blog through Google or a friend, I'm so glad you're here.
              </p>
              <p className="text-xl mt-4 text-primary font-bold">
                Let's navigate this beautiful chaos together.
              </p>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default About;
