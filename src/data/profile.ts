/**
 * Profile and portfolio data
 * Central data source for all components
 */

// Basic profile info
export const profile = {
  name: "Kaneshwar Sharma",
  title: "Senior Backend Engineer",
  email: "mansotra10sharma@gmail.com",
  phone: "+91-9868825809",
  linkedin: "https://linkedin.com/in/kaneshwar",
  github: "https://github.com/kaneshS",
  medium: "https://medium.com/@mansotra99",
  whatsapp: "https://wa.link/mbvszx",
  resume: "https://drive.google.com/file/d/13RVrKZPUy_jR0yrSQD6wnJFJdU51hUw-/view?usp=sharing",
  aboutMe: `I'm a Senior Backend Engineer with 5+ years of experience building distributed systems that handle scale with elegance. From Kafka-based microservices processing 200K+ images daily to Telegram bots serving 5 million users, I've architected solutions that solve real-world challenges.

My journey in tech has taken me from building automated data pipelines to leading infrastructure migrations from AWS to GCP. I thrive in environments where complex problems meet elegant solutions, whether that's optimizing cloud costs by 40% or building AI-powered assistants that transform how users interact with Web3.

Currently, I'm focused on building scalable blockchain infrastructure at Intract, where we've generated over $600K in revenue through innovative data aggregation. When I'm not coding, I'm exploring new technologies and contributing to open source.`,
};

// Education
export interface Education {
  degree: string;
  university: string;
  location: string;
  period: string;
}

export const education: Education = {
  degree: "Bachelor of Technology (B.Tech)",
  university: "Guru Gobind Singh Indraprastha University",
  location: "Delhi, India",
  period: "2016 - 2020",
};

// Experience type
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

export const experiences: Experience[] = [
  {
    id: "intract-sde3",
    company: "Intract",
    role: "Senior Backend Engineer (SDE-III)",
    period: "March 2024 - Present",
    description:
      "Leading backend infrastructure and AI initiatives for a Web3 platform",
    achievements: [
      "Designed multi-region GCP deployment with autoscaling and global load balancing",
      "Built Terraform-based IaC and managed secrets with HashiCorp Vault",
      "Achieved 50% faster response times and 40% cloud cost reduction",
      "Built Ball-E: AI Web3 assistant with orchestrator pattern routing to specialized agents",
      "Implemented Pinecone RAG with OpenAI embeddings and metadata filtering for user isolation",
      "Real-time streaming via SSE, MongoDB conversations, Redis session caching",
      "Led AWS to GCP infrastructure migration",
      "Launched Intract Rewind generating $600K+ revenue in 2 weeks",
    ],
    technologies: [
      "GCP",
      "Terraform",
      "Docker",
      "Pinecone",
      "OpenAI",
      "Vercel AI SDK",
      "LangChain",
      "Node.js",
      "TypeScript",
      "MongoDB",
      "Redis",
    ],
  },
  {
    id: "intract-consultant",
    company: "Intract",
    role: "Consultant / Software Engineer",
    period: "Jan 2024 - March 2024",
    description: "Built backend for Telegram Mini App serving millions",
    achievements: [
      "Built backend for Telegram Mini App serving ~5 million users",
      "Handled 40K daily users with AWS Kinesis and Lambda",
      "Designed comprehensive test suite and CI/CD pipelines",
    ],
    technologies: [
      "AWS Kinesis",
      "Lambda",
      "Node.js",
      "Docker",
      "GitHub Actions",
      "MongoDB",
      "Go",
    ],
  },
  {
    id: "spyne",
    company: "Spyne.ai",
    role: "Senior Software Engineer (SDE-2)",
    period: "March 2021 - Jan 2024",
    location: "Gurgaon, Haryana",
    description: "Led backend development for AI-powered image processing platform",
    achievements: [
      "Engineered Kafka-based architecture processing 200K+ images/day with parallel consumer groups",
      "Built custom autoscaling controller monitoring topic lag and throughput, reducing costs by 35%",
      "Designed FastAPI APIs serving 50+ global enterprise clients (automotive, e-commerce)",
      "Led team of 3 engineers in API architecture design with versioned endpoints",
      "Implemented Redis caching reducing DB load by 60%, improving response times to <100ms",
      "Built complete mobile backend (Android & iOS) with real-time processing updates",
      "Progressed from junior to senior to team lead, mentoring new hires",
    ],
    technologies: [
      "Python",
      "FastAPI",
      "Kafka",
      "MySQL",
      "Docker",
      "AWS",
      "Redis",
      "MongoDB",
      "Prometheus",
      "Grafana",
    ],
  },
  {
    id: "appsuccessor",
    company: "Appsuccessor",
    role: "Software Engineer",
    period: "Sept 2020 - March 2021",
    description: "Developed automation tools and APIs for marketing analytics",
    achievements: [
      "Built automated scripts for third-party API monitoring",
      "Developed REST APIs and web scraping bots",
      "Automated marketing analytics data collection",
    ],
    technologies: ["Python", "REST APIs", "Web Scraping", "Automation"],
  },
];

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
    technologies: ["Node.js", "TypeScript", "GCP", "Redis", "MongoDB"],
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
      "Orchestrator pattern routing to specialized agents, Pinecone RAG with OpenAI embeddings, SSE streaming",
    architectureDiagram: `flowchart TD
    A[User Query] --> B[Vercel AI SDK]
    B --> C[Orchestrator Router]
    C --> D{Intent Detection}
    D -->|Documents| E[RAG Agent]
    D -->|Web3| F[Blockchain Agent]
    D -->|Search| G[Web Search Agent]
    D -->|Social| H[Social Agent]
    D -->|General| I[Chat Agent]
    E --> J[Pinecone + OpenAI]
    F --> K[Wallet Context]
    E & F & G & H & I --> L[LangChain]
    L --> M[SSE Stream]
    M --> N[Response]
    O[MongoDB] -.-> M
    P[Redis] -.-> M
    
    style B fill:#e8f5e9
    style J fill:#e8f5e9
    style L fill:#e8f5e9`,
    technologies: ["TypeScript", "Vercel AI SDK", "LangChain", "Pinecone", "OpenAI", "Node.js", "MongoDB", "Redis"],
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
    period: "2024",
    description:
      "Built a modern, interactive portfolio website featuring an embedded AI assistant powered by RAG that answers questions about my experience and projects.",
    overview:
      "Designed and developed a full-stack portfolio with Next.js 14, featuring a Harry Potter-inspired theme, interactive animations, and an AI chatbot that uses RAG to answer questions about my background.",
    deliverables: [
      "Next.js 14 App Router with TypeScript",
      "AI chatbot with Groq LLM and RAG pipeline",
      "Harry Potter-themed UI with GSAP animations",
      "Interactive experience timeline with footstep animations",
      "Responsive design with custom cursor effects",
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "GSAP", "Groq API", "Framer Motion"],
    outcome: "Unique portfolio showcasing technical skills with an AI-powered personal assistant",
  },
];

// Skills - array format for the Skills component
export const skills = [
  {
    category: "Languages & Frameworks",
    items: ["Python", "TypeScript", "JavaScript", "Go", "Node.js", "FastAPI", "Flask", "Express.js", "React.js", "Next.js"],
  },
  {
    category: "Cloud & Infrastructure",
    items: ["AWS EC2", "AWS Lambda", "AWS Kinesis", "GCP Compute", "Cloud Run", "Cloud SQL", "Pub/Sub", "Terraform", "Docker"],
  },
  {
    category: "Databases & Messaging",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "ChromaDB", "Apache Kafka", "AWS SQS", "Redis Pub/Sub"],
  },
  {
    category: "DevOps & Tools",
    items: ["Docker", "Terraform", "GitHub Actions", "Nginx", "HashiCorp Vault", "Fluentd", "CI/CD"],
  },
];

// RAG chunks for AI assistant
export const ragChunks = [
  {
    id: "personal",
    content: `Kaneshwar Sharma is a Senior Backend Engineer with 5+ years of experience. Contact: Email mansotra10sharma@gmail.com, Phone +91-9868825809. LinkedIn: linkedin.com/in/kaneshwar, GitHub: github.com/kaneshS`,
    metadata: { type: "personal" },
  },
  {
    id: "current-role",
    content: `Currently working at Intract as Senior Backend Engineer (SDE-III) since March 2024. Key achievements: Multi-region GCP deployment, 50% faster response times, 40% cost reduction. Built Ball-E - an AI-powered Web3 assistant using orchestrator pattern with specialized agents, Pinecone RAG with OpenAI embeddings for personalized blockchain insights, real-time SSE streaming, MongoDB conversations, Redis caching. Led AWS to GCP migration. Launched Intract Rewind generating $600K+ revenue.`,
    metadata: { type: "experience" },
  },
  {
    id: "experience-spyne",
    content: `Worked at Spyne.ai (March 2021 - Jan 2024) as Senior Software Engineer. Built Kafka-based microservices processing 200K+ images/day with parallel consumer groups. Custom autoscaling controller reduced costs by 35%. FastAPI APIs for 50+ enterprise clients (automotive, e-commerce). Redis caching reduced DB load by 60%, response times <100ms. Led team of 3 engineers. Progressed from junior to senior to team lead. Built mobile backend for Android & iOS. Set up Prometheus/Grafana monitoring.`,
    metadata: { type: "experience" },
  },
  {
    id: "skills",
    content: `Technical skills: Python, TypeScript, Go, Node.js. Frameworks: FastAPI, Express, React, Next.js. Databases: PostgreSQL, MongoDB, Redis, ChromaDB. Cloud: AWS and GCP expert. DevOps: Docker, Terraform, Kafka, CI/CD.`,
    metadata: { type: "skills" },
  },
  {
    id: "projects",
    content: `Notable projects: Ball-E AI Web3 Assistant (orchestrator pattern, Pinecone RAG, OpenAI embeddings, specialized agents for wallet context and blockchain insights, SSE streaming), Intract Rewind ($600K revenue, 16 blockchain sources), Telegram Mini App (5M users, 40K daily active), AI Image Pipeline (200K+ images/day), WebSocket + Redis Pub/Sub System (real-time LLM streaming, horizontally scalable, sub-50ms latency).`,
    metadata: { type: "projects" },
  },
  {
    id: "education",
    content: `Education: Bachelor of Technology (B.Tech) from Guru Gobind Singh Indraprastha University (GGSIPU), Delhi, India. Duration: 2016 - 2020.`,
    metadata: { type: "education" },
  },
  {
    id: "freelance",
    content: `Freelance projects: Tech Lead at Stealth AI Gaming Startup - led cross-functional teams (frontend, backend, AI) building AI-powered WebGL game generation platform from natural language prompts. Interactive Portfolio with AI Assistant - built this portfolio using Next.js 14, TypeScript, GSAP animations, Harry Potter theme, and embedded AI chatbot with Groq LLM and RAG pipeline. Technologies: FastAPI, Python, WebGL, AI/ML, Next.js, Tailwind CSS, GSAP, Groq API.`,
    metadata: { type: "freelance" },
  },
];

export default profile;
