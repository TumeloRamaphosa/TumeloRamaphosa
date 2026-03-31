import { NextRequest, NextResponse } from "next/server";
import { AGENT_PROMPTS, queryVertex, type VertexMessage } from "@/lib/vertex";

export async function POST(request: NextRequest) {
  try {
    const { message, agent, history } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const agentName = (agent || "charlie").toLowerCase();
    const systemPrompt = AGENT_PROMPTS[agentName] || AGENT_PROMPTS.charlie;

    // Convert history to Vertex format
    const vertexMessages: VertexMessage[] = (history || [])
      .filter((msg: { role: string }) => msg.role === "user" || msg.role === "assistant")
      .map((msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

    // Add current message
    vertexMessages.push({
      role: "user",
      parts: [{ text: message }],
    });

    try {
      const response = await queryVertex(vertexMessages, systemPrompt);
      return NextResponse.json({ response, agent: agentName });
    } catch {
      // Fallback response when Vertex AI is not configured
      const fallbackResponses: Record<string, string> = {
        charlie: `As Charlie, I'd love to help you with "${message}". I specialize in studexmeat.com operations, voice AI, and client support. Once Vertex AI credentials are configured, I'll provide full AI-powered responses. For now, I can confirm that the StudEx system is operational and ready for deployment.`,
        robusca: `As Robusca, regarding "${message}" — I focus on Global Markets, Tencent Cloud optimization, and Nvidia partnerships. The Tencent Cloud JNB1 region offers 60-75% cost savings compared to traditional hyperscalers. Configure Vertex AI to unlock full analytical capabilities.`,
        naledi: `As Naledi, I'm excited about "${message}"! I handle Marketing, YouTube R&D, and NotebookLM integration. The content pipeline is ready for activation. Connect Vertex AI credentials to enable full creative AI assistance.`,
      };

      return NextResponse.json({
        response: fallbackResponses[agentName] || fallbackResponses.charlie,
        agent: agentName,
        fallback: true,
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
