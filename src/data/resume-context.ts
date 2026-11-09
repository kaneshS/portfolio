/**
 * Full resume context for the LLM, rendered from src/data/resume.json
 */
import resume from "./resume.json";
import { freelanceProjects } from "./profile";

const r = resume;

export const resumeContext = `
# ${r.name} - ${r.title}

${r.headline}

## Contact Information
- Email: ${r.email}
- Phone: ${r.phone}
- Location: ${r.location}
- LinkedIn: ${r.links.linkedin}
- GitHub: ${r.links.github}
- Medium: ${r.links.medium}
- WhatsApp: ${r.links.whatsapp}
- Resume/CV: [Download Resume (PDF)](${r.links.resume})

## Professional Summary
${r.summary}

## Work Experience
${r.experience
  .map(
    (e) => `
### ${e.company} - ${e.role}
**${e.start} - ${e.end}**${"location" in e ? ` | ${e.location}` : ""}
${e.description}

Key Responsibilities & Achievements:
${e.achievements.map((a) => `- ${a}`).join("\n")}

Technologies: ${e.stack.join(", ")}`
  )
  .join("\n")}

## Projects
${r.projects.map((p) => `- **${p.title}** (${p.stack.join(", ")}): ${p.description}`).join("\n")}

## Technical Skills
${Object.entries(r.skills)
  .map(([k, v]) => `- ${k}: ${v.join(", ")}`)
  .join("\n")}

## Education
**${r.education.university}**
- Degree: ${r.education.degree}
- Location: ${r.education.location}
- Duration: ${r.education.period}

## Freelance Projects
${freelanceProjects
  .map(
    (f) => `
### ${f.title} (${f.period})
**Client:** ${f.client}
${f.description}
${f.deliverables.map((d) => `- ${d}`).join("\n")}
- Technologies: ${f.technologies.join(", ")}
- Outcome: ${f.outcome}`
  )
  .join("\n")}

## Key Metrics & Achievements
- ~5M users served (40K+ daily active) on Telegram Mini App backend
- 200K+ images processed daily at Spyne.ai
- $600K+ NFT mint revenue generated with Intract Rewind in 2 weeks
- 50+ enterprise clients served via FastAPI APIs
- p95 response times cut 50%, monthly cloud spend cut 40% (AWS-to-GCP migration)
- Infrastructure cost cut 35% via custom Kafka-lag autoscaler
- Redis caching: DB load down 60%, API latency 500ms to under 100ms
- Promoted to SDE-II and team lead of 3 within 13 months
`;

export default resumeContext;
