/**
 * POST /api/chat
 *
 * Emma via Groq (llama-3.3-70b) — sans n8n, sans limite d'exécutions.
 * Body : { message: string, history?: { role: string, text: string }[] }
 */

import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

const EMMA_SYSTEM = `Tu es Emma, conseillère transport de NeoTravel. Tu aides les clients à obtenir un devis de transport de groupe en bus/car en France.

Ton rôle : collecter les informations nécessaires pour établir un devis, une question à la fois, de façon naturelle et chaleureuse.

Informations à collecter (dans cet ordre si non fournies) :
1. Ville de départ
2. Ville d'arrivée
3. Date du trajet
4. Nombre de passagers
5. Aller simple ou aller-retour
6. Adresse email du client

Règles :
- Pose UNE SEULE question à la fois
- Sois chaleureuse, professionnelle et concise
- Parle TOUJOURS en français
- Si plus de 85 passagers : dis qu'un commercial les contactera sous 24h, demande l'email
- Quand tu as TOUTES les infos : dis "Parfait ! Votre devis est en cours de préparation et vous sera envoyé à [email] dans les prochaines minutes."
- Ne calcule JAMAIS de prix — tu n'as pas accès aux tarifs`;

export async function POST(req: NextRequest) {
  if (!GROQ_API_KEY) {
    return NextResponse.json({ error: 'GROQ_API_KEY non configurée.' }, { status: 503 });
  }

  let body: { message?: string; history?: { role: string; text: string }[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide.' }, { status: 400 });
  }

  if (!body.message?.trim()) {
    return NextResponse.json({ error: 'Message vide.' }, { status: 400 });
  }

  // Construire l'historique au format OpenAI
  const messages = [
    { role: 'system', content: EMMA_SYSTEM },
    ...(body.history || [])
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text,
      })),
    { role: 'user', content: body.message },
  ];

  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({ model: MODEL, messages, temperature: 0.7, max_tokens: 512 }),
    });

    if (!res.ok) {
      const err = await res.text().catch(() => '');
      console.error('Groq error:', res.status, err);
      return NextResponse.json({ error: "Emma n'est pas disponible." }, { status: 502 });
    }

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content || "Je n'ai pas pu générer une réponse.";
    return NextResponse.json({ reply }, { status: 200 });
  } catch (err) {
    console.error('Groq fetch failed:', err);
    return NextResponse.json({ error: 'Impossible de joindre Emma.' }, { status: 502 });
  }
}
