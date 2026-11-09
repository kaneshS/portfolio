# Kaneshwar Sharma - Portfolio

A modern, interactive portfolio website featuring an embedded AI assistant powered by RAG (Retrieval-Augmented Generation) that answers questions about my experience and projects.

**Live Site:** [https://kaneshwar.vercel.app](https://kaneshwar.vercel.app/)

## Features

- **AI Assistant** - Embedded chatbot using Groq LLM with RAG pipeline for personalized responses; `/ai` opens as a greeting with five preset chips and becomes a terminal transcript after the first question
- **Terminal Theme** - Near-black ground with a dotted grid, Geist Mono everywhere, one phosphor-green accent; light mode is a paper-white terminal. See [DESIGN.md](DESIGN.md)
- **Shell Grammar** - Projects as `ls -al` rows, experience as `git log --oneline`, skills as `tree` output, every section headed `01 FEATURED WORK · ~/projects/featured`
- **Architecture Diagrams** - Mermaid.js flowcharts for project architectures, restyled to the palette
- **One authored moment** - The hero name types in once with a blinking caret; CSS-only motion elsewhere, reduced-motion safe
- **Responsive Design** - Mobile-first, 44px targets, full-screen mobile menu

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** CSS transitions and keyframes (no animation library)
- **AI/LLM:** Groq API (GPT-OSS 120B)
- **Diagrams:** Mermaid.js
- **Fonts:** Geist Mono (local, via next/font/local)

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

- **Hero** - `$ hi, I'm Kanesh`, role line, summary from the resume, CTAs and social links
- **Ask box** - Terminal window that sends a question to `/ai?q=…`
- **01 Featured Work** - Project rows that open a dialog with metrics and a Mermaid diagram
- **02 Experience** - `git log`-style role list, each opening a dialog with achievements
- **03 Stack** - Every skill group from the resume as `tree` output
- **04 Get in Touch** - Email, key-value contact block, Web3Forms contact form in a dialog

## License

MIT License - feel free to use this as a template for your own portfolio.

## Contact

- **Email:** mansotra10sharma@gmail.com
- **LinkedIn:** [linkedin.com/in/kaneshwar](https://linkedin.com/in/kaneshwar)
- **GitHub:** [github.com/kaneshS](https://github.com/kaneshS)
