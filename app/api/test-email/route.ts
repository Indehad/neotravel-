import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// ⚠️ Resend initialisé DANS le handler, pas au niveau module
// (sinon Next.js plante au build si RESEND_API_KEY est absent)

export async function GET() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ success: false, error: 'RESEND_API_KEY non configurée.' }, { status: 503 });
  }

  const resend = new Resend(apiKey);

  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'gendellfriolanita@gmail.com',
      subject: 'Hello World from VS Code!',
      html: '<p>Congrats on sending your <strong>first email</strong> from your clean workspace!</p>',
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}
