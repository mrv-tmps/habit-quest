-- Feedback requests allow players to suggest improvements and track ideas
CREATE TABLE public.feedback_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT,
  category TEXT NOT NULL DEFAULT 'feature',
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.feedback_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit feedback"
  ON public.feedback_requests
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view feedback"
  ON public.feedback_requests
  FOR SELECT
  USING (auth.role() = 'service_role');

CREATE INDEX feedback_requests_category_idx ON public.feedback_requests (category);
CREATE INDEX feedback_requests_created_at_idx ON public.feedback_requests (created_at DESC);

