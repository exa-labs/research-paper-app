// app/api/exasearch/route.ts
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

    // Use Exa to search for research papers
    const result = await exa.streamAnswer(
        "Are vaccines safe for pregnant women? (Get citations only from Research Papers)",
        {
          model: "exa",
          systemPrompt: "The first word should be YES or NO, if it is a question."
        }
      )


     return NextResponse.json({ results: result });
  } catch (error) {
    return NextResponse.json({ error: `Failed to perform search | ${error}` }, { status: 500 });
  }
}