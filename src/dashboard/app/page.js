'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Users, ShoppingCart, TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/metrics');
      const json = await res.json();
      if (json.success) {
        setMetrics(json.data);
        setIsFallback(Boolean(json.fallback));
      } else {
        setError('Failed to load metrics data.');
      }
    } catch (err) {
      setError('An error occurred while connecting to the API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Databricks Analytics Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time metrics powered by Databricks SQL Warehouse</p>
        </div>
        <button
          onClick={fetchMetrics}
          disabled={loading}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* Fallback Warning Banner (if Databricks credentials aren't set yet) */}
      {isFallback && (
        <div className="mb-6 bg-amber-500/10 border border-amber-500/30 text-amber-300 p-4 rounded-xl flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>
            <strong>Demo Mode:</strong> Displaying simulated mock data because Databricks environment variables are not configured.
          </span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-6 bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-xl flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Total Revenue */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Revenue (30D)</p>
              <h3 className="text-3xl font-extrabold mt-2 text-white">
                {loading && !metrics ? '—' : `$${metrics?.totalRevenue?.toLocaleString() ?? 0}`}
              </h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>+12.4% vs previous month</span>
          </div>
        </div>

        {/* Card 2: Active Users */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Users</p>
              <h3 className="text-3xl font-extrabold mt-2 text-white">
                {loading && !metrics ? '—' : metrics?.activeUsers?.toLocaleString() ?? 0}
              </h3>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-blue-400 font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>+5.1% active engagement</span>
          </div>
        </div>

        {/* Card 3: Avg Order Value */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Avg Order Value</p>
              <h3 className="text-3xl font-extrabold mt-2 text-white">
                {loading && !metrics ? '—' : `$${metrics?.avgOrderValue?.toFixed(2) ?? 0}`}
              </h3>
            </div>
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
              <ShoppingCart className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-purple-400 font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>+2.8% basket size</span>
          </div>
        </div>
      </div>

      {/* Secondary Section / Quick Details */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
        <h2 className="text-lg font-semibold mb-4">Deployment Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
            <span className="text-slate-400 block mb-1">Target Hosting Platform</span>
            <strong className="text-white">Northflank</strong> (Node.js runtime container)
          </div>
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
            <span className="text-slate-400 block mb-1">Data Source</span>
            <strong className="text-white">Databricks SQL Warehouse</strong> via `@databricks/sql`
          </div>
        </div>
      </div>
    </main>
  );
}