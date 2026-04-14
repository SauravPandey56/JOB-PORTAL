import { useState } from "react";
import { Settings, Shield, Bell, Briefcase, Save, Globe, Lock, Mail, Users } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
       setSaving(false);
       toast.success("Settings saved successfully.");
    }, 800);
  };

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "security", label: "Security & Auth", icon: Shield },
    { id: "jobs", label: "Job Settings", icon: Briefcase },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
           <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Platform Settings</h1>
           <p className="mt-1 text-sm text-slate-500">Configure global platform behavior, security limits, and site appearance.</p>
        </div>
        <button
           disabled={saving}
           onClick={handleSave}
           className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50"
        >
           {saving ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="h-4 w-4" />}
           Save Changes
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
         {/* Settings Sidebar */}
         <div className="w-full lg:w-64 shrink-0 flex flex-col gap-1">
            {tabs.map(t => {
               const Icon = t.icon;
               const isActive = activeTab === t.id;
               return (
                 <button
                   key={t.id}
                   onClick={() => setActiveTab(t.id)}
                   className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                     isActive ? "bg-white text-primary shadow-sm ring-1 ring-slate-200" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                   }`}
                 >
                   <Icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-slate-400"}`} />
                   {t.label}
                 </button>
               );
            })}
         </div>

         {/* Settings Panel */}
         <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm min-h-[500px]">
           {activeTab === "general" && (
             <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                   <h2 className="text-lg font-bold text-slate-900">General Appearance</h2>
                   <p className="text-sm text-slate-500 mt-1">Basic details about your SaaS application.</p>
                </div>
                <div className="grid gap-6 max-w-xl">
                   <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Site Name</label>
                      <input defaultValue="TalentOrbit" className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" />
                   </div>
                   <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Support Email</label>
                      <input defaultValue="support@talentorbit.com" className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" />
                   </div>
                   <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Maintenance Mode</label>
                      <div className="mt-2 flex items-center gap-3">
                         <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                            <span className="inline-block h-4 w-4 translate-x-1 rounded-full bg-white transition-transform" />
                         </button>
                         <span className="text-sm text-slate-600">Disable candidate logins during updates</span>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {activeTab === "security" && (
             <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                   <h2 className="text-lg font-bold text-slate-900">Security & Authentication</h2>
                   <p className="text-sm text-slate-500 mt-1">Manage session controls and administrator roles.</p>
                </div>
                <div className="space-y-6 max-w-xl">
                   <div className="rounded-xl border border-slate-200 p-4">
                      <div className="flex items-center justify-between">
                         <div>
                            <p className="font-semibold text-slate-900">Enforce Two-Factor Authentication</p>
                            <p className="text-sm text-slate-500 mt-0.5">Require 2FA for all administrative accounts.</p>
                         </div>
                         <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-emerald-500 transition-colors">
                            <span className="inline-block h-4 w-4 translate-x-6 rounded-full bg-white transition-transform" />
                         </button>
                      </div>
                   </div>
                   <div className="grid gap-6 sm:grid-cols-2">
                       <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Session Timeout (hours)</label>
                          <input type="number" defaultValue="24" className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" />
                       </div>
                       <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Failed Login Limit</label>
                          <input type="number" defaultValue="5" className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" />
                       </div>
                   </div>
                </div>
             </div>
           )}

           {activeTab === "jobs" && (
             <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                   <h2 className="text-lg font-bold text-slate-900">Platform Limits</h2>
                   <p className="text-sm text-slate-500 mt-1">Set thresholds for recruiters and job listings.</p>
                </div>
                <div className="grid gap-6 max-w-xl">
                   <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Default Job Expiration (Days)</label>
                      <input type="number" defaultValue="30" className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" />
                   </div>
                   <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Max Applications Per Candidate (Daily)</label>
                      <input type="number" defaultValue="15" className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" />
                   </div>
                   <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <h4 className="text-sm font-bold text-amber-800">Note on Limitations</h4>
                      <p className="text-xs text-amber-700 mt-1">Lowering these limits will not retroactively expire existing jobs or applications. Changes apply to future transactions.</p>
                   </div>
                </div>
             </div>
           )}

           {activeTab === "notifications" && (
             <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                   <h2 className="text-lg font-bold text-slate-900">Email Notifications</h2>
                   <p className="text-sm text-slate-500 mt-1">Configure admin alerts and automated dispatches.</p>
                </div>
                <div className="space-y-4 max-w-xl">
                   {[
                     "Alert on new recruiter registration",
                     "Daily summary of flagged jobs",
                     "Alert when platform hits 90% DB capacity",
                     "Forward user feedback to support email"
                   ].map((item, i) => (
                      <label key={i} className="flex items-center gap-3 cursor-pointer">
                         <input type="checkbox" defaultChecked={i !== 2} className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" />
                         <span className="text-sm text-slate-700 font-medium">{item}</span>
                      </label>
                   ))}
                </div>
             </div>
           )}
         </div>
      </div>
    </div>
  );
}
