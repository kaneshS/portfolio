/**
 * Simple RAG (Retrieval-Augmented Generation) implementation
 * Uses TF-IDF based similarity for retrieval without external dependencies
 */

import { ragChunks } from "@/data/profile";

interface Chunk {
  id: string;
  content: string;
  metadata: Record<string, string | undefined>;
}

interface ScoredChunk extends Chunk {
  score: number;
}

// Tokenize and normalize text
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

// Calculate term frequency
function termFrequency(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  tokens.forEach((token) => {
    tf.set(token, (tf.get(token) || 0) + 1);
  });
  // Normalize by document length
  const maxFreq = Math.max(...Array.from(tf.values()));
  tf.forEach((freq, token) => {
    tf.set(token, freq / maxFreq);
  });
  return tf;
}

// Calculate inverse document frequency
function inverseDocumentFrequency(
  documents: string[][],
  token: string
): number {
  const containingDocs = documents.filter((doc) => doc.includes(token)).length;
  if (containingDocs === 0) return 0;
  return Math.log(documents.length / containingDocs);
}

// Calculate TF-IDF similarity between query and document
function calculateSimilarity(
  queryTokens: string[],
  docTokens: string[],
  allDocuments: string[][]
): number {
  const queryTf = termFrequency(queryTokens);
  const docTf = termFrequency(docTokens);

  let score = 0;
  queryTokens.forEach((token) => {
    const tf = docTf.get(token) || 0;
    const idf = inverseDocumentFrequency(allDocuments, token);
    const queryWeight = queryTf.get(token) || 0;
    score += tf * idf * queryWeight;
  });

  return score;
}

// Pre-tokenize all chunks for efficient retrieval
const tokenizedChunks = ragChunks.map((chunk) => ({
  ...chunk,
  tokens: tokenize(chunk.content),
}));

const allDocuments = tokenizedChunks.map((chunk) => chunk.tokens);

/**
 * Retrieve the most relevant chunks for a given query
 */
export function retrieveChunks(query: string, topK: number = 3): ScoredChunk[] {
  const queryTokens = tokenize(query);

  const scoredChunks: ScoredChunk[] = tokenizedChunks.map((chunk) => ({
    id: chunk.id,
    content: chunk.content,
    metadata: chunk.metadata,
    score: calculateSimilarity(queryTokens, chunk.tokens, allDocuments),
  }));

  // Sort by score and return top K
  return scoredChunks
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter((chunk) => chunk.score > 0);
}

/**
 * Build the context string from retrieved chunks
 */
export function buildContext(chunks: ScoredChunk[]): string {
  if (chunks.length === 0) {
    return "";
  }

  return chunks.map((chunk) => chunk.content).join("\n\n---\n\n");
}

/**
 * Build the prompt for the LLM with retrieved context
 */
export function buildPrompt(query: string, context: string): string {
  if (!context) {
    return `You are a helpful assistant for Kanesh's portfolio website. 
The user asked: "${query}"

You don't have specific information about this topic in the portfolio data.
Respond with: "I don't have information about that in my portfolio data. Feel free to ask about my work experience, projects, technical skills, or the systems I've built."`;
  }

  return `You are a helpful assistant for Kanesh's portfolio website. Answer questions about Kanesh based ONLY on the following context. Be concise, professional, and friendly. If the information isn't in the context, say you don't have that information.

Context:
${context}

User question: ${query}

Respond naturally as if you are Kanesh's AI assistant. Use first person when referring to Kanesh (e.g., "I have experience with..." instead of "Kanesh has experience with...").`;
}

/**
 * Main RAG function - retrieves relevant chunks and builds prompt
 */
export function rag(query: string): { prompt: string; sources: ScoredChunk[] } {
  const chunks = retrieveChunks(query, 4);
  const context = buildContext(chunks);
  const prompt = buildPrompt(query, context);

  return { prompt, sources: chunks };
}
