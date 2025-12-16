-- Create age group enum
CREATE TYPE public.creative_age_group AS ENUM ('minis', 'creators', 'studio');

-- Create prompt category enum
CREATE TYPE public.creative_prompt_category AS ENUM ('journal', 'story', 'challenge', 'idea', 'writing', 'art', 'design', 'reflection');

-- Parent settings table
CREATE TABLE public.creative_parent_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sound_enabled BOOLEAN NOT NULL DEFAULT true,
  session_limit_minutes INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Child profiles table
CREATE TABLE public.creative_child_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 2 AND age <= 18),
  age_group creative_age_group NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Artworks table (for drawings, colored images)
CREATE TABLE public.creative_artworks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_profile_id UUID NOT NULL REFERENCES public.creative_child_profiles(id) ON DELETE CASCADE,
  title TEXT,
  artwork_type TEXT NOT NULL DEFAULT 'drawing',
  image_url TEXT,
  canvas_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Stories table (for story builder)
CREATE TABLE public.creative_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_profile_id UUID NOT NULL REFERENCES public.creative_child_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'My Story',
  pages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Journal entries table (for teens)
CREATE TABLE public.creative_journal_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_profile_id UUID NOT NULL REFERENCES public.creative_child_profiles(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  prompt_used TEXT,
  mood TEXT,
  is_private BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Mood boards table (for teens)
CREATE TABLE public.creative_mood_boards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_profile_id UUID NOT NULL REFERENCES public.creative_child_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'My Mood Board',
  board_data JSONB NOT NULL DEFAULT '{}',
  is_private BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Creative challenges table (admin-created)
CREATE TABLE public.creative_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  age_group creative_age_group NOT NULL,
  challenge_type TEXT NOT NULL DEFAULT 'weekly',
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Challenge completions table
CREATE TABLE public.creative_challenge_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_profile_id UUID NOT NULL REFERENCES public.creative_child_profiles(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.creative_challenges(id) ON DELETE CASCADE,
  artwork_id UUID REFERENCES public.creative_artworks(id) ON DELETE SET NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(child_profile_id, challenge_id)
);

-- Creative prompts table (admin and AI generated)
CREATE TABLE public.creative_prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_text TEXT NOT NULL,
  category creative_prompt_category NOT NULL,
  age_group creative_age_group NOT NULL,
  is_ai_generated BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Coloring pages table (admin uploaded)
CREATE TABLE public.creative_coloring_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  difficulty TEXT DEFAULT 'easy',
  is_premium BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Badges table
CREATE TABLE public.creative_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  age_group creative_age_group NOT NULL,
  badge_type TEXT NOT NULL DEFAULT 'completion',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Earned badges table
CREATE TABLE public.creative_earned_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_profile_id UUID NOT NULL REFERENCES public.creative_child_profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.creative_badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(child_profile_id, badge_id)
);

-- Session logs table (for time tracking)
CREATE TABLE public.creative_session_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_profile_id UUID NOT NULL REFERENCES public.creative_child_profiles(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER
);

-- Portfolio items table (for teens)
CREATE TABLE public.creative_portfolio_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_profile_id UUID NOT NULL REFERENCES public.creative_child_profiles(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL,
  item_id UUID NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.creative_parent_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creative_child_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creative_artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creative_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creative_journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creative_mood_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creative_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creative_challenge_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creative_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creative_coloring_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creative_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creative_earned_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creative_session_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creative_portfolio_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for creative_parent_settings
CREATE POLICY "Users can view own parent settings" ON public.creative_parent_settings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own parent settings" ON public.creative_parent_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own parent settings" ON public.creative_parent_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for creative_child_profiles
CREATE POLICY "Parents can view own children" ON public.creative_child_profiles
  FOR SELECT USING (auth.uid() = parent_id);
CREATE POLICY "Parents can insert own children" ON public.creative_child_profiles
  FOR INSERT WITH CHECK (auth.uid() = parent_id);
CREATE POLICY "Parents can update own children" ON public.creative_child_profiles
  FOR UPDATE USING (auth.uid() = parent_id);
CREATE POLICY "Parents can delete own children" ON public.creative_child_profiles
  FOR DELETE USING (auth.uid() = parent_id);

-- RLS Policies for creative_artworks (via child profile)
CREATE POLICY "Parents can view children artworks" ON public.creative_artworks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.creative_child_profiles
      WHERE id = creative_artworks.child_profile_id AND parent_id = auth.uid()
    )
  );
CREATE POLICY "Parents can insert children artworks" ON public.creative_artworks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.creative_child_profiles
      WHERE id = creative_artworks.child_profile_id AND parent_id = auth.uid()
    )
  );
CREATE POLICY "Parents can delete children artworks" ON public.creative_artworks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.creative_child_profiles
      WHERE id = creative_artworks.child_profile_id AND parent_id = auth.uid()
    )
  );

-- RLS Policies for creative_stories
CREATE POLICY "Parents can view children stories" ON public.creative_stories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.creative_child_profiles
      WHERE id = creative_stories.child_profile_id AND parent_id = auth.uid()
    )
  );
CREATE POLICY "Parents can manage children stories" ON public.creative_stories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.creative_child_profiles
      WHERE id = creative_stories.child_profile_id AND parent_id = auth.uid()
    )
  );

-- RLS Policies for creative_journal_entries
CREATE POLICY "Parents can view children journal entries" ON public.creative_journal_entries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.creative_child_profiles
      WHERE id = creative_journal_entries.child_profile_id AND parent_id = auth.uid()
    )
  );
CREATE POLICY "Parents can manage children journal entries" ON public.creative_journal_entries
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.creative_child_profiles
      WHERE id = creative_journal_entries.child_profile_id AND parent_id = auth.uid()
    )
  );

-- RLS Policies for creative_mood_boards
CREATE POLICY "Parents can view children mood boards" ON public.creative_mood_boards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.creative_child_profiles
      WHERE id = creative_mood_boards.child_profile_id AND parent_id = auth.uid()
    )
  );
CREATE POLICY "Parents can manage children mood boards" ON public.creative_mood_boards
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.creative_child_profiles
      WHERE id = creative_mood_boards.child_profile_id AND parent_id = auth.uid()
    )
  );

-- RLS Policies for public content (challenges, prompts, coloring pages, badges)
CREATE POLICY "Anyone can view active challenges" ON public.creative_challenges
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage challenges" ON public.creative_challenges
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view active prompts" ON public.creative_prompts
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage prompts" ON public.creative_prompts
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view active coloring pages" ON public.creative_coloring_pages
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage coloring pages" ON public.creative_coloring_pages
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view badges" ON public.creative_badges
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage badges" ON public.creative_badges
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for challenge completions
CREATE POLICY "Parents can view children completions" ON public.creative_challenge_completions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.creative_child_profiles
      WHERE id = creative_challenge_completions.child_profile_id AND parent_id = auth.uid()
    )
  );
CREATE POLICY "Parents can manage children completions" ON public.creative_challenge_completions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.creative_child_profiles
      WHERE id = creative_challenge_completions.child_profile_id AND parent_id = auth.uid()
    )
  );

-- RLS Policies for earned badges
CREATE POLICY "Parents can view children badges" ON public.creative_earned_badges
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.creative_child_profiles
      WHERE id = creative_earned_badges.child_profile_id AND parent_id = auth.uid()
    )
  );
CREATE POLICY "Parents can manage children badges" ON public.creative_earned_badges
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.creative_child_profiles
      WHERE id = creative_earned_badges.child_profile_id AND parent_id = auth.uid()
    )
  );

-- RLS Policies for session logs
CREATE POLICY "Parents can view children sessions" ON public.creative_session_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.creative_child_profiles
      WHERE id = creative_session_logs.child_profile_id AND parent_id = auth.uid()
    )
  );
CREATE POLICY "Parents can manage children sessions" ON public.creative_session_logs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.creative_child_profiles
      WHERE id = creative_session_logs.child_profile_id AND parent_id = auth.uid()
    )
  );

-- RLS Policies for portfolio items
CREATE POLICY "Parents can view children portfolio" ON public.creative_portfolio_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.creative_child_profiles
      WHERE id = creative_portfolio_items.child_profile_id AND parent_id = auth.uid()
    )
  );
CREATE POLICY "Parents can manage children portfolio" ON public.creative_portfolio_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.creative_child_profiles
      WHERE id = creative_portfolio_items.child_profile_id AND parent_id = auth.uid()
    )
  );
CREATE POLICY "Public portfolio items are viewable" ON public.creative_portfolio_items
  FOR SELECT USING (is_public = true);

-- Create storage bucket for creative content
INSERT INTO storage.buckets (id, name, public) VALUES ('creative-content', 'creative-content', true);

-- Storage policies for creative content
CREATE POLICY "Anyone can view creative content" ON storage.objects
  FOR SELECT USING (bucket_id = 'creative-content');
CREATE POLICY "Authenticated users can upload creative content" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'creative-content' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete own creative content" ON storage.objects
  FOR DELETE USING (bucket_id = 'creative-content' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add updated_at trigger for relevant tables
CREATE TRIGGER update_creative_parent_settings_updated_at
  BEFORE UPDATE ON public.creative_parent_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_creative_child_profiles_updated_at
  BEFORE UPDATE ON public.creative_child_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_creative_stories_updated_at
  BEFORE UPDATE ON public.creative_stories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_creative_journal_entries_updated_at
  BEFORE UPDATE ON public.creative_journal_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_creative_mood_boards_updated_at
  BEFORE UPDATE ON public.creative_mood_boards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();