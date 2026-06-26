/**
 * POST /api/chat
 *
 * Proxy entre l'UI chat Next.js et le webhook Emma (n8n cloud).
 * Garde l'URL du webhook côté serveur — jamais exposée au navigateur.
 *
 * Body attendu : { sessionId: string, message: string }
 * Body transmis à n8n : { sessionId, chatInput }
 * Réponse de n8n : { output: string } ou texte brut
 */

import { NextRequest, NextResponse } from 'next/server';

const EMMA_WEBHOOK_URL =
  process.env.EMMA_WEBHOOK_URL ||
  'https://gendellepitech.app.n8n.cloud/webhook/neotravel-chat';

export async function POST(req: NextRequest) {
  let body: { sessionId?: string; message?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide.' }, { status: 400 });
  }

  if (!body.message?.trim()) {
    return NextResponse.json({ error: 'Message vide.' }, { status: 400 });
  }

  try {
    const n8nRes = await fetch(EMMA_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: body.sessionId || 'default-session',
        chatInput: body.message,
      }),
    });

    if (!n8nRes.ok) {
      const text = await n8nRes.text().catch(() => '');
      console.error('Emma webhook error:', n8nRes.status, text);
      return NextResponse.json(
        { error: "Emma n'est pas disponible pour le moment." },
        { status: 502 }
      );
    }

    // n8n peut répondre avec du JSON { output: "..." } ou du texte brut
    const contentType = n8nRes.headers.get('content-type') || '';
    let reply: string;

    if (contentType.includes('application/json')) {
      const data = await n8nRes.json();
      // n8n AI Agent renvoie { output: "..." } ou { message: "..." }
      reply = data.output || data.message || data.text || JSON.stringify(data);
    } else {
      reply = await n8nRes.text();
    }

    return NextResponse.json({ reply }, { status: 200 });
  } catch (err) {
    console.error('fetch Emma failed:', err);
    return NextResponse.json(
      { error: 'Impossible de joindre Emma.' },
      { status: 502 }
    );
  }
}
