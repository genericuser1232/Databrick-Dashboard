import RequestTrendsChart from "@/components/RequestTrendsChart";

type Metric = {
  title: string;
  value: string;
  change: number;
  subtitle: string;
};

const metrics: Metric[] = [
  { title: "Total Requests", value: "1,284,221", change: 12.4, subtitle: "Last 30 days" },
  { title: "Active Users", value: "18,392", change: 4.1, subtitle: "Last 30 days" },
  { title: "Compute Cost", value: "$24,810", change: -3.2, subtitle: "vs previous month" },
  { title: "Avg Query Time", value: "1.42s", change: -8.7, subtitle: "Performance improved" },
];

const serviceUsage = [
  { service: "Data API", requests: 542200, successRate: "99.92%", p95: "820ms", cost: "$8,240" },
  { service: "Batch Jobs", requests: 18210, successRate: "99.10%", p95: "2.4s", cost: "$5,930" },
  { service: "Feature Store", requests: 294110, successRate: "99.80%", p95: "640ms", cost: "$4,180" },
  { service: "SQL Analytics", requests: 429701, successRate: "99.55%", p95: "1.1s", cost: "$6,460" },
];

function TrendBadge({ change }: { change: number }) {
  const isUp = change >= 0;
  return (
    <span className={`badge ${isUp ? "up" : "down"}`}>
      {isUp ? "↑" : "↓"} {Math.abs(change)}%
    </span>
  );
}

export default function DashboardPage() {
  const totalRequests = serviceUsage
    .reduce((acc, s) => acc + s.requests, 0)
    .toLocaleString();

  return (
    <main className="dashboard">
      <div className="container">
        <header className="header">
          <div>
            <p className="kicker">Service Monitoring</p>
            <h1 className="title">Usage Dashboard</h1>
          </div>
          <div className="summary">
            <p className="summary-label">Total service requests</p>
            <p className="summary-value">{totalRequests}</p>
          </div>
        </header>

        <section className="metrics-grid">
          {metrics.map((m) => (
            <article className="card" key={m.title}>
              <div className="card-top">
                <p className="card-title">{m.title}</p>
                <TrendBadge change={m.change} />
              </div>
              <p className="card-value">{m.value}</p>
              <p className="card-subtitle">{m.subtitle}</p>
            </article>
          ))}
        </section>

        <section className="mid-grid">
          {/* Replaced hardcoded bar chart with live component */}
          <RequestTrendsChart />

          <article className="card">
            <h2 className="section-title">Key Insights</h2>
            <ul className="insights-list" style={{ marginTop: 12 }}>
              <li className="insight-item">SQL Analytics usage increased after 9 AM daily.</li>
              <li className="insight-item">Batch Jobs have highest p95 latency among services.</li>
              <li className="insight-item">Overall cost reduced 3.2% vs last month.</li>
            </ul>
          </article>
        </section>

        <section className="card table-card">
          <div className="section-top">
            <h2 className="section-title">Service Breakdown</h2>
            <button className="btn">Export CSV</button>
          </div>
          <div className="table-wrap">
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
                {serviceUsage.map((row) => (
                  <tr key={row.service}>
                    <td>{row.service}</td>
                    <td>{row.requests.toLocaleString()}</td>
                    <td>{row.successRate}</td>
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