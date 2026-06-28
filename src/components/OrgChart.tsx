import React from "react";
import { Users, ShieldAlert, Sparkles, UserCircle } from "lucide-react";
import { TeamMember } from "../types";

interface OrgChartProps {
  primaryBg: string;
  accentText: string;
  cardBg: string;
  themeId: string;
  teamMembers: TeamMember[];
}

export default function OrgChart({ primaryBg, accentText, cardBg, themeId, teamMembers }: OrgChartProps) {
  const isDark = themeId === "dark";

  return (
    <div id="org-chart-wrapper" className="w-full space-y-10">
      
      {/* Dynamic Team Members Grid (Auto-adjusting column layout) */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center space-y-4 group hover:shadow-lg ${
              isDark
                ? "bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60"
                : "bg-white border-slate-200/90 shadow-sm hover:border-[#0073aa]/30 hover:bg-slate-50/40"
            }`}
          >
            {/* Picture block */}
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden shadow-md shrink-0 border border-slate-200/40">
              {member.photoUrl ? (
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className={`w-full h-full flex flex-col items-center justify-center font-mono font-bold text-2xl ${
                  isDark 
                    ? "bg-gradient-to-br from-slate-800 to-slate-950 text-sky-400" 
                    : "bg-gradient-to-br from-slate-100 to-slate-200 text-[#0073aa]"
                }`}>
                  {(member.name || "").split(" ").filter(Boolean).map(n => n[0] || "").join("")}
                </div>
              )}
            </div>

            {/* Profile data */}
            <div className="space-y-1.5 w-full">
              <h5 className={`text-base font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                {member.name}
              </h5>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded inline-block font-sans ${
                isDark 
                  ? "bg-sky-400/10 text-sky-400 border border-sky-400/10" 
                  : "bg-sky-50 text-[#0073aa] border border-sky-200/40"
              }`}>
                {member.role}
              </span>
              <p className={`text-xs leading-relaxed font-sans pt-2 ${isDark ? "text-slate-400" : "text-slate-650"}`}>
                {member.shortDescription}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Security Advisory footer sub-block */}
      <div className={`p-6 rounded-2xl border backdrop-blur-md flex flex-col md:flex-row gap-4 items-start md:items-center justify-between ${
        isDark 
          ? "border-slate-800/60 bg-slate-950/40" 
          : "border-slate-200 bg-slate-50 shadow-xs"
      }`}>
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            isDark ? "bg-cyan-500/10 text-cyan-400" : "bg-cyan-50 text-[#0073aa]"
          }`}>
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h6 className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-250" : "text-slate-900"}`}>
              EXECUTIVE BOARD PRIVACY PROTOCOL
            </h6>
            <p className={`text-[11px] leading-relaxed max-w-2xl font-sans ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Standing assemblies and technical division staff registries are updated and managed securely under Nepalese foreign staffing transparency laws. Any modification is subject to audit logs.
            </p>
          </div>
        </div>
        <div className={`text-[11px] font-mono shrink-0 ${isDark ? "text-cyan-400" : "text-[#0073aa]"}`}>
          Licensed Officers Verification
        </div>
      </div>

    </div>
  );
}
