import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../utils/api.js";
import GlassCard from "../components/GlassCard.jsx";

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

function HeroIllustration({ jobCategories = [], successRate = 8.5 }) {
  const categories = jobCategories.slice(0, 3);
  
  return (
    <div className="relative rounded-[2.5rem] border border-slate-200 bg-white shadow-[0_40px_120px_rgba(15,23,42,0.12)]">
      <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-sky-300/40 blur-3xl" />
      <div className="absolute -right-10 top-16 h-32 w-32 rounded-full bg-fuchsia-300/30 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-white via-slate-50 to-slate-100 p-6">
        <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600 shadow-sm animate-pulse">
              <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
              Trending now
            </div>
            <div className="space-y-3 rounded-[2rem] border border-slate-200 bg-slate-950/95 p-5 text-slate-100 shadow-lg">
              <div className="text-sm uppercase tracking-[0.22em] text-slate-400">Customer Success</div>
              <div className="text-3xl font-semibold">{successRate.toFixed(2)}%</div>
              <div className="text-xs text-slate-400">Monthly hiring growth</div>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.slice(0, 2).map((cat) => (
                <span key={cat._id} className="rounded-full bg-slate-900/95 px-4 py-2 text-xs font-semibold text-white shadow-sm truncate">
                  {cat._id || 'Engineering'}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-28 rounded-[2rem] bg-gradient-to-br from-sky-500 to-violet-500 p-4 text-white shadow-xl">
              <div className="text-xs uppercase tracking-[0.22em]">Top category</div>
              <div className="mt-6 text-lg font-semibold">{categories[0]?._id || 'Engineering'}</div>
            </div>
            <div className="grid gap-3 rounded-[2rem] bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-slate-500">
                <span>Top Categories</span>
                <span>2026</span>
              </div>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <div key={cat._id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                    <span>{cat._id}</span>
                    <span className="text-xs text-slate-400">+{Math.floor(Math.random() * 40 + 5)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [popularJobs, setPopularJobs] = useState(['Designer', 'Web Developer', 'Software Engineer']);
  const [jobStats, setJobStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/jobs?limit=50");
        if (res.data.jobs && Array.isArray(res.data.jobs)) {
          setJobs(res.data.jobs);
          
          const categories = [...new Set(res.data.jobs.map(j => j.category || j.title).filter(Boolean))];
          if (categories.length > 0) {
            setPopularJobs(categories.slice(0, 3));
          }
        }
        setJobStats({
          successRate: 8.5 + Math.random() * 2,
          categories: [...new Set(res.data.jobs?.map(j => ({ _id: j.category || 'Engineering' })) || [])].slice(0, 3)
        });
      } catch (err) {
        console.log("Could not fetch job stats");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="pb-16">
      <section className="relative home-hero overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-500 shadow-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
                Trusted by 1M+ businesses
              </div>

              <div className="space-y-5">
                <h1 className="text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                  Modernizing the_job
                  <br />
                  Search Experience
                </h1>
                <p className="max-w-2xl text-base leading-8 text-slate-600">
                  Connect talent with the right opportunities faster. Search jobs, manage applications, and hire with confidence on a polished job portal built for candidates, recruiters, and admins.
                </p>
              </div>

              <div className="rounded-full border border-slate-200 bg-white p-1 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
                <div className="flex flex-col gap-4 rounded-full bg-white px-4 py-4 sm:flex-row sm:items-center">
                  <input
                    placeholder="Search your needs"
                    className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  />
                  <div className="hidden rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 sm:inline-flex">
                    Web Development
                  </div>
                  <button className="rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 hover:bg-rose-400">
                    Search
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span className="font-semibold text-slate-900">Popular Jobs:</span>
                {popularJobs.map((job) => (
                  <button key={job} className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200">
                    {job}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <HeroIllustration jobCategories={jobStats?.categories || []} successRate={jobStats?.successRate || 8.5} />
            </div>
          </div>

          <div className="mt-10 rounded-[2rem] bg-slate-950/95 px-6 py-5 text-slate-100 shadow-xl ring-1 ring-white/10 sm:flex sm:items-center sm:justify-between">
            <div className="text-sm font-semibold">Trusted By 1M+ Business</div>
            <div className="mt-4 sm:mt-0 overflow-hidden flex-1 ml-4">
              <style>{`
                @keyframes scroll-right {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(calc(-100% / 2)); }
                }
                .companies-scroll {
                  display: flex;
                  gap: 1rem;
                  animation: scroll-right 30s linear infinite;
                  width: max-content;
                }
                .companies-scroll:hover {
                  animation-play-state: paused;
                }
              `}</style>
              <div className="companies-scroll">
                {(['Microsoft', 'Google', 'Amazon', 'Apple', 'IBM', 'Oracle Corporation', 'Intel', 'Cisco Systems', 'Adobe', 'Salesforce', 
                  'Accenture', 'Capgemini', 'Cognizant', 'Tata Consultancy Services', 'Infosys', 'Wipro', 'HCLTech', 'Tech Mahindra', 
                  'DXC Technology', 'NTT Data', 'SAP', 'ServiceNow', 'Workday', 'Snowflake', 'Atlassian', 'VMware', 'Red Hat', 
                  'Palantir Technologies', 'Databricks', 'UiPath', 'NVIDIA', 'AMD', 'Qualcomm', 'Broadcom', 'Micron Technology', 
                  'Texas Instruments', 'Samsung Electronics', 'Sony', 'Lenovo', 'HP Inc.', 'Meta Platforms', 'Uber Technologies', 
                  'Airbnb', 'PayPal', 'Stripe', 'Dropbox', 'Zoom Video Communications', 'Shopify', 'Electronic Arts', 'Intuit'
                ]).map((company) => (
                  <span key={company} className="flex-shrink-0 rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300 whitespace-nowrap">
                    {company}
                  </span>
                ))}
                {(['Microsoft', 'Google', 'Amazon', 'Apple', 'IBM', 'Oracle Corporation', 'Intel', 'Cisco Systems', 'Adobe', 'Salesforce'].map((company) => (
                  <span key={`${company}-2`} className="flex-shrink-0 rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300 whitespace-nowrap">
                    {company}
                  </span>
                )))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-12">
        <div className="rounded-3xl bg-slate-950/60 ring-1 ring-white/10 backdrop-blur-sm p-8 text-center mb-8">
          <h2 className="text-4xl font-semibold tracking-tight text-slate-100">How It Works</h2>
          <p className="mt-4 max-w-2xl text-base text-slate-300 mx-auto">
            Get started in three simple steps. Sign up, find jobs that match your skills, and apply with just one click.
          </p>
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
            <div className="text-xs uppercase tracking-widest text-slate-300">Trusted by teams</div>
            <div className="mt-1 text-lg font-semibold text-slate-100">Hiring across top companies</div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden">
          <style>{`
            @keyframes scroll-right {
              0% { transform: translateX(0); }
              100% { transform: translateX(calc(-100% / 2)); }
            }
            .companies-scroll {
              display: flex;
              gap: 1rem;
              animation: scroll-right 30s linear infinite;
              width: max-content;
            }
            .companies-scroll:hover {
              animation-play-state: paused;
            }
          `}</style>
          <div className="companies-scroll">
            {(['Microsoft', 'Google', 'Amazon', 'Apple', 'IBM', 'Oracle Corporation', 'Intel', 'Cisco Systems', 'Adobe', 'Salesforce', 
              'Accenture', 'Capgemini', 'Cognizant', 'Tata Consultancy Services', 'Infosys', 'Wipro', 'HCLTech', 'Tech Mahindra', 
              'DXC Technology', 'NTT Data', 'SAP', 'ServiceNow', 'Workday', 'Snowflake', 'Atlassian', 'VMware', 'Red Hat', 
              'Palantir Technologies', 'Databricks', 'UiPath', 'NVIDIA', 'AMD', 'Qualcomm', 'Broadcom', 'Micron Technology', 
              'Texas Instruments', 'Samsung Electronics', 'Sony', 'Lenovo', 'HP Inc.', 'Meta Platforms', 'Uber Technologies', 
              'Airbnb', 'PayPal', 'Stripe', 'Dropbox', 'Zoom Video Communications', 'Shopify', 'Electronic Arts', 'Intuit'
            ]).map((company) => (
              <div key={company} className="flex-shrink-0 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-200 shadow-sm whitespace-nowrap">
                {company}
              </div>
            ))}
            {(['Microsoft', 'Google', 'Amazon', 'Apple', 'IBM', 'Oracle Corporation', 'Intel', 'Cisco Systems', 'Adobe', 'Salesforce'].map((company) => (
              <div key={`${company}-2`} className="flex-shrink-0 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-200 shadow-sm whitespace-nowrap">
                {company}
              </div>
            )))}
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <GlassCard className="p-6">
            <div className="text-sm text-slate-200">
              "Simple UI, fast search, and clear status updates. It feels premium."
            </div>
            <div className="mt-3 text-xs text-slate-300">— Candidate</div>
          </GlassCard>
          <GlassCard className="p-6">
            <div className="text-sm text-slate-200">
              "Shortlisting is smooth and resumes are one click. Great for hiring velocity."
            </div>
            <div className="mt-3 text-xs text-slate-300">— Recruiter</div>
          </GlassCard>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-12 pb-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-100 mb-4">Send us Feedback</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Feedback</label>
                <textarea
                  placeholder="Share your thoughts..."
                  rows={4}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200/20 resize-none"
                />
              </div>
              <button className="w-full rounded-xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:bg-sky-400">
                Send Feedback
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-100 mb-6">Get in Touch</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-slate-950/40 p-4">
                  <div className="h-10 w-10 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400 flex-shrink-0">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-slate-400">Email</div>
                    <a href="mailto:pandeysaurav108@gmail.com" className="text-sm font-semibold text-slate-100 hover:text-sky-400 break-all">
                      pandeysaurav108@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-slate-950/40 p-4">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-slate-400">LinkedIn</div>
                    <a href="https://www.linkedin.com/in/sauravpandey56" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-slate-100 hover:text-blue-400">
                      @sauravpandey56
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-slate-950/40 p-4">
                  <div className="h-10 w-10 rounded-lg bg-gray-500/20 flex items-center justify-center text-gray-400 flex-shrink-0">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-slate-400">GitHub</div>
                    <a href="https://github.com/SauravPandey56" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-slate-100 hover:text-gray-400">
                      SauravPandey56
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

