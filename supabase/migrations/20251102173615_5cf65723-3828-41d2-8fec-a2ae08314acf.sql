-- Add archive functionality to blog_posts table
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

-- Add index for better query performance on archived posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_archived ON public.blog_posts(archived);

-- Update RLS policy to exclude archived posts from public view
DROP POLICY IF EXISTS "Anyone can view published posts" ON public.blog_posts;

CREATE POLICY "Anyone can view published posts" 
ON public.blog_posts 
FOR SELECT 
USING (
  (published = true AND archived = false) 
  OR has_role(auth.uid(), 'admin'::app_role)
);