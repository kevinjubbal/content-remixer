import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase = null

// Initialize Supabase client only if credentials are provided
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey)
}

// Save a tweet to the database
export const saveTweet = async (tweetText, remixType = 'general') => {
  if (!supabase) {
    throw new Error('Database not configured. Please add your Supabase credentials.')
  }

  try {
    const { data, error } = await supabase
      .from('saved_tweets')
      .insert([
        {
          text: tweetText,
          remix_type: remixType,
          created_at: new Date().toISOString(),
          character_count: tweetText.length
        }
      ])
      .select()

    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Error saving tweet:', error)
    throw error
  }
}

// Get all saved tweets
export const getSavedTweets = async () => {
  if (!supabase) {
    throw new Error('Database not configured. Please add your Supabase credentials.')
  }

  try {
    const { data, error } = await supabase
      .from('saved_tweets')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching saved tweets:', error)
    throw error
  }
}

// Delete a saved tweet
export const deleteSavedTweet = async (id) => {
  if (!supabase) {
    throw new Error('Database not configured. Please add your Supabase credentials.')
  }

  try {
    const { error } = await supabase
      .from('saved_tweets')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting tweet:', error)
    throw error
  }
}

// Check if database is configured
export const isDatabaseConfigured = () => {
  return !!(supabaseUrl && supabaseKey && supabase)
} 