# Kaneshwar Sharma - Portfolio

A modern, interactive portfolio website featuring an embedded AI assistant powered by RAG (Retrieval-Augmented Generation) that answers questions about my experience and projects.

**Live Site:** [https://kaneshwar.vercel.app](https://kaneshwar.vercel.app/)

## Features

- **AI Assistant** - Embedded chatbot using Groq LLM with RAG pipeline for personalized responses
- **Obsidian + Amber** - Near-black ground, bone type, one amber accent; light mode on warm paper. See [DESIGN.md](DESIGN.md)
- **Live system diagrams** - The hero and every project card are authored SVG pipelines with packets in motion
- **Architecture Diagrams** - Mermaid.js flowcharts for project architectures
- **One authored moment** - Hero lines rise from a mask once; CSS-only motion elsewhere
- **Responsive Design** - Mobile-first approach with custom cursor effects

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** CSS transitions and keyframes (no animation library)
- **AI/LLM:** Groq API (GPT-OSS 120B)
- **Diagrams:** Mermaid.js
- **Fonts:** Bricolage Grotesque (display), Geist Sans and Geist Mono (local)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kaneshS/portfolio.git
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with your API keys:
```env
GROQ_API_KEY=your_groq_api_key_here
NEXT_PUBLIC_WEB3FORMS_KEY=your_web3forms_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── ai/           # AI Assistant page
│   ├── api/chat/     # Chat API endpoint
│   └── page.tsx      # Homepage
├── components/
│   ├── sections/     # Page sections (Hero, About, Projects, etc.)
│   └── ui/           # Reusable UI components
├── data/
│   ├── profile.ts    # Portfolio data and RAG chunks
│   └── resume-context.ts  # LLM context
└── lib/
    └── rag.ts        # RAG implementation
```

## Sections

- **Hero** - Introduction with animated text and CTAs
- **About** - Personal narrative with experience stats
- **Experience Journey** - Interactive S-curve timeline with footstep animations
- **Projects** - Featured projects with architecture diagrams
- **Freelance** - Freelance project showcase
- **Skills** - Technical skills and expertise
- **AI Assistant** - Chat interface for portfolio Q&A
- **Contact** - Contact form and social links


## License

MIT License - feel free to use this as a template for your own portfolio.

## Contact

- **Email:** mansotra10sharma@gmail.com
- **LinkedIn:** [linkedin.com/in/kaneshwar](https://linkedin.com/in/kaneshwar)
- **GitHub:** [github.com/kaneshS](https://github.com/kaneshS)
