import React from "react";
import { Users, Clock, ShieldCheck, Headphones, Globe, Award } from "lucide-react";

interface WhyPartnerWithUsProps {
  isDark: boolean;
}

export const WhyPartnerWithUs: React.FC<WhyPartnerWithUsProps> = ({ isDark }) => {
  const cards = [
    {
      title: "Quality Candidates",
      description: "Access to a vast pool of pre-screened, qualified candidates ready to meet your workforce requirements.",
      icon: Users,
      colorType: "blue" as const,
    },
    {
      title: "Fast Processing",
      description: "Streamlined recruitment process ensuring quick turnaround times from application to deployment.",
      icon: Clock,
      colorType: "red" as const,
    },
    {
      title: "Legal Compliance",
      description: "Full compliance with international labor laws and regulations, ensuring hassle-free recruitment.",
      icon: ShieldCheck,
      colorType: "blue" as const,
    },
    {
      title: "24/7 Support",
      description: "Dedicated support team available round the clock to address your concerns and requirements.",
      icon: Headphones,
      colorType: "red" as const,
    },
    {
      title: "Global Network",
      description: "Extensive network across multiple countries enabling seamless international recruitment.",
      icon: Globe,
      colorType: "blue" as const,
    },
    {
      title: "Certified Agency",
      description: "Licensed and certified by government authorities, ensuring credibility and trustworthiness.",
      icon: Award,
      colorType: "red" as const,
    },
  ];

  return (
    <div className="space-y-10 py-4">
      {/* Heading Block */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className={`text-xs uppercase tracking-widest font-mono font-bold px-2.5 py-1 rounded-full border inline-block ${
          isDark 
            ? "text-cyan-400 bg-cyan-950/40 border-cyan-800/30" 
            : "text-[#0073aa] bg-cyan-50 border-cyan-200"
        }`}>
          Partnership Advantages
        </span>
        <h3 className={`text-2xl md:text-3.5xl font-black tracking-tight ${
          isDark ? "text-white" : "text-slate-900"
        }`}>
          Why Partner With Us?
        </h3>
        <p className={`text-xs md:text-sm leading-relaxed ${
          isDark ? "text-slate-400" : "text-slate-600"
        }`}>
          We provide comprehensive recruitment solutions tailored to your organization's needs
        </p>
      </div>

      {/* Cards Grid */}
      <div className="flex flex-wrap justify-center gap-6">
        {cards.map((card, index) => {
          const IconComponent = card.icon;
          const isBlue = card.colorType === "blue";

          const lightBg = isBlue
            ? "bg-blue-50/40 border-blue-100/70 hover:border-blue-200"
            : "bg-red-50/30 border-red-100/60 hover:border-red-200";

          const darkBg = "bg-slate-900/45 border-slate-800/80 hover:border-slate-700/80";

          const lightIconBg = isBlue ? "bg-[#1e73be]" : "bg-[#e63946]";
          const darkIconBg = isBlue ? "bg-blue-600" : "bg-rose-600";

          return (
            <div
              key={index}
              className={`p-6 sm:p-8 rounded-[2rem] border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col items-start gap-5 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] flex-grow max-w-[420px] ${
                isDark ? darkBg : lightBg
              }`}
            >
              {/* Icon Badge */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm ${
                  isDark ? darkIconBg : lightIconBg
                }`}
              >
                <IconComponent className="w-5 h-5" />
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h4 className={`text-base sm:text-lg font-black tracking-tight ${
                  isDark ? "text-slate-100" : "text-slate-900"
                }`}>
                  {card.title}
                </h4>
                <p className={`text-[12px] sm:text-[13px] leading-relaxed font-medium ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}>
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
