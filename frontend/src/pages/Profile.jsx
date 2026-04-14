import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  Camera, Pencil, Check, X, Building2, MapPin, Phone, Mail, 
  Briefcase, GraduationCap, Link2, Code, FileText, UploadCloud 
} from "lucide-react";
import { useAuth } from "../state/AuthContext";
import { api, apiErrorMessage } from "../utils/api";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, updateUser } = useAuth(); // updateUser is our state updater in AuthContext

  const [activeTab, setActiveTab] = useState("about");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    headline: user?.headline || "",
    location: user?.location || "",
    phone: user?.phone || "",
    companyName: user?.company?.name || "",
    companyWebsite: user?.company?.website || "",
    socialLinks: {
      linkedin: user?.socialLinks?.linkedin || "",
      github: user?.socialLinks?.github || "",
      portfolio: user?.socialLinks?.portfolio || "",
    }
  });

  const [uplFile, setUplFile] = useState(null);
  const [uplPreview, setUplPreview] = useState(null);
  const fileInputRef = useRef(null);

  const calculateProfileStrength = () => {
    let score = 0;
    if (user?.name) score += 20;
    if (user?.headline) score += 20;
    if (user?.avatarUrl) score += 20;
    if (user?.location) score += 10;
    if (user?.resume?.url || user?.company?.name) score += 30; // candidate vs recruiter
    return score;
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value }
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUplFile(file);
      const url = URL.createObjectURL(file);
      setUplPreview(url);
    }
  };

  const handleSaveProfile = async () => {
    try {
      let updatedUser = { ...user };
      
      // Upload photo if exists
      if (uplFile) {
        const d = new FormData();
        d.append("image", uplFile);
        const { data } = await api.post("/users/me/avatar", d);
        updatedUser.avatarUrl = data.imageUrl;
      }

      // Update text details
      const payload = {
        name: formData.name,
        headline: formData.headline,
        location: formData.location,
        phone: formData.phone,
        socialLinks: formData.socialLinks,
      };

      if (user.role === 'recruiter') {
        payload.company = { name: formData.companyName, website: formData.companyWebsite };
      }

      const res = await api.put("/users/me", payload);
      
      toast.success("Profile updated successfully!");
      // Merge updated DB state with any locally known profile URLs if put doesn't return it
      const finalUser = { ...res.data.user, ...updatedUser };
      updateUser(finalUser);
      setIsEditing(false);
      setUplFile(null);
      setUplPreview(null);
      
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  };

  const renderPhotoUrl = () => {
    if (uplPreview) return uplPreview;
    if (user?.avatarUrl) return user.avatarUrl.startsWith('http') ? user.avatarUrl : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${user.avatarUrl}`;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=random&size=128`;
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* PROFILE HEADER / BANNER */}
        <div className="glass-panel overflow-hidden relative">
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-500 relative">
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
          </div>
          <div className="px-6 pb-6 pt-4 relative">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-16 relative">
               
               {/* Avatar */}
               <div className="relative group">
                 <div className="h-24 w-24 rounded-full border-4 border-white dark:border-slate-800 bg-[var(--card-bg)] shadow-xl overflow-hidden shrink-0">
                    <img src={renderPhotoUrl()} alt="Profile" className="w-full h-full object-cover" />
                 </div>
                 {isEditing && (
                    <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm border-4 border-transparent hover:border-primary">
                       <Camera className="w-6 h-6 mb-1"/>
                       <span className="text-[10px] font-bold">Upload</span>
                    </button>
                 )}
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
               </div>

               {/* Info */}
               <div className="flex-1 w-full flex flex-col justify-end">
                  {isEditing ? (
                    <div className="space-y-2 mb-2 w-full max-w-sm">
                       <input autoFocus name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" className="w-full font-bold text-xl px-3 py-1 border border-[var(--border-subtle)] bg-[var(--card-bg)] text-[var(--text-main)] rounded-lg outline-none focus:border-indigo-400" />
                       <input name="headline" value={formData.headline} onChange={handleInputChange} placeholder="Professional Headline (e.g. Frontend Developer)" className="w-full font-medium text-sm text-[var(--text-muted)] bg-[var(--card-bg)] px-3 py-1 border border-[var(--border-subtle)] rounded-lg outline-none focus:border-indigo-400" />
                    </div>
                  ) : (
                    <div className="mb-2">
                       <h1 className="text-2xl font-extrabold text-[var(--text-main)]">{user?.name}</h1>
                       <p className="text-[var(--text-muted)] font-medium text-sm">{user?.headline || "Add a professional headline"}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 mt-2">
                     <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5"/> {user?.email}</span>
                     <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5"/> {user?.location || "Location not set"}</span>
                     <span className="flex items-center gap-1.5 uppercase bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{user?.role}</span>
                  </div>
               </div>

               {/* Actions */}
               <div className="mt-4 sm:mt-0 flex gap-2 w-full sm:w-auto">
                 {isEditing ? (
                   <>
                     <button onClick={() => {setIsEditing(false); setUplPreview(null); setUplFile(null);}} className="flex-1 sm:flex-none px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex justify-center items-center gap-2">
                        <X className="w-4 h-4"/> Cancel
                     </button>
                     <button onClick={handleSaveProfile} className="flex-1 sm:flex-none px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm flex justify-center items-center gap-2">
                        <Check className="w-4 h-4"/> Save
                     </button>
                   </>
                 ) : (
                   <button onClick={() => setIsEditing(true)} className="w-full sm:w-auto px-5 py-2 border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 rounded-xl font-bold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors shadow-sm flex justify-center items-center gap-2">
                      <Pencil className="w-4 h-4"/> Edit Profile
                   </button>
                 )}
               </div>
            </div>
          </div>
        </div>

        {/* PROGRESS / COMPLETION */}
        {!isEditing && (
          <div className="glass-card p-5 flex items-center justify-between gap-6 overflow-hidden relative">
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none"></div>
            <div className="flex-1">
               <h3 className="font-bold text-[var(--text-main)] mb-2 flex items-center gap-2">Profile Strength <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs px-2 py-0.5 rounded-full">{calculateProfileStrength()}%</span></h3>
               <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${calculateProfileStrength()}%` }}></div>
               </div>
            </div>
            {calculateProfileStrength() < 100 && (
              <button onClick={() => setIsEditing(true)} className="shrink-0 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 underline decoration-indigo-200 underline-offset-4">Improve</button>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-[240px_1fr] gap-6">
           {/* Sidebar Tabs */}
           <div className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
              {[
                { id: "about", icon: FileText, label: "Basic Info" },
                { id: "social", icon: Link2, label: "Social Links" },
                ...(user?.role === "candidate" ? [
                  { id: "professional", icon: Briefcase, label: "Professional" },
                  { id: "resume", icon: UploadCloud, label: "Resume" }
                ] : [
                  { id: "company", icon: Building2, label: "Company Profile" }
                ])
              ].map(t => {
                 const Icon = t.icon;
                 const active = activeTab === t.id;
                 return (
                   <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${active ? 'bg-white shadow-sm border-2 border-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-white/50 border-2 border-transparent'}`}>
                     <Icon className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-slate-400'}`}/>
                     {t.label}
                   </button>
                 )
              })}
           </div>

           {/* Content Area */}
           <div className="glass-panel p-6 sm:p-8 min-h-[300px]">
               {activeTab === "about" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h2 className="text-xl font-bold text-[var(--text-main)] border-b border-[var(--border-subtle)] pb-2">Basic Info</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                       <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Phone Number</label>
                          {isEditing ? <input name="phone" value={formData.phone} onChange={handleInputChange} className="input-field"/> : <p className="font-medium text-[var(--text-main)]">{user?.phone || "—"}</p>}
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Location</label>
                          {isEditing ? <input name="location" value={formData.location} onChange={handleInputChange} className="input-field"/> : <p className="font-medium text-[var(--text-main)]">{user?.location || "—"}</p>}
                       </div>
                    </div>
                 </div>
               )}

               {activeTab === "social" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h2 className="text-xl font-bold text-[var(--text-main)] border-b border-[var(--border-subtle)] pb-2">Social Links</h2>
                    <div className="space-y-4 max-w-sm">
                       <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">LinkedIn</label>
                          {isEditing ? <input name="linkedin" value={formData.socialLinks.linkedin} onChange={handleSocialChange} className="input-field"/> : <p className="font-medium text-[var(--text-main)]">{user?.socialLinks?.linkedin || "—"}</p>}
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">GitHub</label>
                          {isEditing ? <input name="github" value={formData.socialLinks.github} onChange={handleSocialChange} className="input-field"/> : <p className="font-medium text-[var(--text-main)]">{user?.socialLinks?.github || "—"}</p>}
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Portfolio</label>
                          {isEditing ? <input name="portfolio" value={formData.socialLinks.portfolio} onChange={handleSocialChange} className="input-field"/> : <p className="font-medium text-[var(--text-main)]">{user?.socialLinks?.portfolio || "—"}</p>}
                       </div>
                    </div>
                 </div>
               )}

               {activeTab === "professional" && (
                 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h2 className="text-xl font-bold text-[var(--text-main)] border-b border-[var(--border-subtle)] pb-2">Professional Info</h2>
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-xl">
                       <p className="text-sm font-medium text-amber-800 dark:text-amber-400">Advanced professional timeline editing (Experience, Education) is coming soon!</p>
                    </div>
                 </div>
               )}

               {activeTab === "resume" && (
                 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h2 className="text-xl font-bold text-[var(--text-main)] border-b border-[var(--border-subtle)] pb-2">Resume Document</h2>
                    {user?.resume?.url ? (
                       <div className="flex items-center gap-4 p-4 border border-indigo-100 dark:border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-xl">
                          <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center shrink-0">
                             <FileText className="h-5 w-5"/>
                          </div>
                          <div className="flex-1">
                             <p className="font-bold text-[var(--text-main)] line-clamp-1">{user?.resume?.originalName || "Resume.pdf"}</p>
                             <p className="text-xs font-medium text-slate-500">Uploaded {new Date(user?.resume?.uploadedAt || new Date()).toLocaleDateString()}</p>
                          </div>
                          <a href={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}${user.resume.url}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition">
                             Download
                          </a>
                       </div>
                    ) : (
                       <p className="text-sm text-slate-500 font-medium">No resume uploaded. Go to your Dashboard to upload.</p>
                    )}
                 </div>
               )}

               {activeTab === "company" && (
                 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h2 className="text-xl font-bold text-[var(--text-main)] border-b border-[var(--border-subtle)] pb-2">Company Information</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                       <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Company Name</label>
                          {isEditing ? <input name="companyName" value={formData.companyName} onChange={handleInputChange} className="input-field"/> : <p className="font-medium text-[var(--text-main)]">{user?.company?.name || "—"}</p>}
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Company Website</label>
                          {isEditing ? <input name="companyWebsite" value={formData.companyWebsite} onChange={handleInputChange} className="input-field"/> : <p className="font-medium text-[var(--text-main)]">{user?.company?.website || "—"}</p>}
                       </div>
                    </div>
                 </div>
               )}
           </div>
        </div>

      </div>
    </div>
  );
}
