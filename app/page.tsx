"use client";

import { useMemo } from "react";

type Metric = {
  title: string;
  value: string;
  change: number;
  subtitle: string;
};

const metrics: Metric[] = [
  {
    title: "Total Requests",
    value: "1,284,221",
    change: 12.4,
    subtitle: "Last 30 days",
  },
  {
    title: "Active Users",
    value: "18,392",
    change: 4.1,
    subtitle: "Last 30 days",
  },
  {
    title: "Compute Cost",
    value: "$24,810",
    change: -3.2,
    subtitle: "vs previous month",
  },
  {
    title: "Avg Query Time",
    value: "1.42s",
    change: -8.7,
    subtitle: "Performance improved",
  },
];

const serviceUsage = [
  { service: "Data API", requests: 542200, successRate: "99.92%", p95: "820ms", cost: "$8,240" },
  { service: "Batch Jobs", requests: 18210, successRate: "99.10%", p95: "2.4s", cost: "$5,930" },
  { service: "Feature Store", requests: 294110, successRate: "99.80%", p95: "640ms", cost: "$4,180" },
  { service: "SQL Analytics", requests: 429701, successRate: "99.55%", p95: "1.1s", cost: "$6,460" },
];

function TrendBadge({ change }: { change: number }) {
  const positive = change >= 0;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
        positive
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
          : "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
      }`}
    >
      {positive ? "↑" : "↓"} {Math.abs(change)}%
    </span>
  );
}

export default function DashboardPage() {
  const totalRequests = useMemo(
    () => serviceUsage.reduce((acc, s) => acc + s.requests, 0).toLocaleString(),
    []
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl p-6 md:p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-slate-500">Service Monitoring</p>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Usage Dashboard</h1>
          </div>
          <div className="rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs text-slate-500">Total service requests</p>
            <p className="text-lg font-semibold">{totalRequests}</p>
          </div>
        </div>

        {/* Metric Cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((m) => (
            <article
              key={m.title}
              className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <p className="text-sm font-medium text-slate-600">{m.title}</p>
                <TrendBadge change={m.change} />
              </div>
              <p className="text-2xl font-bold tracking-tight">{m.value}</p>
              <p className="mt-2 text-xs text-slate-500">{m.subtitle}</p>
            </article>
          ))}
        </section>

        {/* Charts Placeholder + Insights */}
        <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-700">Requests Trend</h2>
              <span className="text-xs text-slate-500">Last 14 days</span>
            </div>

            {/* Lightweight visual placeholder */}
            <div className="h-52 rounded-lg bg-gradient-to-b from-indigo-50 to-white p-4 ring-1 ring-slate-200">
              <div className="flex h-full items-end gap-2">
                {[28, 45, 42, 51, 48, 60, 57, 62, 58, 66, 72, 69, 74, 78].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-indigo-500/80"
                    style={{ height: `${h}%` }}
                    title={`Day ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-4 text-sm font-semibold text-slate-700">Key Insights</h2>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="rounded-lg bg-slate-50 p-3">
                SQL Analytics usage increased after 9 AM daily.
              </li>
              <li className="rounded-lg bg-slate-50 p-3">
                Batch Jobs have highest p95 latency among services.
              </li>
              <li className="rounded-lg bg-slate-50 p-3">
                Overall cost reduced 3.2% vs last month.
              </li>
            </ul>
          </div>
        </section>

        {/* Service Table */}
        <section className="mt-6 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Service Breakdown</h2>
            <button className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-700">
              Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="border-b border-slate-200 px-3 py-2 font-medium">Service</th>
                  <th className="border-b border-slate-200 px-3 py-2 font-medium">Requests</th>
                  <th className="border-b border-slate-200 px-3 py-2 font-medium">Success Rate</th>
                  <th className="border-b border-slate-200 px-3 py-2 font-medium">P95 Latency</th>
                  <th className="border-b border-slate-200 px-3 py-2 font-medium">Cost</th>
                </tr>
              </thead>
              <tbody>
                {serviceUsage.map((row) => (
                  <tr key={row.service} className="hover:bg-slate-50">
                    <td className="border-b border-slate-100 px-3 py-3 font-medium">{row.service}</td>
                    <td className="border-b border-slate-100 px-3 py-3">
                      {row.requests.toLocaleString()}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-3">{row.successRate}</td>
                    <td className="border-b border-slate-100 px-3 py-3">{row.p95}</td>
                    <td className="border-b border-slate-100 px-3 py-3">{row.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}