  import { NextResponse } from 'next/server';
  import { StreamClient } from '@stream-io/node-sdk';

  export async function GET(request: Request) {
    try {
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get('userId');

      if (!userId) {
        return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
      }

      const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
      const apiSecret = process.env.STREAM_SECRET_KEY!;
  console.log(process.env.STREAM_SECRET_KEY,"secret")
      if (!apiKey || !apiSecret) {
        return NextResponse.json(
          { error: 'Missing Stream credentials' },
          { status: 500 }
        );
      }

      const client = new StreamClient(apiKey, apiSecret);

      // ✅ Video-compatible token
      const token = client.generateUserToken({
        user_id: userId,
      });

      return NextResponse.json({ token });
    } catch (err) {
      console.error('Token error:', err);
      return NextResponse.json(
        { error: 'Failed to generate token' },
        { status: 500 }
      );
    }
  }
