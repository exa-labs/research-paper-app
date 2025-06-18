# 📚 Find Answers Based on Research Papers
### Powered by [Exa](https://exa.ai) - The Web Search API

### Try the tool: https://demo.exa.ai/research-paper-app

![Screenshot](https://demo.exa.ai/research-paper-app/opengraph-image.jpg)

<br>

## 🎯 What is Find Answers Based on Research Papers?

Find Answers Based on Research Papers is a free app that uses Exa's search tool with AI to help you find research papers and get quick answers to your questions based on science papers.

This app makes it easy to search through research, get AI summaries, and chat with research papers to learn more about topics.

<br>

## 💻 Tech Stack
- **Search Tool**: [Exa API](https://exa.ai) - Web search made for research papers
- **Frontend**: [Next.js](https://nextjs.org/docs) with App Router, [TailwindCSS](https://tailwindcss.com), TypeScript
- **AI Tools**: [Vercel Hosting + AI SDK](https://sdk.vercel.ai/docs/ai-sdk-core)

<br>

## ✨ Features
- **Smart Paper Search**: Find research papers using Exa's special search
- **AI Answers**: Get quick answers to your questions based on research papers
- **Chat Feature**: Chat with one paper or many papers at the same time
- **Find Similar Papers**: Discover related research papers by entering a paper URL


<br>

## 🚀 Getting Started

### What You Need
- Node.js (v18 or higher)
- Exa API key
- Anthropic API key (or other LLM provider key)

### How to Set Up

1. Download the code
```bash
git clone https://github.com/exa-labs/research-paper-app.git
cd research-paper-app
```

2. Install what you need
```bash
npm install
```

3. Set up your API keys
Create a `.env.local` file and add:
```bash
EXA_API_KEY=your_exa_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

4. Start the app
```bash
npm run dev
```

5. Open http://localhost:3000 in your web browser

<br>

## 🔑 API Keys & Setup

### API Keys You Need
* **Exa API Key**: Get from [Exa Dashboard](https://dashboard.exa.ai/api-keys)
* **Anthropic API Key**: Get from [Anthropic Console](https://console.anthropic.com/) (or use other LLM providers)

> **Note**: This app uses the Vercel AI SDK, so you can easily replace Anthropic with other LLM providers like OpenAI, Google, or others by updating the model configuration.

### Environment File
```bash
EXA_API_KEY=your_exa_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

<br>

## 🛠️ How It's Built

```
research-paper-app/
├── app/
│   ├── api/
│   │   ├── answer/         # AI answers endpoint
│   │   ├── chat/           # Chat with papers endpoint
│   │   ├── exasearch/      # Paper search endpoint
│   │   └── similarpapers/  # Similar papers endpoint
│   ├── chatpage/           # Chat page
│   ├── layout.tsx          # Main layout
│   └── page.tsx            # Home page
├── components/
│   ├── ResearchPaperFinder.tsx  # Main search part
│   ├── ChatWithPaper.tsx        # Chat part
│   ├── CardResearchPaper.tsx    # Paper card
│   ├── PaperDialog.tsx          # Paper details popup
│   └── ui/                      # UI parts
└── lib/                         # Helper functions
```

<br>

## ⭐ About [Exa](https://exa.ai)

This app is powered by [Exa.ai](https://exa.ai), a web search tool made for AI apps.

[Try Exa API](https://dashboard.exa.ai)

<br>

---

Built with ❤️ by the Exa team
