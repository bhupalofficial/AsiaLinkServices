import React from 'react';
import { 
  Globe, 
  FileCheck, 
  Award, 
  ShieldCheck, 
  BookOpen, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  FileSearch, 
  UserCheck, 
  Heart, 
  Compass, 
  Plane 
} from 'lucide-react';
import { CMSData } from '../types';

interface ServicesViewProps {
  isDark: boolean;
  theme: {
    id: string;
    bgColor: string;
    textColor: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    cardBg: string;
    footerBg: string;
    glassClass: string;
    glowColor: string;
  };
  cmsData?: CMSData;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ isDark, theme, cmsData }) => {
  const services = [
    {
      id: "sourcing",
      icon: Globe,
      slug: "Global Talent Sourcing",
      title: "Global Talent Sourcing & Mobilization",
      description: "Harnessing the unmatched work ethic of Nepalese labor across provinces. We specialize in sourcing highly disciplined workers tailored for specific international markets.",
      points: [
        "Regional sourcing networks in all 7 Nepalese Provinces",
        "Targeted matching across Agricultural, Industrial, and Tech sectors",
        "Vast pre-verified talent database for rapid mobilization",
        "Ethical and compliant recruitment parameters"
      ],
      color: "from-blue-500/20 to-cyan-500/20 text-cyan-500",
      lightColor: "bg-cyan-50 text-[#0073aa] border-cyan-100"
    },
    {
      id: "screening",
      icon: Award,
      slug: "Skill Testing",
      title: "Vigorous Pre-Screening & Skills Testing",
      description: "Vetting competence through accredited trade-test centers. We verify skills before candidates progress to client evaluations.",
      points: [
        "Partnership with state-certified vocational testing institutes",
        "Hands-on trade validation for mechanical, construction, and hospitality",
        "Language proficiency indices for destination countries",
        "Aptitude and pyschometric background checks"
      ],
      color: "from-purple-500/20 to-indigo-500/20 text-indigo-400",
      lightColor: "bg-indigo-50 text-indigo-700 border-indigo-150"
    },
    {
      id: "vetting",
      icon: ShieldCheck,
      slug: "Compliance & Vetting",
      title: "Medical & Compliance Cleanliness",
      description: "Facilitating full biometric and health screening via executive partner centers. Candidates meet GCC and JITCO medical eligibility standards perfectly.",
      points: [
        "Accredited biochemical labs & diagnostic centers coordination",
        "Complete immunizations, PCR, and infectious disease protection",
        "Police clearance and official credential authentication",
        "Biometric fingerprint indices registration"
      ],
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-400",
      lightColor: "bg-emerald-50 text-emerald-700 border-emerald-150"
    },
    {
      id: "seminar",
      icon: BookOpen,
      slug: "Familiarization",
      title: "Pre-Departure Orientation & Training",
      description: "Empowering candidates for success in host countries. Cultural training reduces friction and ensures immediate productivity upon deployment.",
      points: [
        "Ministry-approved cultural orientation procedures",
        "Basic conversational languages (English, Japanese, Arabic)",
        "Safety and industrial hazard prevention manuals",
        "Digital financial literacy & savings plan orientations"
      ],
      color: "from-amber-500/20 to-orange-500/20 text-amber-400",
      lightColor: "bg-amber-50 text-amber-700 border-amber-150"
    },
    {
      id: "liaison",
      icon: FileCheck,
      slug: "Gov Liaison",
      title: "Government Liaison & Legal Visas",
      description: "Complete administration of regulatory guidelines of the Ministry of Labor & Department of Foreign Employment.",
      points: [
        "Hassle-free application for statutory labor approvals",
        "Rapid Consular and Embassy coordination in Kathmandu",
        "Legal contracts endorsement & documentation safe custody",
        "Insurance plan provisioning & welfare fund enrollment"
      ],
      color: "from-rose-500/20 to-red-500/20 text-rose-400",
      lightColor: "bg-rose-50 text-[#e31e24] border-rose-150"
    },
    {
      id: "deployment",
      icon: Briefcase,
      slug: "Post-Mobilization",
      title: "Affiliate Support & Post-Deployment",
      description: "We remain your partner even after candidates deploy. Continuous welfare monitoring maintains solid retention and high productivity.",
      points: [
        "Performance reviews and support feedback mechanisms",
        "Liaison matching for candidate welfare issues",
        "Contract prolongation and legal renewal assistance",
        "Returnee labor redeployment & capital reintegration"
      ],
      color: "from-pink-500/20 to-rose-500/20 text-pink-400",
      lightColor: "bg-pink-50 text-pink-700 border-pink-150"
    }
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Demand Receipt",
      description: "Receipt of demand orders from overseas corporate affiliates, verified through government boards.",
      icon: FileSearch
    },
    {
      step: "02",
      title: "Candidate Screening",
      description: "Sourcing across Nepal, followed immediately by robust vocational and trade evaluation.",
      icon: UserCheck
    },
    {
      step: "03",
      title: "Medical Diagnostic",
      description: "Rigorous diagnostic checks to ensure 100% physical and psychiatric readiness.",
      icon: Heart
    },
    {
      step: "04",
      title: "Embassy Visa Endorsement",
      description: "Seamless consular workflow for visa processing and authentic contract endorsement.",
      icon: Compass
    },
    {
      step: "05",
      title: "Orientation & Flyout",
      description: "Pre-departure safety briefings, Department approval, and ticketing support.",
      icon: Plane
    }
  ];

  return (
    <div className="space-y-12 animate-fadeIn" id="services-page-root">
      
      {/* Page Title Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className={`text-xs uppercase tracking-widest font-mono font-bold px-2.5 py-1 rounded-full border inline-block ${
          isDark 
            ? "text-cyan-400 bg-cyan-950/40 border-cyan-800/30" 
            : "text-[#0073aa] bg-cyan-50 border-cyan-205"
        }`}>
          Our Capabilities
        </span>
        <h2 className={`text-2xl md:text-3.5xl font-black tracking-tight ${
          isDark ? "text-white" : "text-slate-900"
        }`}>
          Our Corporate Services
        </h2>
        <p className={`text-xs md:text-sm ${
          isDark ? "text-slate-400" : "text-slate-650"
        }`}>
          Delivering customized human resource recruitment options that bridge Nepalese skillsets with premium international standards.
        </p>
      </div>

      {/* Main Grid: Elegant Services Showcase Grid without sidebar (Centered flex wrap layout) */}
      <div className="flex flex-wrap justify-center gap-6 w-full">
        {services.map((svc) => {
          const SvcIcon = svc.icon;
          return (
            <div 
              key={svc.id} 
              className={`rounded-3xl border p-6 flex flex-col justify-between space-y-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex-grow max-w-[420px] ${
                isDark 
                  ? "bg-slate-950/80 border-slate-900/60 shadow-md" 
                  : "bg-white border-slate-205 shadow-sm"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3.5 pb-3 border-b border-slate-205/40 dark:border-slate-800/40 text-left">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${
                    isDark ? svc.color : svc.lightColor
                  } border`}>
                    <SvcIcon className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h3 className={`text-sm md:text-base font-extrabold leading-tight tracking-tight ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}>
                      {svc.title}
                    </h3>
                  </div>
                </div>

                <p className={`text-xs md:text-sm leading-relaxed text-left ${
                  isDark ? "text-slate-350" : "text-slate-700"
                }`}>
                  {svc.description}
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-205/40 dark:border-slate-800/45 text-left">
                {svc.points.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className={`text-[11px] font-semibold leading-normal ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sourcing Timeline Workflow Flowchart */}
      <div className="space-y-8 pt-4">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className={`text-xs uppercase tracking-widest font-mono font-bold px-2.5 py-1 rounded border inline-block ${
            isDark 
              ? "text-cyan-400 bg-cyan-950/40 border-cyan-800/30" 
              : "text-[#0073aa] bg-cyan-50 border-cyan-205"
          }`}>
            The Mobilization Loop
          </span>
          <h3 className={`text-2xl sm:text-3xl font-black mt-2 leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Deployment Workflow
          </h3>
        </div>

        <div className="flex flex-wrap justify-center gap-5 w-full">
          {workflowSteps.map((ws, i) => {
            const stepIcon = ws.icon;
            const StepIcon = stepIcon;
            return (
              <div 
                key={ws.step} 
                className={`p-6 rounded-2xl border flex flex-col justify-between space-y-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-14px)] lg:w-[calc(20%-16px)] max-w-[320px] sm:max-w-none ${
                  isDark
                    ? "bg-slate-950/60 border-slate-900/60 text-slate-350 hover:border-slate-800 shadow-md"
                    : "bg-white border-slate-205 text-slate-650 hover:border-cyan-500/20 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between border-b pb-3 border-slate-200/40 dark:border-slate-805/40">
                  <span className="text-2xl font-mono font-black text-[#e31e24]">
                    {ws.step}
                  </span>
                  <StepIcon className={`w-5.5 h-5.5 ${isDark ? 'text-cyan-400' : 'text-[#0073aa]'}`} />
                </div>
                <div className="space-y-1.5 flex-grow">
                  <h4 className={`text-xs sm:text-sm font-mono tracking-wide uppercase font-black ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}>
                    {ws.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs leading-relaxed opacity-85">
                    {ws.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Services Call to action */}
      <div className={`p-6 md:p-8 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden backdrop-blur-md ${
        isDark 
          ? "bg-gradient-to-r from-slate-950 via-slate-950 to-cyan-950/20 border-slate-900/60" 
          : "bg-gradient-to-r from-white via-white to-cyan-50 border-slate-200"
      }`}>
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <h4 className={`text-base font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
            Custom-Built Mobilization Proposals
          </h4>
          <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Have an exclusive manpower demand or niche skills requirements for JITCO Japan programs, GCC mega-ventures, or Hospitality lines? Contact our representative desk immediately.
          </p>
        </div>
        <a 
          href={`mailto:${cmsData?.contactInfo.email || "jobasialink119@gmail.com"}?subject=Manpower%2520Demand%2520Inquiry%2520-%2520Asia%2520Link%2520Services`}
          className="px-6 py-3.5 rounded-2xl bg-[#0073aa] hover:bg-[#006292] text-white text-xs font-mono uppercase tracking-widest font-black flex items-center gap-2 shrink-0 transition-all select-none hover:scale-101 shadow-md"
        >
          <span>Initiate Inquiry</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  );
};
