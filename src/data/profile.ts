/**
 * Profile and portfolio data
 * Source of truth: src/data/resume.json (extracted from Kaneshwar_Sharma.pdf)
 * Projects + freelance below are hand-curated (diagrams, metrics).
 */
import resume from "./resume.json";

export { resume };

// Basic profile info
export const profile = {
  name: resume.name,
  title: resume.title,
  email: resume.email,
  phone: resume.phone,
  location: resume.location,
  linkedin: resume.links.linkedin,
  github: resume.links.github,
  medium: resume.links.medium,
  whatsapp: resume.links.whatsapp,
  resume: resume.links.resume,
  aboutMe: `I'm a senior full-stack engineer who builds Python (FastAPI) and Go REST APIs, event-driven microservices, and data pipelines on Linux, AWS, and GCP, with React and Next.js front ends on top. From Kafka pipelines processing 200K+ images a day to a serverless Go backend serving ~5M Telegram users, I've shipped systems that handle real scale.

At Spyne.ai I was promoted to SDE-II and team lead of 3 within 13 months, shipping FastAPI APIs with API-key auth for 50+ enterprise clients. At Intract, a Web3 platform, I built the backend for a multi-chain analytics launch that generated $600K+ in NFT mint revenue within 2 weeks, and led the AWS-to-GCP migration that cut p95 latency 50% and cloud spend 40%.

Most recently at Turing, I built Go and PostgreSQL services integrating Uber into a Dubai-based super app, and backend APIs for standardized AI/ML training environments. I write unit tests against mocked dependencies behind CI coverage gates, and ship the UI in TypeScript, React and Next.js.`,
};

// Education
export type Education = typeof resume.education;
export const education: Education = resume.education;

// Experience
export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location?: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export const experiences: Experience[] = resume.experience.map((e) => ({
  id: e.id,
  company: e.company,
  role: e.role,
  period: `${e.start} - ${e.end}`,
  location: "location" in e ? e.location : undefined,
  description: e.description,
  achievements: e.achievements,
  technologies: e.stack,
}));

// Projects
export interface Project {
  id: string;
  title: string;
  description: string;
  problem: string;
  architecture: string;
  architectureDiagram?: string;
  technologies: string[];
  metrics: { label: string; value: string }[];
  link?: string;
  github?: string;
}

export const projects: Project[] = [
  {
    id: "intract-rewind",
    title: "Intract Rewind",
    description:
      "Web3 analytics product aggregating blockchain data from 16 sources",
    problem:
      "Users needed a comprehensive view of their blockchain activity across multiple chains and protocols",
    architecture:
      "Event-driven pipeline with parallel data fetchers, normalization layer, and real-time aggregation",
    architectureDiagram: `flowchart TD
    A[16 Blockchain Sources] --> B[Data Fetchers]
    B --> C[Normalization Layer]
    C --> D[Aggregation Engine]
    D --> E[Analytics API]
    E --> F[User Dashboard]
    
    style A fill:#e8f5e9
    style D fill:#e8f5e9
    style F fill:#e8f5e9`,
    technologies: ["Python", "Node.js", "TypeScript", "GCP", "MongoDB"],
    metrics: [
      { label: "Revenue", value: "$600K+" },
      { label: "Time to Market", value: "2 weeks" },
      { label: "Data Sources", value: "16" },
    ],
  },
  {
    id: "telegram-backend",
    title: "Telegram Mini App Backend",
    description: "High-performance backend serving millions of users",
    problem:
      "Needed to handle massive concurrent user load with real-time features",
    architecture:
      "Serverless architecture with Kinesis for event streaming and Lambda for processing",
    architectureDiagram: `flowchart LR
    A[5M Users] --> B[API Gateway]
    B --> C[Lambda Functions]
    C --> D[Kinesis Streams]
    D --> E[Processors]
    E --> F[MongoDB]
    
    style A fill:#e8f5e9
    style D fill:#e8f5e9`,
    technologies: ["Go", "AWS Lambda", "Kinesis", "MongoDB", "Docker"],
    metrics: [
      { label: "Users", value: "5M" },
      { label: "Daily Active", value: "40K" },
      { label: "Availability", value: "99.9%" },
    ],
  },
  {
    id: "ai-image-pipeline",
    title: "AI Image Processing Pipeline",
    description: "Kafka-based microservices for AI image processing at scale",
    problem:
      "Enterprise clients needed reliable, fast image processing with AI enhancement",
    architecture:
      "Distributed Kafka consumers with custom autoscaling based on topic lag",
    architectureDiagram: `flowchart TD
    A[Image Upload] --> B[Kafka Topic]
    B --> C[Consumer Group]
    B -.-> G[Autoscaler]
    G -.-> C
    C --> D[AI Processing]
    D --> E[Output Queue]
    E --> F[Delivery]
    
    style B fill:#e8f5e9
    style D fill:#e8f5e9
    style G fill:#e8f5e9`,
    technologies: ["Python", "FastAPI", "Kafka", "Redis", "Docker", "AWS"],
    metrics: [
      { label: "Images/Day", value: "200K+" },
      { label: "Clients", value: "50+" },
      { label: "Latency", value: "<500ms" },
    ],
  },
  {
    id: "web3-assistant",
    title: "Ball-E: AI-Powered Web3 Assistant",
    description:
      "Context-aware Web3 AI assistant with agentic architecture for personalized blockchain insights",
    problem:
      "Users needed personalized blockchain insights with wallet context, secure data isolation, and real-time responses",
    architecture:
      "5+ intent-routed agents, ChromaDB vector search with per-user data isolation, SSE streaming",
    architectureDiagram: `flowchart TD
    A[User Query] --> B[Vercel AI SDK]
    B --> C[Orchestrator Router]
    C --> D{Intent Detection}
    D -->|Documents| E[RAG Agent]
    D -->|Web3| F[Blockchain Agent]
    D -->|Search| G[Web Search Agent]
    D -->|Social| H[Social Agent]
    D -->|General| I[Chat Agent]
    E --> J[ChromaDB Vector Search]
    F --> K[Wallet Context]
    E & F & G & H & I --> L[Agent Orchestrator]
    L --> M[SSE Stream]
    M --> N[Response]
    O[MongoDB] -.-> M
    P[Redis] -.-> M
    
    style B fill:#e8f5e9
    style J fill:#e8f5e9
    style L fill:#e8f5e9`,
    technologies: ["Go", "TypeScript", "Vercel AI SDK", "ChromaDB", "RAG", "MongoDB", "Redis"],
    metrics: [
      { label: "Specialized Agents", value: "5+" },
      { label: "Response Latency", value: "<1s" },
      { label: "Data Isolation", value: "100%" },
    ],
  },
];

// Freelance projects
export interface FreelanceProject {
  id: string;
  client: string;
  title: string;
  period: string;
  description: string;
  overview: string;
  deliverables: string[];
  technologies: string[];
  outcome: string;
}

export const freelanceProjects: FreelanceProject[] = [
  {
    id: "ai-game-platform",
    client: "Stealth AI Gaming Startup",
    title: "Tech Lead - AI-Powered WebGL Game Platform",
    period: "Nov 2023",
    description:
      "Led cross-functional engineering teams at a stealth startup building an AI-powered platform that generates WebGL games from natural language prompts.",
    overview:
      "Served as Tech Lead managing engineers across frontend, backend, and AI teams. Established communication channels with product and CEO for continuous improvement, streamlined development processes, and architected the core infrastructure.",
    deliverables: [
      "Led frontend, backend, and AI engineering teams",
      "Established communication channels between engineering, product, and CEO",
      "Streamlined development processes and workflows",
      "Architected the backend infrastructure for AI game generation",
      "Coordinated cross-team collaboration for seamless integration",
    ],
    technologies: ["Node.js", "WebGL", "AI/ML", "TypeScript", "Cloud Infrastructure"],
    outcome: "Successfully built and shipped AI-to-game generation pipeline",
  },
  {
    id: "portfolio-ai",
    client: "Personal Project",
    title: "Interactive Portfolio with AI Assistant",
    period: "2024 – 2026",
    description:
      "Built a modern, interactive portfolio website featuring an embedded AI assistant powered by RAG that answers questions about my experience and projects.",
    overview:
      "Designed and developed a full-stack portfolio with Next.js 14, featuring dark/light themes, interactive animations, and an AI chatbot that uses RAG to answer questions about my background.",
    deliverables: [
      "Next.js 14 App Router with TypeScript",
      "AI chatbot with Groq LLM and RAG pipeline",
      "Marauder's Map theme with light and dark modes",
      "Footprint timeline that walks the visitor through each role",
      "Responsive design with custom cursor effects",
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Groq API", "Mermaid"],
    outcome: "Unique portfolio showcasing technical skills with an AI-powered personal assistant",
  },
];

// Skills - array format for the Skills component (4 cards)
const s = resume.skills;
export const skills = [
  { category: "Languages & Frameworks", items: [...s["Languages"], ...s["Backend"].slice(0, 5), ...s["Frontend"].slice(0, 2)] },
  { category: "Cloud & Infrastructure", items: s["Cloud & DevOps"] },
  { category: "Databases & Messaging", items: [...s["Databases"], "Kafka", "SQS", "Kinesis", "Redis Pub/Sub", "ChromaDB"] },
  { category: "Testing, Auth & AI", items: [...s["Testing & Observability"].slice(0, 6), ...s["Auth & Security"], ...s["AI/LLM"]] },
];

// RAG chunks for AI assistant - derived from resume.json
export const ragChunks = [
  {
    id: "personal",
    content: `${resume.name} is a ${resume.title} based in ${resume.location}. ${resume.summary} Contact: Email ${resume.email}, Phone ${resume.phone}. LinkedIn: ${resume.links.linkedin}, GitHub: ${resume.links.github}`,
    metadata: { type: "personal" },
  },
  ...resume.experience.map((e) => ({
    id: `experience-${e.id}`,
    content: `${e.company} (${e.start} - ${e.end}), ${e.role}. ${e.description}. Stack: ${e.stack.join(", ")}. ${e.achievements.join(" ")}`,
    metadata: { type: "experience", company: e.company },
  })),
  {
    id: "skills",
    content: `Technical skills. ${Object.entries(s).map(([k, v]) => `${k}: ${v.join(", ")}`).join(". ")}.`,
    metadata: { type: "skills" },
  },
  {
    id: "projects",
    content: `Notable projects: ${resume.projects.map((p) => `${p.title} (${p.stack.join(", ")}): ${p.description}`).join(" ")} Also: Intract Rewind ($600K+ revenue, 16 blockchain sources), Telegram Mini App backend (5M users, 40K daily active), AI Image Pipeline at Spyne (200K+ images/day).`,
    metadata: { type: "projects" },
  },
  {
    id: "education",
    content: `Education: ${resume.education.degree} from ${resume.education.university}, ${resume.education.location}. Duration: ${resume.education.period}.`,
    metadata: { type: "education" },
  },
  {
    id: "freelance",
    content: `Freelance projects: ${freelanceProjects.map((f) => `${f.title} for ${f.client} (${f.period}): ${f.description} Technologies: ${f.technologies.join(", ")}. Outcome: ${f.outcome}`).join(" ")}`,
    metadata: { type: "freelance" },
  },
];

export default profile;
