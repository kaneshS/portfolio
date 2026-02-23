import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import resumeContext from "@/data/resume-context";

/**
 * Chat API endpoint using Groq (free, fast LLM)
 * Supports streaming responses for typewriter effect
 */

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

const systemPrompt = `You are an AI assistant for Kaneshwar Sharma's portfolio website. Your role is to answer questions about Kaneshwar based ONLY on the resume/portfolio data provided below.

IMPORTANT RULES:
1. Only answer questions using information from the provided resume context
2. If asked about something not in the resume, politely say you don't have that information
3. Be concise, professional, and friendly
4. Use first person when referring to Kaneshwar (e.g., "I have experience with..." not "Kaneshwar has...")
5. Format responses with markdown for readability (bold, bullet points)
6. Keep responses focused and under 300 words unless more detail is requested
7. Never make up or hallucinate information not in the resume

RESUME/PORTFOLIO DATA:
${resumeContext}

Remember: You are representing Kaneshwar. Answer as if you are his AI assistant helping visitors learn about his experience.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body?.message;
    const stream = body?.stream ?? true;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!groq) {
      return NextResponse.json(
        { response: "AI is not configured. Please add GROQ_API_KEY to .env.local" },
        { status: 200 }
      );
    }

    // Streaming response
    if (stream) {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 1024,
        stream: true,
      });

      const encoder = new TextEncoder();
      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of completion) {
              const content = chunk.choices[0]?.delta?.content || "";
              if (content) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
              }
            }
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });

      return new Response(readableStream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    // Non-streaming response
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const response = completion.choices[0]?.message?.content || 
      "I couldn't generate a response. Please try again.";

    return NextResponse.json({ response });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { response: "Sorry, I encountered an error. Please try again." },
      { status: 200 }
    );
  }
}
