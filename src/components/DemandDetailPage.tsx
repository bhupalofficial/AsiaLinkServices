import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowLeft, Briefcase, MapPin, Calendar, DollarSign, Clock, 
  Award, FileCheck, Check, Upload, Image, HelpCircle, Phone, 
  Mail, User, Globe, GraduationCap, ShieldAlert, BookOpen
} from "lucide-react";
import { Vacancy, AppTheme } from "../types";

interface DemandDetailPageProps {
  vacancy: Vacancy;
  isDark: boolean;
  theme: AppTheme;
  onBack: () => void;
}

export default function DemandDetailPage({ vacancy, isDark, theme, onBack }: DemandDetailPageProps) {
  const [form, setForm] = useState({
    fullName: "",
    contactNo: "",
    email: "",
    permanentAddress: "",
    temporaryAddress: "",
    passportNo: "",
    dateOfBirth: "",
    academicQualification: "",
    experience: "",
    selfDeclaration: false,
    termsAndConditionsAccepted: false,
    selectedJobTitle: ""
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [passport, setPassport] = useState<File | null>(null);
  const [cv, setCv] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!form.contactNo.trim()) newErrors.contactNo = "Contact number is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!form.permanentAddress.trim()) newErrors.permanentAddress = "Permanent address is required";
    if (!form.temporaryAddress.trim()) newErrors.temporaryAddress = "Temporary address is required";
    if (!form.passportNo.trim()) newErrors.passportNo = "Passport number is required";
    
    if (!form.dateOfBirth) {
      newErrors.dateOfBirth = "Date of Birth is required";
    } else {
      try {
        const dobDate = new Date(form.dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - dobDate.getFullYear();
        const m = today.getMonth() - dobDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
          age--;
        }
        
        if (vacancy.ageMin !== undefined && age < vacancy.ageMin) {
          newErrors.dateOfBirth = `Out of limit: Candidate age must be at least ${vacancy.ageMin} years old (calculated current age: ${age}).`;
        }
        if (vacancy.ageMax !== undefined && age > vacancy.ageMax) {
          newErrors.dateOfBirth = `Out of limit: Candidate age cannot exceed ${vacancy.ageMax} years old (calculated current age: ${age}).`;
        }
      } catch (e) {
        newErrors.dateOfBirth = "Invalid Date of Birth format";
      }
    }

    if (!form.academicQualification.trim()) newErrors.academicQualification = "Academic Qualification is required";
    if (!form.experience.trim()) newErrors.experience = "Work Experience detail is required";
    
    if (!form.selectedJobTitle) {
      newErrors.selectedJobTitle = "Job Title selection is required";
    }

    // Attachments are now fully optional in accordance with guidelines!

    if (!form.selfDeclaration) newErrors.selfDeclaration = "You must accept the self declaration statement";
    if (!form.termsAndConditionsAccepted) newErrors.termsAndConditionsAccepted = "You must agree to the Terms and Conditions of this placement";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // Convert attachments to base64 encoding
      const photoBase64 = photo ? await fileToBase64(photo) : "";
      const passportBase64 = passport ? await fileToBase64(passport) : "";
      const cvBase64 = cv ? await fileToBase64(cv) : "";

      const res = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.contactNo,
          permanentAddress: form.permanentAddress,
          temporaryAddress: form.temporaryAddress,
          passportNo: form.passportNo,
          dateOfBirth: form.dateOfBirth,
          academicQualification: form.academicQualification,
          experience: form.experience,
          selectedJobTitle: form.selectedJobTitle,
          photoBase64,
          photoName: photo ? photo.name : "",
          passportBase64,
          passportName: passport ? passport.name : "",
          cvBase64,
          cvName: cv ? cv.name : ""
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsSuccess(true);
        setForm({
          fullName: "",
          contactNo: "",
          email: "",
          permanentAddress: "",
          temporaryAddress: "",
          passportNo: "",
          dateOfBirth: "",
          academicQualification: "",
          experience: "",
          selfDeclaration: false,
          termsAndConditionsAccepted: false,
          selectedJobTitle: ""
        });
        setPhoto(null);
        setPassport(null);
        setCv(null);
      } else {
        setErrors(prev => ({ ...prev, submit: data.error || "Failed to submit recruitment files. Please try again." }));
      }
    } catch (err: any) {
      setErrors(prev => ({ ...prev, submit: `Database connection failure: ${err.message}` }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="space-y-10 max-w-7xl mx-auto"
    >
      {/* Back navigation header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 border-slate-500/10 shrink-0">
        <button
          onClick={onBack}
          className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all active:scale-95 cursor-pointer max-w-fit ${
            isDark 
              ? "border-slate-800 text-slate-300 hover:bg-slate-900 hover:text-white" 
              : "border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <ArrowLeft className="w-4 h-4 text-cyan-500" />
          <span>Back to All Careers</span>
        </button>

        <span className={`text-xs md:text-sm font-mono tracking-wider font-extrabold px-4 py-2 rounded-xl border shrink-0 ${
          isDark ? "bg-slate-900/60 border-slate-800 text-slate-350" : "bg-slate-50 border-slate-200 text-slate-700"
        }`}>
          LT. No.: {vacancy.recruitmentQuotaCode || "Approved"}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: DEMAND SPECIFICATIONS & DEMAND LETTER PREVIEW (7 columns) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Header Specs Card */}
          <div className={`p-6 md:p-8 rounded-3xl border relative overflow-hidden shadow-xl ${theme.cardBg}`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-black uppercase text-cyan-500 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/15">
                  Verified Employment Vacancy
                </span>
                <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded border ${
                  isDark ? "bg-slate-900 text-amber-400 border-slate-800" : "bg-amber-50 text-amber-700 border-amber-200"
                }`}>
                  {vacancy.location} Target
                </span>
              </div>

              <div className="space-y-1">
                <h1 className={`text-2xl md:text-3xl font-black tracking-tight leading-tight ${isDark ? "text-white" : "text-slate-950"}`}>
                  {vacancy.title}
                </h1>
                <p className={`text-sm font-bold ${isDark ? "text-slate-350" : "text-slate-600"}`}>
                  Employer: {vacancy.companyName}
                </p>
              </div>

              {/* Grid of Key Numbers */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                <div className={`p-3 rounded-2xl border ${isDark ? "bg-slate-950/40 border-slate-900/60" : "bg-slate-50 border-slate-200/60"}`}>
                  <span className={`text-[9px] uppercase font-bold block ${isDark ? "text-slate-500" : "text-slate-450"}`}>Sourcing Target</span>
                  <span className={`text-xs font-black mt-1 block ${isDark ? "text-white" : "text-slate-800"}`}>
                    {(() => {
                      const parts = [];
                      if (vacancy.positionsMale && vacancy.positionsMale > 0) parts.push(`${vacancy.positionsMale} Male`);
                      if (vacancy.positionsFemale && vacancy.positionsFemale > 0) parts.push(`${vacancy.positionsFemale} Female`);
                      return parts.length > 0 ? parts.join(" / ") : `${Number(vacancy.positionsMale || 0) + Number(vacancy.positionsFemale || 0)} Seats`;
                    })()}
                  </span>
                </div>
                <div className={`p-3 rounded-2xl border ${isDark ? "bg-slate-950/40 border-slate-900/60" : "bg-slate-50 border-slate-200/60"}`}>
                  <span className={`text-[9px] uppercase font-bold block ${isDark ? "text-slate-500" : "text-slate-450"}`}>Monthly Salary</span>
                  <span className={`text-xs font-black mt-1 block text-amber-500`}>
                    {vacancy.salary}
                  </span>
                </div>
                <div className={`p-3 rounded-2xl border col-span-2 md:col-span-1 ${isDark ? "bg-slate-950/40 border-slate-900/60" : "bg-slate-50 border-slate-200/60"}`}>
                  <span className={`text-[9px] uppercase font-bold block ${isDark ? "text-slate-500" : "text-slate-450"}`}>Contract Validity</span>
                  <span className={`text-xs font-black mt-1 block ${isDark ? "text-white" : "text-slate-800"}`}>
                    {vacancy.duration}
                  </span>
                </div>
              </div>

              {/* Recruitment Schemes */}
              <div className={`border-t pt-4 space-y-3.5 text-xs ${isDark ? "border-slate-900 text-slate-400" : "border-slate-100 text-slate-600"}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-500 shrink-0" />
                    <div>
                      <span className="font-bold block">Weekly Duty Scheme</span>
                      <span className="text-[11px] text-slate-450">{vacancy.workingHours}/day, {vacancy.workingDays} days/week</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-cyan-500 shrink-0" />
                    <div>
                      <span className="font-bold block">Food & Allowance</span>
                      <span className="text-[11px] text-slate-450">{vacancy.foodAllowance}</span>
                    </div>
                  </div>
                  {(vacancy.ageMin !== undefined || vacancy.ageMax !== undefined) && (
                    <div className="flex items-center gap-2 md:col-span-2 border-t border-dashed border-slate-500/10 pt-2 mt-1">
                      <User className="w-4 h-4 text-cyan-500 shrink-0" />
                      <div>
                        <span className="font-bold block text-slate-450 text-[10px] uppercase tracking-wider">Age limit Compliance</span>
                        <span className="text-[11px] font-semibold text-cyan-500">
                          {vacancy.ageMin !== undefined && vacancy.ageMax !== undefined
                            ? `Must be between ${vacancy.ageMin} and ${vacancy.ageMax} years old`
                            : vacancy.ageMin !== undefined
                              ? `Must be at least ${vacancy.ageMin} years old`
                              : `Must not exceed ${vacancy.ageMax} years old`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2 border-t border-dashed border-slate-500/10 pt-3.5">
                  <span className="font-bold block text-slate-450 text-[10px] uppercase tracking-wider">Required Compliance Files</span>
                  <div className="flex flex-wrap gap-2">
                    {(vacancy.requiredDocuments || ["Passport", "Bio Profile", "Educational Testimonials", "Exp Certificate"]).map((doc, idx) => (
                      <span key={idx} className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 border ${
                        isDark ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-205 text-slate-700"
                      }`}>
                        <FileCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span>{doc}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* JOB POSITIONS & SALARY MATRIX CARD */}
          {vacancy.subJobs && vacancy.subJobs.length > 0 && (
            <div className={`p-6 rounded-3xl border space-y-4 shadow-xl ${theme.cardBg}`}>
              <div className="flex items-center gap-2.5 border-b pb-3 border-slate-500/10">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-500">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className={`text-xs font-black tracking-tight uppercase ${isDark ? "text-white" : "text-slate-900"}`}>
                    Job Positions &amp; Salary Matrix
                  </h3>
                  <p className="text-[9px] text-slate-450">Specific job titles and approved recruitment quotas in this demand</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b border-slate-500/10 text-[10px] font-mono uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      <th className="py-2.5 font-bold">Job Title</th>
                      <th className="py-2.5 font-bold text-center">Required (Male/Female)</th>
                      <th className="py-2.5 font-bold text-right">Salary Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-500/5 text-xs">
                    {vacancy.subJobs.map((sub) => (
                      <tr key={sub.id} className={isDark ? "text-slate-300" : "text-slate-700"}>
                        <td className="py-3 font-bold text-cyan-500">{sub.jobTitle}</td>
                        <td className="py-3 text-center font-mono">
                          {(() => {
                            const parts = [];
                            if (sub.positionsMale && sub.positionsMale > 0) parts.push(`${sub.positionsMale} M`);
                            if (sub.positionsFemale && sub.positionsFemale > 0) parts.push(`${sub.positionsFemale} F`);
                            return parts.length > 0 ? parts.join(" / ") : `${Number(sub.positionsMale || 0) + Number(sub.positionsFemale || 0)} Seats`;
                          })()}
                        </td>
                        <td className="py-3 text-right font-black text-amber-500">{sub.salary}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CONTRACTUAL TERMS & CONDITIONS CARD */}
          <div className={`p-6 rounded-3xl border space-y-4 shadow-xl ${theme.cardBg}`}>
            <div className="flex items-center gap-2.5 border-b pb-3 border-slate-500/10">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className={`text-xs font-black tracking-tight uppercase ${isDark ? "text-white" : "text-slate-900"}`}>
                  Contractual Terms & Conditions
                </h3>
                <p className="text-[9px] text-slate-450">Official recruitment contract terms and legal compliance clauses</p>
              </div>
            </div>

            {vacancy.termsAndConditions ? (
              <div className={`text-xs leading-relaxed whitespace-pre-line ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                {vacancy.termsAndConditions}
              </div>
            ) : (
              <div className="space-y-3.5 text-xs">
                <p className={`italic ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Standard labor contract terms apply under Nepal Ministry of Labor guidelines:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className={isDark ? "text-slate-350" : "text-slate-600"}>
                      <strong>Contract Validity:</strong> Initial duration of 2 Years, renewable under mutual agreement.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className={isDark ? "text-slate-350" : "text-slate-600"}>
                      <strong>Air Passages:</strong> One-way joining air ticket provided; return ticket provided on successful completion of contract term.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className={isDark ? "text-slate-350" : "text-slate-600"}>
                      <strong>Standard Welfare:</strong> Safe accommodation, transport facilities, medical coverage, and insurance provided by the employer brand.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className={isDark ? "text-slate-350" : "text-slate-600"}>
                      <strong>Recruitment Standards:</strong> Code-compliant ethical sourcing under Nepal Foreign Employment Sourcing Act regulations.
                    </span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* AUTO-PREVIEW DEMAND LETTER ATTACHMENT CARD */}
          <div className={`p-6 rounded-3xl border space-y-4 shadow-xl ${theme.cardBg}`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-500/10">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-500">
                  <Image className="w-4 h-4" />
                </div>
                <div>
                  <h3 className={`text-xs font-black tracking-tight uppercase ${isDark ? "text-white" : "text-slate-900"}`}>
                    Physical Demand Attachment
                  </h3>
                  <p className="text-[9px] text-slate-400">Nepal Ministry of Labor authorized circular preview</p>
                </div>
              </div>
              {vacancy.demandLetterUrl && (
                <a 
                  href={vacancy.demandLetterUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[9px] font-bold text-cyan-500 hover:underline flex items-center gap-1"
                >
                  <Globe className="w-3 h-3" />
                  <span>Open Original File</span>
                </a>
              )}
            </div>

            {vacancy.demandLetterUrl ? (
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden border border-slate-500/10 bg-slate-950/40 p-2 flex items-center justify-center shadow-inner group">
                  <img 
                    referrerPolicy="no-referrer"
                    src={vacancy.demandLetterUrl} 
                    alt="Authorized Demand letter" 
                    className="w-full h-auto max-h-[480px] object-contain rounded-xl transition-transform duration-300 group-hover:scale-[1.01]"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 to-transparent p-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-mono text-white/80 bg-slate-905/90 px-3 py-1 rounded-full backdrop-blur-md">
                      Interactive Visual Document Guard
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 italic text-center">
                  * High-contrast visual scan of government approved quota certificate. Inspect detail requirements above.
                </p>
              </div>
            ) : (
              <div className={`py-12 border-2 border-dashed rounded-2xl text-center space-y-2.5 ${
                isDark ? "border-slate-800 bg-slate-900/10" : "border-slate-205 bg-slate-50/50"
              }`}>
                <ShieldAlert className="w-8 h-8 text-amber-500 mx-auto animate-bounce" />
                <div>
                  <p className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    Physical demand letter image not attached.
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Quota approval code verified digitally under Nepal Government regulations.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: DETAILED CANDIDATE REGISTRATION FORM (5 columns) */}
        <div className="lg:col-span-5" id="apply-form-container">
          <div className={`p-6 md:p-8 rounded-3xl border relative shadow-xl space-y-6 ${theme.cardBg}`}>
            <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>

            {isSuccess ? (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center space-y-5 py-8"
              >
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                  <Check className="w-8 h-8 animate-bounce" />
                </div>
                <div className="space-y-2">
                  <h3 className={`text-xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                    Application Submitted!
                  </h3>
                  <p className={`text-xs leading-relaxed max-w-sm mx-auto ${isDark ? "text-slate-350" : "text-slate-600"}`}>
                    Your comprehensive profile for <strong>{vacancy.title}</strong> has been stored in our sourcing index registry. Asia Link Services recruiting directors will contact you immediately via phone or email for interview routing.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSuccess(false)}
                  className="px-5 py-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors cursor-pointer w-full"
                >
                  Submit Another Application
                </button>
              </motion.div>
            ) : (
              <>
                <div className="border-b pb-4 border-slate-500/10">
                  <span className="text-[9px] font-mono font-black uppercase text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Direct Application Registry
                  </span>
                  <h2 className={`text-lg font-black tracking-tight mt-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                    Submit Candidate Profile
                  </h2>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Fill the comprehensive form below to index your documents for physical selection.
                  </p>
                </div>

                {errors.submit && (
                  <div className="p-3 bg-red-950/25 border border-red-500/20 rounded-xl text-red-400 text-xs font-semibold text-center">
                    {errors.submit}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Applying Job Title Dropdown Selection */}
              <div className="space-y-1">
                <label className={`text-[10px] font-mono tracking-wider uppercase block ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                  Applying Job Title *
                </label>
                <div className="relative">
                  <select
                    required
                    value={form.selectedJobTitle}
                    onChange={(e) => setForm({ ...form, selectedJobTitle: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs outline-none focus:ring-1 transition-all appearance-none cursor-pointer ${
                      isDark 
                        ? "bg-slate-900 border-slate-850 text-white focus:border-cyan-400 focus:ring-cyan-400/30" 
                        : "bg-white border-slate-205 text-slate-900 focus:border-[#0073aa] focus:ring-[#0073aa]/20"
                    }`}
                  >
                    <option value="">-- Select Applying Position --</option>
                    {vacancy.subJobs && vacancy.subJobs.length > 0 ? (
                      vacancy.subJobs.map((sub) => (
                        <option key={sub.id} value={sub.jobTitle}>
                          {sub.jobTitle} (Salary: {sub.salary})
                        </option>
                      ))
                    ) : (
                      <option value={vacancy.title}>{vacancy.title}</option>
                    )}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
                {errors.selectedJobTitle && <p className="text-[10px] text-red-500 font-bold">{errors.selectedJobTitle}</p>}
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className={`text-[10px] font-mono tracking-wider uppercase block ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your official full name"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs outline-none focus:ring-1 transition-all ${
                      isDark 
                        ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-cyan-400/30" 
                        : "bg-white border-slate-205 text-slate-900 placeholder-slate-450 focus:border-[#0073aa] focus:ring-[#0073aa]/20"
                    }`}
                  />
                </div>
                {errors.fullName && <p className="text-[10px] text-red-500 font-bold">{errors.fullName}</p>}
              </div>

              {/* Contact No & Email Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={`text-[10px] font-mono tracking-wider uppercase block ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                    Contact No *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +977 98XXXXXXX"
                      value={form.contactNo}
                      onChange={(e) => setForm({ ...form, contactNo: e.target.value })}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs outline-none focus:ring-1 transition-all ${
                        isDark 
                          ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-cyan-400/30" 
                          : "bg-white border-slate-205 text-slate-900 placeholder-slate-450 focus:border-[#0073aa] focus:ring-[#0073aa]/20"
                      }`}
                    />
                  </div>
                  {errors.contactNo && <p className="text-[10px] text-red-500 font-bold">{errors.contactNo}</p>}
                </div>

                <div className="space-y-1">
                  <label className={`text-[10px] font-mono tracking-wider uppercase block ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. candidate@domain.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs outline-none focus:ring-1 transition-all ${
                        isDark 
                          ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-cyan-400/30" 
                          : "bg-white border-slate-205 text-slate-900 placeholder-slate-450 focus:border-[#0073aa] focus:ring-[#0073aa]/20"
                      }`}
                    />
                  </div>
                  {errors.email && <p className="text-[10px] text-red-500 font-bold">{errors.email}</p>}
                </div>
              </div>

              {/* Passport No & Date of Birth */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={`text-[10px] font-mono tracking-wider uppercase block ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                    Passport No *
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Enter Passport ID"
                      value={form.passportNo}
                      onChange={(e) => setForm({ ...form, passportNo: e.target.value })}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs outline-none focus:ring-1 transition-all ${
                        isDark 
                          ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-cyan-400/30" 
                          : "bg-white border-slate-205 text-slate-900 placeholder-slate-450 focus:border-[#0073aa] focus:ring-[#0073aa]/20"
                      }`}
                    />
                  </div>
                  {errors.passportNo && <p className="text-[10px] text-red-500 font-bold">{errors.passportNo}</p>}
                </div>

                <div className="space-y-1">
                  <label className={`text-[10px] font-mono tracking-wider uppercase block ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.dateOfBirth}
                    onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs outline-none focus:ring-1 transition-all ${
                      isDark 
                        ? "bg-slate-900 border-slate-800 text-white focus:border-cyan-400 focus:ring-cyan-400/30" 
                        : "bg-white border-slate-205 text-slate-900 focus:border-[#0073aa] focus:ring-[#0073aa]/20"
                    }`}
                  />
                  {errors.dateOfBirth && <p className="text-[10px] text-red-500 font-bold">{errors.dateOfBirth}</p>}
                </div>
              </div>

              {/* Permanent Address */}
              <div className="space-y-1">
                <label className={`text-[10px] font-mono tracking-wider uppercase block ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                  Permanent Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Official address on citizenship certificate"
                  value={form.permanentAddress}
                  onChange={(e) => setForm({ ...form, permanentAddress: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs outline-none focus:ring-1 transition-all ${
                    isDark 
                      ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-cyan-400/30" 
                      : "bg-white border-slate-205 text-slate-900 placeholder-slate-450 focus:border-[#0073aa] focus:ring-[#0073aa]/20"
                  }`}
                />
                {errors.permanentAddress && <p className="text-[10px] text-red-500 font-bold">{errors.permanentAddress}</p>}
              </div>

              {/* Temporary Address */}
              <div className="space-y-1">
                <label className={`text-[10px] font-mono tracking-wider uppercase block ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                  Temporary Address (Current Residence) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Current city / apartment address"
                  value={form.temporaryAddress}
                  onChange={(e) => setForm({ ...form, temporaryAddress: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs outline-none focus:ring-1 transition-all ${
                    isDark 
                      ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-cyan-400/30" 
                      : "bg-white border-slate-205 text-slate-900 placeholder-slate-450 focus:border-[#0073aa] focus:ring-[#0073aa]/20"
                  }`}
                />
                {errors.temporaryAddress && <p className="text-[10px] text-red-500 font-bold">{errors.temporaryAddress}</p>}
              </div>

              {/* Academic Qualification */}
              <div className="space-y-1">
                <label className={`text-[10px] font-mono tracking-wider uppercase block ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                  Academic Qualification *
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. SLC / +2 Graduate / Bachelor / Diploma"
                    value={form.academicQualification}
                    onChange={(e) => setForm({ ...form, academicQualification: e.target.value })}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs outline-none focus:ring-1 transition-all ${
                      isDark 
                        ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-cyan-400/30" 
                        : "bg-white border-slate-205 text-slate-900 placeholder-slate-450 focus:border-[#0073aa] focus:ring-[#0073aa]/20"
                    }`}
                  />
                </div>
                {errors.academicQualification && <p className="text-[10px] text-red-500 font-bold">{errors.academicQualification}</p>}
              </div>

              {/* Work Experience */}
              <div className="space-y-1">
                <label className={`text-[10px] font-mono tracking-wider uppercase block ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                  Work Experience (Years & Scope) *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Summarize your past experience or list previous employer companies"
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  className={`w-full p-3.5 rounded-xl border text-xs outline-none focus:ring-1 transition-all resize-none ${
                    isDark 
                      ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-cyan-400/30" 
                      : "bg-white border-slate-205 text-slate-900 placeholder-slate-450 focus:border-[#0073aa] focus:ring-[#0073aa]/20"
                  }`}
                />
                {errors.experience && <p className="text-[10px] text-red-500 font-bold">{errors.experience}</p>}
              </div>

              {/* Document Upload Section */}
              <div className="border-t border-dashed border-slate-500/10 pt-4 space-y-4">
                <h3 className={`text-xs font-black uppercase tracking-wider ${isDark ? "text-slate-305" : "text-slate-800"}`}>
                  Application Attachments (Optional)
                </h3>
                
                <FileUploadField
                  label="1. Passport-sized Photo"
                  accept="image/*,application/pdf"
                  file={photo}
                  onChange={setPhoto}
                  error={errors.photo}
                  isDark={isDark}
                  placeholderText="JPG, PNG, or PDF (Max 5MB)"
                />

                <FileUploadField
                  label="2. Passport Copy"
                  accept="image/*,application/pdf"
                  file={passport}
                  onChange={setPassport}
                  error={errors.passport}
                  isDark={isDark}
                  placeholderText="Scan copy of passport main pages (JPG, PNG, PDF)"
                />

                <FileUploadField
                  label="3. Resume / CV Copy"
                  accept="image/*,application/pdf"
                  file={cv}
                  onChange={setCv}
                  error={errors.cv}
                  isDark={isDark}
                  placeholderText="Latest detailed curriculum vitae (JPG, PNG, PDF)"
                />
              </div>

               {/* Self Declaration Checkbox */}
              <div className="pt-2 space-y-3">
                <div>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.selfDeclaration}
                      onChange={(e) => setForm({ ...form, selfDeclaration: e.target.checked })}
                      className="mt-0.5 rounded border-slate-300 text-cyan-500 focus:ring-cyan-400 cursor-pointer"
                    />
                    <span className={`text-[10px] leading-relaxed select-none ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      <strong>Self Declaration:</strong> I hereby certify and declare that all details and documents supplied in this application form are absolutely correct, complete, and authentic in accordance with Nepal foreign employment acts.
                    </span>
                  </label>
                  {errors.selfDeclaration && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.selfDeclaration}</p>}
                </div>

                <div>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.termsAndConditionsAccepted}
                      onChange={(e) => setForm({ ...form, termsAndConditionsAccepted: e.target.checked })}
                      className="mt-0.5 rounded border-slate-300 text-cyan-500 focus:ring-cyan-400 cursor-pointer"
                    />
                    <span className={`text-[10px] leading-relaxed select-none ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      <strong>Terms &amp; Conditions:</strong> I have read and agree to all the contractual terms, conditions, duty timings, salary parameters, and food/welfare allowances stated for this specific foreign placement vacancy.
                    </span>
                  </label>
                  {errors.termsAndConditionsAccepted && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.termsAndConditionsAccepted}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 mt-2 rounded-xl bg-[#0073aa] hover:bg-[#006292] text-white text-xs font-black tracking-wide transition-all duration-300 transform active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Indexing Your Credentials...</span>
                  </>
                ) : (
                  <>
                    <FileCheck className="w-4 h-4" />
                    <span>Submit Verified Application</span>
                  </>
                )}
              </button>

            </form>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface FileUploadFieldProps {
  label: string;
  accept: string;
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  isDark: boolean;
  placeholderText: string;
}

function FileUploadField({ label, accept, file, onChange, error, isDark, placeholderText }: FileUploadFieldProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const isImg = droppedFile.type.startsWith("image/");
      const isPdf = droppedFile.type === "application/pdf";
      if (isImg || isPdf) {
        onChange(droppedFile);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0]);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-1.5">
      <label className={`text-[10px] font-mono tracking-wider uppercase block ${isDark ? "text-slate-400" : "text-slate-700"}`}>
        {label} *
      </label>
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all relative ${
          file 
            ? isDark 
              ? "border-emerald-500/40 bg-emerald-950/10" 
              : "border-emerald-500/40 bg-emerald-50/20"
            : isDragging
              ? isDark
                ? "border-cyan-400 bg-cyan-950/20 scale-[1.01]"
                : "border-[#0073aa] bg-[#0073aa]/5 scale-[1.01]"
              : isDark
                ? "border-slate-800 hover:border-slate-700 bg-slate-900/30 hover:bg-slate-900/50"
                : "border-slate-205 hover:border-slate-305 bg-slate-50/30 hover:bg-slate-50/60"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept={accept}
          className="hidden"
        />

        {file ? (
          <div className="flex items-center justify-between gap-3 text-left" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className={`text-xs font-bold truncate ${isDark ? "text-white" : "text-slate-800"}`}>
                  {file.name}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type.split("/")[1]?.toUpperCase() || "FILE"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={clearFile}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer shrink-0 ${
                isDark 
                  ? "border-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-900" 
                  : "border-slate-205 text-slate-205 hover:text-red-600 hover:bg-slate-100"
              }`}
              title="Remove File"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="py-2.5 space-y-2">
            <Upload className={`w-6 h-6 mx-auto transition-transform ${isDragging ? "translate-y-[-2px]" : ""} ${isDark ? "text-slate-500" : "text-slate-400"}`} />
            <div className="space-y-0.5">
              <p className={`text-xs font-bold ${isDark ? "text-slate-350" : "text-slate-700"}`}>
                Drag & drop or <span className="text-cyan-500 hover:underline">browse</span>
              </p>
              <p className="text-[10px] text-slate-400">{placeholderText}</p>
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-[10px] text-red-500 font-bold">{error}</p>}
    </div>
  );
}
