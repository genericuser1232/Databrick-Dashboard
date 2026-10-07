"use client";

import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("SELECT current_date()");
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    setLoading(true);
    setError("");
    setRows([]);

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed");
      setRows(data.rows || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Next.js + Databricks SQL</h1>

      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        rows={6}
        style={{ width: "100%", marginTop: 12 }}
      />

      <div style={{ marginTop: 12 }}>
        <button onClick={run} disabled={loading}>
          {loading ? "Running..." : "Run Query"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {rows.length > 0 && (
        <pre style={{ marginTop: 20, background: "#f5f5f5", padding: 12, overflowX: "auto" }}>
          {JSON.stringify(rows, null, 2)}
        </pre>
      )}
    </main>
  );
}