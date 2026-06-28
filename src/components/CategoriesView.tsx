import React, { useState } from "react";
import { 
  Briefcase, 
  ChevronRight, 
  Award, 
  Utensils, 
  UserCheck, 
  Cpu, 
  Shield, 
  ShoppingBag, 
  Wrench, 
  HardHat, 
  Stethoscope, 
  Hammer, 
  Sprout, 
  ChevronDown, 
  ChevronUp, 
  ArrowUpRight 
} from "lucide-react";
import { RecruitedCategoryGroup } from "../types";

interface CategoriesViewProps {
  groups: RecruitedCategoryGroup[];
  cardBg: string;
  themeId?: string;
}

export default function CategoriesView({ groups, themeId = "dark" }: CategoriesViewProps) {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [selectedGroupId, setSelectedGroupId] = useState<string>("g-1");
  const isDark = themeId === "dark";

  const getGroupConfig = (id: string) => {
    switch (id) {
      case "g-1": // Hotel & Catering Staff
        return {
          colorName: "Hotel & Catering",
          gradientBg: isDark 
            ? "from-amber-600/15 via-orange-600/5 to-slate-950/40 border-amber-500/20"
            : "bg-gradient-to-br from-amber-100/90 via-orange-50 to-amber-50/60 border-amber-300 shadow-md shadow-amber-300/10",
          badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25",
          iconColor: "text-amber-500",
          iconBg: isDark ? "bg-amber-500/20 border-amber-500/30 text-amber-400" : "bg-amber-100 border-amber-250 text-amber-700",
          bullet: "text-amber-500",
          glow: isDark ? "shadow-amber-500/10" : "shadow-amber-200/40",
          borderHover: "hover:border-amber-400/85 group-hover:border-amber-500/90",
          textHover: "group-hover:text-amber-500",
          buttonStyle: "bg-amber-500/10 hover:bg-amber-500/25 text-amber-600 dark:text-amber-400 border-amber-500/25",
          icon: Utensils,
        };
      case "g-2": // Office & Executives
        return {
          colorName: "Office & Corporate",
          gradientBg: isDark 
            ? "from-blue-600/15 via-indigo-600/5 to-slate-950/40 border-blue-500/20"
            : "bg-gradient-to-br from-blue-105 via-indigo-50/90 to-blue-50/60 border-blue-300/90 shadow-md shadow-blue-300/10",
          badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25",
          iconColor: "text-blue-500",
          iconBg: isDark ? "bg-blue-500/20 border-blue-500/30 text-blue-400" : "bg-blue-105 border-blue-250 text-blue-700",
          bullet: "text-blue-500",
          glow: isDark ? "shadow-blue-500/15" : "shadow-blue-200/40",
          borderHover: "hover:border-blue-400/85 group-hover:border-blue-500/90",
          textHover: "group-hover:text-blue-500",
          buttonStyle: "bg-blue-500/10 hover:bg-blue-500/25 text-blue-600 dark:text-blue-450 border-blue-500/25",
          icon: UserCheck,
        };
      case "g-3": // Information Technology
        return {
          colorName: "Computer & IT",
          gradientBg: isDark 
            ? "from-violet-600/15 via-purple-600/5 to-slate-950/40 border-violet-500/20"
            : "bg-gradient-to-br from-violet-100 via-purple-50/90 to-violet-50/60 border-violet-300/90 shadow-md shadow-violet-300/10",
          badge: "bg-violet-500/10 text-violet-605 dark:text-violet-400 border-violet-500/25",
          iconColor: "text-violet-500",
          iconBg: isDark ? "bg-violet-500/20 border-violet-500/30 text-violet-400" : "bg-violet-100 border-violet-250 text-violet-700",
          bullet: "text-violet-500",
          glow: isDark ? "shadow-violet-500/15" : "shadow-violet-200/40",
          borderHover: "hover:border-violet-400/85 group-hover:border-violet-500/90",
          textHover: "group-hover:text-violet-505",
          buttonStyle: "bg-violet-500/10 hover:bg-violet-500/25 text-violet-600 dark:text-violet-400 border-violet-500/25",
          icon: Cpu,
        };
      case "g-4": // Security Sector Group
        return {
          colorName: "Defense & Security",
          gradientBg: isDark 
            ? "from-rose-600/15 via-red-650/5 to-slate-950/40 border-rose-500/20"
            : "bg-gradient-to-br from-rose-100 via-red-50/90 to-rose-50/60 border-rose-300/90 shadow-md shadow-rose-300/10",
          badge: "bg-rose-500/10 text-rose-600 dark:text-rose-455 border-rose-500/25",
          iconColor: "text-rose-500",
          iconBg: isDark ? "bg-rose-500/20 border-rose-500/30 text-rose-400" : "bg-rose-100 border-rose-250 text-rose-700",
          bullet: "text-rose-500",
          glow: isDark ? "shadow-rose-500/15" : "shadow-rose-200/40",
          borderHover: "hover:border-rose-400/85 group-hover:border-rose-500/90",
          textHover: "group-hover:text-rose-500",
          buttonStyle: "bg-rose-500/10 hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 border-rose-500/25",
          icon: Shield,
        };
      case "g-5": // Supermarket & Retail
        return {
          colorName: "Retail & Sales",
          gradientBg: isDark 
            ? "from-emerald-600/15 via-green-600/5 to-slate-950/40 border-emerald-500/20"
            : "bg-gradient-to-br from-emerald-100/90 via-green-50 to-emerald-50/60 border-emerald-300 shadow-md shadow-emerald-300/10",
          badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
          iconColor: "text-emerald-500",
          iconBg: isDark ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" : "bg-emerald-100 border-emerald-250 text-emerald-700",
          bullet: "text-emerald-500",
          glow: isDark ? "shadow-emerald-500/15" : "shadow-emerald-200/40",
          borderHover: "hover:border-emerald-400/85 group-hover:border-emerald-500/90",
          textHover: "group-hover:text-emerald-500",
          buttonStyle: "bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
          icon: ShoppingBag,
        };
      case "g-6": // Heavy Equipment, Vehicle & Auto Mechanic
        return {
          colorName: "Automotive & Logistics",
          gradientBg: isDark 
            ? "from-yellow-600/15 via-amber-600/5 to-slate-950/40 border-yellow-500/20"
            : "bg-gradient-to-br from-yellow-200/70 via-amber-100 to-yellow-50/60 border-yellow-350 shadow-md shadow-yellow-300/10",
          badge: "bg-yellow-500/10 text-yellow-650 dark:text-yellow-450 border-yellow-500/25",
          iconColor: "text-yellow-600",
          iconBg: isDark ? "bg-yellow-500/20 border-yellow-500/30 text-yellow-400" : "bg-yellow-105 border-yellow-250 text-yellow-700",
          bullet: "text-yellow-600",
          glow: isDark ? "shadow-yellow-500/15" : "shadow-yellow-200/40",
          borderHover: "hover:border-yellow-400/85 group-hover:border-yellow-500/90",
          textHover: "group-hover:text-yellow-600",
          buttonStyle: "bg-yellow-500/10 hover:bg-yellow-500/25 text-yellow-650 dark:text-yellow-450 border-yellow-500/25",
          icon: Wrench,
        };
      case "g-7": // Engineering & Technical
        return {
          colorName: "Engineering",
          gradientBg: isDark 
            ? "from-cyan-600/15 via-teal-600/5 to-slate-950/40 border-cyan-500/20"
            : "bg-gradient-to-br from-cyan-100 via-teal-50/90 to-cyan-50/60 border-cyan-300 shadow-md shadow-cyan-300/10",
          badge: "bg-cyan-500/10 text-[#0073aa] dark:text-cyan-400 border-cyan-500/25",
          iconColor: "text-cyan-500",
          iconBg: isDark ? "bg-cyan-500/20 border-cyan-500/30 text-cyan-450" : "bg-cyan-100 border-cyan-250 text-cyan-700",
          bullet: "text-cyan-500",
          glow: isDark ? "shadow-cyan-500/15" : "shadow-cyan-200/40",
          borderHover: "hover:border-cyan-400/85 group-hover:border-cyan-500/90",
          textHover: "group-hover:text-cyan-600",
          buttonStyle: "bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-600 dark:text-cyan-400 border-cyan-500/25",
          icon: HardHat,
        };
      case "g-8": // Hospital & Medical Staff
        return {
          colorName: "Healthcare & Clinic",
          gradientBg: isDark 
            ? "from-pink-600/15 via-rose-600/5 to-slate-950/40 border-pink-500/20"
            : "bg-gradient-to-br from-pink-100 via-rose-50/90 to-pink-50/60 border-pink-300 shadow-md shadow-pink-300/10",
          badge: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/25",
          iconColor: "text-pink-500",
          iconBg: isDark ? "bg-pink-500/20 border-pink-500/30 text-pink-400" : "bg-pink-100 border-pink-250 text-pink-700",
          bullet: "text-pink-500",
          glow: isDark ? "shadow-pink-500/15" : "shadow-pink-200/40",
          borderHover: "hover:border-pink-400/85 group-hover:border-pink-550/90",
          textHover: "group-hover:text-pink-500",
          buttonStyle: "bg-pink-500/10 hover:bg-pink-500/25 text-pink-600 dark:text-pink-400 border-pink-500/25",
          icon: Stethoscope,
        };
      case "g-9": // Building Maintenance & Construction
        return {
          colorName: "Construction & Trade",
          gradientBg: isDark 
            ? "from-orange-600/15 via-red-600/5 to-slate-950/40 border-orange-500/20"
            : "bg-gradient-to-br from-orange-100 via-red-50/90 to-orange-50/60 border-orange-300 shadow-md shadow-orange-300/10",
          badge: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/25",
          iconColor: "text-orange-500",
          iconBg: isDark ? "bg-orange-500/20 border-orange-500/30 text-orange-400" : "bg-orange-100 border-orange-250 text-orange-700",
          bullet: "text-orange-500",
          glow: isDark ? "shadow-orange-500/15" : "shadow-orange-200/40",
          borderHover: "hover:border-orange-400/85 group-hover:border-orange-550/90",
          textHover: "group-hover:text-orange-500",
          buttonStyle: "bg-orange-500/10 hover:bg-orange-500/25 text-orange-650 dark:text-orange-400 border-orange-500/25",
          icon: Hammer,
        };
      case "g-10": // Garments, Manufacturing & Farming
        return {
          colorName: "Manufacturing & Ag",
          gradientBg: isDark 
            ? "from-teal-600/15 via-emerald-600/5 to-slate-950/40 border-teal-500/20"
            : "bg-gradient-to-br from-teal-100 via-emerald-50/90 to-teal-50/60 border-teal-300 shadow-md shadow-teal-300/10",
          badge: "bg-teal-500/10 text-teal-605 dark:text-teal-400 border-teal-500/25",
          iconColor: "text-teal-600",
          iconBg: isDark ? "bg-teal-500/20 border-teal-500/30 text-teal-400" : "bg-teal-100 border-teal-250 text-teal-700",
          bullet: "text-teal-600",
          glow: isDark ? "shadow-teal-500/15" : "shadow-teal-200/40",
          borderHover: "hover:border-teal-400/85 group-hover:border-teal-550/90",
          textHover: "group-hover:text-teal-500",
          buttonStyle: "bg-teal-500/10 hover:bg-teal-500/25 text-teal-600 dark:text-teal-400 border-teal-500/25",
          icon: Sprout,
        };
      default:
        return {
          colorName: "Sourcing Classification",
          gradientBg: isDark ? "from-slate-900 border-slate-800 text-slate-200" : "from-slate-50 border-slate-200 text-slate-800",
          badge: "bg-slate-500/10 text-slate-400 border-slate-500/20",
          iconColor: "text-slate-400",
          iconBg: "bg-slate-500/10 border-slate-500/20",
          bullet: "text-slate-400",
          glow: "shadow-slate-500/10",
          borderHover: "hover:border-slate-400/50 group-hover:border-slate-500/40",
          textHover: "group-hover:text-slate-400",
          buttonStyle: "bg-slate-500/10 hover:bg-slate-500/25 text-slate-500 border-slate-500/25",
          icon: Briefcase,
        };
    }
  };

  const toggleCard = (cardId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const scrollToCareers = () => {
    const el = document.getElementById("careers-notice-split-section") || document.getElementById("careers-side-section") || document.getElementById("demands");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const activeGroup = groups.find(g => g.id === selectedGroupId) || groups[0];

  return (
    <div id="categories-module" className="space-y-6">
      {/* Auto-adjusting Responsive Grid: Dynamically fits columns based on screen size (from 1 up to 5+ columns), centered when wrapped */}
      <div className="flex flex-wrap justify-center gap-5 w-full">
        {groups.map((group) => {
          const cfg = getGroupConfig(group.id);
          const GroupIcon = cfg.icon;
          
          const isExpanded = expandedCards[group.id];
          const originalLength = group.categories.length;
          const displayCategories = isExpanded 
            ? group.categories 
            : group.categories.slice(0, 6); // show up to 6 by default

          return (
            <div
              key={group.id}
              className={`rounded-2xl border p-6 flex flex-col justify-between transition-all duration-500 relative group overflow-hidden w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] xl:w-[calc(25%-15px)] flex-grow max-w-[400px] ${
                isDark 
                  ? `bg-gradient-to-b ${cfg.gradientBg} shadow-2xl border-transparent` 
                  : `${cfg.gradientBg}`
              } ${cfg.borderHover} ${cfg.glow} hover:shadow-2xl hover:translate-y-[-6px]`}
            >
              {/* Decorative glow backing */}
              <div className="absolute -right-12 -top-12 w-36 h-36 rounded-full bg-cyan-550/10 dark:bg-amber-500/5 blur-3xl group-hover:bg-cyan-550/20 transition-all duration-500"></div>

              {/* Content Body */}
              <div className="space-y-5 relative z-10">
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-[10.5px] font-mono uppercase tracking-widest font-black border ${cfg.badge}`}>
                    {cfg.colorName}
                  </span>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 ${cfg.iconBg}`}>
                    <GroupIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className={`font-black text-base xs:text-lg lg:text-[19px] leading-tight tracking-tight uppercase group-hover:text-amber-500 transition-colors ${
                      isDark ? 'text-white' : 'text-slate-800'
                    }`}>
                      {group.title}
                    </h4>
                    <p className="text-[10px] md:text-[11px] text-slate-500 tracking-wide mt-0.5 font-mono font-bold uppercase">Sourcing Framework</p>
                  </div>
                </div>

                {/* Categories Roles Listing */}
                <ul className="space-y-2.5 pt-3">
                  {displayCategories.map((cat, idx) => {
                    return (
                      <li
                        key={idx}
                        className={`flex items-start gap-3 text-[13.5px] xs:text-[15.5px] py-1.5 px-2 rounded-lg transition-all duration-300 group/item ${
                          isDark 
                            ? "text-slate-100 hover:text-white hover:bg-white/5" 
                            : "text-slate-800 hover:text-slate-950 hover:bg-black/5 font-semibold"
                        }`}
                      >
                        <ChevronRight className={`w-4 h-4 mt-0.5 shrink-0 transition-transform group-hover/item:translate-x-1.5 ${cfg.bullet}`} />
                        <span className="leading-snug font-bold tracking-tight">{cat}</span>
                      </li>
                    );
                  })}
                </ul>

                {/* Drawer Button */}
                {originalLength > 6 && (
                  <button
                    onClick={() => toggleCard(group.id)}
                    className={`mt-4 w-full py-2.5 px-4 rounded-xl text-[11px] font-extrabold tracking-wider uppercase font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${cfg.buttonStyle}`}
                  >
                    {isExpanded ? (
                      <>
                        <span>Hide specialty fields</span>
                        <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <span>View All {originalLength} Vetted Fields</span>
                        <ChevronDown className="w-4 h-4 animate-bounce" />
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Card bottom footer */}
              <div className={`mt-6 pt-4 border-t flex items-center justify-end text-[10.5px] ${
                isDark ? 'border-slate-900/80 text-slate-500' : 'border-slate-100 text-slate-500'
              }`}>
                <button
                  onClick={scrollToCareers}
                  className="flex items-center gap-1.5 text-[#0073aa] hover:text-[#005580] font-black transition-colors cursor-pointer group/btn uppercase tracking-widest text-[10px] font-mono"
                >
                  <span>Active Careers</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:translate-y-[-0.5px] transition-transform text-[#0073aa]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
