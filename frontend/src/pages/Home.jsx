import { Link } from "react-router-dom";
import GlassCard from "../components/GlassCard.jsx";
import LogoMarquee from "../components/LogoMarquee.jsx";

function HowItWorksCard({ title, subtitle, tone, children }) {
  const tones = {
    violet: "bg-violet-50 border-violet-100",
    amber: "bg-amber-50 border-amber-100",
    rose: "bg-rose-50 border-rose-100",
  };
  return (
    <div className={["rounded-3xl border p-6 shadow-sm", tones[tone] || "bg-slate-50 border-slate-200"].join(" ")}>
      <div className="text-lg font-semibold text-slate-900">{title}</div>
      <div className="mt-1 text-sm text-slate-600">{subtitle}</div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function RightHeroCard() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-10 rounded-[2.75rem] bg-gradient-to-br from-emerald-300/40 via-sky-300/20 to-violet-300/20 blur-2xl" />
      <div className="relative overflow-hidden rounded-[2.75rem] border border-emerald-200/60 bg-emerald-100/70 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.14)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-900">What type of job</div>
            <div className="text-sm font-semibold text-slate-900">you are looking</div>
          </div>
          <div className="h-10 w-10 rounded-2xl bg-white/70 shadow-sm" />
        </div>

        <div className="mt-4 flex gap-2">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm">
            Design
          </span>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm">
            Dev
          </span>
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow-sm">
            Sales
          </span>
        </div>

        <div className="mt-8 flex items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="h-3 w-24 rounded-full bg-white/70" />
            <div className="h-3 w-36 rounded-full bg-white/70" />
            <div className="h-3 w-28 rounded-full bg-white/70" />
          </div>

          {/* Abstract avatar */}
          <div className="relative h-44 w-40">
            <div className="absolute inset-0 rounded-[2.25rem] bg-white/55 blur-[1px]" />
            <div className="absolute left-1/2 top-6 h-20 w-20 -translate-x-1/2 rounded-full bg-slate-900/10" />
            <div className="absolute left-1/2 top-18 h-28 w-28 -translate-x-1/2 rounded-[2.25rem] bg-slate-900/10" />
            <div className="absolute left-1/2 top-7 h-16 w-16 -translate-x-1/2 rounded-full bg-gradient-to-br from-slate-200 to-white" />
            <div className="absolute left-1/2 top-20 h-24 w-24 -translate-x-1/2 rounded-[2rem] bg-gradient-to-b from-white to-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

function LogoStrip() {
  // Text-only “logos” to avoid using trademark image assets.
  const names = ["Wix", "Zillow", "Oracle", "Vodafone", "Lensa", "KIA"];
  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm font-semibold tracking-wide text-slate-400">
      {names.map((n) => (
        <span key={n} className="uppercase">
          {n}
        </span>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="pb-16">
      <section className="relative home-hero">
        <div className="mx-auto max-w-6xl px-4 pt-10 pb-12">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl">
                Connecting Talent <br />
                with Opportunities
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">
                Our platform is designed to connect talented individuals like you with a wide array of job openings
                across various industries and sectors.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  to="/jobs"
                  className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Find Jobs
                </Link>
                <Link
                  to="/register"
                  className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  Sign Up
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <div className="text-xs font-semibold text-slate-900">Join our community</div>
                  <div className="mt-1 text-xs text-slate-500">Get discovered by recruiters</div>
                </div>
                <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 shadow-sm">
                  <div className="text-xs font-semibold text-slate-900">Featured</div>
                  <div className="mt-1 text-xs text-slate-500">TalentOrbit picks</div>
                </div>
              </div>
            </div>

            <div className="lg:justify-self-end">
              <RightHeroCard />
            </div>
          </div>

          <LogoStrip />
        </div>

        <div className="home-wave" />
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-12">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Easy to Use ,Easy to Apply</h2>
          <p className="mt-2 text-sm text-slate-500">How it Works</p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <HowItWorksCard
            title="Sign Up For TalentOrbit"
            subtitle="Lets Get Started"
            tone="violet"
          >
            <div className="rounded-2xl border border-violet-100 bg-white p-4">
              <div className="text-xs font-semibold text-slate-900">Create your account</div>
              <div className="mt-3 h-9 rounded-xl border border-slate-200 bg-slate-50" />
              <div className="mt-2 h-9 rounded-xl border border-slate-200 bg-slate-50" />
              <div className="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white">
                Continue
              </div>
            </div>
          </HowItWorksCard>

          <HowItWorksCard
            title="Find a job to liking"
            subtitle="Lets Get Started"
            tone="amber"
          >
            <div className="rounded-2xl border border-amber-100 bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-900">Search jobs</div>
                <div className="rounded-lg bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-900">
                  filters
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <div className="h-9 flex-1 rounded-xl border border-slate-200 bg-slate-50" />
                <div className="h-9 w-20 rounded-xl bg-sky-600" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-10 rounded-2xl border border-slate-200 bg-white" />
                <div className="h-10 rounded-2xl border border-slate-200 bg-white" />
              </div>
            </div>
          </HowItWorksCard>

          <HowItWorksCard
            title="Apply to job your choice"
            subtitle="Lets Get Started"
            tone="rose"
          >
            <div className="rounded-2xl border border-rose-100 bg-white p-4">
              <div className="text-xs font-semibold text-slate-900">Apply in one click</div>
              <div className="mt-3 grid gap-2">
                <div className="h-10 rounded-2xl border border-slate-200 bg-white" />
                <div className="h-10 rounded-2xl border border-slate-200 bg-white" />
              </div>
              <div className="mt-4 inline-flex rounded-xl bg-sky-600 px-4 py-2 text-xs font-semibold text-white">
                Apply
              </div>
            </div>
          </HowItWorksCard>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-slate-400">Trusted by teams</div>
            <div className="mt-1 text-lg font-semibold text-slate-900">Hiring across top companies</div>
          </div>
        </div>

        <div className="mt-4">
          <LogoMarquee />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <GlassCard className="p-6">
            <div className="text-sm text-slate-200">
              “Simple UI, fast search, and clear status updates. It feels premium.”
            </div>
            <div className="mt-3 text-xs text-slate-300">— Candidate</div>
          </GlassCard>
          <GlassCard className="p-6">
            <div className="text-sm text-slate-200">
              “Shortlisting is smooth and resumes are one click. Great for hiring velocity.”
            </div>
            <div className="mt-3 text-xs text-slate-300">— Recruiter</div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}

