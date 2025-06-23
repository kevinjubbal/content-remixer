import { useState } from 'react'
import { remixContent } from './services/api'

function App() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [remixType, setRemixType] = useState('general')
  const [copySuccess, setCopySuccess] = useState(false)

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputText)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      alert('Failed to copy to clipboard')
    }
  }

  const remixTypes = [
    { value: 'general', label: '✨ General Remix', description: 'Balanced transformation' },
    { value: 'professional', label: '💼 Professional', description: 'Formal and polished' },
    { value: 'casual', label: '😊 Casual', description: 'Friendly and relaxed' },
    { value: 'creative', label: '🎨 Creative', description: 'Artistic and imaginative' }
  ]

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 50%, #f0fdfa 100%)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '3rem', paddingTop: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            borderRadius: '20px',
            marginBottom: '1.5rem',
            boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
          }}>
            <span style={{ fontSize: '2rem' }}>🎭</span>
          </div>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem',
            letterSpacing: '-0.02em'
          }}>
            Content Remixer
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#64748b',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Transform your content with AI-powered remixing. Give your text a fresh new perspective in seconds.
          </p>
        </header>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', 
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {/* Input Section */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '24px',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.5)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: '#dbeafe',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1rem'
              }}>
                <span style={{ color: '#3b82f6' }}>✏️</span>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                Input Text
              </h2>
            </div>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="✨ Paste your text here to remix it into something amazing..."
              style={{
                width: '100%',
                height: '200px',
                padding: '1.5rem',
                border: '2px solid #e2e8f0',
                borderRadius: '16px',
                resize: 'none',
                fontSize: '1rem',
                lineHeight: '1.5',
                fontFamily: 'inherit',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6'
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0'
                e.target.style.boxShadow = 'none'
              }}
            />
            
            {/* Remix Type Selection */}
            <div style={{ marginTop: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '0.9rem', 
                fontWeight: '600', 
                color: '#374151', 
                marginBottom: '1rem' 
              }}>
                Choose your remix style
              </label>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {remixTypes.map(type => (
                  <label key={type.value} style={{ cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="remixType"
                      value={type.value}
                      checked={remixType === type.value}
                      onChange={(e) => setRemixType(e.target.value)}
                      style={{ display: 'none' }}
                    />
                    <div style={{
                      padding: '1rem',
                      borderRadius: '12px',
                      border: `2px solid ${remixType === type.value ? '#3b82f6' : '#e2e8f0'}`,
                      backgroundColor: remixType === type.value ? '#f0f9ff' : 'rgba(255, 255, 255, 0.5)',
                      transition: 'all 0.2s ease'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontWeight: '600', color: '#1e293b' }}>{type.label}</div>
                          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{type.description}</div>
                        </div>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: `2px solid ${remixType === type.value ? '#3b82f6' : '#d1d5db'}`,
                          backgroundColor: remixType === type.value ? '#3b82f6' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {remixType === type.value && (
                            <div style={{
                              width: '8px',
                              height: '8px',
                              backgroundColor: 'white',
                              borderRadius: '50%'
                            }}></div>
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
              style={{
                marginTop: '2rem',
                width: '100%',
                background: isLoading || !inputText.trim() 
                  ? '#9ca3af' 
                  : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '16px',
                border: 'none',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: isLoading || !inputText.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
              }}
            >
              {isLoading ? '🔄 Remixing your content...' : '🎭 Remix Content'}
            </button>
          </div>

          {/* Output Section */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '24px',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#dcfce7',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '1rem'
                }}>
                  <span style={{ color: '#16a34a' }}>✨</span>
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                  Remixed Output
                </h2>
              </div>
              {outputText && !outputText.startsWith('Error:') && (
                <button
                  onClick={handleCopy}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '10px',
                    border: `2px solid ${copySuccess ? '#16a34a' : '#3b82f6'}`,
                    backgroundColor: copySuccess ? '#dcfce7' : '#f0f9ff',
                    color: copySuccess ? '#16a34a' : '#3b82f6',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {copySuccess ? '✅ Copied!' : '📋 Copy'}
                </button>
              )}
            </div>
            
            <div style={{
              width: '100%',
              height: '200px',
              padding: '1.5rem',
              border: '2px solid #e2e8f0',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              overflowY: 'auto',
              fontSize: '1rem',
              lineHeight: '1.6'
            }}>
              {outputText ? (
                <div style={{
                  whiteSpace: 'pre-wrap',
                  color: outputText.startsWith('Error:') ? '#dc2626' : '#1e293b'
                }}>
                  {outputText}
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>🎭</div>
                  <p style={{ color: '#64748b', fontSize: '1.1rem', margin: 0 }}>
                    Your beautifully remixed content will appear here...
                  </p>
                  <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    Add some text and hit the remix button to get started!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        {!import.meta.env.VITE_CLAUDE_API_KEY || import.meta.env.VITE_CLAUDE_API_KEY === 'your_claude_api_key_here' ? (
          <div style={{
            background: 'linear-gradient(135deg, #fef3c7, #fed7aa)',
            border: '2px solid #f59e0b',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 10px 25px rgba(245, 158, 11, 0.2)',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: '#fbbf24',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1.5rem',
                flexShrink: 0
              }}>
                <span style={{ fontSize: '1.5rem' }}>⚙️</span>
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#92400e', marginBottom: '1rem' }}>
                  Setup Required
                </h3>
                <p style={{ color: '#b45309', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                  To unlock the full AI remixing magic, you'll need to configure your API key:
                </p>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: '1px solid #f59e0b'
                }}>
                  <ol style={{ color: '#b45309', margin: 0, paddingLeft: '1.5rem' }}>
                    <li style={{ marginBottom: '0.75rem' }}>
                      Get a Claude API key from <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" style={{ color: '#d97706', textDecoration: 'underline', fontWeight: '600' }}>Anthropic Console</a>
                    </li>
                    <li style={{ marginBottom: '0.75rem' }}>
                      Create a <code style={{ background: '#fbbf24', padding: '0.25rem 0.5rem', borderRadius: '6px', fontFamily: 'monospace' }}>.env</code> file in the project root
                    </li>
                    <li style={{ marginBottom: '0.75rem' }}>
                      Add your API key: <code style={{ background: '#fbbf24', padding: '0.25rem 0.5rem', borderRadius: '6px', fontFamily: 'monospace' }}>VITE_CLAUDE_API_KEY=your_actual_api_key</code>
                    </li>
                    <li>
                      Restart the development server and start remixing!
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Footer */}
        <footer style={{ textAlign: 'center', paddingBottom: '2rem' }}>
          <p style={{ color: '#9ca3af', fontSize: '1rem' }}>
            Made with ❤️ and AI magic
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
