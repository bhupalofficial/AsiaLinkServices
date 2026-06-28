import React from "react";
import { 
  FileText, 
  Download, 
  ShieldCheck,
  PlaneTakeoff,
  Globe,
  CheckCircle2
} from "lucide-react";
import { CMSData } from "../types";

interface CompanyProfileViewProps {
  cmsData: CMSData;
  activeSubPage: string;
  themeId?: string;
}

export default function CompanyProfileView({ cmsData, activeSubPage, themeId = "dark" }: CompanyProfileViewProps) {
  const isDark = themeId === "dark";
  const pdfPath = "/Asia Link Services Company Profile.pdf";
  const { companyMeta, quotes, chairmanMessage } = cmsData;

  return (
    <div className="w-full space-y-6 md:space-y-8 animate-fadeIn">
      
      {/* 1. INTRODUCTION SECTION */}
      {activeSubPage === "about" && (
        <section id="about-section" className="space-y-10 md:space-y-12 min-h-[45vh] font-sans">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch w-full">
            {/* Left Column: Heading & Creed */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6 md:space-y-8">
              
              {/* Premium About page Heading Group */}
              <div className="text-left border-l-4 border-cyan-500 pl-4">
                <span className={`text-xs uppercase tracking-widest font-mono font-bold px-2.5 py-1 rounded border inline-block ${
                  isDark 
                    ? "text-cyan-400 bg-cyan-950/40 border-cyan-800/30" 
                    : "text-[#0073aa] bg-cyan-50 border-cyan-200"
                }`}>
                  About Us
                </span>
                <h3 className={`text-2xl xs:text-3xl md:text-3.5xl font-black tracking-tight mt-2 leading-tight ${
                  isDark ? "text-white" : "text-slate-900"
                }`}>
                  Asia Link Services Pvt. Ltd.
                </h3>
                <p className={`text-xs md:text-sm mt-1.5 leading-relaxed ${
                  isDark ? "text-slate-400" : "text-slate-605"
                }`}>
                  Nepal's premier government-recognized manpower recruitment firm, delivering institutional trust and transparency since 1998.
                </p>
              </div>

              {/* Brand Statement Bubble */}
              <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden transition-all hover:scale-[1.01] flex-grow ${
                isDark 
                  ? "bg-slate-900/30 border-slate-800/60" 
                  : "bg-slate-50/50 border-slate-200/80 shadow-xs"
              }`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
                <span className={`text-[10px] font-mono tracking-widest font-extrabold uppercase px-2 py-0.5 rounded border inline-block mb-3 ${
                  isDark 
                    ? "text-amber-400 bg-amber-400/5 border-amber-400/20" 
                    : "text-amber-700 bg-amber-50 border-amber-200"
                }`}>
                  Board Creed
                </span>
                <blockquote className={`text-base xs:text-lg sm:text-xl font-bold tracking-tight leading-snug italic mb-4 ${
                  isDark ? "text-slate-100" : "text-slate-850"
                }`}>
                  "{quotes.trustQuote}"
                </blockquote>
                <p className={`text-xs md:text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Asia Link Services represent Nepal's golden standard of institutional transparency. We operate direct candidate pipelines governed strictly by fair sourcing, ethical recruitment guidelines, and strict compliance covenants, delivering safe, secure, and authenticated human talent solutions.
                </p>
              </div>

            </div>

            {/* DESKTOP VIEW ONLY: Key credentials stacked vertically next to the Left Content to fill the empty space (Styled significantly BIGGER) */}
            <div className="hidden lg:flex lg:col-span-5 flex-col justify-between gap-5">
              <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg flex items-start gap-4 h-full ${
                isDark ? "bg-slate-900/20 border-slate-800/80" : "bg-white border-slate-200/60 shadow-md"
              }`}>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[#0073aa] dark:text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h5 className={`text-sm sm:text-base font-black tracking-wide uppercase ${isDark ? "text-white" : "text-slate-950"}`}>Ethical Sourcing</h5>
                  <p className={`text-xs sm:text-sm leading-relaxed mt-1.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Direct pipelines governed entirely by social compliance standards.</p>
                </div>
              </div>

              <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg flex items-start gap-4 h-full ${
                isDark ? "bg-slate-900/20 border-slate-800/80" : "bg-white border-slate-200/60 shadow-md"
              }`}>
                <div className="w-12 h-12 rounded-xl bg-[#e31e24]/10 border border-[#e31e24]/20 text-[#e31e24] flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h5 className={`text-sm sm:text-base font-black tracking-wide uppercase ${isDark ? "text-white" : "text-slate-950"}`}>Rigorous Vetting</h5>
                  <p className={`text-xs sm:text-sm leading-relaxed mt-1.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Comprehensive trade, medical, and behavioral alignments.</p>
                </div>
              </div>

              <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg flex items-start gap-4 h-full ${
                isDark ? "bg-slate-900/20 border-slate-800/80" : "bg-white border-slate-200/60 shadow-md"
              }`}>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h5 className={`text-sm sm:text-base font-black tracking-wide uppercase ${isDark ? "text-white" : "text-slate-950"}`}>Full Integrity</h5>
                  <p className={`text-xs sm:text-sm leading-relaxed mt-1.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>A verified clean, audit-backed operational history since 1998.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Full section narrative text block (Spans across full screen in a clean, single-column layout) */}
          <div className="space-y-6 pt-8 border-t border-slate-200/30 dark:border-slate-800/50">
            <div className="space-y-4">
              <h4 className={`text-lg sm:text-xl md:text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                Empowering Global Enterprise with Reliable Nepalese Manpower
              </h4>
              <div className={`space-y-4 text-xs sm:text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                <p>
                  Asia Link Services Pvt. Ltd. is a premier, government-recognized recruitment firm headquartered in Kathmandu, Nepal. Our comprehensive network handles candidate sourcing, multi-stage professional evaluations, trade validations, medical tests coordination, and fast government exit permits processing.
                </p>
                <p>
                  We specialize in providing workforce solutions across diverse sectors including Hospitality, Commercial Construction, Manufacturing & Assembly, Logistics, Aviation, and Health Services. Our strategic partnerships extend through major GCC hubs (Saudi Arabia, UAE, Qatar, Kuwait) and East Asian markets.
                </p>
              </div>
            </div>

            {/* MOBILE / TABLET VIEW ONLY: Restores core credentials to their previous place (below narrative text) but BIGGER & styled beautifully */}
            <div className="block lg:hidden pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg flex flex-col items-start gap-4 ${
                  isDark ? "bg-slate-900/20 border-slate-800/80" : "bg-white border-slate-200/60 shadow-md"
                }`}>
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[#0073aa] dark:text-cyan-400 flex items-center justify-center">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className={`text-sm sm:text-base font-black tracking-wide uppercase ${isDark ? "text-white" : "text-slate-950"}`}>Ethical Sourcing</h5>
                    <p className={`text-xs sm:text-sm leading-relaxed mt-1.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Direct pipelines governed entirely by social compliance standards.</p>
                  </div>
                </div>

                <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg flex flex-col items-start gap-4 ${
                  isDark ? "bg-slate-900/20 border-slate-800/80" : "bg-white border-slate-200/60 shadow-md"
                }`}>
                  <div className="w-12 h-12 rounded-xl bg-[#e31e24]/10 border border-[#e31e24]/20 text-[#e31e24] flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className={`text-sm sm:text-base font-black tracking-wide uppercase ${isDark ? "text-white" : "text-slate-950"}`}>Rigorous Vetting</h5>
                    <p className={`text-xs sm:text-sm leading-relaxed mt-1.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Comprehensive trade, medical, and behavioral alignments.</p>
                  </div>
                </div>

                <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg flex flex-col items-start gap-4 sm:col-span-2 md:col-span-1 ${
                  isDark ? "bg-slate-900/20 border-slate-800/80" : "bg-white border-slate-200/60 shadow-md"
                }`}>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className={`text-sm sm:text-base font-black tracking-wide uppercase ${isDark ? "text-white" : "text-slate-950"}`}>Full Integrity</h5>
                    <p className={`text-xs sm:text-sm leading-relaxed mt-1.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>A verified clean, audit-backed operational history since 1998.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* 2. MISSION & VISION SECTION */}
      {activeSubPage === "mission" && (
        <section id="mission-vision" className="space-y-6 md:space-y-10 min-h-[40vh] font-sans">
          <div className="text-left border-l-4 border-[#e31e24] pl-4 max-w-xl">
            <span className="text-xs uppercase tracking-widest font-mono text-[#e31e24] font-black px-2 py-0.5 bg-red-500/5 border border-red-500/10 inline-block">
              Corporate Strategy
            </span>
            <h3 className={`text-2xl xs:text-3xl font-extrabold tracking-tight mt-2 ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              Our Vision, Mission & Values
            </h3>
            <p className={`text-xs md:text-sm mt-1 leading-relaxed ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}>
              Driven by dual principles of absolute candidate integrity and world-class speed for international employers.
            </p>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5 md:gap-6">
            
            {/* Mission Card */}
            <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden group hover:scale-[1.01] transition-all duration-300 ${
              isDark 
                ? "bg-slate-900/40 border-slate-800/60 hover:border-red-500/30" 
                : "bg-white border-slate-200 hover:border-red-500/30 shadow-xs"
            }`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-650/10 rounded-full blur-2xl group-hover:bg-red-650/20 transition-colors" />
              <div className="flex items-center gap-3 mb-4">
                <span className={`p-3 rounded-2xl ${isDark ? "bg-red-500/10 text-red-500" : "bg-red-50 text-red-600"}`}>
                  <PlaneTakeoff className="w-6 h-6 text-red-500" />
                </span>
                <h4 className={`text-lg sm:text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Our Mission</h4>
              </div>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-slate-700"}`}>
                To match premier global employers with elite, verified Nepalese workforces swiftly and transparently, championing safe, compliant migration pathways with unrivaled integrity.
              </p>
            </div>

            {/* Vision Card */}
            <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden group hover:scale-[1.01] transition-all duration-300 ${
              isDark 
                ? "bg-slate-900/40 border-slate-800/60 hover:border-sky-500/30" 
                : "bg-white border-slate-200 hover:border-sky-500/30 shadow-xs"
            }`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-sky-450/10 rounded-full blur-2xl group-hover:bg-sky-450/20 transition-colors" />
              <div className="flex items-center gap-3 mb-4">
                <span className={`p-3 rounded-2xl ${isDark ? "bg-sky-500/10 text-sky-400" : "bg-sky-50 text-sky-600"}`}>
                  <Globe className="w-6 h-6 text-sky-400" />
                </span>
                <h4 className={`text-lg sm:text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Our Vision</h4>
              </div>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-slate-700"}`}>
                To govern South Asia's benchmark of recruitment compliance, integrating modern screening automation to nurture prosperous communities and strengthen corporate partnerships.
              </p>
            </div>

            {/* Core Values Card */}
            <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden group hover:scale-[1.01] transition-all duration-300 sm:col-span-2 lg:col-span-1 ${
              isDark 
                ? "bg-slate-900/40 border-slate-800/60 hover:border-amber-400/30" 
                : "bg-white border-slate-200 hover:border-amber-400/30 shadow-xs"
            }`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-450/10 rounded-full blur-2xl group-hover:bg-amber-450/20 transition-colors" />
              <div className="flex items-center gap-3 mb-4">
                <span className={`p-3 rounded-2xl ${isDark ? "bg-amber-500/10 text-amber-500" : "bg-amber-50 text-amber-600"}`}>
                  <ShieldCheck className="w-6 h-6 text-amber-500" />
                </span>
                <h4 className={`text-lg sm:text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Our Values</h4>
              </div>
              <ul className="space-y-3 mt-2">
                <li className="flex items-start gap-2 text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span className={`${isDark ? "text-gray-300" : "text-slate-700"}`}>
                    <strong className={isDark ? "text-[#fff]" : "text-slate-900 font-extrabold"}>Candidate First</strong>: Ethical, clean sourcing operations.
                  </span>
                </li>
                <li className="flex items-start gap-2 text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-sky-450 shrink-0 mt-0.5" />
                  <span className={`${isDark ? "text-gray-300" : "text-slate-700"}`}>
                    <strong className={isDark ? "text-[#fff]" : "text-slate-900 font-extrabold"}>Speed & Scale</strong>: Dynamic, fast mobilization cycles.
                  </span>
                </li>
                <li className="flex items-start gap-2 text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span className={`${isDark ? "text-gray-300" : "text-slate-700"}`}>
                    <strong className={isDark ? "text-[#fff]" : "text-slate-900 font-extrabold"}>Global Integrity</strong>: Compliance with Nepalese & host governments.
                  </span>
                </li>
              </ul>
            </div>

          </div>
        </section>
      )}

      {/* 3. CHAIRMAN MESSAGE SECTION */}
      {activeSubPage === "chairman" && (
        <section id="chairman-statement" className={`relative rounded-3xl overflow-hidden border shadow-2xl p-6 sm:p-10 md:p-12 space-y-8 ${
          isDark ? "border-slate-800/80 bg-slate-950/80" : "border-slate-200 bg-white"
        }`}>
          {/* PHOTO ON TOP - NATURAL ASPECT RATIO / AS UPLOADED SIZE */}
          {chairmanMessage && chairmanMessage.avatarUrl && (
            <div className="w-full flex justify-center">
              <div className="w-full rounded-2xl overflow-hidden border border-slate-300/10 shadow-lg bg-slate-950/20 relative group">
                <img
                  src={chairmanMessage.avatarUrl}
                  alt={`${chairmanMessage.name || "Chairman"} - Asia Link Services`}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto filter brightness-[0.95] contrast-[1.05] hover:scale-[1.01] transition-transform duration-700"
                />
              </div>
            </div>
          )}

          {/* TEXT ON DOWN */}
          <div className="w-full space-y-6">
            <div className="text-center space-y-3">
              <h3 className={`text-xl xs:text-2xl sm:text-3xl font-extrabold tracking-tight font-serif ${
                isDark ? "text-white" : "text-slate-900"
              }`}>
                {chairmanMessage.salutation}
              </h3>
            </div>
            
            <div className={`space-y-4 text-xs sm:text-sm leading-relaxed font-sans text-justify ${
              isDark ? "text-gray-300" : "text-slate-700"
            }`}>
              {chairmanMessage.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <div className={`flex flex-col items-center justify-center text-center gap-1 border-t pt-6 mt-4 ${
              isDark ? "border-slate-900" : "border-slate-150"
            }`}>
              <h4 className={`font-extrabold text-sm sm:text-base ${isDark ? "text-white" : "text-slate-900"}`}>
                {chairmanMessage.name || "Meelan Kattel"}
              </h4>
              <p className={`text-[10px] sm:text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {chairmanMessage.title || "Managing Chairman"}, Asia Link Services Pvt. Ltd.
              </p>
              {chairmanMessage.mobile && (
                <p className="text-[10px] font-mono text-slate-500 mt-1">
                  Contact: {chairmanMessage.mobile}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 4. COMPANY PROFILE VIEW SECTION */}
      {activeSubPage === "legal" && (
        <section id="legal-section" className="space-y-6 md:space-y-8 font-sans">
          
          {/* Section Header */}
          <div className="text-left border-l-4 border-cyan-400 pl-4">
            <span className={`text-xs uppercase tracking-widest font-mono font-semibold px-2 py-0.5 rounded border inline-block ${
              isDark 
                ? "text-cyan-400 bg-cyan-950/40 border-cyan-800/30" 
                : "text-[#0073aa] bg-cyan-50 border-cyan-200"
            }`}>
              Official Credentials
            </span>
            <h3 className={`text-2xl md:text-3xl font-extrabold tracking-tight mt-2 ${isDark ? "text-white" : "text-slate-900"}`}>
              Corporate Profile & Document Deck
            </h3>
            <p className={`text-xs md:text-sm mt-1 max-w-2xl leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Browse official regulatory standing materials, licensed capability profiles, or preview our agency prospectus with the secure direct links below.
            </p>
          </div>

          {/* Top Document Header Card - Main Action Hub */}
          <div className={`p-5 sm:p-6 rounded-3xl border relative overflow-hidden backdrop-blur-md ${
            isDark 
              ? "bg-slate-950/60 border-slate-800/80 shadow-2xl" 
              : "bg-white border-slate-200/80 shadow-md"
          }`}>
            <div className="absolute top-0 right-0 w-80 h-40 bg-cyan-500/5 dark:bg-cyan-500/5 blur-3xl rounded-full" />
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6 relative z-10">
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  isDark 
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" 
                    : "bg-cyan-50 text-[#0073aa] border border-[#0073aa]/10"
                }`}>
                  <FileText className="w-5.5 h-5.5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] sm:text-[10px] uppercase tracking-widest font-mono font-black px-2 py-0.5 rounded ${
                      isDark 
                        ? "bg-cyan-950/40 border-cyan-800/30 text-cyan-400" 
                        : "bg-cyan-50 border-cyan-200 text-[#0073aa]"
                    }`}>
                      Official Booklet
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <h4 className={`text-base sm:text-lg md:text-xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                    Asia Link Services — Corporate Booklet
                  </h4>
                  <p className={`text-[11px] sm:text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"} max-w-xl`}>
                    Access the verified corporate identity credentials, capital investments registry, legal standing certificates, and organizational blueprints.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-stretch md:items-end gap-2.5 shrink-0 w-full md:w-60">
                {/* Premium action download button */}
                <a
                  href={pdfPath}
                  download="Asia_Link_Services_Company_Profile.pdf"
                  className="w-full px-5 py-3.5 rounded-2xl text-xs font-black tracking-wider uppercase text-white bg-[#e31e24] hover:bg-[#c11419] flex items-center justify-center gap-2 transition-all duration-350 shadow-md hover:scale-[1.01]"
                >
                  <Download className="w-4 h-4 text-white" />
                  <span>Download PDF</span>
                </a>

                {/* View document directly in another tab named PREVIEW PDF */}
                <a
                  href={pdfPath}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full px-5 py-3.5 rounded-2xl text-xs font-black tracking-wider uppercase text-white bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2 transition-all duration-350 shadow-md hover:scale-[1.01] cursor-pointer"
                  title="Preview company profile document"
                >
                  <FileText className="w-4 h-4 text-white" />
                  <span>Preview PDF</span>
                </a>
              </div>
            </div>

            {/* License verification indicators footer within the card */}
            <div className="mt-5 pt-4 border-t border-slate-205 flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] sm:text-[11px] font-mono font-bold text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Ministry Credential clearances verified</span>
              </div>
              <div className="hidden sm:block">•</div>
              <div>Govt Lic: <span className="text-[#e31e24] dark:text-cyan-400">{companyMeta.govLicenseNo || "119/055/056"}</span></div>
              <div className="hidden sm:block">•</div>
              <div>JITCO Status: <span className={isDark ? "text-white" : "text-slate-800"}>{companyMeta.jitcoNo || "311"}</span></div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
