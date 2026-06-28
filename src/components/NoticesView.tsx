import React, { useState, useMemo } from "react";
import { 
  Search, Calendar, Filter, Sparkles, X, ChevronDown, 
  ArrowRight, ShieldCheck, UserCheck, Landmark, BookOpen, 
  FileCheck, Shield, PlaneTakeoff, Lock, Award, RefreshCw
} from "lucide-react";

// Icon mapping based on notice item configuration
const iconMap: Record<string, any> = {
  n_1: ShieldCheck,
  n_2: UserCheck,
  n_3: Landmark,
  n_4: BookOpen,
  n_5: FileCheck,
  n_6: Shield,
  n_7: PlaneTakeoff,
  n_8: Lock,
  n_9: Award,
  n_10: Sparkles,
};

interface Notice {
  id: string;
  title: string;
  description: string;
  icon?: any;
  tag: string;
  color: string;
  date: string; // YYYY-MM-DD
  imageUrl?: string;
}

interface NoticesViewProps {
  notices: Notice[];
  isDark: boolean;
  theme: any;
}

export default function NoticesView({ notices, isDark, theme }: NoticesViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Notice detail expansion state
  const [expandedNoticeId, setExpandedNoticeId] = useState<string | null>(null);

  // Apply filters: Search Query, Category/Tag, Date Range
  const filteredNotices = useMemo(() => {
    return notices.filter((notice) => {
      // 1. Text Search Filter
      const textMatch = 
        notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notice.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notice.tag.toLowerCase().includes(searchQuery.toLowerCase());
      if (!textMatch) return false;

      // 2. Tag Category Filter
      if (selectedTag !== "All" && notice.tag !== selectedTag) return false;

      // 3. Date Filters
      if (startDate) {
        if (notice.date < startDate) return false;
      }
      if (endDate) {
        if (notice.date > endDate) return false;
      }

      return true;
    });
  }, [notices, searchQuery, selectedTag, startDate, endDate]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedTag("All");
    setStartDate("");
    setEndDate("");
  };

  // Convert notice.id standard references to appropriate icons securely
  const getNoticeIconComponent = (notice: Notice) => {
    const key = notice.id.replace("-", "_");
    const IconComponent = iconMap[key] || Sparkles;
    return <IconComponent className="w-5 h-5 font-bold" />;
  };

  return (
    <div className="space-y-10 animate-fadeIn" id="notices-view-wrapper">
      
      {/* 1. Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className={`text-xs uppercase tracking-widest font-mono font-bold px-3 py-1 rounded-full border inline-flex items-center gap-2 ${
          isDark 
            ? "text-amber-400 bg-amber-950/40 border-amber-800/30" 
            : "text-amber-700 bg-amber-50 border-amber-200"
        }`}>
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          Official Governance & Compliance Records
        </span>
        <h2 className={`text-3xl md:text-4.5xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
          Regulations & Notices Archive
        </h2>
        <p className={`text-xs md:text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-650"}`}>
          All official corporate declarations, compliance regulations, and regulatory statements from Asia Link Services corporate secretariat, presented with complete operational transparency.
        </p>
      </div>

      {/* 2. Advanced Interactive Filter Panel */}
      <div className={`p-6 md:p-8 rounded-3xl border backdrop-blur-md relative overflow-hidden transition-all shadow-xl ${
        isDark 
          ? "bg-slate-950/70 border-slate-900/80" 
          : "bg-white border-slate-205 shadow-sm"
      }`} id="notice-filter-panel">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200/40 dark:border-slate-800/60">
            <Filter className={`w-4 h-4 ${isDark ? "text-cyan-400" : "text-[#0073aa]"}`} />
            <span className={`text-xs font-mono font-black uppercase tracking-wider ${isDark ? "text-gray-200" : "text-slate-800"}`}>
              Filter Notices
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* SEARCH INPUT */}
            <div className="space-y-2">
              <label className={`text-[10px] font-mono font-extrabold uppercase tracking-wider block ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}>
                Search Statements
              </label>
              <div className="relative">
                <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`} />
                <input
                  type="text"
                  placeholder="Keyword search (e.g. 'RBA', 'compliance', 'flight')..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full py-2.5 pl-10 pr-4 rounded-xl text-xs font-sans border transition-all outline-none focus:ring-1 ${
                    isDark 
                      ? "bg-slate-900 border-slate-800 text-white focus:border-cyan-500 focus:ring-cyan-500/30" 
                      : "bg-slate-50 border-slate-250 text-slate-900 focus:bg-white focus:border-[#0073aa] focus:ring-[#0073aa]/20"
                  }`}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                )}
              </div>
            </div>

            {/* DATE FILTER RANGE */}
            <div className="space-y-2">
              <label className={`text-[10px] font-mono font-extrabold uppercase tracking-wider block ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}>
                Filter by Date Range
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={`w-full py-2.5 pl-8 pr-2 rounded-xl text-xs font-mono border transition-all outline-none focus:ring-1 ${
                      isDark 
                        ? "bg-slate-900 border-slate-800 text-white focus:border-cyan-500 focus:ring-cyan-500/30" 
                        : "bg-slate-50 border-slate-250 text-slate-900 focus:bg-white focus:border-[#0073aa] focus:ring-[#0073aa]/20"
                    }`}
                  />
                </div>
                <span className={`text-[10px] font-mono ${isDark ? "text-slate-500" : "text-slate-400"}`}>to</span>
                <div className="relative flex-1">
                  <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={`w-full py-2.5 pl-8 pr-2 rounded-xl text-xs font-mono border transition-all outline-none focus:ring-1 ${
                      isDark 
                        ? "bg-slate-900 border-slate-800 text-white focus:border-cyan-500 focus:ring-cyan-500/30" 
                        : "bg-slate-50 border-slate-250 text-slate-900 focus:bg-white focus:border-[#0073aa] focus:ring-[#0073aa]/20"
                    }`}
                  />
                </div>
              </div>
            </div>

          </div>

          {/* RESET BUTTON */}
          {(searchQuery || startDate || endDate) && (
            <div className="flex justify-end pt-3 border-t border-slate-200/40 dark:border-slate-800/60">
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-extrabold text-red-500 hover:bg-red-500/5 hover:-scale-95 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 text-red-500/80" />
                <span>Reset Filters</span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* 3. Output List */}
      <div className="space-y-4" id="notices-archive-listing">
        {filteredNotices.length > 0 ? (
          filteredNotices.map((notice, idx) => {
            const isExpanded = expandedNoticeId === notice.id;
            
            return (
              <div
                key={notice.id}
                className={`p-6 md:p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden backdrop-blur-xs group ${
                  isExpanded
                    ? isDark 
                      ? "bg-slate-900/90 border-slate-700/80 ring-1 ring-slate-800/50 shadow-2xl"
                      : "bg-white border-[#0073aa]/40 shadow-xl ring-1 ring-[#0073aa]/10"
                    : isDark
                      ? "bg-slate-950/40 border-slate-900 hover:bg-slate-900/50 hover:border-slate-800 shadow-xs"
                      : "bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-md shadow-xs"
                }`}
              >
                {/* Visual hover accent bar on left */}
                <div className={`absolute top-0 left-0 w-1.5 h-full transition-all duration-300 ${
                  isExpanded ? "bg-[#e31e24]" : "bg-transparent group-hover:bg-[#0073aa]"
                }`}></div>

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Notice Icon with responsive theme adaptation */}
                    <div className={`p-2.5 h-11 w-11 rounded-xl border shrink-0 flex items-center justify-center transition-all duration-300 ${
                      isExpanded 
                        ? notice.color 
                        : isDark
                          ? "bg-slate-900 border-slate-800 text-slate-300 group-hover:bg-slate-800 group-hover:text-amber-400"
                          : "bg-slate-50 border-slate-200 text-slate-650 group-hover:bg-slate-100 group-hover:text-[#0073aa]"
                    }`}>
                      {getNoticeIconComponent(notice)}
                    </div>

                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Notice Date */}
                        <span className={`text-[10px] font-mono font-extrabold flex items-center gap-1 ${
                          isDark ? "text-slate-400" : "text-slate-500"
                        }`}>
                          <Calendar className="w-3.5 h-3.5 opacity-80" />
                          {new Date(notice.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                          })}
                        </span>
                        
                        {/* Notice Topic Tag */}
                        <span className={`text-[9px] font-mono uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md border ${
                          isDark 
                            ? "bg-slate-950/80 text-amber-400/90 border-slate-800" 
                            : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}>
                          {notice.tag}
                        </span>

                        {notice.date >= "2026-06-10" && (
                          <span className="text-[8px] uppercase tracking-wide px-1.5 py-0.5 rounded font-black font-mono text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 animate-pulse">
                            New Directive
                          </span>
                        )}
                      </div>

                      <h3 
                        onClick={() => setExpandedNoticeId(isExpanded ? null : notice.id)}
                        className={`text-base md:text-lg font-black tracking-tight leading-snug cursor-pointer transition-colors ${
                          isDark 
                            ? "text-white hover:text-amber-400 hover:underline decoration-amber-500/30" 
                            : "text-slate-900 hover:text-[#0073aa] hover:underline decoration-[#0073aa]/30"
                        }`}
                        title="Click to toggle full directive details"
                      >
                        {notice.title}
                      </h3>

                      <p className={`text-xs md:text-sm leading-relaxed ${
                        isExpanded 
                          ? isDark ? "text-slate-300" : "text-slate-700" 
                          : isDark ? "line-clamp-2 text-slate-400" : "line-clamp-2 text-slate-600"
                      }`}>
                        {notice.description}
                      </p>

                      {isExpanded && (
                        <div className="mt-5 pt-5 border-t text-xs md:text-sm leading-relaxed space-y-4 border-slate-200/50 dark:border-slate-800/80">
                          {notice.imageUrl && (
                            <div className="mb-4 rounded-2xl overflow-hidden border border-slate-500/10 max-h-80 flex justify-center bg-slate-900/5 p-2">
                              <img src={notice.imageUrl} alt={notice.title} className="max-w-full max-h-80 object-contain rounded-xl" referrerPolicy="no-referrer" />
                            </div>
                          )}

                          <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                            isDark 
                              ? "bg-red-500/5 border-red-500/10 text-slate-300" 
                              : "bg-red-50/50 border-red-100 text-slate-700"
                          }`}>
                            <div className="p-1.5 rounded-lg bg-red-500/10 text-[#e31e24] border border-[#e31e24]/10 shrink-0">
                              <Lock className="w-4 h-4" />
                            </div>
                            <div className="space-y-1">
                              <p className="font-extrabold text-[10px] uppercase font-mono tracking-wider text-red-500">Anonymous Whistleblower Hotline</p>
                              <p className="text-[11px] leading-relaxed">Report any unauthorized service demands or requests for administrative charges directly to: <span className="font-mono font-bold text-red-500 hover:underline">jobasialink119@gmail.com</span></p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedNoticeId(isExpanded ? null : notice.id)}
                    className={`self-start md:self-center px-4 py-2 rounded-xl text-xs font-black border transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      isExpanded
                        ? "bg-red-500/5 border-red-500/20 text-red-500 hover:bg-red-500/10"
                        : isDark
                          ? "bg-slate-900 hover:bg-slate-800 border-slate-800 text-gray-200 hover:text-white"
                          : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-xs hover:border-slate-300"
                    }`}
                  >
                    <span>{isExpanded ? "Collapse View" : "Read Full Directive"}</span>
                    {!isExpanded && <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className={`p-12 rounded-3xl border text-center space-y-4 max-w-lg mx-auto ${
            isDark ? "bg-slate-950/40 border-slate-900/60" : "bg-slate-50 border-slate-205"
          }`}>
            <div className="mx-auto h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Calendar className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className={`text-base font-black ${isDark ? "text-white" : "text-slate-950"}`}>
                No Notices in Date Range
              </h3>
              <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                There are no directives or compliance records matching code qualifiers, your selected tags, or date periods.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all text-white bg-[#0073aa] hover:bg-[#006292]`}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
