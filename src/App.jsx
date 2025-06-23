import { useState, useEffect } from 'react'
import { tweetsFromPost } from './services/api'
import { saveTweet, getSavedTweets, deleteSavedTweet, isDatabaseConfigured } from './services/database'

function App() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [tweets, setTweets] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [remixType, setRemixType] = useState('general')
  const [savedTweets, setSavedTweets] = useState([])
  const [showSavedTweets, setShowSavedTweets] = useState(false)
  const [isSaving, setIsSaving] = useState({})
  const [isLoadingSaved, setIsLoadingSaved] = useState(false)

  // Load saved tweets on component mount
  useEffect(() => {
    if (isDatabaseConfigured()) {
      loadSavedTweets()
    }
  }, [])

  const loadSavedTweets = async () => {
    if (!isDatabaseConfigured()) return
    
    setIsLoadingSaved(true)
    try {
      const saved = await getSavedTweets()
      setSavedTweets(saved)
    } catch (error) {
      console.error('Error loading saved tweets:', error)
    } finally {
      setIsLoadingSaved(false)
    }
  }

  const handleSaveTweet = async (tweetText, index) => {
    if (!isDatabaseConfigured()) {
      alert('Database not configured. Please add your Supabase credentials.')
      return
    }

    setIsSaving(prev => ({ ...prev, [index]: true }))
    try {
      await saveTweet(tweetText, remixType)
      await loadSavedTweets() // Refresh saved tweets
      // Show success feedback
      setIsSaving(prev => ({ ...prev, [index]: 'saved' }))
      setTimeout(() => {
        setIsSaving(prev => ({ ...prev, [index]: false }))
      }, 2000)
    } catch (error) {
      console.error('Error saving tweet:', error)
      alert('Error saving tweet: ' + error.message)
      setIsSaving(prev => ({ ...prev, [index]: false }))
    }
  }

  const handleDeleteSavedTweet = async (id) => {
    try {
      await deleteSavedTweet(id)
      await loadSavedTweets() // Refresh saved tweets
    } catch (error) {
      console.error('Error deleting tweet:', error)
      alert('Error deleting tweet: ' + error.message)
    }
  }

  const handleRemix = async () => {
    if (!inputText.trim()) {
      alert('Please enter some text to remix!')
      return
    }

    setIsLoading(true)
    
    try {
      const result = await tweetsFromPost(inputText, remixType)
      setOutputText(result.rawText)
      setTweets(result.tweets)
    } catch (error) {
      console.error('Error remixing content:', error)
      setOutputText(`Error: ${error.message}`)
      setTweets([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleTweetAll = () => {
    const allTweets = tweets.join('\n\n')
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(allTweets)}`
    window.open(twitterUrl, '_blank')
  }

  const handleTweet = (tweet) => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`
    window.open(twitterUrl, '_blank')
  }

  const remixTypes = [
    { value: 'general', label: '✨ General Remix', description: 'Balanced transformation' },
    { value: 'professional', label: '💼 Professional', description: 'Formal and polished' },
    { value: 'casual', label: '😊 Casual', description: 'Friendly and relaxed' },
    { value: 'creative', label: '🎨 Creative', description: 'Artistic and imaginative' }
  ]

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="text-center mb-12 pt-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/30">
                <span className="text-3xl">🎭</span>
              </div>
              {isDatabaseConfigured() && (
                <button
                  onClick={() => setShowSavedTweets(!showSavedTweets)}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-xl border-2 border-green-200 hover:bg-green-200 transition-all duration-200 font-medium flex items-center gap-2"
                >
                  <span>💾</span>
                  Saved Tweets ({savedTweets.length})
                </button>
              )}
            </div>
            <h1 className="text-6xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 tracking-tight">
              Content Remixer
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Transform your content with AI-powered remixing. Give your text a fresh new perspective in seconds.
            </p>
          </header>

          <div className="grid lg:grid-cols-2 gap-8 mb-12 lg:items-stretch">
            {/* Input Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-blue-600">✏️</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Input Text
                </h2>
              </div>
              
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="✨ Paste your text here to remix it into something amazing..."
                className="w-full h-52 p-6 border-2 border-slate-200 rounded-2xl resize-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-700 placeholder-slate-400 bg-white/80 backdrop-blur-sm font-medium outline-none"
              />
              
              {/* Remix Type Selection */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-slate-700 mb-4">
                  Choose your remix style
                </label>
                <div className="grid gap-3">
                  {remixTypes.map(type => (
                    <label key={type.value} className="cursor-pointer group">
                      <input
                        type="radio"
                        name="remixType"
                        value={type.value}
                        checked={remixType === type.value}
                        onChange={(e) => setRemixType(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`p-4 rounded-xl border-2 transition-all duration-200 group-hover:border-slate-300 group-hover:bg-white/70 ${
                        remixType === type.value 
                          ? 'border-blue-500 bg-blue-50 shadow-md' 
                          : 'border-slate-200 bg-white/50'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-semibold text-slate-800">{type.label}</div>
                            <div className="text-sm text-slate-600">{type.description}</div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            remixType === type.value 
                              ? 'border-blue-500 bg-blue-500' 
                              : 'border-slate-300'
                          }`}>
                            {remixType === type.value && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleRemix}
                disabled={isLoading || !inputText.trim()}
                className={`mt-8 w-full py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 relative overflow-hidden ${
                  !inputText.trim()
                    ? 'bg-slate-400 cursor-not-allowed text-white'
                    : isLoading
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-500/30 cursor-wait'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-blue-500/30'
                }`}
              >
                {isLoading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_ease-in-out_infinite]"></div>
                  </div>
                )}
                <span className="relative z-10 flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating tweets...
                    </>
                  ) : (
                    '🐦 Generate Tweets'
                  )}
                </span>
              </button>
            </div>

            {/* Output Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 hover:shadow-3xl transition-all duration-300 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-green-600">✨</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Remixed Output
                  </h2>
                </div>
                {tweets.length > 0 && (
                  <button
                    onClick={handleTweetAll}
                    className="px-4 py-2 rounded-lg font-medium transition-all duration-200 border-2 bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200 hover:border-blue-300"
                  >
                    🐦 Tweet All
                  </button>
                )}
              </div>
              
              <div className="w-full flex-1 overflow-y-auto">
                {tweets.length > 0 ? (
                  <div className="space-y-4">
                    {tweets.map((tweet, index) => (
                      <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                            Tweet {index + 1}
                          </span>
                          <div className="flex gap-2">
                            {isDatabaseConfigured() && (
                              <button
                                onClick={() => handleSaveTweet(tweet, index)}
                                disabled={isSaving[index]}
                                className={`text-xs px-3 py-1 rounded-lg font-medium transition-all duration-200 border ${
                                  isSaving[index] === 'saved'
                                    ? 'bg-green-100 text-green-700 border-green-200'
                                    : isSaving[index]
                                    ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed'
                                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200'
                                }`}
                              >
                                {isSaving[index] === 'saved' ? '✅ Saved' : isSaving[index] ? '⏳ Saving...' : '💾 Save'}
                              </button>
                            )}
                            <button
                              onClick={() => handleTweet(tweet)}
                              className="text-xs px-3 py-1 rounded-lg font-medium transition-all duration-200 bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200"
                            >
                              🐦 Tweet
                            </button>
                          </div>
                        </div>
                        <p className="text-slate-800 font-medium leading-relaxed">
                          {tweet}
                        </p>
                        <div className="mt-2 text-xs text-slate-500">
                          {tweet.length} characters
                        </div>
                      </div>
                    ))}
                  </div>
                ) : outputText && outputText.startsWith('Error:') ? (
                  <div className="p-6 text-red-600 font-medium border-2 border-red-200 rounded-2xl bg-red-50">
                    {outputText}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <div className="text-6xl mb-4 opacity-20">🎭</div>
                    <p className="text-slate-500 text-lg font-medium">
                      Your beautifully remixed tweets will appear here...
                    </p>
                    <p className="text-slate-400 text-sm mt-2">
                      Add some text and hit the remix button to get started!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Setup Instructions */}
          {(!import.meta.env.VITE_CLAUDE_API_KEY || import.meta.env.VITE_CLAUDE_API_KEY === 'your_claude_api_key_here') || !isDatabaseConfigured() ? (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl p-8 shadow-lg shadow-amber-500/20 mb-8">
              <div className="flex items-start">
                <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mr-6 flex-shrink-0">
                  <span className="text-2xl">⚙️</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-amber-800 mb-4">
                    Setup Required
                  </h3>
                  <p className="text-amber-700 mb-6 text-lg">
                    To unlock the full AI remixing magic and save tweets, you'll need to configure your API keys:
                  </p>
                  <div className="bg-white/60 rounded-2xl p-6 border border-amber-200">
                    <ol className="text-amber-700 space-y-3">
                      {(!import.meta.env.VITE_CLAUDE_API_KEY || import.meta.env.VITE_CLAUDE_API_KEY === 'your_claude_api_key_here') && (
                        <>
                          <li className="flex items-start">
                            <span className="bg-amber-200 text-amber-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">1</span>
                            <span>Get a Claude API key from <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-800 underline font-semibold">Anthropic Console</a></span>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-amber-200 text-amber-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">2</span>
                            <span>Add to your <code className="bg-amber-100 px-2 py-1 rounded font-mono text-sm">.env</code> file: <code className="bg-amber-100 px-2 py-1 rounded font-mono text-sm">VITE_CLAUDE_API_KEY=your_claude_key</code></span>
                          </li>
                        </>
                      )}
                      {!isDatabaseConfigured() && (
                        <>
                          <li className="flex items-start">
                            <span className="bg-amber-200 text-amber-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">{(!import.meta.env.VITE_CLAUDE_API_KEY || import.meta.env.VITE_CLAUDE_API_KEY === 'your_claude_api_key_here') ? '3' : '1'}</span>
                            <span>Create a free Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-800 underline font-semibold">supabase.com</a></span>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-amber-200 text-amber-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">{(!import.meta.env.VITE_CLAUDE_API_KEY || import.meta.env.VITE_CLAUDE_API_KEY === 'your_claude_api_key_here') ? '4' : '2'}</span>
                            <span>Add to your <code className="bg-amber-100 px-2 py-1 rounded font-mono text-sm">.env</code> file: <code className="bg-amber-100 px-2 py-1 rounded font-mono text-sm">VITE_SUPABASE_URL=your_supabase_url</code> and <code className="bg-amber-100 px-2 py-1 rounded font-mono text-sm">VITE_SUPABASE_ANON_KEY=your_anon_key</code></span>
                          </li>
                        </>
                      )}
                      <li className="flex items-start">
                        <span className="bg-amber-200 text-amber-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">{(!import.meta.env.VITE_CLAUDE_API_KEY || import.meta.env.VITE_CLAUDE_API_KEY === 'your_claude_api_key_here') && !isDatabaseConfigured() ? '5' : (!import.meta.env.VITE_CLAUDE_API_KEY || import.meta.env.VITE_CLAUDE_API_KEY === 'your_claude_api_key_here') || !isDatabaseConfigured() ? '3' : '1'}</span>
                        <span>Restart the development server and start remixing!</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Footer */}
          <footer className="text-center pb-8">
            <p className="text-slate-400 text-lg">
              Made with ❤️ and AI magic
            </p>
          </footer>
        </div>
      </div>

      {/* Saved Tweets Sidebar */}
      {showSavedTweets && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-md bg-white shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <span>💾</span>
                Saved Tweets
              </h2>
              <button
                onClick={() => setShowSavedTweets(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              {isLoadingSaved ? (
                <div className="flex items-center justify-center py-8">
                  <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : savedTweets.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4 opacity-30">💾</div>
                  <p className="text-gray-500">No saved tweets yet.</p>
                  <p className="text-gray-400 text-sm mt-1">Generate some tweets and save your favorites!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedTweets.map((savedTweet) => (
                    <div key={savedTweet.id} className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                          {savedTweet.remix_type}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleTweet(savedTweet.text)}
                            className="text-xs px-3 py-1 rounded-lg font-medium transition-all duration-200 bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200"
                          >
                            🐦 Tweet
                          </button>
                          <button
                            onClick={() => handleDeleteSavedTweet(savedTweet.id)}
                            className="text-xs px-3 py-1 rounded-lg font-medium transition-all duration-200 bg-red-100 text-red-700 hover:bg-red-200 border border-red-200"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                      <p className="text-slate-800 font-medium leading-relaxed text-sm">
                        {savedTweet.text}
                      </p>
                      <div className="mt-2 text-xs text-slate-500 flex justify-between">
                        <span>{savedTweet.character_count} characters</span>
                        <span>{new Date(savedTweet.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App
