useEffect(() => {
  const load = async () => {
    try {
      const res = await fetch("/api/request-trends");
      const text = await res.text();

      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(`Non-JSON response from /api/request-trends: ${text.slice(0, 120)}...`);
      }

      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);

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
