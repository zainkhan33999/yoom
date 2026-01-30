import { StreamClient } from '@stream-io/node-sdk';

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

  // ⬇️ VERY IMPORTANT
  const token = client.createToken(userId, Math.floor(Date.now() / 1000) + 60 * 60 * 24); 
  // 24 HOURS

  return Response.json({ token });
}
