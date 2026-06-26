import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!webhookUrl) {
      return NextResponse.json({ success: false, error: "Missing N8N_WEBHOOK_URL in environment" });
    }

    // This is the mock travel data we are sending to n8n
    const mockData = {
      clientName: "Gendell Janssens",
      destination: "Paris, France",
      status: "Verified_Pipeline_Test",
      timestamp: new Date().toISOString()
    };

    // Shoot the data down the ngrok tunnel
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockData),
    });

    return NextResponse.json({ 
      success: true, 
      message: "Data fired down the tunnel successfully!",
      statusReceived: response.status 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}