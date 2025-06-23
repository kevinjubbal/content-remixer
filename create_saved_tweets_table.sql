-- Create the saved_tweets table
CREATE TABLE saved_tweets (
  id BIGSERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  remix_type TEXT DEFAULT 'general',
  character_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE saved_tweets ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (for simplicity)
-- In production, you'd want more restrictive policies
CREATE POLICY "Allow all operations on saved_tweets" ON saved_tweets
FOR ALL USING (true); 