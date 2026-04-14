import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import SimpleLineChart from "../components/admin/SimpleLineChart.jsx";
import SimpleBarChart from "../components/admin/SimpleBarChart.jsx";
import SimpleDonutChart from "../components/admin/SimpleDonutChart.jsx";
import { api } from "../utils/api.js";
import { RefreshCw, TrendingUp, BarChart3, PieChart } from "lucide-react";

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
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-8">
         <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 mb-4" />
         <p className="text-sm font-medium text-slate-500">Compiling analytics engine...</p>
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Platform Analytics</h1>
          <p className="mt-1 text-sm text-slate-500">Visualize engagement trends, user growth, and core platform metrics.</p>
        </div>
        <button
          type="button"
          onClick={() => load()}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" />
          Sync Live Data
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Line Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-500" />
                <h2 className="font-bold text-slate-900">Job Posting Velocity</h2>
             </div>
             <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Weekly Line Trend</span>
          </div>
          <div className="p-6 flex-1 flex items-center justify-center">
             <div className="w-full h-full min-h-[250px]">
                {jobsLine.length === 0 ? (
                   <p className="text-slate-400 text-sm italic text-center py-20">Insufficient data for chart.</p>
                ) : (
                   <SimpleLineChart title="" subtitle="" data={jobsLine} stroke="#6366f1" />
                )}
             </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-violet-500" />
                <h2 className="font-bold text-slate-900">User Registrations</h2>
             </div>
             <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Weekly Bar Trend</span>
          </div>
          <div className="p-6 flex-1 flex items-center justify-center">
             <div className="w-full h-full min-h-[250px]">
                {regBars.length === 0 ? (
                   <p className="text-slate-400 text-sm italic text-center py-20">Insufficient data for chart.</p>
                ) : (
                   <SimpleBarChart title="" subtitle="" data={regBars} accent="bg-violet-500" />
                )}
             </div>
          </div>
        </div>
      </div>

      {/* Donut Chart */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col max-w-4xl mx-auto">
         <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
               <PieChart className="h-5 w-5 text-emerald-500" />
               <h2 className="font-bold text-slate-900">Application Distribution</h2>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Category Share</span>
         </div>
         <div className="p-6 flex items-center justify-center">
            <div className="w-full max-w-lg min-h-[300px]">
               {donut.length === 0 ? (
                   <p className="text-slate-400 text-sm italic text-center py-24">Insufficient data for chart.</p>
               ) : (
                   <SimpleDonutChart title="" subtitle="" data={donut} />
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
