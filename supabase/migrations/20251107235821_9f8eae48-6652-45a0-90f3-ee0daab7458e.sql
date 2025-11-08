-- Create comments table for blog posts
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  approved BOOLEAN DEFAULT false NOT NULL
);

-- Create index for faster queries
CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_comments_created_at ON public.comments(created_at DESC);

-- Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read approved comments"
  ON public.comments
  FOR SELECT
  USING (approved = true);

CREATE POLICY "Anyone can create comments"
  ON public.comments
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can manage all comments"
  ON public.comments
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));