# Database Setup Guide

This guide will help you set up Supabase to save your favorite tweets.

## Step 1: Create a Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project (give it any name you like)

## Step 2: Create the Database Table

1. In your Supabase dashboard, go to the **SQL Editor**
2. Click **New Query**
3. Copy and paste this SQL code:

```sql
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
```

4. Click **Run** to execute the query

## Step 3: Get Your API Keys

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy your **Project URL** and **anon public** key

## Step 4: Add Keys to Your Project

1. Create a `.env` file in your project root (if it doesn't exist)
2. Add these lines:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your_project_url_here` and `your_anon_key_here` with your actual values from step 3.

## Step 5: Restart Your Development Server

```bash
npm run dev
```

That's it! You should now see a "Saved Tweets" button in the header when the database is configured properly.

## Features

- **Save tweets**: Click the 💾 Save button on any generated tweet
- **View saved tweets**: Click the "Saved Tweets" button to open the sidebar
- **Tweet saved content**: Click 🐦 Tweet on any saved tweet
- **Delete saved tweets**: Click 🗑️ Delete to remove tweets you no longer want

## Troubleshooting

- **"Database not configured" error**: Double-check your `.env` file has the correct keys
- **Can't save tweets**: Make sure you ran the SQL query to create the table
- **Tweets not showing**: Try refreshing the page or checking the browser console for errors 