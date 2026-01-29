import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { description, scheduledAt, link, userId } = body;

    // Stream API credentials (server-side only!)
    const STREAM_API_KEY = process.env.STREAM_API_KEY!;
    const STREAM_API_SECRET = process.env.STREAM_API_SECRET!;

    // Create meeting via Stream REST API
    const response = await fetch("https://video.stream-io-api.com/meetings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${STREAM_API_SECRET}`,
      },
      body: JSON.stringify({
        description,
        scheduled_at: scheduledAt,
        link,
        created_by: userId,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ error: text }, { status: 500 });
    }

    const meeting = await response.json();

    return NextResponse.json(meeting);
  } catch (err: any) {
    console.error("Error creating meeting:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
