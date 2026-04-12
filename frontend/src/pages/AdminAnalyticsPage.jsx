import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import GlassCard from "../components/GlassCard.jsx";
import SimpleLineChart from "../components/admin/SimpleLineChart.jsx";
import SimpleBarChart from "../components/admin/SimpleBarChart.jsx";
import SimpleDonutChart from "../components/admin/SimpleDonutChart.jsx";
import { api } from "../utils/api.js";
import { RefreshCw } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/analytics");
      setData(res.data);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-8">
        <GlassCard className="flex items-center gap-2 px-6 py-4 text-slate-600">
          <RefreshCw className="h-5 w-5 animate-spin" />
          Loading…
        </GlassCard>
      </div>
    );
  }

  const jobsLine = (data?.jobsPerWeek || []).map((r) => ({ label: r.label, value: r.count }));
  const regBars = (data?.registrationsPerWeek || []).map((r) => ({ label: r.label, count: r.count }));
  const donut = (data?.applicationsByCategory || []).map((r) => ({
    label: r.category,
    value: r.count,
  }));

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-sm text-slate-600">Visual trends across hiring activity and signups.</p>
        </div>
        <button
          type="button"
          onClick={() => load()}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard className="p-5">
          <SimpleLineChart title="Jobs posted per week" subtitle="Line trend" data={jobsLine} stroke="#6366f1" />
        </GlassCard>
        <GlassCard className="p-5">
          <SimpleBarChart
            title="User registrations"
            subtitle="Bar by week"
            data={regBars}
            accent="bg-violet-500"
          />
        </GlassCard>
      </div>
      <GlassCard className="p-5">
        <SimpleDonutChart title="Applications by category" subtitle="Share of applications" data={donut} />
      </GlassCard>
    </div>
  );
}
