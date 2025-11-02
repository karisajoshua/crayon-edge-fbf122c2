import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Heart } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <article className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className="w-48 h-48 md:w-56 md:h-56 flex-shrink-0">
              <img 
                src="https://qjivusdkfvjrzaqyxxmy.supabase.co/storage/v1/object/public/blog-images/0.7296860073967326.jpg"
                alt="Flois - CrayonEdge Author"
                className="w-full h-full object-cover rounded-full shadow-lg"
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Hi, I'm Flois!</h1>
              <p className="text-xl text-muted-foreground">
                A parent's journey through intentional parenting and child development
              </p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <div className="bg-gradient-soft rounded-2xl p-8 md:p-12">
              <div className="flex justify-center mb-6">
                <Heart className="w-16 h-16 text-primary" />
              </div>
              
              <p className="text-lg leading-relaxed">
                I've always believed in parenting with intention, where you understand your child and make thoughtful choices that support their growth, confidence, and emotional well-being. My interest in how children think and feel guided me toward a Bachelor's degree, then a Master's in Early Childhood Development, where I focused on the kinds of support that help children feel safe, capable, and loved, as well as on what strengthens the parent-child bond. Parenting is not always easy. Some days I get it right, some days I do not, but every day I learn something new about myself and my children, which makes the whole journey meaningful.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Why CrayonEdge?</h2>
              <p>
                This blog began with real moments in parenting, the ones filled with joy and the doubts that sneak in when you wonder if you are doing enough. Parenting today comes with so much comparison and the endless pressure to look perfect, but this space is the opposite of that. Here, we celebrate the small wins, acknowledge the hard days, and keep growing together.
              </p>
              
              <p>
                Choosing to parent with intention changed how I showed up for my children, and CrayonEdge grew from that shift. Children need room to explore and express themselves (just like crayons creating freely), but they also need clear boundaries and structures that help them feel safe and supported (the edge that gives them direction). That balance between freedom and boundaries is where real parenting happens, and CrayonEdge helps you walk that balance with confidence.
              </p>

              <p>
                This is a place where you feel supported in your parenting, where guidance is rooted in child development and psychology, but shaped by real family life, and where the focus stays on what helps children grow into emotionally secure and capable people. Parenting moves quickly, children change fast, and we learn new things every single day. CrayonEdge is here to walk with you through it, helping you feel steady as you guide your child with purpose.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold">What You'll Find Here</h2>
              <ul className="space-y-4 text-lg">
                <li className="flex gap-3">
                  <span className="text-primary">→</span>
                  <span><strong>Evidence-based guidance</strong> grounded in child development and psychology research</span>
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
                  <span><strong>Positive discipline</strong> that supports emotional growth</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">→</span>
                  <span><strong>Support and encouragement</strong> for your parenting journey</span>
                </li>
              </ul>
            </div>

            <div className="bg-secondary-light rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-6">My Parenting Philosophy</h2>
              <p className="text-lg leading-relaxed">
                I believe every child is a remarkable individual, growing and learning at their own pace, and this belief is what roots me in parenting with intention. My goal is to make everyday choices that support children's emotional well-being and growth while focusing on presence rather than perfection. Parenting with intention is all about paying attention to what children need, guiding behavior with respect, and setting clear expectations that help them feel safe. When children feel understood and supported, they grow with confidence, empathy, and a strong sense of who they are.
              </p>
            </div>

            <div className="text-center pt-8">
              <p className="text-xl">
                Thank you for being here. Whether you're just starting or deep in the parenting journey, I'm grateful you found your way to CrayonEdge!
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