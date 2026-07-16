import { NextRequest, NextResponse } from 'next/server';

interface ModelConfig {
  ollamaUrl: string;
  blotatoKey?: string;
  connectivityMode: 'offline' | 'hybrid' | 'online';
  selectedModels: string[];
}

let modelConfig: ModelConfig = {
  ollamaUrl: 'http://localhost:11434',
  connectivityMode: 'hybrid',
  selectedModels: [],
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'install') {
      const { modelId, ollamaUrl } = body;

      try {
        const response = await fetch(`${ollamaUrl}/api/pull`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: modelId }),
        });

        if (response.ok) {
          return NextResponse.json({ success: true, message: `Model ${modelId} installation started` });
        } else {
          return NextResponse.json({ success: false, error: 'Failed to start installation' }, { status: 400 });
        }
      } catch (error) {
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
      }
    }

    if (action === 'save-config') {
      const { ollamaUrl, blotatoKey, connectivityMode, selectedModels } = body;

      modelConfig = {
        ollamaUrl,
        blotatoKey,
        connectivityMode,
        selectedModels,
      };

      return NextResponse.json({ success: true, config: modelConfig });
    }

    if (action === 'get-config') {
      return NextResponse.json(modelConfig);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');

  if (action === 'config') {
    return NextResponse.json(modelConfig);
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
