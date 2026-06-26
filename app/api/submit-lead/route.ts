/**
 * POST /api/submit-lead
 *
 * Proxy entre le formulaire Next.js et le webhook n8n.
 * Le webhook URL reste côté serveur (jamais exposé au client).
 */

import { NextRequest, NextResponse } from 'next/server';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

export async function POST(req: NextRequest) {
  if (!N8N_WEBHOOK_URL) {
    console.error('N8N_WEBHOOK_URL not configured');
    return NextResponse.json({ error: 'Service temporairement indisponible.' }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide.' }, { status: 400 });
  }

  try {
    const n8nRes = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    // n8n répond souvent avec 200 ou no-content — on accepte les deux
    if (!n8nRes.ok && n8nRes.status !== 204) {
      const text = await n8nRes.text().catch(() => '');
      console.error('n8n error:', n8nRes.status, text);
      return NextResponse.json({ error: 'Erreur lors de l\'envoi au serveur.' }, { status: 502 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('fetch n8n failed:', err);
    return NextResponse.json({ error: 'Impossible de joindre le serveur n8n.' }, { status: 502 });
  }
}
