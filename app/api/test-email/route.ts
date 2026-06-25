import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// This safely pulls your key from the .env.local file you just made
const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'gendellfriolanita@gmail.com', // Must be your registered Resend email
      subject: 'Hello World from VS Code!',
      html: '<p>Congrats on sending your <strong>first email</strong> from your clean workspace!</p>'
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}