# Kaneshwar Sharma - Portfolio

A modern, interactive portfolio website featuring an embedded AI assistant powered by RAG (Retrieval-Augmented Generation) that answers questions about my experience and projects.

**Live Site:** [https://kaneshwar.vercel.app](https://kaneshwar.vercel.app/)

## Features

- **AI Assistant** - Embedded chatbot using Groq LLM with RAG pipeline for personalized responses
- **Editorial light theme** - Warm off-white ground, one burnt red-brown accent, numbers-led content; warm charcoal dark mode. See [DESIGN.md](DESIGN.md)
- **Experience ledger** - Company, role, dates and one line per row; click for the full entry
- **Architecture Diagrams** - Mermaid.js flowcharts for project architectures, restyled to the palette
- **One authored moment** - The hero words rise once on load; CSS-only motion elsewhere
- **Responsive Design** - Mobile-first, full-screen menu, 44px targets

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** CSS transitions and keyframes (no animation library)
- **AI/LLM:** Groq API (GPT-OSS 120B)
- **Diagrams:** Mermaid.js
- **Fonts:** Schibsted Grotesk, JetBrains Mono (via next/font)

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

- **Hero** - Three-word headline, one sentence from the resume, contact CTA, authored SVG pipeline diagram
- **Work** - The two biggest numbers as panels, the rest as rows; each opens a project dialog with a diagram
- **Experience** - Ledger of roles with detail dialogs
- **Skills** - Every resume skill group as plain lists
- **AI Assistant** - Centered greeting with preset chips, then chat
- **Contact** - Contact form, email, socials, resume PDF


## License

MIT License - feel free to use this as a template for your own portfolio.

## Contact

- **Email:** mansotra10sharma@gmail.com
- **LinkedIn:** [linkedin.com/in/kaneshwar](https://linkedin.com/in/kaneshwar)
- **GitHub:** [github.com/kaneshS](https://github.com/kaneshS)
