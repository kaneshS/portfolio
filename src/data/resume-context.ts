/**
 * Complete resume context for LLM
 * This provides full context about Kaneshwar Sharma for the AI assistant
 */

export const resumeContext = `
# Kaneshwar Sharma - Senior Backend Engineer

## Contact Information
- Email: mansotra10sharma@gmail.com
- Phone: +91-9868825809
- Location: India
- LinkedIn: [linkedin.com/in/kaneshwar](https://linkedin.com/in/kaneshwar)
- GitHub: [github.com/kaneshS](https://github.com/kaneshS)
- WhatsApp: [Chat on WhatsApp](https://wa.link/mbvszx)
- Resume/CV: [Download Resume (PDF)](https://drive.google.com/file/d/13RVrKZPUy_jR0yrSQD6wnJFJdU51hUw-/view?usp=sharing)

**To download Kaneshwar's resume, click here:** [Download Resume](https://drive.google.com/file/d/13RVrKZPUy_jR0yrSQD6wnJFJdU51hUw-/view?usp=sharing)

## Professional Summary
Senior Backend Engineer with 5+ years of experience designing and building distributed systems at scale. Specializing in high-performance APIs, event-driven architectures, and cloud-native solutions on AWS and GCP. Passionate about solving complex problems with elegant, maintainable solutions.

## Work Experience

### Intract - Senior Backend Engineer (SDE-III)
**March 2024 - Present**

Key Responsibilities & Achievements:
- Designed and implemented a multi-region deployment on GCP using Managed Instance Groups with autoscaling behind a Global HTTP(S) Load Balancer
- Built Terraform scripts for infrastructure formation stacks and managed Docker Registry and HashiCorp Vault for secrets
- Optimized backend performance and cloud costs through gzip compression, query indexing, caching, and instance right-sizing, achieving 50% faster response times and 40% cost reduction
- Built Ball-E, an AI-powered Web3 assistant using orchestrator pattern with specialized agents for personalized blockchain insights, wallet context, and real-time Web3 queries
- Implemented Pinecone-based RAG layer with OpenAI embeddings, metadata filtering for strict user data isolation, and query expansion for improved semantic search accuracy
- Designed agentic AI architecture routing user intents to specialized agents (document insights, Web3 queries, web search, social workflows) using Vercel AI SDK and LangChain
- Built real-time streaming responses using Server-Sent Events (SSE), MongoDB for conversation storage, and Redis for session caching
- Led infrastructure migration from AWS to GCP
- Built and launched Intract Rewind by aggregating data from 16 blockchain sources, generating over $600K revenue in two weeks

Technologies: GCP, Terraform, Docker, Pinecone, OpenAI, Vercel AI SDK, LangChain, Node.js, TypeScript, MongoDB, Redis

### Intract - Consultant / Software Engineer
**January 2024 - March 2024**

Key Responsibilities & Achievements:
- Built backend for a Telegram Mini App serving around 5 million users
- Handled daily load of 40K users using AWS Kinesis and Lambda for near real-time processing
- Designed unit and integration tests and implemented CI/CD pipelines using GitHub Actions and Docker

Technologies: AWS Kinesis, AWS Lambda, Node.js, Docker, GitHub Actions, TypeScript, MongoDB

### Spyne.ai - Senior Software Engineer (SDE-2)
**March 2021 - January 2024** | Gurgaon, Haryana

Key Responsibilities & Achievements:
- Engineered a Kafka-based microservice architecture for AI image processing handling 200K+ images per day with multiple consumer groups for parallel processing
- Built a custom autoscaling controller that monitors Kafka topic lag, consumer throughput, and processing latency to dynamically scale worker pods, reducing infrastructure costs by 35%
- Designed and maintained FastAPI-based external APIs serving 50+ global enterprise clients including automotive dealers and e-commerce platforms
- Led a team of 3 engineers to design API architecture, database models, and OpenAPI documentation with versioned endpoints
- Implemented Redis caching layer reducing database load by 60% and improving API response times from 500ms to under 100ms
- Built complete backend infrastructure for mobile teams (Android & iOS) with real-time image processing status updates
- Progressed from junior engineer to senior to team lead, mentoring new hires and conducting code reviews
- Set up monitoring and alerting using Prometheus and Grafana for proactive incident management

Technologies: Python, FastAPI, Kafka, MySQL, Docker, AWS, Redis, MongoDB, Prometheus, Grafana

### Appsuccessor - Software Engineer
**September 2020 - March 2021**

Key Responsibilities & Achievements:
- Built automated scripts to replicate and monitor third-party API data streams
- Developed REST APIs and web scraping bots to automate marketing analytics data collection

Technologies: Python, REST APIs, Web Scraping, Automation

## Technical Skills

### Programming Languages
- Python (Primary)
- TypeScript
- JavaScript
- Node.js
- Go

### Frameworks & Libraries
- FastAPI (Expert)
- Flask
- Express.js
- React.js
- Next.js
- Go

### Databases
- Mysql  (Primary)
- MySQL
- MongoDB
- Redis (Caching & Pub/Sub)
- ChromaDB (Vector Database)

### Message Queues & Streaming
- Apache Kafka (Expert)
- AWS Kinesis
- AWS SQS
- Redis Pub/Sub
- GCP Pub/Sub

### Cloud Platforms

#### AWS
- EC2, Lambda, RDS
- Kinesis, SQS
- S3, CloudWatch

#### GCP
- Compute Engine, Cloud Run
- Cloud SQL, Pub/Sub
- Managed Instance Groups
- Global Load Balancer

### DevOps & Infrastructure
- Docker (Containerization)
- Terraform (Infrastructure as Code)
- GitHub Actions (CI/CD)
- Nginx (Reverse Proxy)
- HashiCorp Vault (Secrets Management)
- Fluentd (Log Aggregation)

### Architecture Patterns
- Microservices Architecture
- Event-Driven Architecture
- RESTful API Design
- Real-time Systems
- Distributed Systems

## Key Projects

### 1. Intract Rewind
- Web3 analytics product aggregating blockchain data from 16 sources
- Generated $600K+ revenue in 2 weeks
- Built data pipelines for collecting and normalizing blockchain activity

### 2. Telegram Mini App Backend
- Served 5 million users with 40K daily active users
- Real-time processing with AWS Kinesis and Lambda
- 99.9% availability 
- built backend with Go and MongoDB

### 3. AI Image Processing Pipeline (Spyne.ai)
- Kafka-based microservices processing 200K+ images/day
- Custom autoscaling based on topic lag
- Serving 50+ global enterprise clients

### 4. AI-Powered Web3 Assistant
- Built with Vercel AI SDK
- Custom agents for Twitter, LinkedIn, MetaMask integration
- ChromaDB for vector search and personalization

### 5. WebSocket + Redis Pub/Sub System
- Real-time LLM response streaming with chunked delivery
- Horizontally scalable WebSocket architecture without sticky sessions
- Redis Pub/Sub for cross-instance message broadcasting
- Connection pooling and automatic reconnection handling
- Sub-50ms latency for message propagation
- Technologies: Node.js, WebSocket, Redis Pub/Sub, TypeScript, Docker
- Use case: Enables real-time AI chat experiences across distributed server instances

## Education

**Guru Gobind Singh Indraprastha University (GGSIPU)**
- Degree: Bachelor of Technology (B.Tech)
- Location: Delhi, India
- Duration: 2016 - 2020

## Freelance Projects

Kaneshwar also takes on freelance backend engineering projects. Notable work includes:

### 1. Tech Lead - AI-Powered WebGL Game Platform (Nov 2023)
**Client:** Stealth AI Gaming Startup
- Led cross-functional engineering teams (frontend, backend, AI) at a stealth startup
- Built an AI-powered platform that generates WebGL games from natural language prompts
- Established communication channels between engineering, product, and CEO
- Streamlined development processes and coordinated cross-team collaboration
- Technologies: Node.js, WebGL, AI/ML, TypeScript, Cloud Infrastructure
- Outcome: Successfully built and shipped AI-to-game generation pipeline

### 2. Interactive Portfolio with AI Assistant (2024)
**Client:** Personal Project
- Built a modern portfolio with Next.js 14 and TypeScript
- Embedded AI chatbot using Groq LLM with RAG pipeline
- Harry Potter-themed UI with GSAP scroll animations
- Interactive experience timeline with animated footsteps
- Technologies: Next.js, TypeScript, Tailwind CSS, GSAP, Groq API, Framer Motion
- Outcome: Unique portfolio showcasing technical skills with AI-powered assistant

## Key Metrics & Achievements
- 5 million users served on Telegram Mini App
- 200K+ images processed daily at Spyne.ai
- $600K+ revenue generated with Intract Rewind in 2 weeks
- 50% improvement in response times
- 40% reduction in cloud costs
- 99.9%+ system availability
- Led team of 3 engineers
- 50+ global enterprise clients served

## Engineering Philosophy
1. Event-Driven First: Prefer decoupled architectures with Kafka and message queues
2. Cost-Performance Balance: Optimize for both speed and cost efficiency
3. Infrastructure as Code: Terraform for reproducible, version-controlled infrastructure
4. Observability: Comprehensive logging, metrics, and monitoring from day one
`;

export default resumeContext;
