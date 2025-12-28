import { NextResponse } from "next/server";
import { runDailyGeneration } from "@/lib/videoPipeline";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const prompt = searchParams.get("prompt") ?? undefined;
    const data = await runDailyGeneration({ promptOverride: prompt });
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
