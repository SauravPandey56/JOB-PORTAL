import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import AnimatedLogo from "./AnimatedLogo.jsx";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
         <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6 lg:gap-12">
            
            {/* Brand Section */}
            <div className="col-span-2 lg:col-span-2">
               <Link to="/" className="flex items-center gap-2 mb-4">
                 <div className="text-indigo-600">
                    <AnimatedLogo />
                 </div>
                 <span className="text-xl font-bold tracking-tight text-slate-900">TalentOrbit</span>
               </Link>
               <p className="max-w-sm text-sm text-slate-600 mb-6 leading-relaxed">
                  A modern, production-level platform connecting top talent with the fastest-growing companies across the globe. Built for candidates, engineered for recruiters.
               </p>
               <div className="flex items-center gap-4">
                 <a href="https://linkedin.com" target="_blank" rel="noreferrer" hover-title="LinkedIn" className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                 </a>
                 <a href="https://github.com" target="_blank" rel="noreferrer" hover-title="GitHub" className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-100 transition-all shadow-sm">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                 </a>
                 <a href="https://twitter.com" target="_blank" rel="noreferrer" hover-title="Twitter" className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-sky-500 hover:border-sky-200 hover:bg-sky-50 transition-all shadow-sm">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                 </a>
                 <a href="mailto:contact@talentorbit.com" hover-title="Email" className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm">
                    <Mail className="h-5 w-5" />
                 </a>
               </div>
            </div>

            {/* Product */}
            <div className="col-span-1">
               <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Product</h3>
               <ul className="space-y-3">
                  <li><Link to="/jobs" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Jobs</Link></li>
                  <li><a href="/#companies" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Companies</a></li>
                  <li><a href="/#pricing" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Pricing</a></li>
                  <li><Link to="/register?intent=recruiter" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">For Recruiters</Link></li>
               </ul>
            </div>

            {/* Resources */}
            <div className="col-span-1">
               <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Resources</h3>
               <ul className="space-y-3">
                  <li><a href="/#resources" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Career Advice</a></li>
                  <li><a href="#" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Blog</a></li>
                  <li><a href="#" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Help Center</a></li>
                  <li><a href="#" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Developer API</a></li>
               </ul>
            </div>

            {/* Company */}
            <div className="col-span-1">
               <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Company</h3>
               <ul className="space-y-3">
                  <li><a href="#" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">About TalentOrbit</a></li>
                  <li><a href="/#contact" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Contact Us</a></li>
                  <li><a href="#" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Careers</a></li>
                  <li><a href="#" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Press & Media</a></li>
               </ul>
            </div>

            {/* Legal */}
            <div className="col-span-1">
               <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Legal</h3>
               <ul className="space-y-3">
                  <li><a href="#" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Cookie Settings</a></li>
                  <li><a href="#" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Security</a></li>
               </ul>
            </div>
         </div>

         {/* Bottom Bar */}
         <div className="mt-16 border-t border-slate-200/80 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500 text-center md:text-left">
               © {new Date().getFullYear()} TalentOrbit Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-500">
               <span className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-emerald-500"></div> All systems operational</span>
               <span>Built in React</span>
            </div>
         </div>
      </div>
    </footer>
  );
}
