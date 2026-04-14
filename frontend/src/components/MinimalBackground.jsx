import React from 'react';
import { useLocation } from 'react-router-dom';

const MinimalBackground = ({ children }) => {
  const location = useLocation();

  // We enforce this effect globally now, not just on dashboard
  return (
    <div className="relative min-h-screen w-full bg-[var(--app-bg-gradient)] overflow-x-hidden transition-colors duration-300">
      {/* Base Global Animated Gradient */}
      <div className="fixed inset-0 z-0 bg-[var(--app-bg-gradient)] transition-colors duration-300"></div>
      
      {/* Minimalistic SaaS Floating Blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-60 transition-opacity duration-500">
        <div className="absolute top-0 left-[10%] h-[600px] w-[600px] animate-float-slow rounded-full bg-blue-400/10 mix-blend-multiply blur-[120px]"></div>
        <div className="absolute top-[20%] right-[5%] h-[500px] w-[500px] animate-float-medium rounded-full bg-indigo-400/10 mix-blend-multiply blur-[100px]" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-[-10%] left-[30%] h-[700px] w-[700px] animate-float-slow rounded-full bg-purple-400/10 mix-blend-multiply blur-[120px]" style={{ animationDelay: '7s' }}></div>
        <div className="absolute bottom-[20%] right-[30%] h-[400px] w-[400px] animate-float-slow rounded-full bg-slate-400/20 mix-blend-multiply blur-[80px]" style={{ animationDelay: '12s' }}></div>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default MinimalBackground;
