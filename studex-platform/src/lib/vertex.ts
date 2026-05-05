const VERTEX_PROJECT = process.env.GOOGLE_CLOUD_PROJECT;
const VERTEX_LOCATION = process.env.GOOGLE_CLOUD_LOCATION || "us-central1";

export interface VertexMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export interface VertexRequest {
  contents: VertexMessage[];
  systemInstruction?: { parts: { text: string }[] };
  generationConfig?: {
    temperature?: number;
    topP?: number;
    maxOutputTokens?: number;
  };
}

export async function queryVertex(
  messages: VertexMessage[],
  systemPrompt?: string,
  model = "gemini-2.0-flash"
): Promise<string> {
  const endpoint = `https://${VERTEX_LOCATION}-aiplatform.googleapis.com/v1/projects/${VERTEX_PROJECT}/locations/${VERTEX_LOCATION}/publishers/google/models/${model}:generateContent`;

  const body: VertexRequest = {
    contents: messages,
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 8192,
    },
  };

  if (systemPrompt) {
    body.systemInstruction = { parts: [{ text: systemPrompt }] };
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getAccessToken()}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Vertex AI error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
}

async function getAccessToken(): Promise<string> {
  // In production, use Google Auth library or service account
  // For Vercel, use GOOGLE_APPLICATION_CREDENTIALS or workload identity
  try {
    const metadataUrl = "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token";
    const res = await fetch(metadataUrl, {
      headers: { "Metadata-Flavor": "Google" },
    });
    const data = await res.json();
    return data.access_token;
  } catch {
    // Fallback: return env token for local dev
    return process.env.VERTEX_ACCESS_TOKEN || "";
  }
}

export const AGENT_PROMPTS: Record<string, string> = {
  charlie: `You are Charlie, the StudEx AI consultant specializing in studexmeat.com operations, voice AI integration, and client support. You are deeply knowledgeable about:
- E-commerce platform management (studexmeat.com)
- Voice AI assistants and customer service automation
- Client relationship management
- South African market dynamics
Respond with expertise, warmth, and a focus on practical solutions. You represent StudEx's client-facing operations.`,

  robusca: `You are Robusca, the StudEx AI consultant for Global Markets, Tencent Cloud partnerships, and Nvidia technology integration. Your expertise includes:
- Global market analysis and trends
- Tencent Cloud infrastructure and cost optimization
- Nvidia GPU computing, CUDA, and AI acceleration
- Strategic technology partnerships
- Africa-focused cloud deployment strategies
Respond with authority on technology strategy and market intelligence.`,

  naledi: `You are Naledi, the StudEx AI consultant for Marketing, YouTube R&D, and NotebookLM content summarization. You specialize in:
- Digital marketing strategy and content creation
- YouTube channel optimization and video production
- Google NotebookLM integration for research summaries
- Brand development and audience engagement
- African tech ecosystem storytelling
Respond creatively with marketing insight and content strategy expertise.`,
};
