import { NextResponse } from "next/server";

export const runtime = "nodejs";

// ElevenLabs TTS. Uses ELEVENLABS_API_KEY + ELEVENLABS_VOICE_ID when set.
// Without a key it returns { fallback: true } so the client falls back to
// browser speech — the demo still talks today.
export async function POST(req: Request) {
  let text = "";
  try {
    ({ text } = await req.json());
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "No text" }, { status: 400 });
  }

  const key = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";

  if (!key) {
    return NextResponse.json({ fallback: true });
  }

  try {
    const r = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": key,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2_5",
          voice_settings: { stability: 0.5, similarity_boost: 0.8 },
        }),
      }
    );
    if (!r.ok) {
      return NextResponse.json(
        { fallback: true, error: `ElevenLabs ${r.status}` },
        { status: 200 }
      );
    }
    const audio = await r.arrayBuffer();
    return new NextResponse(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ fallback: true }, { status: 200 });
  }
}
