import { useState } from 'react'
import { remixContent } from './services/api'

function App() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [remixType, setRemixType] = useState('general')

  const handleRemix = async () => {
    if (!inputText.trim()) {
      alert('Please enter some text to remix!')
      return
    }

    setIsLoading(true)
    
    try {
      const remixed = await remixContent(inputText, remixType)
      setOutputText(remixed)
    } catch (error) {
      console.error('Error remixing content:', error)
      setOutputText(`Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText)
    alert('Copied to clipboard!')
  }

  const remixTypes = [
    { value: 'general', label: 'General Remix' },
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'creative', label: 'Creative' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Content Remixer
          </h1>
          <p className="text-gray-600">
            Transform your content with AI-powered remixing
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Input Text
            </h2>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your text here to remix..."
              className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            {/* Remix Type Selection */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remix Type
              </label>
              <select
                value={remixType}
                onChange={(e) => setRemixType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {remixTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleRemix}
              disabled={isLoading || !inputText.trim()}
              className="mt-4 w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Remixing...' : 'Remix Content'}
            </button>
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Remixed Output
              </h2>
              {outputText && !outputText.startsWith('Error:') && (
                <button
                  onClick={handleCopy}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Copy
                </button>
              )}
            </div>
            <div className="w-full h-64 p-4 border border-gray-300 rounded-lg bg-gray-50 overflow-y-auto">
              {outputText ? (
                <p className={`whitespace-pre-wrap ${outputText.startsWith('Error:') ? 'text-red-600' : 'text-gray-800'}`}>
                  {outputText}
                </p>
              ) : (
                <p className="text-gray-500 italic">
                  Your remixed content will appear here...
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        {!import.meta.env.VITE_CLAUDE_API_KEY || import.meta.env.VITE_CLAUDE_API_KEY === 'your_claude_api_key_here' ? (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Setup Required
            </h3>
            <p className="text-yellow-700 mb-2">
              To use the AI remixing feature, you need to:
            </p>
            <ol className="text-yellow-700 list-decimal list-inside space-y-1">
              <li>Get a Claude API key from <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="underline">Anthropic Console</a></li>
              <li>Create a <code className="bg-yellow-100 px-1 rounded">.env</code> file in the project root</li>
              <li>Add your API key: <code className="bg-yellow-100 px-1 rounded">VITE_CLAUDE_API_KEY=your_actual_api_key</code></li>
              <li>Restart the development server</li>
            </ol>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default App
