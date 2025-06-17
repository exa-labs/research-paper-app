import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic('claude-4-sonnet-20250514'),
    system: "Use simple English. Give short answers.",
    messages,
  });

  return result.toDataStreamResponse();
}