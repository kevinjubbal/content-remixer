# Content Remixer

A React-based content remixing tool that uses AI to transform your text content in various styles.

## Features

- ✅ Paste in text you want to remix
- ✅ Click a button to apply AI-powered remixing
- ✅ Multiple remix styles (General, Professional, Casual, Creative)
- ✅ See the remixed output in real-time
- ✅ Copy remixed content to clipboard
- ✅ Beautiful, responsive UI with Tailwind CSS

## Tech Stack

- **React** - Frontend framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Claude API** - AI content remixing

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Claude API key from [Anthropic Console](https://console.anthropic.com)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd content-remixer-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up your API key:
   - Copy `.env.example` to `.env`
   - Add your Claude API key:
   ```
   VITE_CLAUDE_API_KEY=your_actual_api_key_here
   ```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Input Text**: Paste or type the content you want to remix in the left textarea
2. **Select Style**: Choose from four remix styles:
   - **General**: Creative and engaging remix
   - **Professional**: Polished and formal tone
   - **Casual**: Friendly and conversational
   - **Creative**: Imaginative transformation
3. **Remix**: Click the "Remix Content" button
4. **Copy**: Use the "Copy" button to copy the remixed content to your clipboard

## Development

### Project Structure

```
src/
├── App.jsx          # Main application component
├── index.css        # Global styles with Tailwind
├── main.jsx         # Application entry point
└── services/
    └── api.js       # Claude API integration
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Future Enhancements

- [ ] Add more AI APIs (OpenAI, Gemini)
- [ ] Audio file upload and transcription
- [ ] Social media integration (Tweet scheduling)
- [ ] Database storage for remixed content
- [ ] User accounts and history
- [ ] Custom remix prompts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
