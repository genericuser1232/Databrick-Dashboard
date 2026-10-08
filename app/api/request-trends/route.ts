export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { runQuery } from "@/lib/databricks";

export async function GET() {
  try {
    const rows = await runQuery(`
      SELECT date_format(event_date, 'MM-dd') AS day_label, request_count
      FROM demo_dashboard.request_trends
      ORDER BY event_date ASC
      LIMIT 14
    `);

    return NextResponse.json({ rows },
    {
			headers: {
			"Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
			},
		}  
    );
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed" }, { status: 500 });
  }
}
