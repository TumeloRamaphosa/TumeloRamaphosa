import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action !== "push") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const githubToken = process.env.GITHUB_TOKEN;
    const org = process.env.GITHUB_ORG || "StudEx";

    if (!githubToken) {
      return NextResponse.json({
        status: "simulated",
        message: `Simulated push to ${org}/studex-platform. Configure GITHUB_TOKEN for real integration.`,
        timestamp: new Date().toISOString(),
      });
    }

    // Real GitHub API push via the REST API
    const response = await fetch(
      `https://api.github.com/repos/${org}/studex-platform/dispatches`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_type: "deploy",
          client_payload: {
            timestamp: new Date().toISOString(),
            triggered_by: "studex-brain-dashboard",
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return NextResponse.json({
      status: "pushed",
      message: `Successfully triggered deploy to ${org}/studex-platform`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "GitHub push failed", details: String(error) },
      { status: 500 }
    );
  }
}
