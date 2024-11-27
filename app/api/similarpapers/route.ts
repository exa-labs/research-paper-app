// app/api/exasearch/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Exa from "exa-js";

export const maxDuration = 60;

const exa = new Exa(process.env.EXA_API_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query) {
      return NextResponse.json({ error: 'search query is required' }, { status: 400 });
    }

    // Use Exa to search for research papers
    const result = await exa.searchAndContents(
        query,
        {
          type: "auto",
          category: "research paper",
          text: true,
          summary: {
            query: `Give me a one/two lines summary about this research paper in simple english.`
          },
          numResults: 10
        }
    );


    return NextResponse.json({ results: result.results });
  } catch (error) {
    return NextResponse.json({ error: `Failed to perform search | ${error}` }, { status: 500 });
  }
}