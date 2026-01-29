// app/api/token/route.ts
import { NextResponse } from 'next/server';
import { StreamChat } from 'stream-chat';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    if (!process.env.STREAM_API_KEY || !process.env.STREAM_API_SECRET) {
      return NextResponse.json({ error: 'Missing Stream API credentials' }, { status: 500 });
    }

    const serverClient = new StreamChat(
      process.env.STREAM_API_KEY,
      process.env.STREAM_API_SECRET
    );

    const token = serverClient.createToken(userId);

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error generating Stream token:', error);
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
  }
}
