import { useState, useEffect } from 'react'
import { tweetsFromPost } from './services/api'
import { saveTweet, getSavedTweets, deleteSavedTweet, updateSavedTweet, isDatabaseConfigured } from './services/database'

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
  const [editingTweet, setEditingTweet] = useState(null)
  const [editedTweetText, setEditedTweetText] = useState('')
  const [editingSavedTweet, setEditingSavedTweet] = useState(null)
  const [editedSavedTweetText, setEditedSavedTweetText] = useState('')

  // Load saved tweets on component mount
  useEffect(() => {
    if (isDatabaseConfigured()) {
      loadSavedTweets()
    }
  }, [])

  // Handle ESC key to close sidebar and edit modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        if (editingTweet) {
          handleCancelEdit()
        } else if (editingSavedTweet) {
          handleCancelSavedTweetEdit()
        } else if (showSavedTweets) {
          setShowSavedTweets(false)
        }
      }
    }

    if (showSavedTweets || editingTweet || editingSavedTweet) {
      document.addEventListener('keydown', handleEscKey)
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [showSavedTweets, editingTweet, editingSavedTweet])

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

  const handleEditTweet = (tweetText, index) => {
    setEditingTweet({ text: tweetText, index, type: 'new' })
    setEditedTweetText(tweetText)
  }

  const handleEditSavedTweet = (savedTweet) => {
    setEditingSavedTweet(savedTweet.id)
    setEditedSavedTweetText(savedTweet.text)
  }

  const handleCancelSavedTweetEdit = () => {
    setEditingSavedTweet(null)
    setEditedSavedTweetText('')
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
      // Close edit modal if open
      setEditingTweet(null)
      setEditedTweetText('')
    } catch (error) {
      console.error('Error saving tweet:', error)
      alert('Error saving tweet: ' + error.message)
      setIsSaving(prev => ({ ...prev, [index]: false }))
    }
  }

  const handleUpdateSavedTweet = async (tweetText, tweetId) => {
    if (!isDatabaseConfigured()) {
      alert('Database not configured. Please add your Supabase credentials.')
      return
    }

    try {
      await updateSavedTweet(tweetId, tweetText)
      await loadSavedTweets() // Refresh saved tweets
      // Close inline edit
      setEditingSavedTweet(null)
      setEditedSavedTweetText('')
    } catch (error) {
      console.error('Error updating tweet:', error)
      alert('Error updating tweet: ' + error.message)
    }
  }

  const handleCancelEdit = () => {
    setEditingTweet(null)
    setEditedTweetText('')
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
                            <button
                              onClick={() => handleEditTweet(tweet, index)}
                              className="text-sm p-2 rounded-lg font-medium transition-all duration-200 bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200"
                              title="Edit tweet"
                            >
                              ✏️
                            </button>
                            {isDatabaseConfigured() && (
                              <button
                                onClick={() => handleSaveTweet(tweet, index)}
                                disabled={isSaving[index]}
                                className={`text-sm p-2 rounded-lg font-medium transition-all duration-200 border ${
                                  isSaving[index] === 'saved'
                                    ? 'bg-green-100 text-green-700 border-green-200'
                                    : isSaving[index]
                                    ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed'
                                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200'
                                }`}
                                title={isSaving[index] === 'saved' ? 'Saved' : isSaving[index] ? 'Saving...' : 'Save tweet'}
                              >
                                {isSaving[index] === 'saved' ? '✅' : isSaving[index] ? '⏳' : '💾'}
                              </button>
                            )}
                            <button
                              onClick={() => handleTweet(tweet)}
                              className="text-sm p-2 rounded-lg font-medium transition-all duration-200 bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200"
                              title="Tweet this"
                            >
                              🐦
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

      {/* Sidebar Toggle Button */}
      {isDatabaseConfigured() && (
        <button
          onClick={() => setShowSavedTweets(!showSavedTweets)}
          className={`fixed top-8 z-40 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-l-2xl shadow-lg hover:shadow-xl transition-all duration-300 group ${
            showSavedTweets ? 'right-[24rem]' : 'right-0'
          }`}
        >
          <div className={`transition-transform duration-300 ${showSavedTweets ? 'rotate-180' : ''}`}>
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          {/* Tooltip */}
          <div className={`absolute right-full top-1/2 -translate-y-1/2 mr-3 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none ${
            showSavedTweets ? 'hidden' : ''
          }`}>
            Saved Tweets ({savedTweets.length})
          </div>
        </button>
      )}

      {/* Saved Tweets Sidebar */}
      {showSavedTweets && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end"
          onClick={(e) => {
            // Close sidebar if clicking on backdrop (not the sidebar content)
            if (e.target === e.currentTarget) {
              setShowSavedTweets(false)
            }
          }}
        >
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
                        {editingSavedTweet !== savedTweet.id && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditSavedTweet(savedTweet)}
                              className="text-sm p-2 rounded-lg font-medium transition-all duration-200 bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200"
                              title="Edit tweet"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleTweet(savedTweet.text)}
                              className="text-sm p-2 rounded-lg font-medium transition-all duration-200 bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200"
                              title="Tweet this"
                            >
                              🐦
                            </button>
                            <button
                              onClick={() => handleDeleteSavedTweet(savedTweet.id)}
                              className="text-sm p-2 rounded-lg font-medium transition-all duration-200 bg-red-100 text-red-700 hover:bg-red-200 border border-red-200"
                              title="Delete tweet"
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {editingSavedTweet === savedTweet.id ? (
                        <div className="space-y-3">
                          <textarea
                            value={editedSavedTweetText}
                            onChange={(e) => setEditedSavedTweetText(e.target.value)}
                            className="w-full h-20 p-3 border-2 border-blue-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-slate-700 bg-white text-sm outline-none"
                            placeholder="Edit your tweet..."
                            autoFocus
                          />
                          <div className="flex justify-between items-center">
                            <span className={`text-xs ${editedSavedTweetText.length > 280 ? 'text-red-600' : 'text-slate-500'}`}>
                              {editedSavedTweetText.length} / 280 characters
                            </span>
                            <div className="flex gap-2">
                              <button
                                onClick={handleCancelSavedTweetEdit}
                                className="text-sm p-2 rounded-lg font-medium transition-all duration-200 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                                title="Cancel editing"
                              >
                                ✖️
                              </button>
                              <button
                                onClick={() => handleUpdateSavedTweet(editedSavedTweetText, savedTweet.id)}
                                disabled={editedSavedTweetText.trim() === '' || editedSavedTweetText.length > 280}
                                className={`text-sm p-2 rounded-lg font-medium transition-all duration-200 ${
                                  editedSavedTweetText.trim() === '' || editedSavedTweetText.length > 280
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-300'
                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200'
                                }`}
                                title="Save changes"
                              >
                                💾
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-slate-800 font-medium leading-relaxed text-sm">
                            {savedTweet.text}
                          </p>
                          <div className="mt-2 text-xs text-slate-500 flex justify-between">
                            <span>{savedTweet.character_count} characters</span>
                            <span>{new Date(savedTweet.created_at).toLocaleDateString()}</span>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Tweet Modal */}
      {editingTweet && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <span>✏️</span>
                Edit Tweet
              </h2>
              <button
                onClick={handleCancelEdit}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tweet Content
                </label>
                <textarea
                  value={editedTweetText}
                  onChange={(e) => setEditedTweetText(e.target.value)}
                  className="w-full h-32 p-4 border-2 border-slate-200 rounded-xl resize-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-700 bg-white font-medium outline-none"
                  placeholder="Edit your tweet..."
                />
                <div className="mt-2 flex justify-between items-center text-sm">
                  <span className={`${editedTweetText.length > 280 ? 'text-red-600' : 'text-slate-500'}`}>
                    {editedTweetText.length} / 280 characters
                  </span>
                  {editedTweetText.length > 280 && (
                    <span className="text-red-600 font-medium">
                      Too long for a tweet!
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCancelEdit}
                  className="p-3 rounded-xl font-medium transition-all duration-200 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 text-lg"
                  title="Cancel editing"
                >
                  ✖️
                </button>
                <button
                  onClick={() => {
                    if (editingTweet.type === 'saved') {
                      handleUpdateSavedTweet(editedTweetText, editingTweet.id)
                    } else {
                      handleSaveTweet(editedTweetText, editingTweet.index)
                    }
                  }}
                  disabled={
                    (editingTweet.type === 'new' && isSaving[editingTweet.index]) || 
                    editedTweetText.trim() === '' || 
                    editedTweetText.length > 280
                  }
                  className={`p-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl text-lg ${
                    (editingTweet.type === 'new' && isSaving[editingTweet.index]) || 
                    editedTweetText.trim() === '' || 
                    editedTweetText.length > 280
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                  }`}
                  title={
                    (editingTweet.type === 'new' && isSaving[editingTweet.index]) ? 'Saving...' :
                    editingTweet.type === 'saved' ? 'Update tweet' : 'Save tweet'
                  }
                >
                  {(editingTweet.type === 'new' && isSaving[editingTweet.index]) ? '⏳' : '💾'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App
