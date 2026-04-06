import { useEffect, useState } from "react";
import GlassCard from "../components/GlassCard.jsx";
import { api } from "../utils/api.js";

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api
      .get("/admin/analytics")
      .then((res) => alive && setData(res.data))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <GlassCard className="p-6">Loading...</GlassCard>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-4">
      <h2 className="text-2xl font-semibold">Admin analytics</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(data?.totals || {}).map(([k, v]) => (
          <GlassCard key={k} className="p-6">
            <div className="text-xs uppercase tracking-wide text-slate-300">{k}</div>
            <div className="mt-2 text-2xl font-semibold">{v}</div>
          </GlassCard>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <GlassCard className="p-6">
          <h3 className="font-medium">Top companies</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-200">
            {(data?.topCompanies || []).map((c) => (
              <div key={c.company} className="flex items-center justify-between">
                <span>{c.company}</span>
                <span className="text-slate-300">{c.jobs}</span>
              </div>
            ))}
            {!data?.topCompanies?.length ? <div className="text-slate-300">No data.</div> : null}
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <h3 className="font-medium">Most applied jobs</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-200">
            {(data?.mostAppliedJobs || []).map((j) => (
              <div key={j.jobId} className="flex items-center justify-between">
                <span className="truncate pr-3">{j.title}</span>
                <span className="text-slate-300">{j.applications}</span>
              </div>
            ))}
            {!data?.mostAppliedJobs?.length ? <div className="text-slate-300">No data.</div> : null}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

