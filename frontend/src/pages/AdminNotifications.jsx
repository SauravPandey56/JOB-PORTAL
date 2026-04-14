import { useState } from "react";
import { Send, Users, Briefcase, BellRing, UserCog } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminNotifications() {
  const [target, setTarget] = useState("all");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    // Mock backend delay
    setTimeout(() => {
       setSubject("");
       setMessage("");
       toast.success("Notification dispatched securely to target group.");
       setSending(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl flex items-center">
             System Broadcast
          </h1>
          <p className="mt-1 text-sm text-slate-500">
             Dispatch platform-wide alerts, system updates, and targeted notifications.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto mt-6 max-w-4xl space-y-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        
        <div>
          <label className="mb-4 block text-sm font-bold text-slate-900 uppercase tracking-wide">1. Select Target Audience</label>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { id: "all", label: "Global Scope", icon: Users, desc: "All system users" },
              { id: "candidates", label: "Job Seekers", icon: Briefcase, desc: "Candidate accounts" },
              { id: "recruiters", label: "Recruiters", icon: UserCog, desc: "Verified employers" },
            ].map((option) => {
              const Icon = option.icon;
              const isSelected = target === option.id;
              return (
                <label
                  key={option.id}
                  className={`relative flex cursor-pointer flex-col rounded-xl border p-5 transition-all ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-600"
                      : "border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="target"
                    className="sr-only"
                    checked={isSelected}
                    onChange={() => setTarget(option.id)}
                  />
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${isSelected ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500"}`}>
                       <Icon className="h-5 w-5" />
                    </div>
                    {isSelected && (
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
                      </span>
                    )}
                  </div>
                  <div className="mt-4">
                     <span className={`block font-bold text-sm ${isSelected ? "text-indigo-950" : "text-slate-700"}`}>
                       {option.label}
                     </span>
                     <span className={`mt-1 block text-xs ${isSelected ? "text-indigo-700 font-medium" : "text-slate-500"}`}>
                       {option.desc}
                     </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <div className="my-8 h-px bg-slate-100" />

        <div className="space-y-6">
          <label className="block text-sm font-bold text-slate-900 uppercase tracking-wide">2. Compose Message</label>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Subject Line</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-colors"
              placeholder="e.g. Action Required: System Maintenance Notice"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Message Body</label>
            <textarea
              required
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-colors"
              placeholder="Draft your notification details..."
            />
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-slate-100">
          <button
            type="submit"
            disabled={sending || !subject.trim() || !message.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:hover:bg-indigo-600"
          >
            {sending ? (
               <>
                 <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 Dispatching...
               </>
            ) : (
               <>
                 <Send className="h-4 w-4" /> Dispatch Broadcast
               </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
