import { useCallback, useEffect, useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import GlassCard from "../components/GlassCard.jsx";
import { api } from "../utils/api.js";

export default function AdminReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/analytics");
      setData(res.data);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const download = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `talentorbit-admin-report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report downloaded");
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="text-sm text-slate-600">Export platform analytics as structured JSON.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => load()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            type="button"
            disabled={!data}
            onClick={download}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:opacity-40"
          >
            <Download className="h-4 w-4" />
            Export JSON
          </button>
        </div>
      </div>

      {loading ? (
        <GlassCard className="p-8 text-center">Loading…</GlassCard>
      ) : (
        <GlassCard className="p-5">
          <p className="text-sm text-slate-600">
            Snapshot includes totals, weekly series, category breakdown, recruiter activity, top companies, and most
            applied jobs. Open the <strong>Analytics</strong> section for interactive charts.
          </p>
          <pre className="mt-4 max-h-[420px] overflow-auto rounded-xl bg-slate-900 p-4 text-xs text-slate-100">
            {JSON.stringify(data?.totals || {}, null, 2)}
          </pre>
        </GlassCard>
      )}
    </div>
  );
}
