-- Enum types
CREATE TYPE public.track_status AS ENUM ('active', 'inactive');
CREATE TYPE public.source_type AS ENUM ('soundcloud', 'youtube', 'file');
CREATE TYPE public.submission_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Tracks table
CREATE TABLE public.tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_name TEXT NOT NULL,
  track_title TEXT NOT NULL,
  audio_source_url TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL,
  cover_image_url TEXT,
  status public.track_status NOT NULL DEFAULT 'active',
  source_type public.source_type NOT NULL DEFAULT 'soundcloud',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Radio state table (singleton pattern)
CREATE TABLE public.radio_state (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  current_track_id UUID REFERENCES public.tracks(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Submissions table
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_name TEXT NOT NULL,
  track_title TEXT NOT NULL,
  track_url TEXT NOT NULL,
  email TEXT,
  agreed_to_terms BOOLEAN NOT NULL DEFAULT false,
  status public.submission_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Enable RLS on all tables
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.radio_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Tracks policies
CREATE POLICY "Anyone can read active tracks"
  ON public.tracks FOR SELECT
  USING (status = 'active');

CREATE POLICY "Admins can read all tracks"
  ON public.tracks FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert tracks"
  ON public.tracks FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update tracks"
  ON public.tracks FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete tracks"
  ON public.tracks FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Radio state policies
CREATE POLICY "Anyone can read radio state"
  ON public.radio_state FOR SELECT
  USING (true);

CREATE POLICY "Admins can update radio state"
  ON public.radio_state FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert radio state"
  ON public.radio_state FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Submissions policies
CREATE POLICY "Anyone can submit"
  ON public.submissions FOR INSERT
  WITH CHECK (agreed_to_terms = true);

CREATE POLICY "Admins can read submissions"
  ON public.submissions FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update submissions"
  ON public.submissions FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies
CREATE POLICY "Users can read own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger to update updated_at on radio_state
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_radio_state_updated_at
  BEFORE UPDATE ON public.radio_state
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial radio state row
INSERT INTO public.radio_state (id, started_at) VALUES (1, now());