import React, { useState, useEffect } from "react";
import { Shield, Sparkles, MapPin, Phone, Mail, Award, Landmark, ChevronDown, CheckCircle, ArrowRight, BookOpen, Target, UserCheck, FileText, Briefcase } from "lucide-react";
import { CMSData, AppTheme } from "../types";
// @ts-ignore
import logoUrl from "../assets/images/ASIA LINK LOGO PNG.png";
// @ts-ignore
import heroBackground from "../assets/images/himalayas_sunrise_hero_1781589773916.jpg";

function FastTypingDescription({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    setDisplayedText("");
    setComplete(false);

    // Typing interval in ms (shorter interval = faster typing)
    const interval = setInterval(() => {
      index++;
      setDisplayedText(text.substring(0, index));
      if (index >= text.length) {
        clearInterval(interval);
        setComplete(true);
      }
    }, 12); // extremely fast typing speed: ~12ms per character

    return () => clearInterval(interval);
  }, [text]);

  return (
    <span>
      {displayedText}
      <span 
        className={`inline-block w-[3px] h-[1.1em] ml-1 bg-[#5ce1e6] align-baseline transition-opacity duration-300 ${
          complete ? "opacity-0 invisible" : "animate-pulse"
        }`}
      />
    </span>
  );
}

interface HeroSectionProps {
  cmsData: CMSData;
  theme: AppTheme;
  onScrollToCategories: () => void;
  onScrollToVacancies: () => void;
  onNavigateToPage: (page: string) => void;
}

export default function HeroSection({
  cmsData,
  theme,
  onScrollToCategories,
  onScrollToVacancies,
  onNavigateToPage
}: HeroSectionProps) {
  const activeVacancyCount = cmsData.vacancies.filter((v) => v.active).length;
  const isDark = theme.id === "dark";

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden pt-[88px]">
      
      {/* Cinematic wide-angle background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={cmsData.companyMeta.heroBgUrl || heroBackground}
          alt="Majestic Sunrise on Himalayas - Asia Link Services"
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover scale-102 transition-transform duration-[10s] hover:scale-105 ${
            isDark ? "brightness-[0.68] contrast-[1.05]" : "brightness-[1.0] opacity-85"
          }`}
        />
        {/* Deep visual gradient vignette */}
        <div className={`absolute inset-0 pointer-events-none ${
          isDark 
            ? "bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/20 to-black/20"
            : "bg-gradient-to-t from-white/50 via-white/20 to-white/5"
        }`}></div>
      </div>

      {/* Primary Content Floating Box */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto w-full pt-10 md:pt-16 lg:pt-24 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-11 xl:gap-16 items-center w-full">
          
          {/* LEFT SIDE: Identity & Typing description (8 Columns) */}
          <div className={`col-span-1 lg:col-span-8 flex flex-col gap-4 sm:gap-5 items-center lg:items-start w-full p-5 sm:p-7 rounded-3xl lg:p-0 transition-all ${
            isDark 
              ? "bg-slate-950/15 border border-white/10 shadow-2xl backdrop-blur-[3px] lg:bg-transparent lg:border-0 lg:backdrop-blur-none lg:shadow-none" 
              : "bg-white/12 border border-white/25 shadow-xl backdrop-blur-[3px] lg:bg-transparent lg:border-0 lg:backdrop-blur-none lg:shadow-none"
          }`}>
            
            {/* Logo */}
            <div className="flex justify-center lg:justify-start w-full">
              <img 
                src={logoUrl}
                alt="Asia Link Services (Pvt.) Ltd."
                className="h-28 sm:h-36 md:h-44 lg:h-44 xl:h-[220px] w-auto max-w-full object-contain select-none filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-transform duration-500 hover:scale-[1.02] mt-0"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* License Badge */}
            <div className="flex justify-center lg:justify-start w-full">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-colors shadow-lg active:scale-98 ${
                isDark 
                  ? "bg-black/50 hover:bg-black/70 border-white/10 text-white" 
                  : "bg-white/90 hover:bg-white border-slate-200 text-slate-800"
              }`}>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[9px] sm:text-[10px] md:text-xs font-mono tracking-widest font-bold uppercase">
                  Govt. Lic. {cmsData.companyMeta.govLicenseNo} • JITCO {cmsData.companyMeta.jitcoNo}
                </span>
              </div>
            </div>

            {/* Description */}
            <h2 id="hero-description-text" className={`text-[13px] sm:text-[15px] lg:text-[17px] max-w-xl lg:max-w-[85%] font-sans tracking-wide leading-relaxed font-bold opacity-95 min-h-[44px] text-center lg:text-left ${
              isDark ? "text-slate-200" : "text-[#001f3f]"
            }`}>
              <FastTypingDescription text="Nepal's Top 10 Recruitment Agency. Bridging premier global enterprises with certified Nepalese professionals through ethical sourcing and strict regulatory compliance." />
            </h2>
            
            {/* MOBILE & TABLET UNIQUE EXPERIENCE (Creative Bento Panel) */}
            <div className="flex flex-col gap-3 w-full lg:hidden pt-3">
              
              {/* Trust Indicators: Side-by-Side */}
              <div className="grid grid-cols-2 gap-3 w-full">
                {/* 1. Top Manpower */}
                <div className={`border p-3.5 rounded-2xl select-none flex flex-col items-center justify-center text-center w-full min-h-[84px] transition-all duration-300 shadow-xs ${
                  isDark 
                    ? "bg-amber-500/[0.06] border-amber-500/30 text-white" 
                    : "bg-amber-500/[0.04] border-amber-500/20 shadow-xs text-slate-800"
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 mb-1.5 ${
                    isDark ? "bg-amber-500/20 border-amber-500/35 text-amber-300" : "bg-white border-amber-200 text-amber-600 shadow-2xs"
                  }`}>
                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="7" />
                      <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
                    </svg>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-amber-500 font-extrabold font-mono leading-none">Top Manpower</span>
                  <span className={`text-[13px] font-black tracking-tight leading-none ${isDark ? 'text-white' : 'text-slate-900'} mt-1`}>
                    Rating #10
                  </span>
                </div>

                {/* 2. ISO Certified */}
                <div className={`border p-3.5 rounded-2xl select-none flex flex-col items-center justify-center text-center w-full min-h-[84px] transition-all duration-300 shadow-xs ${
                  isDark 
                    ? "bg-emerald-500/[0.06] border-emerald-500/30 text-white" 
                    : "bg-emerald-500/[0.04] border-emerald-500/20 shadow-xs text-slate-800"
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 mb-1.5 ${
                    isDark ? "bg-emerald-500/20 border-emerald-500/35 text-emerald-300" : "bg-white border-emerald-200 text-emerald-600 shadow-2xs"
                  }`}>
                    <svg className="w-5.5 h-5.5 text-emerald-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.2" strokeDasharray="1.5 1.5" />
                      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1" />
                      <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle" fontSize="5.5" fontWeight="900" fontFamily="sans-serif" fill="currentColor">ISO</text>
                    </svg>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-emerald-550 font-extrabold font-mono leading-none">ISO</span>
                  <span className={`text-[12px] font-black tracking-tight leading-none ${isDark ? 'text-white' : 'text-slate-900'} mt-1`}>
                    9001:2008 Certified
                  </span>
                </div>
              </div>

              {/* Action Buttons: 3 Column Dock */}
              <div className="grid grid-cols-3 gap-2.5 w-full pt-1">
                {/* Email Us */}
                <a
                  id="hero-contact-email-link-mobile"
                  href={`mailto:${cmsData.contactInfo.email}`}
                  title={`Email Us: ${cmsData.contactInfo.email}`}
                  className={`rounded-2xl border p-2 flex flex-col items-center justify-center text-center transition-all duration-300 active:scale-95 group w-full min-h-[76px] ${
                    isDark
                      ? "bg-sky-950/40 border-sky-500/40 text-sky-300 hover:bg-sky-950/70 shadow-[0_0_15px_rgba(14,165,233,0.15)]"
                      : "bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100 shadow-[0_2px_8px_rgba(14,165,233,0.1)] font-extrabold"
                  }`}
                >
                  <Mail className="w-6 h-6 mb-1 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span className="text-[10.5px] font-sans tracking-wide font-black uppercase text-center w-full block">Email Us</span>
                </a>

                {/* Call Us */}
                <a
                  id="hero-contact-call-link-mobile"
                  href={`tel:${cmsData.contactInfo.phone}`}
                  title={`Call Us: ${cmsData.contactInfo.phone}`}
                  className={`rounded-2xl border p-2 flex flex-col items-center justify-center text-center transition-all duration-300 active:scale-95 group w-full min-h-[76px] ${
                    isDark
                      ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/70 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                      : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 shadow-[0_2px_8px_rgba(16,185,129,0.1)] font-extrabold"
                  }`}
                >
                  <Phone className="w-6 h-6 mb-1 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-[10.5px] font-sans tracking-wide font-black uppercase text-center w-full block">Call Us</span>
                </a>

                {/* Office Location */}
                <a
                  id="hero-contact-map-link-mobile"
                  href={cmsData.contactInfo.googleMapLink || "https://maps.app.goo.gl/QDaaqr6mcDDeKW7W6"}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Our Location: ${cmsData.contactInfo.address}`}
                  className={`rounded-2xl border p-2 flex flex-col items-center justify-center text-center transition-all duration-300 active:scale-95 group w-full min-h-[76px] ${
                    isDark
                      ? "bg-red-950/40 border-red-500/40 text-red-300 hover:bg-red-950/70 shadow-[0_0_15px_rgba(239,68,68,0.15)]"
                      : "bg-red-50 border-red-200 text-red-600 hover:bg-red-100 shadow-[0_2px_8px_rgba(239,68,68,0.1)] font-extrabold"
                  }`}
                >
                  <MapPin className="w-6 h-6 mb-1 text-red-600 dark:text-red-400 shrink-0" />
                  <span className="text-[10.5px] font-sans tracking-wide font-black uppercase text-center w-full block leading-tight">Office Location</span>
                </a>
              </div>

            </div>

            {/* DESKTOP EXPERIENCE (5-Column Horizontal Bento) */}
            <div className="hidden lg:grid grid-cols-5 gap-1.5 pt-5 w-full max-w-2xl lg:max-w-[680px] mx-auto lg:mx-0">
              {/* 1. Top Manpower */}
              <div className={`border px-3.5 py-3 rounded-xl select-none flex flex-col items-center justify-center text-center w-full min-h-[80px] lg:min-h-[92px] transition-all duration-300 ${
                isDark 
                  ? "bg-black/55 border-white/10 text-white" 
                  : "bg-white/95 border-slate-200 shadow-sm text-slate-800"
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 mb-1.5 ${
                  isDark ? "bg-amber-500/10 border-amber-500/30 text-[#ffc150]" : "bg-amber-55 border-amber-200 text-amber-600"
                }`}>
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="7" />
                    <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
                  </svg>
                </div>
                <span className="text-[9.5px] xs:text-[10.5px] sm:text-[11px] uppercase tracking-widest text-[#ffc150] font-black font-mono leading-none">Top Manpower</span>
                <span className={`text-[13px] xs:text-[14px] sm:text-[14.5px] font-black tracking-tight leading-none ${isDark ? 'text-white' : 'text-slate-900'} mt-1`}>
                  Rating #10
                </span>
              </div>

              {/* 2. ISO Certified */}
              <div className={`border px-3.5 py-3 rounded-xl select-none flex flex-col items-center justify-center text-center w-full min-h-[80px] lg:min-h-[92px] transition-all duration-300 ${
                isDark 
                  ? "bg-black/55 border-white/10 text-white" 
                  : "bg-white/95 border-slate-200 shadow-sm text-slate-800"
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 mb-1.5 ${
                  isDark ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-emerald-55 border-emerald-200 text-emerald-600"
                }`}>
                  <svg className="w-5.5 h-5.5 text-emerald-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.2" strokeDasharray="1.5 1.5" />
                    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1" />
                    <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle" fontSize="5.5" fontWeight="900" fontFamily="sans-serif" fill="currentColor">ISO</text>
                  </svg>
                </div>
                <span className="text-[9.5px] xs:text-[10.5px] sm:text-[11px] uppercase tracking-widest text-emerald-500 font-black font-mono leading-none">ISO</span>
                <span className={`text-[12px] xs:text-[13px] sm:text-[13.5px] font-black tracking-tight leading-none ${isDark ? 'text-white' : 'text-slate-900'} mt-1`}>
                  9001:2008 Certified
                </span>
              </div>

              {/* 3. Elegant Icon-Only Email Button */}
              <a
                id="hero-contact-email-link"
                href={`mailto:${cmsData.contactInfo.email}`}
                title={`Email Us: ${cmsData.contactInfo.email}`}
                className={`rounded-xl border flex flex-col items-center justify-center text-center transition-all duration-305 hover:scale-[1.03] group w-full min-h-[80px] lg:min-h-[92px] ${
                  isDark
                    ? "bg-sky-950/40 border-sky-500/40 text-sky-300 hover:bg-sky-950/70 hover:shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                    : "bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100 hover:shadow-[0_0_12px_rgba(14,165,233,0.2)]"
                }`}
              >
                <Mail className="w-7.5 h-7.5 transition-transform group-hover:scale-110 mb-1.5 text-sky-600 dark:text-sky-450 shrink-0" />
                <span className="text-[10px] xs:text-[11.5px] sm:text-[12px] font-mono tracking-wider font-extrabold uppercase opacity-85 text-center w-full block">Email Us</span>
              </a>

              {/* 4. Elegant Icon-Only Call Button */}
              <a
                id="hero-contact-call-link"
                href={`tel:${cmsData.contactInfo.phone}`}
                title={`Call Us: ${cmsData.contactInfo.phone}`}
                className={`rounded-xl border flex flex-col items-center justify-center text-center transition-all duration-305 hover:scale-[1.03] group w-full min-h-[80px] lg:min-h-[92px] ${
                  isDark
                    ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/70 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                }`}
              >
                <Phone className="w-7.5 h-7.5 transition-transform group-hover:scale-110 mb-1.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-[10px] xs:text-[11.5px] sm:text-[12px] font-mono tracking-wider font-extrabold uppercase opacity-85 text-center w-full block">Call Us</span>
              </a>

              {/* 5. Elegant Icon-Only Office Map Button */}
              <a
                id="hero-contact-map-link"
                href={cmsData.contactInfo.googleMapLink || "https://maps.app.goo.gl/QDaaqr6mcDDeKW7W6"}
                target="_blank"
                rel="noopener noreferrer"
                title={`Our Location: ${cmsData.contactInfo.address}`}
                className={`rounded-xl border flex flex-col items-center justify-center text-center transition-all duration-305 hover:scale-[1.03] group w-full min-h-[80px] lg:min-h-[92px] ${
                  isDark
                    ? "bg-red-950/40 border-red-500/40 text-red-300 hover:bg-red-950/70 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                    : "bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:shadow-[0_0_12px_rgba(239,68,68,0.2)]"
                }`}
              >
                <MapPin className="w-7.5 h-7.5 transition-transform group-hover:scale-110 mb-1.5 text-red-600 dark:text-red-400 shrink-0" />
                <span className="text-[10px] xs:text-[11.5px] sm:text-[12px] font-mono tracking-wider font-extrabold uppercase opacity-85 text-center w-full block">Office Location</span>
              </a>
            </div>

          </div>

          {/* RIGHT SIDE: Corporate Profile Subsections Navigation (4 Columns) - Hidden on tablet/mobile, shown only on desktop */}
          <div className="hidden lg:flex col-span-1 lg:col-span-4 flex-col gap-3.5 font-sans select-none w-full lg:max-w-[290px] mt-4 lg:mt-0 ml-auto">
            
            {/* Hub Cards Deck - 1-col list on desktop */}
            <div className="grid grid-cols-1 gap-3.5 w-full">
              
               {/* CARD 1: INTRODUCTION */}
              <button
                onClick={() => onNavigateToPage("about")}
                className={`w-full text-left py-3 px-4 rounded-xl border transition-all duration-250 group flex items-center justify-between cursor-pointer active:scale-[0.99] ${
                  isDark 
                    ? "bg-black/50 hover:bg-cyan-950/25 border-white/5 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)]" 
                    : "bg-white/95 border-slate-200 hover:border-cyan-500/50 hover:bg-cyan-50/30 shadow-sm hover:shadow-[0_0_12px_rgba(6,182,212,0.18)]"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="p-2 rounded-lg bg-cyan-500/15 text-cyan-500 group-hover:scale-105 transition-transform flex items-center justify-center">
                    <BookOpen className="w-4.5 h-4.5 shrink-0" />
                  </span>
                  <span className={`text-xs md:text-sm font-extrabold group-hover:text-cyan-600 transition-colors truncate ${
                    isDark ? "text-white" : "text-slate-800"
                  }`}>
                    Introduction
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-500 group-hover:translate-x-1 shrink-0 transition-all ml-2" />
              </button>

              {/* CARD 2: MISSION & VISION */}
              <button
                onClick={() => onNavigateToPage("mission")}
                className={`w-full text-left py-3 px-4 rounded-xl border transition-all duration-250 group flex items-center justify-between cursor-pointer active:scale-[0.99] ${
                  isDark 
                    ? "bg-black/50 hover:bg-red-950/25 border-white/5 hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.25)]" 
                    : "bg-white/95 border-slate-205 hover:border-red-500/50 hover:bg-red-50/30 shadow-sm hover:shadow-[0_0_12px_rgba(239,68,68,0.18)]"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="p-2 rounded-lg bg-red-500/15 text-red-555 group-hover:scale-105 transition-transform flex items-center justify-center">
                    <Target className="w-4.5 h-4.5 shrink-0" />
                  </span>
                  <span className={`text-xs md:text-sm font-extrabold group-hover:text-red-650 transition-colors truncate ${
                    isDark ? "text-white" : "text-slate-800"
                  }`}>
                    Mission & Vision
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-500 group-hover:translate-x-1 shrink-0 transition-all ml-2" />
              </button>

              {/* CARD 3: CHAIRMAN'S MESSAGE */}
              <button
                onClick={() => onNavigateToPage("chairman")}
                className={`w-full text-left py-3 px-4 rounded-xl border transition-all duration-250 group flex items-center justify-between cursor-pointer active:scale-[0.99] ${
                  isDark 
                    ? "bg-black/50 hover:bg-amber-950/25 border-white/5 hover:border-amber-500/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.25)]" 
                    : "bg-white/95 border-slate-205 hover:border-amber-500/50 hover:bg-amber-50/30 shadow-sm hover:shadow-[0_0_12px_rgba(245,158,11,0.18)]"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="p-2 rounded-lg bg-amber-500/15 text-amber-555 group-hover:scale-105 transition-transform flex items-center justify-center">
                    <UserCheck className="w-4.5 h-4.5 shrink-0" />
                  </span>
                  <span className={`text-xs md:text-sm font-extrabold group-hover:text-amber-600 transition-colors truncate ${
                    isDark ? "text-white" : "text-slate-800"
                  }`}>
                    Chairman Message
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-1 shrink-0 transition-all ml-2" />
              </button>

              {/* CARD 4: COMPANY PROFILE LINK BUTTON */}
              <button
                onClick={() => onNavigateToPage("legal")}
                className={`w-full text-left py-3 px-4 rounded-xl border transition-all duration-250 group flex items-center justify-between cursor-pointer active:scale-[0.99] ${
                  isDark 
                    ? "bg-black/50 hover:bg-emerald-950/25 border-white/5 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.25)]" 
                    : "bg-white/95 border-slate-200 hover:border-emerald-500/50 hover:bg-emerald-50/30 shadow-sm hover:shadow-[0_0_12px_rgba(16,185,129,0.18)]"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="p-2 rounded-lg bg-emerald-500/15 text-emerald-600 group-hover:scale-105 transition-transform flex items-center justify-center">
                    <FileText className="w-4.5 h-4.5 shrink-0" />
                  </span>
                  <span className={`text-xs md:text-sm font-extrabold group-hover:text-emerald-600 transition-colors truncate flex items-center gap-1.5 ${
                    isDark ? "text-white" : "text-slate-800"
                  }`}>
                    Company Profile
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 shrink-0 transition-all ml-2" />
              </button>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
export {};
