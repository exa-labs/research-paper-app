// app/api/answer/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Exa from "exa-js";

export const maxDuration = 100;

const exa = new Exa(process.env.EXA_API_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query) {
      return NextResponse.json({ error: 'search query is required' }, { status: 400 });
    }

    // Use Exa to get a streaming answer
    const stream = await exa.streamAnswer(
        query,
        {
          model: "exa",
          systemPrompt: "Provide a good answer based on research papers and scientific evidence. Use simple words and avoid complex sentences. Don't have very long answer. Use short sentences. If there is a long sentence, break it into multiple short sentences. Say Yes or No at the beginning of your answer."
        }
      );

    // Create a ReadableStream to handle the streaming response
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            // Send each chunk as a JSON string followed by newline
            const chunkData = JSON.stringify(chunk) + '\n';
            controller.enqueue(new TextEncoder().encode(chunkData));
          }
          controller.close();
        } catch (error) {
          console.error('Error in stream:', error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in answer endpoint:', error);
    return NextResponse.json({ error: `Failed to get answer | ${error}` }, { status: 500 });
  }
}