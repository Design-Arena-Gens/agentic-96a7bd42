import { NextResponse } from "next/server";
import { runDailyGeneration } from "@/lib/videoPipeline";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      prompt?: string;
    };
    const data = await runDailyGeneration({
      promptOverride: body.prompt
    });
    return NextResponse.json({
      success: true,
      data: { topic: data.topic, youtubeUrl: data.youtubeUrl }
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        error: err.message
      },
      { status: 500 }
    );
  }
}
