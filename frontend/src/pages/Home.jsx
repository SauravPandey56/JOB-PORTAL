import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../utils/api.js";
import { useAuth } from "../state/AuthContext.jsx";
import AnimatedCounter from "../components/AnimatedCounter.jsx";
import Footer from "../components/Footer.jsx";
import OrbitLogo from "../components/OrbitLogo.jsx";

const COMPANY_SUGGESTIONS = [
  "Google",
  "Microsoft",
  "Amazon",
  "Adobe",
  "Salesforce",
  "Infosys",
  "TCS",
  "Wipro",
];

const TESTIMONIALS = [
  {
    id: "1",
    rating: 5,
    quote: "Simple UI, fast job search, and easy applications.",
    author: "Candidate",
  },
  {
    id: "2",
    rating: 5,
    quote: "Shortlisting candidates is incredibly fast.",
    author: "Recruiter",
  },
  {
    id: "3",
    rating: 5,
    quote: "Clear status updates on every application. It feels premium.",
    author: "Candidate",
  },
];

function Section({ id, children, className = "" }) {
  return (
    <section id={id} className={["section-y", className].filter(Boolean).join(" ")}>
      {children}
    </section>
  );
}

function formatSalary(job) {
  if (!job?.salaryMax && !job?.salaryMin) return "Competitive";
  const min = Number(job.salaryMin) || 0;
  const max = Number(job.salaryMax) || 0;
  if (min && max) return `₹${(min / 1000).toFixed(0)}k – ₹${(max / 1000).toFixed(0)}k`;
  if (max) return `Up to ₹${(max / 1000).toFixed(0)}k`;
  return "Competitive";
}

function HowItWorksSignup() {
  return (
    <Link
      to="/register"
      className="home-card group block rounded-2xl border border-violet-100 bg-violet-50/80 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-card-hover"
    >
      <h3 className="text-h3 text-dark">Sign up for TalentOrbit</h3>
      <p className="mt-1 text-small text-slate-600">Create your free account</p>
      <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <p className="text-small font-semibold text-dark">Your account</p>
        <div className="mt-4 space-y-3" aria-hidden="true">
          <div className="flex min-h-[2.5rem] items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-small text-slate-400">
            Work email
          </div>
          <div className="flex min-h-[2.5rem] items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-small text-slate-400">
            Secure password
          </div>
        </div>
        <span className="mt-6 flex min-h-[2.75rem] w-full items-center justify-center rounded-xl bg-primary text-small font-semibold text-white transition group-hover:bg-accent">
          Open sign up
        </span>
      </div>
    </Link>
  );
}

function HowItWorksFind({ categories }) {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const merged = useMemo(() => {
    const fromApi = (categories || []).filter(Boolean).slice(0, 12);
    return [...new Set([...COMPANY_SUGGESTIONS, ...fromApi])];
  }, [categories]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return merged.slice(0, 8);
    return merged.filter((x) => x.toLowerCase().includes(s)).slice(0, 10);
  }, [q, merged]);

  useEffect(() => {
    const close = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const pick = (label) => {
    setOpen(false);
    setQ("");
    nav(`/jobs?q=${encodeURIComponent(label)}`);
  };

  return (
    <div
      ref={containerRef}
      className="home-card rounded-2xl border border-amber-100 bg-amber-50/80 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-card-hover"
    >
      <h3 className="text-h3 text-dark">Find work that fits you</h3>
      <p className="mt-1 text-small text-slate-600">Search companies and categories</p>
      <div className="relative mt-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <p className="text-small font-semibold text-dark">Search</p>
        <div className="relative mt-3">
          <input
            type="text"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Try Google, Microsoft, or a role…"
            className="input-field pr-24 text-small"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls="home-search-suggestions"
            role="combobox"
          />
          <button
            type="button"
            className="absolute right-1.5 top-1/2 min-h-[2.25rem] -translate-y-1/2 rounded-lg bg-primary px-3 text-xs font-semibold text-white transition hover:bg-accent"
            onClick={() => (q.trim() ? pick(q.trim()) : setOpen((o) => !o))}
          >
            Go
          </button>
          {open ? (
            <ul
              id="home-search-suggestions"
              className="absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg transition-opacity duration-200"
              role="listbox"
            >
              {filtered.length === 0 ? (
                <li className="px-3 py-2 text-small text-slate-500">No matches — press Go to search anyway</li>
              ) : (
                filtered.map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      className="w-full px-3 py-2.5 text-left text-small text-dark transition hover:bg-slate-50"
                      onClick={() => pick(item)}
                    >
                      {item}
                    </button>
                  </li>
                ))
              )}
            </ul>
          ) : null}
        </div>
        <p className="mt-3 text-small text-slate-500">Click the field for suggestions, or type and press Go.</p>
        <Link
          to="/jobs"
          className="mt-4 inline-flex min-h-[2.75rem] w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-small font-semibold text-dark transition hover:border-primary/30 hover:bg-white"
        >
          Browse all jobs
        </Link>
      </div>
    </div>
  );
}

function HowItWorksApply({ ctaTo, ctaLabel, lines, title, subtitle }) {
  return (
    <Link
      to={ctaTo}
      className="home-card group block rounded-2xl border border-rose-100 bg-rose-50/80 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-card-hover"
    >
      <h3 className="text-h3 text-dark">{title}</h3>
      <p className="mt-1 text-small text-slate-600">{subtitle}</p>
      <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <p className="text-small font-semibold text-dark">Track applications</p>
        <div className="mt-4 space-y-3" aria-hidden="true">
          {lines.map((line) => (
            <div
              key={line}
              className="flex min-h-[2.5rem] items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-small text-slate-400"
            >
              {line}
            </div>
          ))}
        </div>
        <span className="mt-6 flex min-h-[2.75rem] w-full items-center justify-center rounded-xl bg-primary text-small font-semibold text-white transition group-hover:bg-accent">
          {ctaLabel}
        </span>
      </div>
    </Link>
  );
}

export default function Home() {
  const { isAuthed, user } = useAuth();
  const nav = useNavigate();
  const [popularJobs, setPopularJobs] = useState(["Designer", "Web Developer", "Software Engineer"]);
  const [jobStats, setJobStats] = useState(null);
  const [heroQuery, setHeroQuery] = useState("");
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [jobsTotal, setJobsTotal] = useState(0);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/jobs", { params: { limit: 24, page: 1 } });
        const items = res.data.items || [];
        const total = res.data.total ?? items.length;
        setJobsTotal(total);
        setFeaturedJobs(items.slice(0, 4));

        const cats = [...new Set(items.map((j) => j.category).filter(Boolean))];
        setCategories(cats);
        const titles = [...new Set(items.map((j) => j.category || j.title).filter(Boolean))];
        if (titles.length) setPopularJobs(titles.slice(0, 3));

        setJobStats({
          successRate: 8.5 + Math.random() * 2,
          categories: cats.slice(0, 3).map((c) => ({ _id: c })),
        });
      } catch {
        /* landing still works */
      }
    };
    load();
  }, []);

  const submitHeroSearch = (e) => {
    e.preventDefault();
    const q = heroQuery.trim();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    nav(params.toString() ? `/jobs?${params.toString()}` : "/jobs");
  };

  const onFeedbackSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = (fd.get("name") || "").toString().trim();
    const email = (fd.get("email") || "").toString().trim();
    const message = (fd.get("message") || "").toString().trim();
    if (!message) {
      toast.error("Please enter a message.");
      return;
    }
    try {
      await api.post("/feedback", { name, email, message });
      toast.success("Thanks for your feedback—we read every message.");
      form.reset();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not send feedback");
    }
  };

  const stepApply =
    isAuthed && user?.role === "recruiter"
      ? {
          title: "Hire in one place",
          subtitle: "Post roles and review applicants",
          lines: ["Listings go live instantly", "Statuses update from one dashboard"],
          ctaTo: "/recruiter/jobs",
          ctaLabel: "Manage job listings",
        }
      : isAuthed && user?.role === "admin"
        ? {
            title: "Run the platform",
            subtitle: "Analytics and moderation",
            lines: ["Org-wide metrics", "User and job safety tools"],
            ctaTo: "/admin",
            ctaLabel: "Open admin dashboard",
          }
        : {
            title: "Apply in one place",
            subtitle: "Track every application",
            lines: ["Apply from any job page when signed in", "Shortlisted and rejected in one list"],
            ctaTo: "/candidate/applications",
            ctaLabel: "View my applications",
          };

  return (
    <div className="home-landing text-dark">
      <div className="home-landing__glow" aria-hidden>
        <div className="home-blob home-blob--1" />
        <div className="home-blob home-blob--2" />
        <div className="home-blob home-blob--3" />
      </div>

      <section className="section-y relative z-[1] pt-10 md:pt-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <OrbitLogo size={64} className="hero-in hero-in-1 mt-1" />
                <div className="min-w-0 flex-1 space-y-5">
                  <h1 className="hero-in hero-in-2 text-h1 text-dark sm:text-[48px]">
                    The modern way to
                    <br />
                    hire and get hired
                  </h1>
                  <p className="hero-in hero-in-3 max-w-xl text-body text-slate-600">
                    Search curated roles, manage applications in one dashboard, and keep hiring human—with tools built
                    for candidates, recruiters, and teams.
                  </p>
                </div>
              </div>

              <form
                onSubmit={submitHeroSearch}
                className="hero-in hero-in-4 rounded-2xl border border-slate-200/90 bg-white/90 p-2 shadow-card backdrop-blur-sm transition hover:border-primary/15 hover:shadow-card-hover"
                role="search"
                aria-label="Search jobs"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
                  <label htmlFor="hero-job-search" className="sr-only">
                    Keywords, title, or company
                  </label>
                  <input
                    id="hero-job-search"
                    value={heroQuery}
                    onChange={(e) => setHeroQuery(e.target.value)}
                    placeholder="Job title, skill, or company"
                    autoComplete="off"
                    className="input-field min-h-[3rem] flex-1 border-0 bg-transparent shadow-none focus:ring-0"
                  />
                  <button
                    type="submit"
                    className="min-h-[3rem] shrink-0 rounded-xl bg-primary px-8 text-small font-semibold text-white shadow-md transition hover:bg-accent hover:shadow-lg active:scale-[0.98]"
                  >
                    Search jobs
                  </button>
                </div>
              </form>

              <div className="hero-in flex flex-wrap items-center gap-2 text-small text-slate-600 [animation-delay:380ms]">
                <span className="mr-1 font-semibold text-dark">Popular:</span>
                {popularJobs.map((job) => (
                  <Link
                    key={job}
                    to={`/jobs?q=${encodeURIComponent(job)}`}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary hover:shadow-md active:scale-[0.98]"
                  >
                    {job}
                  </Link>
                ))}
              </div>

              <div className="hero-in grid grid-cols-3 gap-6 border-t border-slate-200/80 pt-8 [animation-delay:440ms]">
                <div>
                  <div className="text-h2 text-primary">
                    <AnimatedCounter end={Math.max(jobsTotal, 12)} active suffix="+" />
                  </div>
                  <div className="mt-1 text-small text-slate-600">Active roles</div>
                </div>
                <div>
                  <div className="text-h2 text-primary">
                    <AnimatedCounter end={Math.max(categories.length * 4, 24)} active suffix="+" />
                  </div>
                  <div className="mt-1 text-small text-slate-600">Companies hiring</div>
                </div>
                <div>
                  <div className="text-h2 text-primary">
                    <AnimatedCounter end={98} decimals={0} active suffix="%" />
                  </div>
                  <div className="mt-1 text-small text-slate-600">Satisfaction (demo)</div>
                </div>
              </div>
            </div>

            <HeroMini jobCategories={jobStats?.categories || []} successRate={jobStats?.successRate || 8.5} />
          </div>
        </div>
      </section>

      <Section className="relative z-[1]">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-h2 text-dark">How it works</h2>
            <p className="mt-3 text-body text-slate-600">
              Three guided steps — each card is interactive. Sign up, discover roles with smart suggestions, then track
              applications from your dashboard.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <HowItWorksSignup />
            <HowItWorksFind categories={categories} />
            <HowItWorksApply {...stepApply} />
          </div>
        </div>
      </Section>

      <Section id="categories" className="relative z-[1]">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-h2 text-dark">Job categories</h2>
          <p className="mt-2 max-w-2xl text-body text-slate-600">Explore openings grouped by what teams are hiring for right now.</p>
          <div className="mt-8 flex flex-wrap gap-6">
            {(categories.length ? categories : ["Engineering", "Design", "Product", "Data", "Sales", "Marketing"]).map(
              (cat) => (
                <Link
                  key={cat}
                  to={`/jobs?category=${encodeURIComponent(cat)}`}
                  className="card-surface home-card inline-flex min-w-[140px] flex-1 basis-[calc(50%-12px)] items-center justify-center px-4 py-4 text-center text-h3 text-dark sm:basis-[calc(25%-18px)]"
                >
                  {cat}
                </Link>
              )
            )}
          </div>
        </div>
      </Section>

      <Section id="featured-jobs" className="relative z-[1]">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-h2 text-dark">Featured jobs</h2>
              <p className="mt-2 text-body text-slate-600">Live listings from the TalentOrbit network.</p>
            </div>
            <Link
              to="/jobs"
              className="btn-secondary w-full shrink-0 transition hover:-translate-y-0.5 hover:shadow-md sm:w-auto"
            >
              View all jobs
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredJobs.length === 0
              ? [1, 2, 3, 4].map((i) => (
                  <div key={i} className="card-surface animate-pulse p-6">
                    <div className="h-5 w-[60%] rounded bg-slate-100" />
                    <div className="mt-3 h-4 w-[40%] rounded bg-slate-100" />
                    <div className="mt-6 h-10 rounded-xl bg-slate-100" />
                  </div>
                ))
              : featuredJobs.map((job) => (
                  <article key={job._id} className="card-surface home-card flex flex-col p-6">
                    <h3 className="text-h3 text-dark">{job.title}</h3>
                    <p className="mt-2 text-small text-slate-600">
                      {job.recruiterId?.company?.name || job.recruiterId?.name || "Company"} · {job.location || "Remote"}
                    </p>
                    <p className="mt-3 text-small font-medium text-primary">{formatSalary(job)}</p>
                    <Link
                      to={`/jobs/${job._id}`}
                      className="mt-auto inline-flex min-h-[2.75rem] items-center justify-center rounded-xl bg-primary px-4 text-small font-semibold text-white shadow-sm transition hover:bg-accent hover:shadow-md active:scale-[0.98]"
                    >
                      Apply
                    </Link>
                  </article>
                ))}
          </div>
        </div>
      </Section>

      <Section id="testimonials" className="relative z-[1]">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-h2 text-dark">Testimonials</h2>
          <p className="mt-2 text-body text-slate-600">What people say about hiring on TalentOrbit.</p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.id} className="card-surface home-card p-6">
                <div className="text-amber-400" aria-hidden>
                  {"★".repeat(t.rating)}
                </div>
                <blockquote className="mt-3 text-body text-slate-700">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-4 text-small font-medium text-slate-500">— {t.author}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Section>

      <Section id="contact" className="relative z-[1]">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-10 md:grid-cols-2 md:gap-12">
            <div>
              <h2 className="text-h2 text-dark">Feedback</h2>
              <p className="mt-2 text-body text-slate-600">We read every message.</p>
              <form className="mt-6 space-y-4" onSubmit={onFeedbackSubmit}>
                <div>
                  <label htmlFor="feedback-name" className="mb-1.5 block text-small font-medium text-slate-700">
                    Name
                  </label>
                  <input id="feedback-name" name="name" type="text" className="input-field" placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="feedback-email" className="mb-1.5 block text-small font-medium text-slate-700">
                    Email
                  </label>
                  <input id="feedback-email" name="email" type="email" className="input-field" placeholder="you@example.com" />
                </div>
                <div>
                  <label htmlFor="feedback-body" className="mb-1.5 block text-small font-medium text-slate-700">
                    Message
                  </label>
                  <textarea
                    id="feedback-body"
                    name="message"
                    rows={4}
                    className="input-field resize-none"
                    placeholder="What can we improve?"
                  />
                </div>
                <button type="submit" className="btn-primary max-w-xs transition hover:shadow-lg active:scale-[0.99]">
                  Send feedback
                </button>
              </form>
            </div>
            <div>
              <h2 className="text-h2 text-dark">Contact</h2>
              <p className="mt-2 text-body text-slate-600">Reach the team directly.</p>
              <div className="mt-6 space-y-4">
                <a
                  href="mailto:pandeysaurav108@gmail.com"
                  className="card-surface flex items-center gap-4 p-6 no-underline transition hover:border-primary/25"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-small font-semibold uppercase tracking-wide text-slate-500">Email</div>
                    <div className="text-body font-medium text-dark">pandeysaurav108@gmail.com</div>
                  </div>
                </a>
                <a
                  href="https://www.linkedin.com/in/sauravpandey56"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-surface flex items-center gap-4 p-6 no-underline transition hover:border-primary/25"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-small font-semibold uppercase tracking-wide text-slate-500">LinkedIn</div>
                    <div className="text-body font-medium text-dark">@sauravpandey56</div>
                  </div>
                </a>
                <a
                  href="https://github.com/SauravPandey56"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-surface flex items-center gap-4 p-6 no-underline transition hover:border-primary/25"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-small font-semibold uppercase tracking-wide text-slate-500">GitHub</div>
                    <div className="text-body font-medium text-dark">SauravPandey56</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  );
}

function HeroMini({ jobCategories, successRate }) {
  const categories = jobCategories.slice(0, 3);
  return (
    <div className="home-card hero-in rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-card backdrop-blur-sm [animation-delay:520ms]">
      <div className="flex items-center gap-2 text-small font-semibold uppercase tracking-wide text-slate-500">
        <span className="h-2 w-2 rounded-full bg-primary" />
        Live market snapshot
      </div>
      <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-5">
        <div className="text-small font-medium text-slate-500">Hiring velocity</div>
        <div className="mt-2 text-h2 text-primary">{successRate.toFixed(1)}%</div>
        <div className="text-small text-slate-600">Demo growth index</div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {(categories.length ? categories : [{ _id: "Engineering" }]).map((cat) => (
          <span key={cat._id} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {cat._id}
          </span>
        ))}
      </div>
    </div>
  );
}
