import RequestTrendsChart from "@/components/RequestTrendsChart";
import ExportCsvButton, { type TableRow } from "@/components/Buttons";

type KPI = {
  label: string;
  value: string;
  delta: number;
  period: string;
};

const kpis: KPI[] = [
  { label: "Total Requests", value: "1,284,221", delta: 12.4, period: "vs previous 30 days" },
  { label: "Unique Users", value: "18,392", delta: 4.1, period: "vs previous 30 days" },
  { label: "Avg Success Rate", value: "99.72%", delta: 0.3, period: "vs previous 30 days" },
  { label: "Total Cost", value: "$24,810", delta: -3.2, period: "vs previous 30 days" },
];

const topServices = [
  { name: "Data API", requests: 542200, cost: "$8,240" },
  { name: "SQL Analytics", requests: 429701, cost: "$6,460" },
  { name: "Feature Store", requests: 294110, cost: "$4,180" },
];

const breakdown = [
  { service: "Data API", requests: 542200, success: "99.92%", p95: "820ms", cost: "$8,240" },
  { service: "Batch Jobs", requests: 18210, success: "99.10%", p95: "2.4s", cost: "$5,930" },
  { service: "Feature Store", requests: 294110, success: "99.80%", p95: "640ms", cost: "$4,180" },
  { service: "SQL Analytics", requests: 429701, success: "99.55%", p95: "1.1s", cost: "$6,460" },
];

function DeltaBadge({ delta }: { delta: number }) {
  const up = delta >= 0;
  return (
    <span className={`badge ${up ? "up" : "down"}`}>
      {up ? "↑" : "↓"} {Math.abs(delta)}%
    </span>
  );
}

export default function DashboardPage() {
  const lastUpdated = "2026-10-07 09:00";
  const selectedPeriod = "Last 30 days";

  return (
    <main className="dashboard">
      <div className="container">
        <header className="header">
          <div>
            <p className="kicker">Service Usage Dashboard</p>
            <h1 className="title">Operational Overview</h1>
            <p className="muted" style={{ marginTop: 6 }}>
              Last updated: {lastUpdated}
            </p>
          </div>
          <div className="summary">
            <p className="summary-label">Reporting Period</p>
            <p className="summary-value">{selectedPeriod}</p>
          </div>
        </header>

        <section className="metrics-grid">
          {kpis.map((kpi) => (
            <article className="card" key={kpi.label}>
              <div className="card-top">
                <p className="card-title">{kpi.label}</p>
                <DeltaBadge delta={kpi.delta} />
              </div>
              <p className="card-value">{kpi.value}</p>
              <p className="card-subtitle">{kpi.period}</p>
            </article>
          ))}
        </section>

        <section className="mid-grid">
          <RequestTrendsChart />

          <article className="card">
            <div className="section-top">
              <h2 className="section-title">Top Services by Requests</h2>
            </div>
            <ul className="insights-list">
              {topServices.map((s) => (
                <li className="insight-item" key={s.name}>
                  <strong>{s.name}</strong>
                  <div className="muted" style={{ marginTop: 4 }}>
                    Requests: {s.requests.toLocaleString()} · Cost: {s.cost}
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="card table-card">
          <div className="section-top">
            <h2 className="section-title">Service Breakdown</h2>
            <ExportCsvButton rows={breakdown} fileName="users.csv" className="btn" />
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Requests</th>
                  <th>Success Rate</th>
                  <th>P95 Latency</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                {breakdown.map((row) => (
                  <tr key={row.service}>
                    <td>{row.service}</td>
                    <td>{row.requests.toLocaleString()}</td>
                    <td>{row.success}</td>
                    <td>{row.p95}</td>
                    <td>{row.cost}</td>
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