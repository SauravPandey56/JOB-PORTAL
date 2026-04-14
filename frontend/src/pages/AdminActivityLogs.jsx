import { Activity, Shield, UserX, Briefcase, Building, LogIn, HardDrive } from "lucide-react";

export default function AdminActivityLogs() {
  const logs = [
    { id: 1, action: "Admin approved recruiter account for 'TechNova'", user: "admin_sarah", time: "10 minutes ago", icon: Building, color: "text-emerald-500", bg: "bg-emerald-100 outline-emerald-50" },
    { id: 2, action: "Removed job post 'Senior React Dev' due to spam flags", user: "system_auto", time: "1 hour ago", icon: Briefcase, color: "text-rose-500", bg: "bg-rose-100 outline-rose-50" },
    { id: 3, action: "Banned candidate user 'spambot99' permanently", user: "admin_sarah", time: "3 hours ago", icon: UserX, color: "text-rose-500", bg: "bg-rose-100 outline-rose-50" },
    { id: 4, action: "System automatic database backup completed", user: "system_cron", time: "12 hours ago", icon: HardDrive, color: "text-blue-500", bg: "bg-blue-100 outline-blue-50" },
    { id: 5, action: "Modified global application rate limits configuration", user: "admin_chief", time: "1 day ago", icon: Shield, color: "text-amber-500", bg: "bg-amber-100 outline-amber-50" },
    { id: 6, action: "SuperAdmin logged into the console from new IP", user: "admin_chief", time: "2 days ago", icon: LogIn, color: "text-indigo-500", bg: "bg-indigo-100 outline-indigo-50" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Audit Logs</h1>
          <p className="mt-1 text-sm text-slate-500">
             Cryptographically verified record of all administrative and system events.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm max-w-4xl">
         <div className="flex items-center gap-2 mb-8 border-b border-slate-100 pb-4">
            <Activity className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Recent Activity Trace</h2>
         </div>

         <div className="relative border-l-2 border-slate-100 ml-4 space-y-10 pb-4">
           {logs.map((log) => {
             const Icon = log.icon;
             return (
               <div key={log.id} className="relative pl-8 sm:pl-12 group transition-all">
                 {/* Timeline dot */}
                 <span className={`absolute left-[-17px] top-1 flex h-8 w-8 items-center justify-center rounded-full outline outline-8 ${log.bg}`}>
                   <Icon className={`h-4 w-4 ${log.color}`} />
                 </span>
                 
                 <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                   <div>
                     <h3 className="font-semibold text-slate-900 text-base leading-snug">
                       {log.action}
                     </h3>
                     <div className="mt-1.5 flex items-center gap-2 text-sm">
                        <span className="font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-xs tracking-wide">
                           {log.user}
                        </span>
                        <span className="text-slate-400 text-xs">System Trace ID: {log.id * 8923481}</span>
                     </div>
                   </div>
                   <div className="mt-1 sm:mt-0 whitespace-nowrap text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                     {log.time}
                   </div>
                 </div>
               </div>
             );
           })}
         </div>
         
         <div className="mt-10 flex border-t border-slate-100 pt-6">
           <button className="w-full rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 border border-slate-200 border-dashed">
             Load Historical Logs
           </button>
         </div>
      </div>
    </div>
  );
}
