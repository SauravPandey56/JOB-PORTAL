import { useState, useRef, useEffect } from "react";
import { Search, Building2, ExternalLink, ShieldAlert, Trash2, MoreVertical, Ban, RefreshCw, Filter } from "lucide-react";

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

function CompanyActionsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useOnClickOutside(ref, () => setOpen(false));

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button 
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-xl border border-slate-100 bg-white py-1 shadow-lg ring-1 ring-black/5">
          <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 text-left">
            <ExternalLink className="h-4 w-4 text-indigo-500" /> View Public Profile
          </button>
          
          <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 text-left">
            <Ban className="h-4 w-4 text-amber-500" /> Suspend Company
          </button>

          <div className="my-1 h-px bg-slate-100" />

          <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 text-left">
            <Trash2 className="h-4 w-4" /> Delete Records
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminCompanies() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const companies = [
    { id: 1, name: "Google", industry: "Technology", jobs: 45, status: "Active", joined: "2024-01-10", website: "https://google.com" },
    { id: 2, name: "Meta", industry: "Technology", jobs: 32, status: "Active", joined: "2024-02-15", website: "https://meta.com" },
    { id: 3, name: "Stripe", industry: "Fintech", jobs: 12, status: "Under Review", joined: "2024-03-20", website: "https://stripe.com" },
    { id: 4, name: "Spotify", industry: "Entertainment", jobs: 28, status: "Active", joined: "2024-04-05", website: "https://spotify.com" },
  ];

  const filtered = companies.filter(c => {
     if(statusFilter !== "All" && c.status !== statusFilter) return false;
     if(searchTerm && !c.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
     return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Companies</h1>
          <p className="mt-1 text-sm text-slate-500">Manage registered employers and verify organization identities.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800">
          <Building2 className="h-4 w-4" /> Add Company
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between rounded-2xl bg-white p-2 shadow-sm border border-slate-100">
        <div className="flex flex-1 items-center gap-2">
           <div className="relative flex-1 max-w-sm ml-2">
             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
             <input
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               placeholder="Search registered companies..."
               className="w-full rounded-xl border-none bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
             />
           </div>
           
           <div className="relative">
             <select
               className="appearance-none rounded-xl border border-slate-200 bg-white pl-4 pr-10 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value)}
             >
               <option value="All">All Statuses</option>
               <option value="Active">Active verified</option>
               <option value="Under Review">Pending Review</option>
             </select>
             <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                <Filter className="h-3 w-3 text-slate-400" />
             </div>
           </div>
        </div>
        
        <button
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" /> Sync Records
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Organization</th>
                <th className="px-6 py-4">Industry Vector</th>
                <th className="px-6 py-4">Active Listings</th>
                <th className="px-6 py-4">Verification Status</th>
                <th className="px-6 py-4">Date Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                 <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                       No companies match the search criteria.
                    </td>
                 </tr>
              ) : (
                 filtered.map((company) => (
                   <tr key={company.id} className="transition hover:bg-slate-50/50">
                     <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-bold text-slate-600">
                           {company.name.substring(0, 2).toUpperCase()}
                         </div>
                         <div>
                           <div className="font-semibold text-slate-900">{company.name}</div>
                           <a href={company.website} target="_blank" rel="noreferrer" className="text-xs text-indigo-500 hover:underline flex items-center mt-0.5">
                             {company.website.replace("https://", "")} <ExternalLink className="ml-1 h-3 w-3" />
                           </a>
                         </div>
                       </div>
                     </td>
                     <td className="px-6 py-4">
                        <span className="font-medium text-slate-700">{company.industry}</span>
                     </td>
                     <td className="px-6 py-4">
                       <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-500/10 tabular-nums">
                          {company.jobs} Posts
                       </span>
                     </td>
                     <td className="px-6 py-4">
                       <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${
                         company.status === "Active" ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20" :
                         "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20"
                       }`}>
                         <span className={`h-1.5 w-1.5 rounded-full ${company.status === "Active" ? "bg-emerald-500" : "bg-amber-500"}`}></span>
                         {company.status}
                       </span>
                     </td>
                     <td className="px-6 py-4 text-slate-500 font-medium">{company.joined}</td>
                     <td className="px-6 py-4 text-right">
                        <CompanyActionsDropdown />
                     </td>
                   </tr>
                 ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
