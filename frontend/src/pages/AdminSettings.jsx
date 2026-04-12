import { Bell, Mail, Shield } from "lucide-react";
import GlassCard from "../components/GlassCard.jsx";

export default function AdminSettings() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-600">Platform preferences (stubs for future configuration).</p>
      </div>

      <GlassCard className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <Bell className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-slate-900">Notifications</h2>
            <p className="mt-1 text-sm text-slate-600">Email digests for spikes in applications and new feedback.</p>
            <p className="mt-2 text-xs font-medium text-amber-800">Coming soon — no backend wiring yet.</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <Mail className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-slate-900">Support contact</h2>
            <p className="mt-1 text-sm text-slate-600">Shown on invoices and automated emails.</p>
            <p className="mt-2 text-xs font-medium text-amber-800">Configure via environment in a future release.</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <Shield className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-slate-900">Security</h2>
            <p className="mt-1 text-sm text-slate-600">Admin sessions use the same JWT flow as the rest of the app.</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
