"use client";

import { useEffect, useState } from "react";

type TrendRow = {
  day_label: string;
  request_count: number;
};

export default function RequestTrendsChart() {
  const [rows, setRows] = useState<TrendRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/request-trends");
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch trends");

        const normalized: TrendRow[] = (data.rows || []).map((r: any) => ({
          day_label: r.day_label,
          request_count: Number(r.request_count),
        }));

        setRows(normalized);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <div className="card">Loading request trends...</div>;
  if (error) return <div className="card">Error: {error}</div>;
  if (!rows.length) return <div className="card">No trend data found.</div>;

  const max = Math.max(...rows.map((r) => r.request_count));

  return (
    <article className="card">
      <div className="section-top">
        <h2 className="section-title">Request Trends</h2>
        <span className="muted">Last {rows.length} days</span>
      </div>

      <div className="chart-area">
        {rows.map((r) => {
          const heightPct = Math.max(8, (r.request_count / max) * 100);
          return (
            <div
              key={r.day_label}
              className="bar"
              style={{ height: `${heightPct}%` }}
              title={`${r.day_label}: ${r.request_count.toLocaleString()}`}
            />
          );
        })}
      </div>

      <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", gap: 8, fontSize: 12, color: "#64748b" }}>
        {rows.map((r) => (
          <span key={r.day_label}>{r.day_label}</span>
        ))}
      </div>
    </article>
  );
}