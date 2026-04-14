import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, Briefcase, FileCheck, Building2, Zap, Monitor, PenTool, Layout, Database, TrendingUp, Megaphone, Banknote, Users, Star, ArrowRight, CheckCircle, Smartphone, Globe, Code, FileText, MessageSquare, Compass, DollarSign, Bookmark, ShieldCheck, Cpu } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../utils/api.js";
import { useAuth } from "../state/AuthContext.jsx";
import Footer from "../components/Footer.jsx";
import AnimatedCounter from "../components/AnimatedCounter.jsx";

const CATEGORIES = [
  { name: "Engineering", icon: Monitor, count: "5.2k" },
  { name: "Design", icon: PenTool, count: "2.1k" },
  { name: "Product", icon: Layout, count: "1.8k" },
  { name: "Data", icon: Database, count: "3.4k" },
  { name: "Sales", icon: TrendingUp, count: "4.1k" },
  { name: "Marketing", icon: Megaphone, count: "2.5k" },
  { name: "Finance", icon: Banknote, count: "1.2k" },
  { name: "Human Resources", icon: Users, count: "900" },
];

const FEATURES = [
  { title: "Smart job recommendations", desc: "Our algorithm learns your preferences and highlights exactly what you're looking for.", icon: Cpu },
  { title: "Application tracking", desc: "Never lose track of a role. Monitor your status from Applied to Hired in one place.", icon: FileCheck },
  { title: "Recruiter verification", desc: "Every employer is manually verified to ensure you're applying to legitimate organizations.", icon: ShieldCheck },
  { title: "Instant job alerts", desc: "Get notified the second a company posts a role matching your exact skill profile.", icon: Zap },
];

const RESOURCES = [
  { title: "Resume Building Tips", text: "Create ATS-friendly resumes that get you noticed by top tech companies.", icon: FileText },
  { title: "Interview Preparation", text: "Practice common questions and behavioral technical rounds with confidence.", icon: MessageSquare },
  { title: "Career Path Advice", text: "Navigate the corporate ladder and switch industries without losing momentum.", icon: Compass },
  { title: "Salary Guides 2026", text: "Negotiate better with real-time benchmarking data for your role and region.", icon: DollarSign },
];

// Removed GLOBAL_COMPANIES, LARGE_COMPANY_LIST, TRUSTED_COMPANIES

function formatSalary(job) {
  if (!job?.salaryMax && !job?.salaryMin) return "Competitive Salary";
  const min = Number(job.salaryMin) || 0;
  const max = Number(job.salaryMax) || 0;
  if (min && max) return `₹${(min / 1000).toFixed(0)}k – ₹${(max / 1000).toFixed(0)}k`;
  if (max) return `Up to ₹${(max / 1000).toFixed(0)}k`;
  return "Competitive";
}

export default function Home() {
  const { isAuthed, user } = useAuth();
  const nav = useNavigate();
  
  // Data
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [jobFilter, setJobFilter] = useState("All");
  
  // Form states
  const [heroQuery, setHeroQuery] = useState("");
  const [heroLocation, setHeroLocation] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/jobs", { params: { limit: 12, page: 1 } });
        setFeaturedJobs(res.data.items || []);
      } catch {
        /* silent catch */
      }
    };
    load();
  }, []);

  const submitHeroSearch = (e) => {
    e.preventDefault();
    const q = heroQuery.trim();
    const loc = heroLocation.trim();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (loc) params.set("location", loc);
    nav(params.toString() ? `/jobs?${params.toString()}` : "/jobs");
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await api.post("/feedback", {
        name: fd.get("name"),
        email: fd.get("email"),
        message: fd.get("message")
      });
      toast.success("Message sent successfully. We'll be in touch!");
      e.currentTarget.reset();
    } catch(err) {
      toast.error(err?.response?.data?.message || "Failed to send message");
    }
  };

  const topCompanies = useMemo(() => {
    const out = [];
    const seen = new Set();
    for (const j of featuredJobs) {
      const name = j?.recruiterId?.company?.name || j?.recruiterId?.name;
      if (!name || seen.has(name)) continue;
      seen.add(name);
      out.push({
        id: String(j?.recruiterId?._id || name),
        name,
        logo: j?.recruiterId?.company?.logoUrl || j?.recruiterId?.avatarUrl || j?.recruiterId?.image,
        jobs: Math.floor(Math.random() * 50) + 5
      });
      if (out.length >= 6) break;
    }
    // Fallback if APIs don't have enough data
    const fallbacks = ["Google", "Microsoft", "Stripe", "Spotify", "Amazon", "Netflix"];
    let i = 0;
    while(out.length < 6 && i < fallbacks.length) {
       if(!seen.has(fallbacks[i])) {
          out.push({ id: fallbacks[i], name: fallbacks[i], jobs: 12, logo: null });
       }
       i++;
    }
    return out;
  }, [featuredJobs]);

  const displayedJobs = useMemo(() => {
    let jobs = featuredJobs;
    if(jobFilter === "Remote") jobs = jobs.filter(j => (j.location || "").toLowerCase().includes("remote"));
    if(jobFilter === "Full-time") jobs = jobs.filter(j => (j.jobType || "").toLowerCase().includes("full-time"));
    return jobs.slice(0, 6);
  }, [featuredJobs, jobFilter]);

  return (
    <div className="min-h-screen selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-transparent pt-16 pb-24 lg:pt-28 lg:pb-32 border-b border-slate-200">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-indigo-50 blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-60 h-[600px] w-[600px] rounded-full bg-blue-50 blur-[100px] pointer-events-none"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side */}
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold mb-6 border border-indigo-100">
                <Globe className="h-4 w-4" /> The #1 Platform for Top Talent
              </span>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-[var(--text-main)] tracking-tight leading-[1.1] mb-6">
                Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Dream Job</span> Faster
              </h1>
              <p className="text-lg text-[var(--text-muted)] mb-10 leading-relaxed font-medium">
                Discover jobs from top companies, apply easily, and track your applications in one smart dashboard.
              </p>

              <form onSubmit={submitHeroSearch} className="bg-[var(--card-bg)] p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[var(--border-subtle)] flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 flex items-center">
                   <Search className="absolute left-4 h-5 w-5 text-slate-400" />
                   <input 
                     type="text" 
                     className="w-full bg-transparent pl-12 pr-4 py-3 outline-none text-[var(--text-main)] placeholder:text-slate-400 font-medium" 
                     placeholder="Job title, skill, or keyword"
                     value={heroQuery}
                     onChange={(e) => setHeroQuery(e.target.value)}
                   />
                </div>
                <div className="hidden sm:block w-px bg-slate-200 my-2"></div>
                <div className="relative flex-1 flex items-center">
                   <MapPin className="absolute left-4 h-5 w-5 text-slate-400" />
                   <input 
                     type="text" 
                     className="w-full bg-transparent pl-12 pr-4 py-3 outline-none text-[var(--text-main)] placeholder:text-slate-400 font-medium" 
                     placeholder="City, state, or Remote"
                     value={heroLocation}
                     onChange={(e) => setHeroLocation(e.target.value)}
                   />
                </div>
                <button type="submit" className="bg-indigo-600 text-white rounded-xl px-8 py-3 font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
                   Search
                </button>
              </form>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                 <span className="text-sm font-semibold text-[var(--text-muted)]">Popular Searches:</span>
                 {["Software Engineer", "Frontend Developer", "Data Analyst", "UI Designer"].map(tag => (
                    <button key={tag} onClick={() => nav(`/jobs?q=${encodeURIComponent(tag)}`)} className="px-4 py-1.5 rounded-full bg-[var(--card-bg)] border border-[var(--border-subtle)] text-sm font-medium text-[var(--text-main)] hover:border-indigo-500 hover:text-indigo-600 transition-colors shadow-sm">
                       {tag}
                    </button>
                 ))}
              </div>
            </div>

            {/* Right side - Stats Ticket */}
            <div className="relative lg:ml-auto w-full max-w-sm">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200 to-blue-200 blur-2xl transform scale-[0.8] opacity-50 rounded-full"></div>
                <div className="relative bg-[var(--card-bg)]/80 backdrop-blur-xl border border-[var(--border-subtle)] p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                   <div className="flex items-center gap-4 mb-8">
                       <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                           <TrendingUp className="h-6 w-6 text-white" />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest">Live Platform Data</p>
                          <p className="text-xl font-bold text-[var(--text-main)]">Hiring Statistics</p>
                       </div>
                   </div>
                   
                   <div className="space-y-6">
                      <div className="border-b border-slate-200/60 pb-6">
                          <div className="text-4xl font-extrabold text-[var(--text-main)] flex items-center">
                             <AnimatedCounter end={10} active suffix="," />
                             <AnimatedCounter end={482} active suffix="+" />
                          </div>
                          <p className="text-[var(--text-muted)] font-medium mt-1">Active jobs posted</p>
                      </div>
                      <div className="border-b border-slate-200/60 pb-6">
                          <div className="text-4xl font-extrabold text-[var(--text-main)] flex items-center">
                             <AnimatedCounter end={2} active suffix="," />
                             <AnimatedCounter end={500} active suffix="+" />
                          </div>
                          <p className="text-[var(--text-muted)] font-medium mt-1">Companies hiring actively</p>
                      </div>
                      <div className="pb-2">
                          <div className="text-4xl font-extrabold text-[var(--text-main)] flex items-center">
                             <AnimatedCounter end={50} active suffix="," />
                             <AnimatedCounter end={400} active suffix="+" />
                          </div>
                          <p className="text-[var(--text-muted)] font-medium mt-1">Candidates searching</p>
                      </div>
                   </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST SECTION REMOVED */}

      {/* 3. HOW IT WORKS */}
      <section className="py-24 bg-transparent border-t border-[var(--border-subtle)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
           <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-extrabold text-[var(--text-main)] sm:text-4xl">How TalentOrbit Works</h2>
              <p className="mt-4 text-lg text-[var(--text-muted)]">Three simple steps to connect with your next big opportunity.</p>
           </div>
           <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Create your account", desc: "Sign up as a candidate or recruiter and build a comprehensive profile.", icon: Code },
                { step: "02", title: "Discover jobs", desc: "Search thousands of opportunities globally using our highly tuned matching algorithms.", icon: Smartphone },
                { step: "03", title: "Apply instantly", desc: "Submit your application with one click and track everything neatly in your dashboard.", icon: CheckCircle }
              ].map((card, i) => {
                 const Icon = card.icon;
                 return (
                   <div key={i} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
                      <div className="absolute -right-4 -top-4 text-9xl font-black text-slate-50 group-hover:text-indigo-50/50 transition-colors z-0 select-none">
                         {card.step}
                      </div>
                      <div className="relative z-10">
                         <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
                            <Icon className="h-7 w-7 text-indigo-600 group-hover:text-white transition-colors" />
                         </div>
                         <h3 className="text-xl font-bold text-[var(--text-main)] mb-3">{card.title}</h3>
                         <p className="text-[var(--text-muted)] font-medium leading-relaxed">{card.desc}</p>
                      </div>
                   </div>
                 )
              })}
           </div>
        </div>
      </section>

      {/* 4. POPULAR JOB CATEGORIES */}
      <section className="py-24 bg-transparent border-y border-[var(--border-subtle)]">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
               <div>
                 <h2 className="text-3xl font-extrabold text-[var(--text-main)] sm:text-4xl">Popular Categories</h2>
                 <p className="mt-4 text-lg text-[var(--text-muted)]">Explore openings grouped by what teams are hiring for.</p>
               </div>
               <Link to="/jobs" className="text-indigo-600 font-bold hover:text-indigo-800 flex items-center gap-2 transition-colors">
                  View all categories <ArrowRight className="h-4 w-4" />
               </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {CATEGORIES.map(cat => {
                   const Icon = cat.icon;
                   return (
                     <Link key={cat.name} to={`/jobs?category=${encodeURIComponent(cat.name)}`} className="group flex flex-col p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] hover:border-indigo-500 transition-all shadow-sm hover:shadow-md">
                        <Icon className="h-8 w-8 text-indigo-500 mb-4 group-hover:scale-110 transition-transform origin-left" />
                        <h3 className="text-lg font-bold text-[var(--text-main)] group-hover:text-indigo-900">{cat.name}</h3>
                        <p className="text-sm font-medium text-[var(--text-muted)] mt-1">{cat.count} open positions</p>
                     </Link>
                   )
                })}
            </div>
         </div>
      </section>


      {/* 6. FEATURED JOBS */}
      <section className="py-24 bg-transparent border-t border-[var(--border-subtle)]">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
               <div>
                 <h2 className="text-3xl font-extrabold text-[var(--text-main)] sm:text-4xl">Featured Jobs</h2>
                 <p className="mt-4 text-lg text-[var(--text-muted)]">Hand-picked opportunities directly from the employers.</p>
               </div>
               <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto">
                 {["All", "Remote", "Full-time", "Internship", "Part-time"].map(f => (
                   <button 
                     key={f} 
                     onClick={() => setJobFilter(f)} 
                     className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors border ${jobFilter === f ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-[var(--card-bg)] text-[var(--text-muted)] hover:border-[var(--border-subtle)] border-[var(--border-subtle)]'}`}
                   >
                     {f}
                   </button>
                 ))}
               </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {displayedJobs.length > 0 ? (
                  displayedJobs.map(job => (
                     <div key={job._id} className="border border-[var(--border-subtle)] bg-[var(--card-bg)] rounded-3xl p-6 shadow-sm hover:shadow-xl transition-shadow flex flex-col group">
                        <div className="flex items-start justify-between mb-4">
                           <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-slate-400 overflow-hidden">
                              {job.recruiterId?.company?.logoUrl ? <img src={job.recruiterId.company.logoUrl} alt="" className="w-full h-full object-cover"/> : <Building2 className="h-5 w-5"/>}
                           </div>
                           <button className="text-slate-400 hover:text-indigo-600 transition-colors"><Bookmark className="h-5 w-5" /></button>
                        </div>
                        <div className="mb-4">
                           <h3 className="text-lg font-bold text-[var(--text-main)] group-hover:text-indigo-600 transition-colors line-clamp-1">{job.title}</h3>
                           <p className="text-sm font-medium text-[var(--text-muted)] mt-1">{job.recruiterId?.company?.name || "Verified Company"}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-6">
                           <span className="inline-flex items-center px-2.5 py-1 rounded bg-slate-100 text-xs font-semibold text-[var(--text-muted)]"><MapPin className="h-3 w-3 mr-1"/> {job.location || "Remote"}</span>
                           <span className="inline-flex items-center px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 text-xs font-semibold">{formatSalary(job)}</span>
                           <span className="inline-flex items-center px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-semibold capitalize">{job.jobType || "Full-time"}</span>
                        </div>
                        <Link to={`/jobs/${job._id}`} className="mt-auto block w-full py-2.5 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-center rounded-xl transition-colors">
                           Apply Now
                        </Link>
                     </div>
                  ))
               ) : (
                  <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-3xl text-[var(--text-muted)] font-medium">
                     No jobs matching this filter right now. Check back later!
                  </div>
               )}
            </div>

            <div className="mt-12 text-center">
               <Link to="/jobs" className="inline-flex items-center justify-center bg-[var(--card-bg)] border-2 border-[var(--border-subtle)] hover:border-indigo-500 text-[var(--text-main)] transition text-center font-bold px-8 py-3 rounded-full hover:shadow-sm">
                  Load more jobs
               </Link>
            </div>
         </div>
      </section>

      {/* 7. RECRUITER CTA SECTION */}
      <section className="bg-indigo-600 py-24 relative overflow-hidden">
         <div className="absolute right-0 top-0 h-full w-full opacity-10 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full"><path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" stroke="white" strokeWidth="2"></path></svg>
         </div>
         <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl font-extrabold text-white sm:text-5xl mb-6">Hire the best talent faster.</h2>
            <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto leading-relaxed">
               Post jobs, track candidates seamlessly through customized pipelines, and accelerate your recruitment metrics.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <Link to={isAuthed ? "/recruiter/jobs/new" : "/register?intent=recruiter"} className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  Post a Job for Free
               </Link>
               <Link to={isAuthed ? "/dashboard" : "/login"} className="w-full sm:w-auto px-8 py-4 bg-indigo-700 text-white font-bold rounded-2xl hover:bg-indigo-800 transition-colors border border-indigo-500">
                  Enter Recruiter Dashboard
               </Link>
            </div>
         </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="py-24 bg-transparent border-y border-[var(--border-subtle)]">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
               <h2 className="text-3xl font-extrabold text-[var(--text-main)] sm:text-4xl">Why they love TalentOrbit</h2>
               <p className="mt-4 text-lg text-[var(--text-muted)]">Hear from the candidates and companies actively succeeding on our platform.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
               {[
                 { q: "Simple UI, lightning-fast job search, and easy applications. I got 3 interviews in a week.", n: "Alex Johnson", t: "Candidate", color: "bg-blue-100" },
                 { q: "Shortlisting candidates is incredibly fast. The verified tags give us a massive head start on screening.", n: "Sarah Davis", t: "Recruiter Manager", color: "bg-emerald-100" },
                 { q: "Clear status updates on every application. It feels incredibly premium compared to the bloated legacy boards.", n: "Miguel R.", t: "Software Engineer", color: "bg-amber-100" }
               ].map((t, i) => (
                  <div key={i} className="bg-[var(--card-bg)] p-8 rounded-3xl border border-[var(--border-subtle)] shadow-sm relative">
                     <div className="flex gap-1 mb-6 text-amber-400">
                       <Star className="h-5 w-5 fill-current" />
                       <Star className="h-5 w-5 fill-current" />
                       <Star className="h-5 w-5 fill-current" />
                       <Star className="h-5 w-5 fill-current" />
                       <Star className="h-5 w-5 fill-current" />
                     </div>
                     <p className="text-[var(--text-main)] text-lg leading-relaxed mb-8 font-medium italic">"{t.q}"</p>
                     <div className="flex items-center gap-4 mt-auto">
                        <div className={`h-12 w-12 rounded-full ${t.color} flex items-center justify-center font-bold text-[var(--text-main)]`}>{t.n.substring(0,1)}</div>
                        <div>
                           <p className="font-bold text-[var(--text-main)]">{t.n}</p>
                           <p className="text-sm font-medium text-[var(--text-muted)]">{t.t}</p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 9. PLATFORM FEATURES */}
      <section className="py-24 bg-transparent border-t border-[var(--border-subtle)]">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
               <div>
                  <h2 className="text-3xl font-extrabold text-[var(--text-main)] sm:text-4xl mb-6">Designed to eliminate friction.</h2>
                  <p className="text-lg text-[var(--text-muted)] mb-10 leading-relaxed">
                     We built TalentOrbit because the hiring process was broken. No more ghosting, no more lost emails, and no more fake job listings. Just pure transparency.
                  </p>
                  <div className="space-y-8">
                     {FEATURES.map((f, i) => {
                        const Icon = f.icon;
                        return (
                          <div key={i} className="flex gap-4">
                             <div className="h-12 w-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                                <Icon className="h-6 w-6 text-indigo-600" />
                             </div>
                             <div>
                                <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">{f.title}</h3>
                                <p className="text-[var(--text-muted)] leading-relaxed">{f.desc}</p>
                             </div>
                          </div>
                        )
                     })}
                  </div>
               </div>
               <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-blue-50 rounded-[3rem] transform rotate-3 scale-105 pointer-events-none"></div>
                  <div className="relative bg-slate-900 rounded-[2.5rem] shadow-2xl p-4 sm:p-8 overflow-hidden aspect-[4/3] flex flex-col">
                      {/* Fake Dashboard UI */}
                      <div className="flex items-center gap-2 border-b border-slate-700 pb-4 mb-4">
                         <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-rose-500"/><div className="w-3 h-3 rounded-full bg-amber-500"/><div className="w-3 h-3 rounded-full bg-emerald-500"/></div>
                         <div className="mx-auto bg-slate-800 rounded-md px-24 py-1.5 opacity-50"></div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                         <div className="bg-slate-800 rounded-xl h-24 p-4 border border-slate-700/50"><div className="w-8 h-8 rounded-full bg-indigo-500/20 mb-2"></div><div className="w-16 h-2 bg-slate-700 rounded"></div></div>
                         <div className="bg-slate-800 rounded-xl h-24 p-4 border border-slate-700/50"><div className="w-8 h-8 rounded-full bg-emerald-500/20 mb-2"></div><div className="w-16 h-2 bg-slate-700 rounded"></div></div>
                         <div className="bg-slate-800 rounded-xl h-24 p-4 border border-slate-700/50"><div className="w-8 h-8 rounded-full bg-amber-500/20 mb-2"></div><div className="w-16 h-2 bg-slate-700 rounded"></div></div>
                      </div>
                      <div className="bg-slate-800 flex-1 rounded-xl border border-slate-700/50 p-4 space-y-3">
                          <div className="w-full h-8 bg-slate-700/50 rounded-lg"></div>
                          <div className="w-full h-8 bg-slate-700/50 rounded-lg"></div>
                          <div className="w-full h-8 bg-slate-700/50 rounded-lg"></div>
                          <div className="w-3/4 h-8 bg-slate-700/50 rounded-lg"></div>
                      </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 10. CAREER RESOURCES */}
      <section id="resources" className="py-24 bg-transparent border-t border-[var(--border-subtle)]">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
               <h2 className="text-3xl font-extrabold text-[var(--text-main)] sm:text-4xl">Accelerate Your Career</h2>
               <p className="mt-4 text-lg text-[var(--text-muted)]">Access exclusive guides and tools to ace your job hunt.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {RESOURCES.map((r,i) => {
                   const Icon = r.icon;
                   return (
                     <div key={i} className="bg-[var(--card-bg)] p-6 rounded-3xl border border-[var(--border-subtle)] shadow-sm hover:-translate-y-1 transition-transform group cursor-pointer">
                        <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                           <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="font-bold text-[var(--text-main)] mb-2 uppercase tracking-wide text-sm">{r.title}</h3>
                        <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-6 font-medium">{r.text}</p>
                        <div className="text-indigo-600 font-bold text-sm inline-flex items-center group-hover:text-indigo-800">
                           Read Guide <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                     </div>
                   )
                })}
            </div>
         </div>
      </section>

      {/* 11. CONTACT & FEEDBACK */}
      <section id="contact" className="py-24 bg-transparent border-t border-[var(--border-subtle)]">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl">
               <div className="grid md:grid-cols-2">
                  <div className="p-10 sm:p-16 text-white bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-blend-overlay">
                     <h2 className="text-3xl font-extrabold sm:text-4xl mb-4">We're listening.</h2>
                     <p className="text-lg text-slate-400 mb-10">
                        Have ideas to improve the platform? Found a bug? Just want to say hi? Send us a message directly.
                     </p>
                     
                     <div className="space-y-6">
                        <a href="mailto:pandeysaurav108@gmail.com" className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:shadow-lg hover:scale-[1.03] transition-all duration-300 ease-in-out">
                           <div className="h-12 w-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-300 transition-colors">
                              <MessageSquare className="h-5 w-5" />
                           </div>
                           <div>
                              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-300 transition-colors">Email</p>
                              <p className="font-medium text-white">pandeysaurav108@gmail.com</p>
                           </div>
                        </a>
                        <a href="https://www.linkedin.com/in/sauravpandey56" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:shadow-lg hover:scale-[1.03] transition-all duration-300 ease-in-out">
                           <div className="h-12 w-12 bg-sky-500/10 rounded-xl flex items-center justify-center text-sky-400 group-hover:bg-sky-500/20 group-hover:text-sky-300 transition-colors">
                              <Briefcase className="h-5 w-5" />
                           </div>
                           <div>
                              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-300 transition-colors">LinkedIn</p>
                              <p className="font-medium text-white">sauravpandey56</p>
                           </div>
                        </a>
                        <a href="https://github.com/SauravPandey56" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:shadow-lg hover:scale-[1.03] transition-all duration-300 ease-in-out">
                           <div className="h-12 w-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-colors">
                              <Code className="h-5 w-5" />
                           </div>
                           <div>
                              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-300 transition-colors">GitHub</p>
                              <p className="font-medium text-white">SauravPandey56</p>
                           </div>
                        </a>
                     </div>
                  </div>
                  <div className="p-10 sm:p-16 bg-white shrink-0">
                     <form onSubmit={submitFeedback} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                           <div>
                              <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Name</label>
                              <input required name="name" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"/>
                           </div>
                           <div>
                              <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Email</label>
                              <input required name="email" type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"/>
                           </div>
                        </div>
                        <div>
                           <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Message</label>
                           <textarea required name="message" rows="4" className="w-full resize-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"></textarea>
                        </div>
                        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-md transition-colors">
                           Submit Feedback
                        </button>
                     </form>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 12. FOOTER */}
      <Footer />
    </div>
  );
}
