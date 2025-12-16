import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ScrollToTop from "@/components/ScrollToTop";
import Home from "./pages/Home";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import PostsList from "@/pages/admin/PostsList";
import PostEditor from "@/pages/admin/PostEditor";
import MediaManager from "@/pages/admin/MediaManager";
import Categories from "@/pages/admin/Categories";
import ArchivedPosts from "@/pages/admin/ArchivedPosts";
import CommentModeration from "@/pages/admin/CommentModeration";
import Subscribers from "@/pages/admin/Subscribers";
import Messages from "@/pages/admin/Messages";

// Creative Platform Pages
import CreativeLanding from "./pages/creative/CreativeLanding";
import ParentLogin from "./pages/creative/parent/ParentLogin";
import ParentDashboard from "./pages/creative/parent/ParentDashboard";
import MinisHome from "./pages/creative/minis/MinisHome";
import ColoringPage from "./pages/creative/minis/ColoringPage";
import ShapeMatch from "./pages/creative/minis/ShapeMatch";
import DragDropPlay from "./pages/creative/minis/DragDropPlay";
import CreatorsHome from "./pages/creative/creators/CreatorsHome";
import DrawPad from "./pages/creative/creators/DrawPad";
import StoryBuilder from "./pages/creative/creators/StoryBuilder";
import ChallengesHub from "./pages/creative/creators/ChallengesHub";
import Gallery from "./pages/creative/creators/Gallery";
import StudioHome from "./pages/creative/studio/StudioHome";
import DigitalJournal from "./pages/creative/studio/DigitalJournal";
import IdeaPrompts from "./pages/creative/studio/IdeaPrompts";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/blog/category/:category" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Creative Platform Routes */}
            <Route path="/creative" element={<CreativeLanding />} />
            <Route path="/creative/parent/login" element={<ParentLogin />} />
            <Route path="/creative/parent/dashboard" element={<ParentDashboard />} />
            
            {/* Minis (Ages 2-5) */}
            <Route path="/creative/minis" element={<MinisHome />} />
            <Route path="/creative/minis/color" element={<ColoringPage />} />
            <Route path="/creative/minis/match" element={<ShapeMatch />} />
            <Route path="/creative/minis/play" element={<DragDropPlay />} />
            
            {/* Creators (Ages 6-11) */}
            <Route path="/creative/creators" element={<CreatorsHome />} />
            <Route path="/creative/creators/draw" element={<DrawPad />} />
            <Route path="/creative/creators/story" element={<StoryBuilder />} />
            <Route path="/creative/creators/challenges" element={<ChallengesHub />} />
            <Route path="/creative/creators/gallery" element={<Gallery />} />
            
            {/* Studio (Ages 12-18) */}
            <Route path="/creative/studio" element={<StudioHome />} />
            <Route path="/creative/studio/journal" element={<DigitalJournal />} />
            <Route path="/creative/studio/prompts" element={<IdeaPrompts />} />
            
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="posts" element={<PostsList />} />
              <Route path="posts/new" element={<PostEditor />} />
              <Route path="posts/edit/:id" element={<PostEditor />} />
              <Route path="media" element={<MediaManager />} />
              <Route path="categories" element={<Categories />} />
              <Route path="archive" element={<ArchivedPosts />} />
              <Route path="comments" element={<CommentModeration />} />
              <Route path="subscribers" element={<Subscribers />} />
              <Route path="messages" element={<Messages />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
