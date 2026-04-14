import { useCallback, useEffect, useState } from "react";
import { Download, RefreshCw, FileJson, FileText, Calendar, Filter } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../utils/api.js";

export default function AdminReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState("all");
  const [dateRange, setDateRange] = useState("30d");
  const [format, setFormat] = useState("json");

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
    if (format === "json") {
       const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
       const url = URL.createObjectURL(blob);
       const a = document.createElement("a");
       a.href = url;
       a.download = `talentorbit-${reportType}-report-${new Date().toISOString().slice(0, 10)}.json`;
       a.click();
       URL.revokeObjectURL(url);
    } else {
       toast.error("CSV format is currently stubbed mock API.");
       return;
    }
    toast.success("Report generation complete.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Platform Reports</h1>
          <p className="mt-1 text-sm text-slate-500">Configure and export raw data artifacts for external analysis.</p>
        </div>
        <button
          type="button"
          onClick={() => load()}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" /> Refresh Base Data
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Report Configuration */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-1 border-t-4 border-t-indigo-500">
           <h2 className="text-lg font-bold text-slate-900 mb-6">Report Parameters</h2>
           
           <div className="space-y-5">
              <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2"><Filter className="h-4 w-4"/> Data Scope</label>
                 <select 
                    value={reportType} 
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                 >
                    <option value="all">Full Platform Dump</option>
                    <option value="users">Candidate Metrics</option>
                    <option value="jobs">Job Posting Statistics</option>
                    <option value="moderation">Moderation Actions</option>
                 </select>
              </div>

              <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2"><Calendar className="h-4 w-4"/> Date Range</label>
                 <select 
                    value={dateRange} 
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                 >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last Quarter</option>
                    <option value="all">All Time</option>
                 </select>
              </div>

              <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2"><FileJson className="h-4 w-4"/> Export Format</label>
                 <div className="flex gap-3">
                    <button 
                       type="button" 
                       onClick={() => setFormat("json")}
                       className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition ${format === "json" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
                    >
                       JSON API
                    </button>
                    <button 
                       type="button" 
                       onClick={() => setFormat("csv")}
                       className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition ${format === "csv" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
                    >
                       CSV File
                    </button>
                 </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                 <button
                    type="button"
                    disabled={loading || !data}
                    onClick={download}
                    className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50"
                 >
                    <Download className="h-4 w-4" /> Generate & Download
                 </button>
              </div>
           </div>
        </div>

        {/* Live Preview */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2 overflow-hidden flex flex-col">
           <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                 <FileText className="h-4 w-4" /> Payload Preview
              </h2>
              <span className="text-xs font-semibold text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                 {loading ? "FETCHING..." : `${reportType.toUpperCase()} DATASET`}
              </span>
           </div>
           <div className="flex-1 bg-slate-900 p-6 overflow-auto max-h-[500px]">
              {loading ? (
                 <div className="flex items-center justify-center h-full text-slate-500">
                    <RefreshCw className="h-6 w-6 animate-spin" />
                 </div>
              ) : (
                 <pre className="text-[13px] text-slate-300 font-mono leading-relaxed">
                   {JSON.stringify(data?.totals || {
                      _meta: { status: "ready", generated: new Date().toISOString(), requested_by: "system_admin" },
                      datasets: "No payload available. Select scope."
                   }, null, 2)}
                 </pre>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
