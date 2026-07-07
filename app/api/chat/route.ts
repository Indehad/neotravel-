import { NextRequest, NextResponse } from "next/server";

const N8N_WEBHOOK = "https://gendellepitech.app.n8n.cloud/webhook/neotravel-chat";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const n8nRes = await fetch(N8N_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!n8nRes.ok) {
      return NextResponse.json(
        { error: `n8n error ${n8nRes.status}` },
        { status: n8nRes.status }
      );
    }

    const data = await n8nRes.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Chat proxy error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
