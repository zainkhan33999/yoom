import { StreamClient } from '@stream-io/node-sdk';

export const runtime = 'nodejs'; // ⬅️ VERY IMPORTANT

const client = new StreamClient(
  process.env.NEXT_PUBLIC_STREAM_API_KEY!,
  process.env.STREAM_SECRET_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return Response.json({ error: 'Missing userId' }, { status: 400 });
  }

  const token = client.createToken(
    userId,
    Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24h
  );

  return Response.json({ token });
}
