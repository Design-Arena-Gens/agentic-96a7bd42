#!/usr/bin/env ts-node
import { runDailyGeneration } from "../lib/videoPipeline";

async function main() {
  const promptOverride = process.argv.slice(2).join(" ") || undefined;
  try {
    const result = await runDailyGeneration({ promptOverride });
    // eslint-disable-next-line no-console
    console.log(
      JSON.stringify(
        {
          topic: result.topic,
          summary: result.summary,
          youtubeUrl: result.youtubeUrl,
          assetDir: result.assetDir
        },
        null,
        2
      )
    );
    process.exit(0);
  } catch (error) {
    const err = error as Error;
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  }
}

void main();
