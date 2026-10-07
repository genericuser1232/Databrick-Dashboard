export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { runQuery } from "@/lib/databricks";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 });
    }

    const rows = await runQuery(query);
    return NextResponse.json({ rows });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Query failed" },
      { status: 500 }
    );
  }
}
