import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, Phone, Mail, Info, Users, Briefcase, 
  MapPin, Landmark, ArrowRight, Shield, Award, CheckCircle2, 
  FileCheck, HelpCircle, MessageSquare, Menu, X, Sparkles, 
  Lock, BookOpen, UserCheck, PlaneTakeoff, Heart, Globe, Upload,
  Sun, Moon, ArrowUp, ChevronDown, Search, Image, Eye, Calendar, Check
} from "lucide-react";

// Types & Defaults
import { CMSData, AppTheme, Vacancy, INITIAL_CMS_DATA, PRESET_THEMES } from "./types";

// Components
import HeroSection from "./components/HeroSection";
import CategoriesView from "./components/CategoriesView";
import OrgChart from "./components/OrgChart";
import CompanyProfileView from "./components/CompanyProfileView";
import ContactView from "./components/ContactView";
import NoticesView from "./components/NoticesView";
import { WhyPartnerWithUs } from "./components/WhyPartnerWithUs";
import { ServicesView } from "./components/ServicesView";
import AdminPanel from "./components/AdminPanel";
import DemandDetailPage from "./components/DemandDetailPage";

// @ts-ignore
import logoUrl from "./assets/images/ASIA LINK LOGO PNG.png";

export const generateSlug = (text: string | undefined | null): string => {
  if (!text || typeof text !== "string") return "";
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

// Number increasing animation component for stats
function AnimatedCounter({ value, highlightColor }: { value: string; highlightColor: string }) {
  const [count, setCount] = useState(0);
  const elementRef = React.useRef<HTMLSpanElement>(null);

  const numericPart = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
  const suffix = value.replace(/[0-9]/g, "");

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let animationStarted = false;

    const startCounter = () => {
      if (animationStarted) return;
      animationStarted = true;

      const duration = 1500; // 1.5 seconds
      const steps = 50;
      const stepTime = duration / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOutQuad = progress * (2 - progress);
        const nextValue = Math.floor(easeOutQuad * numericPart);

        if (currentStep >= steps) {
          setCount(numericPart);
          clearInterval(timer);
        } else {
          setCount(nextValue);
        }
      }, stepTime);
    };

    if (elementRef.current && typeof window.IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            startCounter();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(elementRef.current);
    } else {
      startCounter();
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [numericPart]);

  return (
    <span ref={elementRef} className={`text-2xl md:text-3.5xl font-black block tracking-tight ${highlightColor}`}>
      {count}
      {suffix}
    </span>
  );
}

export default function App() {
  // Load dynamic CMS state from backend and initial template as fallback
  const [cmsData, setCmsData] = useState<CMSData>(INITIAL_CMS_DATA);

  // Current active theme selection - locked to light mode
  const [currentThemeId, setCurrentThemeId] = useState<string>("light");

  // activePage routing state: 'home' | 'about' | 'mission' | 'chairman' | 'team' | 'legal'
  const [activePage, setActivePage] = useState<string>("home");

  // Scroll to Top float button visibility state
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Fetch CMS data on mount and poll for real-time updates every 5 seconds (paused on admin panel to prevent form resets)
  useEffect(() => {
    let isMounted = true;
    const fetchCmsData = async () => {
      try {
        const response = await fetch("/api/cms");
        if (response.ok) {
          const data = await response.json();
          if (isMounted && data && typeof data === "object") {
            setCmsData({
              ...INITIAL_CMS_DATA,
              ...data,
              contactInfo: {
                ...INITIAL_CMS_DATA.contactInfo,
                ...(data.contactInfo || {})
              },
              companyMeta: {
                ...INITIAL_CMS_DATA.companyMeta,
                ...(data.companyMeta || {})
              },
              chairmanMessage: {
                ...INITIAL_CMS_DATA.chairmanMessage,
                ...(data.chairmanMessage || {})
              },
              aboutNepal: {
                ...INITIAL_CMS_DATA.aboutNepal,
                ...(data.aboutNepal || {})
              },
              quotes: {
                ...INITIAL_CMS_DATA.quotes,
                ...(data.quotes || {})
              },
              guidingValues: Array.isArray(data.guidingValues) && data.guidingValues.length > 0 ? data.guidingValues : INITIAL_CMS_DATA.guidingValues,
              codeOfEthics: Array.isArray(data.codeOfEthics) && data.codeOfEthics.length > 0 ? data.codeOfEthics : INITIAL_CMS_DATA.codeOfEthics,
              codeOfConduct: Array.isArray(data.codeOfConduct) && data.codeOfConduct.length > 0 ? data.codeOfConduct : INITIAL_CMS_DATA.codeOfConduct,
              provinces: Array.isArray(data.provinces) && data.provinces.length > 0 ? data.provinces : INITIAL_CMS_DATA.provinces,
              categoryGroups: Array.isArray(data.categoryGroups) && data.categoryGroups.length > 0 ? data.categoryGroups : INITIAL_CMS_DATA.categoryGroups,
              documentsRequired: Array.isArray(data.documentsRequired) && data.documentsRequired.length > 0 ? data.documentsRequired : INITIAL_CMS_DATA.documentsRequired,
              selectionSteps: Array.isArray(data.selectionSteps) && data.selectionSteps.length > 0 ? data.selectionSteps : INITIAL_CMS_DATA.selectionSteps,
              notices: Array.isArray(data.notices) && data.notices.length > 0 ? data.notices : INITIAL_CMS_DATA.notices,
              vacancies: Array.isArray(data.vacancies) && data.vacancies.length > 0 ? data.vacancies : INITIAL_CMS_DATA.vacancies,
              teamMembers: Array.isArray(data.teamMembers) && data.teamMembers.length > 0 ? data.teamMembers : INITIAL_CMS_DATA.teamMembers,
              clients: Array.isArray(data.clients) && data.clients.length > 0 ? data.clients : INITIAL_CMS_DATA.clients,
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch CMS data from backend:", err);
      }
    };

    fetchCmsData();

    // Set up real-time polling (only if NOT on the admin panel page)
    let intervalId: any;
    if (activePage !== "admin") {
      intervalId = setInterval(fetchCmsData, 5000);
    }

    return () => {
      isMounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [activePage]);



  // Escape and shortcut key global listener for Search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setGlobalSearchQuery("");
      }
      // Ctrl+K or Cmd+K to toggle global search
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const activeTheme = PRESET_THEMES.find((t) => t.id === currentThemeId) || PRESET_THEMES[0];
  const isDark = currentThemeId === "dark";

  // Mobile menu toggler
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Global search modal and text query states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");

  // Quick interactive application form modal
  const [selectedVacancyForApply, setSelectedVacancyForApply] = useState<Vacancy | null>(null);
  const [selectedDemandDetail, setSelectedDemandDetail] = useState<Vacancy | null>(null);
  const [previewDemandLetter, setPreviewDemandLetter] = useState<Vacancy | null>(null);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isCsrOpen, setIsCsrOpen] = useState(false);
  const [selectedNoticeDetail, setSelectedNoticeDetail] = useState<any | null>(null);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [applicationError, setApplicationError] = useState("");
  const [showAllCareers, setShowAllCareers] = useState(false);
  const [showAllNotices, setShowAllNotices] = useState(false);
  const [careerSearchText, setCareerSearchText] = useState("");

  const lastRoutedHashRef = useRef<string>("");

  // Synchronize hash with page state for shareable permalinks
  useEffect(() => {
    const handleHashRouting = () => {
      const hash = window.location.hash || "";
      const cleanHash = hash.replace(/^#\/?/, ""); // e.g. "demand/heavy-truck-driver" or "about"
      
      const didHashChange = lastRoutedHashRef.current !== hash;
      lastRoutedHashRef.current = hash;
      
      if (!cleanHash || cleanHash === "home") {
        setActivePage("home");
        setSelectedDemandDetail(null);
        return;
      }
      
      if (cleanHash.startsWith("demand/")) {
        const slugOrId = cleanHash.substring("demand/".length);
        const found = cmsData.vacancies?.find(
          (vac) => generateSlug(vac.title) === slugOrId || vac.id === slugOrId
        );
        if (found) {
          setSelectedDemandDetail(found);
          setActivePage("demand-detail");
        } else {
          // If the page was just loaded, wait or fallback
          setActivePage("demands");
          setSelectedDemandDetail(null);
        }
        if (didHashChange) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }
      
      const validPages = [
        "about", "mission", "chairman", "team", "legal", 
        "demands", "notices", "services", "contact", "admin"
      ];
      
      if (validPages.includes(cleanHash)) {
        setActivePage(cleanHash);
        setSelectedDemandDetail(null);
        if (didHashChange) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }
      
      if (cleanHash === "sectors") {
        setActivePage("home");
        setSelectedDemandDetail(null);
        setTimeout(() => {
          const el = document.getElementById("sectors-section");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
        return;
      }
      
      if (cleanHash === "steps") {
        setActivePage("home");
        setSelectedDemandDetail(null);
        setTimeout(() => {
          const el = document.getElementById("selection-section");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
        return;
      }
      
      // Default fallback
      setActivePage("home");
      setSelectedDemandDetail(null);
    };

    window.addEventListener("hashchange", handleHashRouting);
    // Execute on initial mount and when vacancies list shifts
    handleHashRouting();

    return () => {
      window.removeEventListener("hashchange", handleHashRouting);
    };
  }, [cmsData.vacancies]);

  const filteredCareers = useMemo(() => {
    return cmsData.vacancies.filter((vac) => {
      if (!vac.active) return false;
      if (!careerSearchText) return true;
      const term = careerSearchText.toLowerCase();
      return (
        (vac.title && vac.title.toLowerCase().includes(term)) ||
        (vac.companyName && vac.companyName.toLowerCase().includes(term)) ||
        (vac.location && vac.location.toLowerCase().includes(term)) ||
        (vac.recruitmentQuotaCode && vac.recruitmentQuotaCode.toLowerCase().includes(term)) ||
        (vac.salary && vac.salary.toLowerCase().includes(term))
      );
    });
  }, [cmsData.vacancies, careerSearchText]);
  const [applicantForm, setApplicantForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    skills: "",
    experienceYears: "2",
    nepalHomeProvince: "Bagamati Province",
    message: ""
  });

  // File drag & drop resume attachment state
  const [uploadedResume, setUploadedResume] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  // Form handling functions
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedResume(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedResume(e.target.files[0]);
    }
  };

  const submitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplicationSubmitted(true);
    setApplicationError("");
    setApplicationSuccess(false);
    
    try {
      let cvBase64 = "";
      if (uploadedResume) {
        cvBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(uploadedResume);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (err) => reject(err);
        });
      }

      const res = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullName: applicantForm.fullName,
          email: applicantForm.email,
          phone: applicantForm.phone,
          permanentAddress: applicantForm.nepalHomeProvince,
          temporaryAddress: "",
          passportNo: "",
          dateOfBirth: "",
          academicQualification: applicantForm.skills,
          experience: `Years of experience: ${applicantForm.experienceYears}. Message: ${applicantForm.message || "None"}`,
          selectedJobTitle: selectedVacancyForApply ? selectedVacancyForApply.title : "General Sourcing Intake",
          cvBase64,
          cvName: uploadedResume ? uploadedResume.name : ""
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setApplicantForm({
          fullName: "",
          email: "",
          phone: "",
          skills: "",
          experienceYears: "2",
          nepalHomeProvince: "Bagamati Province",
          message: ""
        });
        setUploadedResume(null);
        setApplicationSuccess(true);
      } else {
        setApplicationError(data.error || "Failed to submit application. Please try again.");
      }
    } catch (err: any) {
      setApplicationError(`Network connection issue: ${err.message}`);
    } finally {
      setApplicationSubmitted(false);
    }
  };

  // Inline view scroll helper with direct cross-page support
  const scrollToView = (id: string) => {
    if (activePage !== "home") {
      setActivePage("home");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    setIsMobileMenuOpen(false);
  };

  // Dedicated page transition router with top-level reset
  const navigateToPage = (pageName: string, itemSlug?: string) => {
    setIsMobileMenuOpen(false);
    if (pageName === "sectors") {
      window.location.hash = "#/sectors";
      return;
    }
    if (pageName === "steps") {
      window.location.hash = "#/steps";
      return;
    }
    if (pageName === "demand-detail") {
      const slug = itemSlug || (selectedDemandDetail ? generateSlug(selectedDemandDetail.title) : "");
      if (slug) {
        window.location.hash = `#/demand/${slug}`;
      } else {
        window.location.hash = `#/demands`;
      }
      return;
    }
    if (pageName === "home") {
      window.location.hash = "#/";
      return;
    }
    window.location.hash = `#/${pageName}`;
  };

  // Dynamic notices list resolving from cmsData on the server
  const noticesList = useMemo(() => {
    return cmsData.notices || [];
  }, [cmsData.notices]);

  // Search over pages, occupational categories/specializations, active vacancies, notices, and team members
  const searchResults = useMemo(() => {
    if (!globalSearchQuery.trim()) return [];
    
    const query = globalSearchQuery.toLowerCase();
    const results: { type: "page" | "job" | "sector" | "notice" | "team"; title: string; subtitle: string; action: () => void }[] = [];

    // 1. Pages matching
    const sitePages = [
      { key: "home", title: "Home Portal", subtitle: "Main hub covering notice board, occupational specializations, selection modes, and global affiliates" },
      { key: "about", title: "About Us - Introduction", subtitle: "Asia Link's corporate introduction and creed" },
      { key: "services", title: "Services - Corporate Capabilities", subtitle: "Placement, pre-screening, diagnostic vetting, orientation and complete mobilization services for Nepalese recruitment" },
      { key: "mission", title: "About Us - Mission & Vision", subtitle: "Our core strategic values, corporate missions and long-term goals" },
      { key: "chairman", title: "About Us - Chairman's Message", subtitle: "Official corporate address and Nepalese orientation key statement" },
      { key: "team", title: "About Us - Executive Team & Structure", subtitle: "Corporate executive officers and operational division graph" },
      { key: "legal", title: "About Us - Company Profile", subtitle: "Official corporate profile document reader, regulatory permit credentials, standing capital indices" },
      { key: "demands", title: "Active Careers & Demand Letters", subtitle: "Live verified international employment vacancies and RBA compliance details" },
      { key: "contact", title: "Communications & Contact Channels", subtitle: "Interactive office coordinates, support email ticket Desk, corporate map" },
      { key: "notices", title: "Regulations & Notices Archive", subtitle: "Official compliance directives, regulatory definitions, ethical standards, and legal covenants" },
    ];

    sitePages.forEach((p) => {
      if (p.title.toLowerCase().includes(query) || p.subtitle.toLowerCase().includes(query)) {
        results.push({
          type: "page",
          title: p.title,
          subtitle: p.subtitle,
          action: () => {
            navigateToPage(p.key);
            setIsSearchOpen(false);
            setGlobalSearchQuery("");
          }
        });
      }
    });

    // 2. Active Job Vacancies
    if (cmsData.vacancies) {
      cmsData.vacancies.forEach((v) => {
        if (v.active && (v.title.toLowerCase().includes(query) || v.location.toLowerCase().includes(query) || v.companyName.toLowerCase().includes(query))) {
          results.push({
            type: "job",
            title: `${v.title} (${v.location})`,
            subtitle: `Employer: ${v.companyName} • Salary: ${v.salary} • Quota Code: ${v.recruitmentQuotaCode || 'Active License'}`,
            action: () => {
              navigateToPage("demand-detail", generateSlug(v.title));
              setIsSearchOpen(false);
              setGlobalSearchQuery("");
            }
          });
        }
      });
    }

    // 3. Category Groups and Specific Roles
    if (cmsData.categoryGroups) {
      cmsData.categoryGroups.forEach((grp) => {
        const matchesGroup = grp.title.toLowerCase().includes(query);
        const matchedRoles = grp.categories.filter(cat => cat.toLowerCase().includes(query));
        
        if (matchesGroup || matchedRoles.length > 0) {
          results.push({
            type: "sector",
            title: `Sector: ${grp.title}`,
            subtitle: `Vetted Roles: ${matchedRoles.length > 0 ? matchedRoles.slice(0, 3).join(", ") : grp.categories.slice(0, 3).join(", ")}...`,
            action: () => {
              navigateToPage("home");
              setIsSearchOpen(false);
              setGlobalSearchQuery("");
              setTimeout(() => {
                scrollToView("sectors-section");
              }, 120);
            }
          });
        }
      });
    }

    // 4. Compliance Notices & Bulletins
    if (cmsData.notices) {
      cmsData.notices.forEach((n) => {
        if (n.title.toLowerCase().includes(query) || (n.description && n.description.toLowerCase().includes(query))) {
          results.push({
            type: "notice",
            title: `Notice: ${n.title}`,
            subtitle: `Published: ${n.date} • Category: ${n.category || "General"}`,
            action: () => {
              navigateToPage("notices");
              setIsSearchOpen(false);
              setGlobalSearchQuery("");
              setTimeout(() => {
                const element = document.getElementById("notices");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }, 120);
            }
          });
        }
      });
    }

    // 5. Executive Officers & Staff Profiles
    if (cmsData.teamMembers) {
      cmsData.teamMembers.forEach((t) => {
        if (t.name.toLowerCase().includes(query) || t.role.toLowerCase().includes(query)) {
          results.push({
            type: "team",
            title: `Team: ${t.name}`,
            subtitle: `${t.role} • Corporate Representative`,
            action: () => {
              navigateToPage("team");
              setIsSearchOpen(false);
              setGlobalSearchQuery("");
            }
          });
        }
      });
    }

    return results;
  }, [globalSearchQuery, cmsData, navigateToPage]);

  return (
    <div className={`min-h-screen ${activeTheme.bgColor} ${activeTheme.textColor} font-sans selection:bg-amber-500 selection:text-slate-900 overflow-x-clip transition-all duration-300`}>
      
      {/* Dynamic Background Glow representing modern clean luxury */}
      <div 
        className="fixed top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none transition-all duration-[4s]"
        style={{ backgroundColor: activeTheme.glowColor }}
      ></div>

      {/* Primary Brand Header (Frozen/fixed with premium solid dark theme - ALWAYS DARK THEME) */}
      {activePage !== "admin" && (
        <>
          <header className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300 border-b border-slate-900 bg-slate-950 shadow-md">
        <div className="max-w-full lg:px-12 xl:px-16 mx-auto px-4 md:px-6 h-22 flex items-center justify-between">
          
          {/* Logo container recreating Page 1 & 8 aesthetics */}
          <div 
            onClick={() => {
              navigateToPage("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }} 
            className="flex items-center cursor-pointer group hover:opacity-95 transition-opacity duration-300"
            title="Asia Link Services"
          >
            <img 
              src={logoUrl}
              alt="Asia Link Services Pvt. Ltd."
              className="h-10 md:h-12 lg:h-15 w-auto max-w-[160px] md:max-w-[220px] lg:max-w-[280px] object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Nav Rails Desktop - text size increased to 15px font-extrabold with responsive transitions in dark aesthetics aligned to right */}
          <nav className="hidden lg:flex items-center gap-8 text-[15px] font-extrabold tracking-wide ml-auto mr-8">
            <button 
              onClick={() => navigateToPage("home")} 
              className="transition-colors cursor-pointer text-gray-200 hover:text-sky-400"
            >
              Home
            </button>
            <button 
              onClick={() => navigateToPage("about")} 
              className="transition-colors cursor-pointer text-gray-200 hover:text-sky-400"
            >
              About Us
            </button>
            <button 
              onClick={() => navigateToPage("services")} 
              className={`transition-colors cursor-pointer text-gray-200 hover:text-sky-400 ${activePage === "services" ? "text-cyan-400 font-extrabold" : ""}`}
            >
              Services
            </button>
            <button 
              onClick={() => navigateToPage("demands")} 
              className="transition-colors cursor-pointer text-gray-200 hover:text-sky-400"
            >
              Active Careers
            </button>
            <button 
              onClick={() => navigateToPage("contact")} 
              className="transition-colors cursor-pointer text-gray-200 hover:text-sky-400"
            >
              Contact Us
            </button>
          </nav>

          {/* Right Header controls: Classic Dark & Light Switcher with icon-only circular buttons */}
          <div className="flex items-center gap-4">
            
            {/* Search Icon Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-3 rounded-full border border-slate-800 bg-slate-900/80 text-gray-300 hover:text-white hover:bg-slate-800 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center shadow-sm"
              title="Search Site (Ctrl+K)"
            >
              <Search className="w-5 h-5 shrink-0" />
            </button>



            {/* Mobile menu trigger */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl border bg-slate-900 hover:bg-slate-800 text-gray-200 border-slate-800 lg:hidden"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-22 z-30 border-b p-6 flex flex-col gap-3 shadow-xl transition-all max-h-[calc(100vh-88px)] overflow-y-auto bg-[#0f172a] border-slate-800 text-gray-200"
          >
            {/* Simple Mobile Menu Links */}
            <button onClick={() => { navigateToPage("home"); }} className="text-left py-2.5 px-3 font-extrabold text-base transition-colors text-gray-200 hover:text-sky-400 border-b border-white/5">Home</button>
            <button onClick={() => { navigateToPage("services"); }} className="text-left py-2.5 px-3 font-extrabold text-base transition-colors text-gray-200 hover:text-sky-400 border-b border-white/5">Services</button>
            
            {/* Expanded About Us Hub for Mobile */}
            <div className="flex flex-col border-b border-white/5 pb-2">
              <div className="flex justify-between items-center py-2 px-3">
                <span className="font-extrabold text-base text-gray-200">About Us</span>
                <span className="text-[10px] font-mono text-[#e31e24] uppercase tracking-wider font-extrabold">Corporate Hub</span>
              </div>
              <div className="flex flex-col pl-4 gap-1 mt-1">
                <button 
                  onClick={() => { navigateToPage("about"); }} 
                  className={`text-left py-2 px-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border ${
                    activePage === "about" 
                      ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" 
                      : "text-slate-400 hover:text-white border-transparent"
                  }`}
                >
                  <Info className="w-4 h-4" />
                  <span>Introduction</span>
                </button>
                <button 
                  onClick={() => { navigateToPage("mission"); }} 
                  className={`text-left py-2 px-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border ${
                    activePage === "mission" 
                      ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" 
                      : "text-slate-400 hover:text-white border-transparent"
                  }`}
                >
                  <PlaneTakeoff className="w-4 h-4" />
                  <span>Mission & Vision</span>
                </button>
                <button 
                  onClick={() => { navigateToPage("chairman"); }} 
                  className={`text-left py-2 px-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border ${
                    activePage === "chairman" 
                      ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" 
                      : "text-slate-400 hover:text-white border-transparent"
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Chairman Message</span>
                </button>
                <button 
                  onClick={() => { navigateToPage("team"); }} 
                  className={`text-left py-2 px-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border ${
                    activePage === "team" 
                      ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" 
                      : "text-slate-400 hover:text-white border-transparent"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Our Team</span>
                </button>
                <button 
                  onClick={() => { navigateToPage("legal"); }} 
                  className={`text-left py-2 px-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border ${
                    activePage === "legal" 
                      ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" 
                      : "text-slate-400 hover:text-white border-transparent"
                  }`}
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Company Profile</span>
                </button>
              </div>
            </div>
            
            <button onClick={() => { navigateToPage("demands"); }} className="text-left py-2.5 px-3 font-extrabold text-base transition-colors text-gray-200 hover:text-sky-400 border-b border-white/5">Careers & Demands</button>
            <button onClick={() => { navigateToPage("contact"); }} className="text-left py-2.5 px-3 font-extrabold text-base transition-colors text-gray-200 hover:text-[#e31e24]">Contact Us</button>
          </motion.div>
        )}
      </AnimatePresence>
        </>
      )}

      {/* Render Cinematic Wide Banner ONLY ON HOME PORTAL */}
      {activePage === "home" && (
        <HeroSection
          cmsData={cmsData}
          theme={activeTheme}
          onScrollToCategories={() => navigateToPage("sectors")}
          onScrollToVacancies={() => navigateToPage("demands")}
          onNavigateToPage={navigateToPage}
        />
      )}

      {/* SUBPAGE HERO HEADER REMOVED PER USER REQUEST */}

      {/* MAIN CONTAINER LAYOUT WITH SPARKLED NEGATIVE SPACES */}
      <main className={activePage === "admin" ? "w-screen h-screen flex flex-col overflow-hidden" : `max-w-full lg:px-12 xl:px-16 mx-auto px-4 md:px-6 w-full ${
        activePage === "home" ? "py-16" : "pt-28 pb-16"
      }`}>

        {activePage === "admin" ? (
          <AdminPanel
            cmsData={cmsData}
            onSaveCMS={async (updatedData) => {
              setCmsData(updatedData);
              try {
                const token = sessionStorage.getItem("asialink_admin_token") || "";
                const response = await fetch("/api/cms", {
                  method: "POST",
                  headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                  },
                  body: JSON.stringify(updatedData),
                });
                const result = await response.json();
                console.log("Global disk synchronization result:", result);
              } catch (error) {
                console.error("Failed to sync CMS dynamically to node backend: ", error);
              }
            }}
            onExit={() => navigateToPage("home")}
            isDark={isDark}
            theme={activeTheme}
          />
        ) : ["about", "mission", "chairman", "team", "legal"].includes(activePage) ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
            
            {/* Elegant Left Sidebar Card (3 Columns) - Desktop ONLY (Hidden on mobile/tablet) */}
            <aside className={`hidden lg:block lg:col-span-3 rounded-3xl p-5 lg:sticky lg:top-28 lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto h-auto lg:self-start backdrop-blur-xl space-y-5 shadow-2xl border ${
              isDark 
                ? "bg-slate-950/80 border-slate-900/60" 
                : "bg-white border-slate-200"
            }`}>
              <div className={`px-3 py-1.5 bg-gradient-to-r border-l-2 mb-2 ${
                isDark 
                  ? "from-[#e31e24]/10 via-transparent to-transparent border-[#e31e24]" 
                  : "from-[#e31e24]/5 via-transparent to-transparent border-[#e31e24]"
              }`}>
                <span className={`text-[10px] font-mono uppercase tracking-widest font-extrabold ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}>
                  Corporate Info
                </span>
                <p className="text-[9px] text-[#e31e24] font-mono mt-0.5">ASIA LINK HUB</p>
              </div>

              <div className="flex flex-col gap-2 w-full shrink-0">
                {/* Introduction Link */}
                <button
                  onClick={() => navigateToPage("about")}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-left text-xs font-extrabold font-mono tracking-wide transition-all cursor-pointer w-full justify-between group border ${
                    activePage === "about"
                      ? isDark 
                        ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-md shadow-cyan-950/20"
                        : "bg-cyan-50 text-[#0073aa] border-cyan-200/80 shadow-xs"
                      : isDark
                        ? "text-slate-400 hover:text-white hover:bg-slate-900/40 border-transparent"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Info className={`w-4 h-4 ${
                      activePage === "about" 
                        ? isDark ? "text-cyan-400" : "text-[#0073aa]" 
                        : isDark ? "text-slate-400" : "text-slate-500"
                    }`} />
                    <span>Introduction</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 -rotate-90 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-1" />
                </button>

                {/* Mission & Vision Link */}
                <button
                  onClick={() => navigateToPage("mission")}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-left text-xs font-extrabold font-mono tracking-wide transition-all cursor-pointer w-full justify-between group border ${
                    activePage === "mission"
                      ? isDark 
                        ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-md shadow-cyan-950/20"
                        : "bg-cyan-50 text-[#0073aa] border-cyan-200/80 shadow-xs"
                      : isDark
                        ? "text-slate-400 hover:text-white hover:bg-slate-900/40 border-transparent"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <PlaneTakeoff className={`w-4 h-4 ${
                      activePage === "mission" 
                        ? isDark ? "text-cyan-400" : "text-[#0073aa]" 
                        : isDark ? "text-slate-400" : "text-slate-500"
                    }`} />
                    <span>Mission & Vision</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 -rotate-90 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-1" />
                </button>

                {/* Chairman's Message Link */}
                <button
                  onClick={() => navigateToPage("chairman")}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-left text-xs font-extrabold font-mono tracking-wide transition-all cursor-pointer w-full justify-between group border ${
                    activePage === "chairman"
                      ? isDark 
                        ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-md shadow-cyan-950/20"
                        : "bg-cyan-50 text-[#0073aa] border-cyan-200/80 shadow-xs"
                      : isDark
                        ? "text-slate-400 hover:text-white hover:bg-slate-900/40 border-transparent"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className={`w-4 h-4 ${
                      activePage === "chairman" 
                        ? isDark ? "text-cyan-400" : "text-[#0073aa]" 
                        : isDark ? "text-slate-400" : "text-slate-500"
                    }`} />
                    <span>Chairman Message</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 -rotate-90 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-1" />
                </button>

                {/* Our Team Link */}
                <button
                  onClick={() => navigateToPage("team")}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-left text-xs font-extrabold font-mono tracking-wide transition-all cursor-pointer w-full justify-between group border ${
                    activePage === "team"
                      ? isDark 
                        ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-md shadow-cyan-950/20"
                        : "bg-cyan-50 text-[#0073aa] border-cyan-200/80 shadow-xs"
                      : isDark
                        ? "text-slate-400 hover:text-white hover:bg-slate-900/40 border-transparent"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Users className={`w-4 h-4 ${
                      activePage === "team" 
                        ? isDark ? "text-cyan-400" : "text-[#0073aa]" 
                        : isDark ? "text-slate-400" : "text-slate-500"
                    }`} />
                    <span>Our Team</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 -rotate-90 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-1" />
                </button>

                {/* Company Profile Link */}
                <button
                  onClick={() => navigateToPage("legal")}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-left text-xs font-extrabold font-mono tracking-wide transition-all cursor-pointer w-full justify-between group border ${
                    activePage === "legal"
                      ? isDark 
                        ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-md shadow-cyan-950/20"
                        : "bg-cyan-50 text-[#0073aa] border-cyan-200/80 shadow-xs"
                      : isDark
                        ? "text-slate-400 hover:text-white hover:bg-slate-900/40 border-transparent"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileCheck className={`w-4 h-4 ${
                      activePage === "legal" 
                        ? isDark ? "text-cyan-400" : "text-[#0073aa]" 
                        : isDark ? "text-slate-400" : "text-slate-500"
                    }`} />
                    <span>Company Profile</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 -rotate-90 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-1" />
                </button>
              </div>

              {/* Sidebar Help Widget */}
              <div className={`pt-4 border-t text-[10px] leading-relaxed font-sans ${
                isDark ? "border-slate-900/60 text-slate-500" : "border-slate-100 text-slate-500"
              }`}>
                <span className="font-extrabold text-[#e31e24] block mb-1">Direct Assistance</span>
                Need validation or corporate verification? Contact our Board secretariat directly at <span className={isDark ? "text-gray-300" : "text-slate-700 font-medium"}>jobasialink119@gmail.com</span>.
              </div>
            </aside>

            {/* Subpage content (9 columns on desktop, 12 on mobile) */}
            <div className="col-span-1 lg:col-span-9 space-y-12 w-full">
              {/* COMPONENTIZED CORPORATE PROFILES & SECTIONS */}
              {["about", "mission", "chairman", "legal"].includes(activePage) && (
                <CompanyProfileView 
                  cmsData={cmsData} 
                  activeSubPage={activePage} 
                  themeId={activeTheme.id} 
                />
              )}

              {/* SECTION 8: STRUCTURAL GOVERNANCE ORG CHART (RECONSTRUCTED AS STANDALONE ROUTE) */}
              {activePage === "team" && (
                <section id="org-structure" className="py-0 min-h-[40vh] space-y-8">
                  {cmsData.teamPhotoUrl && (
                    <div className="space-y-4">
                      <div className="text-left space-y-2">
                        <span className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded font-semibold inline-block ${
                          isDark 
                            ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" 
                            : "bg-[#0073aa]/10 text-[#0073aa] border border-[#0073aa]/15"
                        }`}>
                          UNITED FOR EXCELLENCE
                        </span>
                        <h4 className={`text-xl md:text-3xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                          Our Global Operational Force
                        </h4>
                        <p className={`text-xs md:text-sm font-sans max-w-2xl leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                          The collective leadership and specialized administrative specialists of Asia Link Services, dedicated to zero-compromise speed and absolute ethical recruitment transparency.
                        </p>
                      </div>

                      <div className="w-full overflow-hidden rounded-3xl border border-slate-300/10 shadow-lg relative aspect-[21/9] md:aspect-[24/8] group">
                        <img 
                          src={cmsData.teamPhotoUrl} 
                          alt="Asia Link Services Team Group Photo" 
                          className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                  )}

                  <div className="text-left border-l-4 border-cyan-400 pl-4 max-w-xl mb-6">
                    <span className={`text-xs uppercase tracking-widest font-mono font-semibold px-2 py-0.5 rounded border ${
                      isDark 
                        ? "text-cyan-400 bg-cyan-950/40 border-cyan-800/30" 
                        : "text-[#0073aa] bg-cyan-50 border-cyan-200"
                    }`}>
                      Elite Executive Team
                    </span>
                    <h3 className={`text-2xl md:text-3xl font-extrabold tracking-tight mt-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                      Our Corporate Structure
                    </h3>
                  </div>
                  <OrgChart
                    primaryBg={activeTheme.accentColor}
                    accentText={isDark ? "text-cyan-400" : "text-[#0073aa]"}
                    cardBg={activeTheme.cardBg}
                    themeId={activeTheme.id}
                    teamMembers={cmsData.teamMembers || []}
                  />
                </section>
              )}

            </div>

          </div>
        ) : (
          /* Normal Layout for Recruitment / Sourcing Hub sub-pages */
          <>

            {activePage === "demand-detail" && selectedDemandDetail && (
              <DemandDetailPage
                vacancy={selectedDemandDetail}
                isDark={isDark}
                theme={activeTheme}
                onBack={() => navigateToPage("demands")}
              />
            )}

            {/* SECTION 5: REGISTERED ACTIVE OVERSEAS CAREERS */}
            {activePage === "demands" && (
              <>
                <section id="demands" className="space-y-10">
                  <div className="text-center max-w-xl mx-auto">
                    <span className={`text-xs uppercase tracking-widest font-mono font-semibold px-2.5 py-1 rounded-full border ${
                      isDark 
                        ? "text-cyan-400 bg-cyan-950/40 border-cyan-800/30" 
                        : "text-[#0073aa] bg-cyan-50 border-cyan-200"
                    }`}>
                      Licensed Demand Letters
                    </span>
                    <h3 className={`text-2xl md:text-3.5xl font-extrabold tracking-tight mt-3 ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}>
                      Active Job Recs & Quotas
                    </h3>
                    <p className={`text-xs md:text-sm mt-2 ${
                      isDark ? "text-slate-400" : "text-slate-650"
                    }`}>
                      Genuine global labor quotas authorized by the Department of Foreign Employment. Click "Apply Now" to index your profile.
                    </p>
                  </div>

                  {/* Redesigned Search filter for Careers & Demands */}
                  <div className={`max-w-xl mx-auto p-4 rounded-2xl border ${
                    isDark ? "bg-slate-950/60 border-slate-900" : "bg-white border-slate-205 shadow-xs"
                  }`}>
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={careerSearchText}
                        onChange={(e) => setCareerSearchText(e.target.value)}
                        placeholder="Search by job title, location, company, code..."
                        className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-xs font-semibold font-sans outline-none focus:ring-1 transition-all ${
                          isDark 
                            ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-cyan-400/30" 
                            : "bg-slate-50 border-slate-205 text-slate-900 placeholder-slate-450 focus:border-[#0073aa] focus:ring-[#0073aa]/20"
                        }`}
                      />
                      {careerSearchText && (
                        <button
                          onClick={() => setCareerSearchText("")}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {filteredCareers.length === 0 ? (
                    <div className="text-center py-12 space-y-4">
                      <p className={`text-sm font-semibold ${isDark ? "text-slate-405" : "text-slate-600"}`}>
                        No career openings matched your search terms.
                      </p>
                      <button
                        onClick={() => setCareerSearchText("")}
                        className={`text-xs px-4 py-2 font-bold rounded-lg transition-colors inline-block cursor-pointer ${
                          isDark 
                            ? "bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 hover:bg-cyan-500/20" 
                            : "bg-cyan-50 text-[#0073aa] border border-cyan-200 hover:bg-cyan-100"
                        }`}
                      >
                        Reset Search
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredCareers.map((vac) => {
                        return (
                          <div
                            key={vac.id}
                            className={`p-6 rounded-2xl border ${activeTheme.cardBg} flex flex-col justify-between space-y-6 hover:scale-[1.01] hover:shadow-md transition-all ${
                              isDark ? "hover:border-slate-700" : "hover:border-slate-300"
                            }`}
                          >
                          <div className="space-y-4">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                  <span className={`inline-block text-[9px] px-2 py-0.5 rounded font-mono border ${
                                    isDark 
                                      ? "bg-slate-950 text-cyan-400 border-slate-900" 
                                      : "bg-slate-100 text-[#0073aa] border-slate-200"
                                  }`}>
                                    {vac.recruitmentQuotaCode || "LT. No. Approved"}
                                  </span>
                                  {vac.demandLetterUrl && (
                                    <span className="inline-block text-[9px] px-2 py-0.5 rounded font-mono font-bold border bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                                      Demand Attached
                                    </span>
                                  )}
                                </div>
                                <h4 className={`text-lg font-extrabold tracking-tight leading-snug ${
                                  isDark ? "text-white" : "text-slate-950"
                                }`}>
                                  {vac.title}
                                </h4>
                                <p className={`text-xs font-semibold ${
                                  isDark ? "text-slate-400" : "text-slate-600"
                                }`}>
                                  {vac.companyName}
                                </p>
                              </div>
                              <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border shrink-0 ${
                                isDark 
                                  ? "text-amber-400 bg-amber-400/5 border-amber-400/20" 
                                  : "text-amber-700 bg-amber-50 border-amber-200"
                              }`}>
                                {vac.location}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                              <div className={`p-2.5 rounded-lg border text-center ${
                                isDark ? "bg-slate-950/40 border-slate-900/60" : "bg-slate-50 border-slate-200/60"
                              }`}>
                                <span className={`text-[9px] uppercase block ${
                                  isDark ? "text-slate-500" : "text-slate-450"
                                }`}>Positions Sourced</span>
                                <span className={`text-xs font-extrabold mt-0.5 block ${
                                  isDark ? "text-white" : "text-slate-800"
                                }`}>
                                  {(() => {
                                    const parts = [];
                                    if (vac.positionsMale && vac.positionsMale > 0) parts.push(`${vac.positionsMale} Male`);
                                    if (vac.positionsFemale && vac.positionsFemale > 0) parts.push(`${vac.positionsFemale} Female`);
                                    return parts.length > 0 ? parts.join(" / ") : `${Number(vac.positionsMale || 0) + Number(vac.positionsFemale || 0)} Seats`;
                                  })()}
                                </span>
                              </div>
                              <div className={`p-2.5 rounded-lg border text-center ${
                                isDark ? "bg-slate-950/40 border-slate-900/60" : "bg-slate-50 border-slate-200/60"
                              }`}>
                                <span className={`text-[9px] uppercase block ${
                                  isDark ? "text-slate-500" : "text-slate-450"
                                }`}>Monthly Salary</span>
                                <span className={`text-xs font-extrabold mt-0.5 block ${
                                  isDark ? "text-amber-400" : "text-amber-700"
                                }`}>
                                  {vac.salary}
                                </span>
                              </div>
                            </div>

                            <div className={`space-y-1 pt-1.5 text-[11px] ${
                              isDark ? "text-slate-400" : "text-slate-605"
                            }`}>
                              <p>• Contract Validity: <span className={isDark ? "text-gray-200" : "text-slate-800 font-medium"}>{vac.duration}</span></p>
                              <p>• Weekly Scheme: <span className={isDark ? "text-gray-200" : "text-slate-800 font-medium"}>{vac.workingHours}/day, {vac.workingDays} days/week</span></p>
                              <p>• Food perks: <span className={`font-medium ${isDark ? "text-gray-200" : "text-slate-800"}`}>{vac.foodAllowance}</span></p>
                            </div>
                          </div>

                          <div className={`pt-4 border-t flex items-center justify-between gap-2 ${
                            isDark ? "border-slate-900" : "border-slate-100"
                          }`}>
                            {vac.demandLetterUrl ? (
                              <button
                                type="button"
                                onClick={() => setPreviewDemandLetter(vac)}
                                className={`text-[11px] font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors border cursor-pointer ${
                                  isDark 
                                    ? "border-slate-800 text-slate-300 hover:bg-slate-900 hover:text-white" 
                                    : "border-slate-205 text-slate-700 hover:bg-slate-50"
                                }`}
                              >
                                <Image className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                                <span>View Demand</span>
                              </button>
                            ) : (
                              <span className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-450"}`}>*Verified official placement compliance</span>
                            )}
                            <button
                              onClick={() => {
                                setSelectedDemandDetail(vac);
                                navigateToPage("demand-detail", generateSlug(vac.title));
                              }}
                              className="bg-[#0073aa] hover:bg-[#006292] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                            >
                              <span>More Info</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                </section>
                <span className={`block h-px bg-gradient-to-r from-transparent to-transparent ${
                  isDark ? "via-slate-800/60" : "via-slate-200/80"
                }`}></span>
              </>
            )}



            {/* CONTACT US INTERACTIVE PAGE VIEW WITH CORRESPONDENCE TERMINAL */}
            {activePage === "contact" && (
              <>
                <section id="contact-us-page-view" className="space-y-8 animate-fadeIn">
                  <ContactView cmsData={cmsData} theme={activeTheme} />
                </section>
              </>
            )}

            {/* OFFICIAL COMPLIANCE NOTICES PAGE VIEW */}
            {activePage === "notices" && (
              <>
                <section id="notices-archive-page-view" className="space-y-8 animate-fadeIn">
                  <NoticesView notices={noticesList} isDark={isDark} theme={activeTheme} />
                </section>
              </>
            )}

            {/* CORPORATE SERVICES PAGE VIEW */}
            {activePage === "services" && (
              <>
                <section id="services-page-view" className="space-y-8 animate-fadeIn">
                  <ServicesView isDark={isDark} theme={activeTheme} cmsData={cmsData} />
                </section>
              </>
            )}
          </>
        )}

        {/* HOMEPAGE DYNAMICS UNDER THE HERO SECTION */}
        {activePage === "home" && (
          <div className="space-y-12">
            
            {/* 1. Split Section: Active Careers (Left) & Notice Board (Right) */}
            <motion.section 
              id="careers-notice-split-section" 
              className="scroll-mt-28"
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8">
                
                {/* Left: Active Careers List (7 columns) */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-5 sm:space-y-6" id="careers-side-section">
                  <div className={`p-4 xs:p-6 rounded-2xl xs:rounded-3xl border ${activeTheme.cardBg} flex-1 flex flex-col justify-between space-y-5 sm:space-y-6 relative overflow-hidden backdrop-blur-md`}>
                    <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>
                    
                    <div className="flex items-center justify-between border-b pb-4 border-slate-200/40 dark:border-slate-800/60">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl border ${
                          isDark ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" : "bg-cyan-100 border-cyan-200 text-[#0073aa]"
                        }`}>
                          <Briefcase className="w-5 h-5 font-bold" />
                        </div>
                        <div>
                          <h3 className={`text-xs xs:text-sm md:text-base font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                            Active Careers
                          </h3>
                          <p className={`text-[9px] xs:text-[10px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                            Ministry-approved physical vacancies & demand letters
                          </p>
                        </div>
                      </div>
                      <span className={`text-[8px] xs:text-[9px] md:text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded border inline-block shrink-0 ${
                        isDark ? "bg-cyan-400/10 border-cyan-400/20 text-cyan-400" : "bg-cyan-50 border-cyan-200 text-[#0073aa]"
                      }`}>
                        {cmsData.vacancies.filter(v => v.active).length} Jobs
                      </span>
                    </div>

                    <div className="space-y-3.5 divide-y divide-slate-150/40 dark:divide-slate-800/50 flex-1">
                      {cmsData.vacancies.filter(v => v.active).slice(0, 5).map((vac, idx) => (
                        <div key={vac.id} className={`pt-3.5 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group/item transition-all duration-300`}>
                          <div className="space-y-1.5 max-w-md">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {vac.recruitmentQuotaCode && (
                                <span className={`text-[8px] md:text-[9px] font-mono px-1.5 py-0.5 rounded border leading-none ${
                                  isDark ? "bg-slate-950 text-cyan-400 border-slate-900" : "bg-slate-100/90 text-[#0073aa] border-slate-200"
                                }`}>
                                  {vac.recruitmentQuotaCode}
                                </span>
                              )}
                              <span className={`text-[8px] md:text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                                isDark ? "bg-amber-400/10 text-amber-400" : "bg-amber-55 text-amber-800 border border-amber-205/60"
                              }`}>
                                {vac.location}
                              </span>
                            </div>
                            <h4 className={`text-xs xs:text-sm font-black leading-snug group-hover/item:text-cyan-500 transition-colors ${
                              isDark ? "text-white" : "text-slate-900"
                            }`}>
                              {vac.title}
                            </h4>
                            <p className={`text-[10px] md:text-[11px] leading-none ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                              {vac.companyName}
                            </p>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100/15 dark:border-slate-800/20">
                            <div className="text-left sm:text-right font-sans">
                              <span className={`text-xs block font-bold ${isDark ? "text-amber-400" : "text-amber-700"}`}>
                                {vac.salary}
                              </span>
                              <span className={`text-[9px] block ${isDark ? "text-slate-500" : "text-slate-450"}`}>
                                {vac.positionsMale + vac.positionsFemale} Seats
                              </span>
                            </div>
                            {vac.demandLetterUrl && (
                              <button
                                type="button"
                                title="View demand letter attachment"
                                onClick={() => setPreviewDemandLetter(vac)}
                                className={`p-2 rounded-xl border transition-all active:scale-95 shrink-0 cursor-pointer ${
                                  isDark 
                                    ? "border-slate-800 text-slate-300 hover:bg-slate-900 hover:text-white" 
                                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                                }`}
                              >
                                <Image className="w-3.5 h-3.5 text-cyan-500" />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setSelectedDemandDetail(vac);
                                navigateToPage("demand-detail", generateSlug(vac.title));
                              }}
                              className="px-3.5 py-2 rounded-xl text-[10px] font-bold bg-[#0073aa] hover:bg-[#006292] text-white flex items-center gap-1 transition-all active:scale-95 shrink-0 cursor-pointer"
                            >
                              <span>More Info</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-200/40 dark:border-slate-800/60">
                      <button
                        onClick={() => navigateToPage("demands")}
                        className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl text-xs font-black transition-all text-white bg-[#0073aa] hover:bg-[#006292] flex items-center gap-1.5"
                      >
                        <span>Full Sourcing Hub</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: Notice Board List (5 columns) */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-5 sm:space-y-6" id="notice-side-section">
                  <div className={`p-4 xs:p-6 rounded-2xl xs:rounded-3xl border ${activeTheme.cardBg} flex-1 flex flex-col justify-between space-y-5 sm:space-y-6 relative overflow-hidden backdrop-blur-md`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>

                    <div className="flex items-center justify-between border-b pb-4 border-slate-200/40 dark:border-slate-800/60">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl border ${
                          isDark ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-amber-100 border-amber-200 text-amber-600"
                        }`}>
                          <Sparkles className="w-5 h-5 font-bold" />
                        </div>
                        <div>
                          <h3 className={`text-xs xs:text-sm md:text-base font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                            Official Notices
                          </h3>
                          <p className={`text-[9px] xs:text-[10px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                            Regulations & compliance declarations
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 flex-1">
                      {noticesList.slice(0, 5).map((notice) => {
                        const iconMap: Record<string, any> = {
                          "n-1": ShieldCheck,
                          "n-2": UserCheck,
                          "n-3": Landmark,
                          "n-4": BookOpen,
                          "n-5": FileCheck,
                          "n-6": Shield,
                          "n-7": PlaneTakeoff,
                          "n-8": Lock,
                          "n-9": Award,
                        };
                        const NoticeIcon = iconMap[notice.id] || Sparkles;
                        return (
                          <div 
                            key={notice.id} 
                            onClick={() => setSelectedNoticeDetail(notice)}
                            className={`flex gap-3 text-xs leading-relaxed group cursor-pointer p-2.5 -mx-2.5 rounded-xl transition-all duration-200 ${
                              isDark ? "hover:bg-white/5" : "hover:bg-slate-50/80 shadow-2xs hover:shadow-xs"
                            }`}
                            title="Click to view full governance directive details"
                          >
                            <div className={`p-1.5 h-7 w-7 rounded-lg border shrink-0 flex items-center justify-center ${notice.color}`}>
                              <NoticeIcon className="w-4 h-4 font-bold" />
                            </div>
                            <div className="space-y-0.5 flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className={`font-extrabold text-xs leading-snug ${isDark ? "text-white" : "text-[#111827]"} group-hover:text-amber-500 transition-colors`}>
                                  {notice.title}
                                </h4>
                                <span className={`text-[8px] font-mono leading-none px-1 rounded-full border ${
                                  isDark ? "bg-slate-950 text-slate-500 border-slate-900" : "bg-slate-50 text-slate-450 border-slate-200"
                                }`}>
                                  {notice.tag}
                                </span>
                              </div>
                              <p className={`text-[11px] leading-relaxed line-clamp-2 ${isDark ? "text-slate-400" : "text-slate-650"}`}>
                                {notice.description}
                              </p>
                              <span className="text-[9px] text-[#e31e24] font-bold inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                                Read full notice <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-3 border-t border-slate-200/40 dark:border-slate-800/60">
                      <button
                        onClick={() => navigateToPage("notices")}
                        className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-black transition-all border block text-center ${
                          isDark 
                            ? "bg-slate-950 hover:bg-slate-900 border-slate-800 text-slate-200" 
                            : "bg-white hover:bg-slate-50 border-slate-200 text-slate-705 shadow-xs"
                        }`}
                      >
                        Browse Compliance Hub
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </motion.section>
            
            <span className={`block h-px bg-gradient-to-r from-transparent to-transparent ${isDark ? 'via-slate-800/60' : 'via-slate-200/80'}`}></span>

            {/* Corporate Heritage Section - Relocated to Home page per User Request */}
            <motion.section 
              id="heritage-section" 
              className="scroll-mt-28 space-y-8"
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Premium Heading Group */}
              <div className="text-center max-w-3xl mx-auto animate-fadeIn">
                <span className={`text-xs uppercase tracking-widest font-mono font-bold px-2.5 py-1 rounded border inline-block ${
                  isDark 
                    ? "text-[#e31e24] bg-red-950/20 border-red-900/30" 
                    : "text-[#e31e24] bg-red-50 border-red-200"
                }`}>
                  Corporate Identity & Heritage
                </span>
                <h3 className={`text-2xl md:text-3.5xl font-black tracking-tight mt-3 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}>
                  The Benchmark of Ethical Sourced Mobilization
                </h3>
                <p className={`text-xs md:text-sm mt-3 leading-relaxed max-w-2xl mx-auto ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}>
                  Matched vetting solutions since 1998. Govern and operate under license numbers authorized by Ministry of Labour, Employment and Social Security, Nepal.
                </p>
              </div>

              {/* Operational Stats Grid (Fills section width perfectly, 2 columns on mobile) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 w-full animate-fadeIn">
                {[
                  { val: `${new Date().getFullYear() - 1998}+`, label: "Years of Excellence", desc: "Established in 1998", highlightColor: "text-[#e31e24]" },
                  { val: "98%", label: "Success Rate", desc: "Visa & Deployment accuracy", highlightColor: "text-emerald-500 font-extrabold" },
                  { val: "25k+", label: "Professionals Placed", desc: "Across primary indices", highlightColor: "text-[#0073aa]" },
                  { val: "12+", label: "Sovereign Countries", desc: "Global trade routes", highlightColor: "text-[#0073aa]" }
                ].map((stat, i) => (
                  <div 
                    key={i} 
                    className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-md w-full ${
                      isDark 
                        ? "bg-slate-900/50 border-slate-800/60 hover:border-[#e31e24]/30" 
                        : "bg-white border-slate-205 hover:border-[#e31e24]/20 shadow-sm"
                    }`}
                  >
                    <AnimatedCounter value={stat.val} highlightColor={stat.highlightColor} />
                    <span className={`text-xs sm:text-sm font-bold block mt-2.5 leading-snug ${isDark ? "text-slate-200" : "text-slate-800"}`}>{stat.label}</span>
                    <span className={`text-[10px] sm:text-xs block mt-1 ${isDark ? "text-slate-500" : "text-slate-450"}`}>{stat.desc}</span>
                  </div>
                ))}
              </div>
            </motion.section>

            <span className={`block h-px bg-gradient-to-r from-transparent to-transparent ${isDark ? 'via-slate-800/60' : 'via-slate-200/80'}`}></span>

            {/* 2. Sectors We Supply Section */}
            <motion.section 
              id="sectors-section" 
              className="scroll-mt-28 bg-gradient-to-br from-slate-50/95 via-slate-100/40 to-slate-50/70 p-6 sm:p-8 md:p-12 rounded-[2.5rem] border border-slate-200/80 shadow-[0_8px_30px_rgba(15,23,42,0.02)] relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.98, y: 35 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Decorative background overlay circles */}
              <div className="absolute -left-28 -top-28 w-96 h-96 rounded-full bg-slate-200/30 blur-3xl pointer-events-none"></div>
              <div className="absolute -right-28 -bottom-28 w-96 h-96 rounded-full bg-slate-200/20 blur-3xl pointer-events-none"></div>
              
              <div className="text-center max-w-xl mx-auto mb-10 relative z-10">
                <span className={`text-[11px] uppercase tracking-widest font-mono font-bold px-3.5 py-1.5 rounded-full border bg-white border-slate-200 text-[#0073aa] shadow-sm`}>
                  Sectors We Supply
                </span>
                <h3 className={`text-2xl md:text-3.5xl font-black tracking-tight mt-3 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}>
                  Occupational Specializations
                </h3>
                <p className={`text-xs md:text-sm mt-3 leading-relaxed ${
                  isDark ? "text-slate-400" : "text-slate-650"
                }`}>
                  Browse the comprehensive list of 10 industry classifications we source, fully tested under strict vocational protocols.
                </p>
              </div>

              <div className="relative z-10">
                <CategoriesView groups={cmsData.categoryGroups} cardBg={activeTheme.cardBg} themeId={activeTheme.id} />
              </div>
            </motion.section>

            <span className={`block h-px bg-gradient-to-r from-transparent to-transparent ${isDark ? 'via-slate-800/60' : 'via-slate-200/80'}`}></span>

            {/* 3. Selection Mode Section */}
            <motion.section 
              id="selection-section" 
              className="scroll-mt-28"
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              
              {/* Recruitment Timeline Sub-block */}
              <div className="space-y-6">
                <div className="text-center max-w-xl mx-auto">
                  <span className={`text-xs uppercase tracking-widest font-mono font-semibold px-2.5 py-1 rounded-full border ${
                    isDark 
                      ? "bg-cyan-950/40 border-cyan-800/30 text-cyan-500" 
                      : "bg-cyan-50 border-cyan-205 text-cyan-700"
                  }`}>
                    Deployment Workflow
                  </span>
                  <h3 className={`text-2xl md:text-3.5xl font-extrabold tracking-tight mt-3 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}>
                    Sourcing & Orientation Procedures
                  </h3>
                  <p className={`text-xs md:text-sm mt-2 ${
                    isDark ? "text-slate-400" : "text-slate-650"
                  }`}>
                    Our comprehensive 9-step recruitment workflow ensures absolute compliance with Saudi, UAE, Qatar, and Japanese state rules.
                  </p>
                </div>

                {/* Auto-adjusting centered layout for selection steps */}
                <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                  {cmsData.selectionSteps.map((step) => (
                    <div
                      key={step.id}
                      className={`p-4 xs:p-5 rounded-xl xs:rounded-2xl border flex gap-3.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex-grow max-w-[420px] ${
                        isDark 
                          ? "bg-slate-950/50 border-slate-900 hover:border-slate-800" 
                          : "bg-white shadow-sm border-slate-205 hover:border-cyan-500/30"
                      }`}
                    >
                      <div className={`font-mono text-xl xs:text-2xl font-black transition-colors shrink-0 ${
                        isDark ? "text-cyan-500/40 group-hover:text-cyan-400" : "text-cyan-600/30 group-hover:text-cyan-650"
                      }`}>
                        {step.order < 10 ? `0${step.order}` : step.order}
                      </div>
                      <div className="space-y-1.5">
                        <h4 className={`font-black text-[12px] xs:text-sm lg:text-[15px] tracking-wide uppercase leading-snug group-hover:text-amber-500 transition-colors font-sans ${
                          isDark ? "text-white" : "text-slate-800"
                        }`}>
                          {step.title}
                        </h4>
                        <p className={`text-[11px] xs:text-[12.5px] lg:text-[13.5px] leading-relaxed font-sans ${
                          isDark ? "text-gray-300 font-medium" : "text-slate-700 font-semibold"
                        }`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <span className={`block h-px w-full my-12 bg-gradient-to-r from-transparent via-slate-200/50 to-transparent ${isDark ? 'via-slate-800/40' : 'via-slate-200/60'}`}></span>

                {/* Why Partner With Us Section */}
                <WhyPartnerWithUs isDark={isDark} />
              </div>
            </motion.section>

            <span className={`block h-px bg-gradient-to-r from-transparent to-transparent ${isDark ? 'via-slate-800/60' : 'via-slate-200/80'}`}></span>

            {/* 4. Our Prestigious International Partners Section */}
            <motion.section 
              id="partners-section" 
              className="space-y-6 scroll-mt-28"
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="text-center max-w-xl mx-auto mb-5">
                <span className={`text-xs uppercase tracking-widest font-mono font-semibold px-2.5 py-1 rounded-full border ${
                  isDark 
                    ? "bg-cyan-950/40 border-cyan-800/30 text-cyan-400" 
                    : "bg-cyan-50 border-cyan-205 text-cyan-750"
                }`}>
                  Global Affiliates
                </span>
                <h3 className={`text-2xl md:text-3.5xl font-extrabold tracking-tight mt-3 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}>
                  Our Prestigious International Partners
                </h3>
                <p className={`text-xs md:text-sm mt-2 ${
                  isDark ? "text-slate-400" : "text-slate-650"
                }`}>
                  Trusted by elite corporate employers across GCC countries and the Asia Pacific region.
                </p>
              </div>

              {/* Premium Interactive Grid of Affiliate Partners with Logo / Website / Hover effects (Centered flex wrap layout) */}
              <div className="flex flex-wrap justify-center gap-4 w-full">
                {cmsData.clients.map((cli) => (
                  <a
                    key={cli.id}
                    href={cli.website || undefined}
                    target={cli.website ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className={`p-3.5 rounded-3xl border transition-all duration-300 flex items-center justify-center group hover:shadow-lg relative overflow-hidden h-44 w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] md:w-[calc(25%-12px)] lg:w-[calc(20%-13px)] flex-grow max-w-[220px] ${
                      isDark 
                        ? "bg-slate-900/40 border-slate-850 hover:border-[#e31e24]/40 hover:bg-slate-900/60" 
                        : "bg-white border-slate-200/95 hover:border-[#0073aa]/40 shadow-xs hover:bg-slate-50/40"
                    }`}
                  >
                    {/* Brand Image or Initial Placeholder - Centered when not hovered */}
                    <div className="w-full h-[85%] rounded-2xl overflow-hidden flex items-center justify-center bg-white border p-2.5 border-slate-150/80 shadow-xs transition-transform duration-300 group-hover:scale-105">
                      {cli.logoUrl ? (
                        <img 
                          src={cli.logoUrl} 
                          alt={cli.name} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-1 bg-gradient-to-br from-slate-50 to-slate-150 text-slate-500">
                          <span className="font-black font-mono text-2xl uppercase">{cli.name[0]}</span>
                          <span className="text-[8px] font-bold uppercase tracking-wider line-clamp-1 mt-1 text-slate-600 px-1">{cli.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Hover Overlay with Name, Industry, Description & Website */}
                    <div className="absolute inset-0 bg-slate-950/95 p-4 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-all duration-300 text-center space-y-1">
                      <h4 className="text-xs font-black tracking-tight uppercase line-clamp-2 text-white">
                        {cli.name}
                      </h4>
                      <p className="text-[9px] font-mono leading-none text-cyan-400 tracking-wider uppercase">
                        {cli.industry}
                      </p>
                      {cli.description && (
                        <p className="text-[10px] text-slate-300 leading-normal font-sans line-clamp-3 pt-1">
                          {cli.description}
                        </p>
                      )}
                      {cli.website && (
                        <span className="text-[9px] font-mono text-rose-400 dark:text-cyan-400 underline pt-1">Visit Website</span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </motion.section>
            
          </div>
        )}

      </main>

      {/* FOOTER AREA */}
      {activePage !== "admin" && (
        <footer className={`${activeTheme.footerBg} ${currentThemeId === 'dark' ? 'text-slate-400 border-slate-900' : 'text-slate-600 border-slate-200'} border-t pt-16 pb-12 px-4 md:px-6 transition-all duration-300 relative overflow-hidden`}>

        {/* Five-Column Layout Grids (Auto-adjusting column layout) */}
        <div className="max-w-full lg:px-12 xl:px-16 mx-auto grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-8 pb-12 items-start">
          
          {/* COLUMN 1: CORPORATE BIG LOGO */}
          <div className="space-y-4">
            <div 
              className="flex items-center hover:opacity-90 transition-opacity cursor-pointer group" 
              onClick={() => {
                navigateToPage("home");
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <img 
                src={logoUrl}
                alt="Asia Link Services Pvt. Ltd."
                className="w-full max-w-[220px] h-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* COLUMN 2: CORPORATE MANDATE TEXT */}
          <div className="space-y-3">
            <p className={`text-xs md:text-sm leading-relaxed font-sans ${isDark ? 'text-slate-300' : 'text-slate-755'}`}>
              Establishment certified in professional, transparent and compliant human resource recruitment and international mobilization. Matching Nepalese brilliance with corporate demands worldwide since 1998.
            </p>
          </div>

          {/* COLUMN 3: QUICK LINKS */}
          <div className="space-y-5">
            <h4 className={`text-xs font-mono font-extrabold uppercase tracking-[0.15em] pb-2 border-b ${
              isDark ? 'text-cyan-400 border-slate-800/80' : 'text-slate-900 border-slate-200'
            }`}>
              Quick Links
            </h4>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => navigateToPage("demands")} 
                className={`text-left text-xs font-bold font-sans flex items-center gap-2 transition-colors cursor-pointer group ${
                  isDark ? 'text-slate-400 hover:text-cyan-400' : 'text-slate-600 hover:text-cyan-600'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-cyan-500/70 group-hover:scale-110 transition-transform" />
                <span>Careers & Demand Letters</span>
              </button>

              <button 
                onClick={() => navigateToPage("notices")} 
                className={`text-left text-xs font-bold font-sans flex items-center gap-2 transition-colors cursor-pointer group ${
                  isDark ? 'text-slate-400 hover:text-cyan-400' : 'text-slate-600 hover:text-cyan-600'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-500/70 group-hover:scale-110 transition-transform" />
                <span>Regulations & Notices Board</span>
              </button>

              <button 
                onClick={() => setIsPrivacyOpen(true)} 
                className={`text-left text-xs font-bold font-sans flex items-center gap-2 transition-colors cursor-pointer group ${
                  isDark ? 'text-slate-400 hover:text-cyan-400' : 'text-slate-600 hover:text-cyan-600'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-cyan-500/70 group-hover:scale-110 transition-transform" />
                <span>Privacy & Policy</span>
              </button>
              
              <button 
                onClick={() => setIsTermsOpen(true)} 
                className={`text-left text-xs font-bold font-sans flex items-center gap-2 transition-colors cursor-pointer group ${
                  isDark ? 'text-slate-400 hover:text-cyan-400' : 'text-slate-600 hover:text-cyan-600'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-cyan-500/70 group-hover:scale-110 transition-transform" />
                <span>Terms & Condition</span>
              </button>
            </div>
          </div>

          {/* COLUMN 4: STATE REGULATORY PORTALS */}
          <div className="space-y-5">
            <h4 className={`text-xs font-mono font-extrabold uppercase tracking-[0.15em] pb-2 border-b ${
              isDark ? 'text-cyan-400 border-slate-800/80' : 'text-slate-900 border-slate-200'
            }`}>
              State Regulatory Portals
            </h4>
            <div className="flex flex-col gap-3">
              <a 
                href="https://www.dofe.gov.np" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`flex items-center gap-2 transition-colors group text-xs ${
                  isDark ? 'text-slate-400 hover:text-cyan-400' : 'text-slate-600 hover:text-cyan-600'
                }`}
              >
                <Landmark className="w-3.5 h-3.5 text-cyan-500/70 group-hover:scale-110 transition-transform" />
                <span className="font-sans font-medium">Dept of Foreign Employment (DOFE)</span>
              </a>
              <a 
                href="https://nafea.org.np" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`flex items-center gap-2 transition-colors group text-xs ${
                  isDark ? 'text-slate-400 hover:text-cyan-400' : 'text-slate-600 hover:text-cyan-600'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-cyan-500/70 group-hover:scale-110 transition-transform" />
                <span className="font-sans font-medium">NAFEA Recruitment Registry</span>
              </a>
              <a 
                href="https://moha.gov.np" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`flex items-center gap-2 transition-colors group text-xs ${
                  isDark ? 'text-slate-400 hover:text-cyan-400' : 'text-slate-600 hover:text-cyan-600'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-cyan-500/70 group-hover:scale-110 transition-transform" />
                <span className="font-sans font-medium">Ministry of Home Affairs Portal</span>
              </a>
              <a 
                href="https://www.nepalpolice.gov.np" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`flex items-center gap-2 transition-colors group text-xs ${
                  isDark ? 'text-slate-400 hover:text-cyan-400' : 'text-slate-600 hover:text-cyan-600'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-cyan-500/70 group-hover:scale-110 transition-transform" />
                <span className="font-sans font-medium">Police Clearance Verification</span>
              </a>
            </div>
          </div>

          {/* COLUMN 5: CSR & OPERATIONS (NEW COLUMN MOVED TO END of FOOTER) */}
          <div className="space-y-4">
            <h4 className={`text-xs font-mono font-extrabold uppercase tracking-[0.15em] pb-2 border-b ${
              isDark ? 'text-cyan-400 border-slate-800/80' : 'text-slate-900 border-slate-200'
            }`}>
              CSR & Operations
            </h4>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setIsCsrOpen(true)} 
                className={`text-left text-xs font-bold font-sans flex items-center gap-2 transition-all cursor-pointer group ${
                  isDark ? 'text-slate-400 hover:text-cyan-400' : 'text-emerald-700 hover:text-emerald-900'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-emerald-500/80 group-hover:scale-110 transition-transform" />
                <span className="underline underline-offset-2 hover:decoration-2">CSR Covenant Page</span>
              </button>

              <div className={`p-3 rounded-2xl border flex flex-col gap-1 ${
                isDark ? 'bg-slate-900/60 border-slate-850' : 'bg-slate-50 border-slate-150'
              }`}>
                <span className="text-[9px] font-mono uppercase text-[#e31e24] font-extrabold tracking-wider">
                  Office Hours
                </span>
                <p className={`text-xs font-semibold leading-relaxed font-sans ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Sunday to Friday <br />
                  <span className={`text-[11px] block font-mono font-extrabold mt-0.5 ${isDark ? 'text-cyan-400' : 'text-slate-600'}`}>
                    9:00 AM – 5:00 PM
                  </span>
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line, credits and certification branding elements */}
        <div className={`max-w-full lg:px-12 xl:px-16 mx-auto border-t ${
          currentThemeId === 'dark' ? 'border-slate-900/60' : 'border-slate-200'
        } mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] md:text-[13px] font-mono text-slate-500`}>
          <div>
            © 1998 - {new Date().getFullYear()}{" "}
            <button
              onClick={() => navigateToPage("home")}
              className={`hover:underline font-extrabold cursor-pointer inline transition-all ${
                currentThemeId === "dark" 
                  ? "text-[#5ce1e6] hover:text-cyan-300" 
                  : "text-[#0073aa] hover:text-cyan-800"
              }`}
            >
              {cmsData.companyMeta.title}
            </button>{" "}
            Government License: 119/055/056.
          </div>
          <div className="flex items-center gap-1 text-[11px] md:text-xs">
            <span>Designed and <button onClick={() => navigateToPage("admin")} className="font-normal border-none outline-none focus:outline-none p-0 bg-transparent text-inherit hover:text-slate-500 transition-colors cursor-default select-none">Developed</button> by</span>{" "}
            <a 
              href="https://bhupalbhattarai.com.np" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`font-black tracking-wide underline transition-colors ${
                currentThemeId === "dark" 
                  ? "text-cyan-400 hover:text-cyan-300" 
                  : "text-[#0073aa] hover:text-[#006292]"
              }`}
            >
              Bhupal Bhattarai
            </a>
          </div>
        </div>
      </footer>
      )}

      {/* SCROLL TO TOP FLOATING BUTTON */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <button
              onClick={scrollToTop}
              className={`p-3.5 rounded-full shadow-2xl transition-all cursor-pointer flex items-center justify-center hover:scale-110 active:scale-95 ${
                currentThemeId === 'dark'
                  ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/25'
                  : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/25'
              }`}
              title="Scroll back to top"
            >
              <ArrowUp className="w-5 h-5 stroke-[2.5]" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* IMMERSIVE DEMAND LETTER ATTACHMENT PREVIEW MODAL */}
      <AnimatePresence>
        {previewDemandLetter && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className={`w-full max-w-3xl rounded-3xl border overflow-hidden shadow-2xl flex flex-col max-h-[90vh] ${
                isDark ? "bg-slate-950 border-slate-850" : "bg-white border-slate-200"
              }`}
            >
              {/* Modal Header */}
              <div className={`p-5 border-b flex items-center justify-between shrink-0 ${
                isDark ? "border-slate-850 bg-slate-900/40" : "border-slate-100 bg-slate-50"
              }`}>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Official Demand Letter
                    </span>
                    {previewDemandLetter.recruitmentQuotaCode && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        isDark ? "bg-slate-900 text-cyan-400 border-slate-800" : "bg-slate-100 text-[#0073aa] border-slate-205"
                      }`}>
                        LT. No: {previewDemandLetter.recruitmentQuotaCode}
                      </span>
                    )}
                  </div>
                  <h3 className={`text-base font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-955"}`}>
                    {previewDemandLetter.title}
                  </h3>
                  <p className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Employing Corporate Brand: {previewDemandLetter.companyName}
                  </p>
                </div>
                <button
                  onClick={() => setPreviewDemandLetter(null)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    isDark 
                      ? "border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900" 
                      : "border-slate-205 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                  title="Close Preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Image Preview Container */}
              <div className={`flex-1 p-6 overflow-y-auto flex items-center justify-center min-h-[300px] ${
                isDark ? "bg-slate-950" : "bg-slate-50/50"
              }`}>
                {previewDemandLetter.demandLetterUrl ? (
                  <div className="relative max-w-full max-h-[55vh] flex items-center justify-center rounded-2xl overflow-hidden border border-slate-500/10 shadow-lg">
                    <img
                      referrerPolicy="no-referrer"
                      src={previewDemandLetter.demandLetterUrl}
                      alt={`Demand Letter for ${previewDemandLetter.title}`}
                      className="max-w-full max-h-[55vh] object-contain rounded-2xl"
                    />
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <Image className="w-12 h-12 text-slate-400 mx-auto animate-pulse" />
                    <p className={`text-sm font-bold ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                      Demand Letter Image is unavailable.
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className={`p-4 border-t flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0 ${
                isDark ? "border-slate-850 bg-slate-900/20" : "border-slate-100 bg-slate-50"
              }`}>
                <span className="text-[10px] text-slate-400 italic font-medium">
                  * All attachments are government approved Nepal Ministry of Labor documents.
                </span>
                <div className="flex gap-2 w-full sm:w-auto justify-end">
                  {previewDemandLetter.demandLetterUrl && (
                    <a
                      href={previewDemandLetter.demandLetterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 w-full sm:w-auto ${
                        isDark 
                          ? "border-slate-800 text-slate-300 hover:bg-slate-900 hover:text-white" 
                          : "border-slate-205 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <Eye className="w-4 h-4 text-cyan-500" />
                      <span>Open Full Size</span>
                    </a>
                  )}
                  <button
                    onClick={() => setPreviewDemandLetter(null)}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#e31e24] hover:bg-red-700 transition-colors w-full sm:w-auto cursor-pointer"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* INTERACTIVE APPLICANT FORMS MODAL WITH RESUME FILE ATTACHMENTS */}
      <AnimatePresence>
        {selectedVacancyForApply && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-xl w-full relative space-y-6"
            >
              <button
                onClick={() => { setSelectedVacancyForApply(null); setUploadedResume(null); setApplicationSuccess(false); setApplicationError(""); }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white hover:bg-white/5 p-1.5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {applicationSuccess ? (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center space-y-5 py-6"
                >
                  <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                    <Check className="w-8 h-8 animate-bounce" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-white tracking-tight animate-pulse">
                      Application Sent!
                    </h3>
                    <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                      Your document packet for <span className="text-amber-400 font-bold">{selectedVacancyForApply.title}</span> has been stored securely in our sourcing index database. Asia Link Services recruitment executives will review your profile shortly.
                    </p>
                  </div>
                  <button
                    onClick={() => { setSelectedVacancyForApply(null); setUploadedResume(null); setApplicationSuccess(false); setApplicationError(""); }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs md:text-sm py-3 rounded-xl transition-all shadow-lg text-center cursor-pointer"
                  >
                    Got It, Thank You!
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
                      {selectedVacancyForApply.location} Rec Scheme
                    </span>
                    <h3 className="text-xl font-extrabold text-[#ffffff] tracking-tight">
                      Application for {selectedVacancyForApply.title}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Submitting to: <span className="text-gray-200">{selectedVacancyForApply.companyName}</span>
                    </p>
                  </div>

                  {applicationError && (
                    <div className="p-3 bg-red-950/25 border border-red-500/20 rounded-xl text-red-400 text-xs font-semibold text-center">
                      {applicationError}
                    </div>
                  )}

                  <form onSubmit={submitApplication} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400">Applicant Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Thapa"
                      value={applicantForm.fullName}
                      onChange={(e) => setApplicantForm({ ...applicantForm, fullName: e.target.value })}
                      className="w-full bg-[#12161b] text-xs border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400">Contact Number (Nepal)</label>
                    <input
                      type="tel"
                      required
                      placeholder="+977-980..."
                      value={applicantForm.phone}
                      onChange={(e) => setApplicantForm({ ...applicantForm, phone: e.target.value })}
                      className="w-full bg-[#12161b] text-xs border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400">Your Home Province</label>
                    <select
                      value={applicantForm.nepalHomeProvince}
                      onChange={(e) => setApplicantForm({ ...applicantForm, nepalHomeProvince: e.target.value })}
                      className="w-full bg-[#12161b] text-xs border border-slate-800 rounded-xl p-3 text-white outline-none font-sans"
                    >
                      {cmsData.provinces.map((prov) => (
                        <option key={prov.id} value={prov.name} className="bg-slate-900">{prov.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400">Experience (Years)</label>
                    <input
                      type="number"
                      value={applicantForm.experienceYears}
                      onChange={(e) => setApplicantForm({ ...applicantForm, experienceYears: e.target.value })}
                      className="w-full bg-[#12161b] text-xs border border-slate-800 rounded-xl p-3 text-white outline-none"
                    />
                  </div>
                </div>

                {/* DRAG AND DROP Resume Uploader UI */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400">Attach Verified CV / Passport Scan</label>
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all ${
                      isDragActive
                        ? "border-amber-400 bg-amber-450/5 text-amber-500"
                        : uploadedResume
                          ? "border-emerald-500 bg-emerald-500/5"
                          : "border-slate-800 hover:border-slate-700 bg-slate-950/20"
                    }`}
                  >
                    <input
                      id="resume-file-picker"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    
                    <label htmlFor="resume-file-picker" className="cursor-pointer space-y-1.5 block">
                      <Upload className={`w-6 h-6 mx-auto ${uploadedResume ? "text-emerald-400" : "text-slate-500"}`} />
                      
                      {uploadedResume ? (
                        <div>
                          <p className="text-xs text-emerald-400 font-bold">File Attached Successfully :</p>
                          <p className="text-[10px] text-gray-300 italic">{uploadedResume.name}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs text-gray-300 font-bold">
                            Drag & Drop your Resume here, or <span className="text-cyan-400 underline">browse computer</span>
                          </p>
                          <p className="text-[9px] text-slate-500">Supports PDF or DOCX up to 10MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400">Bio remarks or Training details</label>
                  <textarea
                    rows={2}
                    placeholder="Briefly state your trade specialization, e.g. certified finishing carpenter from AKH academy."
                    value={applicantForm.message}
                    onChange={(e) => setApplicantForm({ ...applicantForm, message: e.target.value })}
                    className="w-full bg-[#12161b] text-xs border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 outline-none resize-none font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={applicationSubmitted}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs md:text-sm py-3 rounded-xl transition-all shadow-lg text-center"
                >
                  {applicationSubmitted ? "Sending secure application packet..." : "Submit Profile & CV to Asia Link"}
                </button>
              </form>
                </>
              )}
            </motion.div>
          </div>
        )}

        {isPrivacyOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`rounded-3xl p-6 md:p-8 max-w-2xl w-full relative space-y-6 shadow-2xl border transition-colors ${
                isDark 
                  ? "bg-slate-900 border-slate-800 text-slate-300" 
                  : "bg-white border-slate-200 text-slate-650"
              }`}
            >
              <button
                onClick={() => setIsPrivacyOpen(false)}
                className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDark ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                <X className="w-5 h-5" />
              </button>

              <div className={`space-y-1 pb-2 border-b ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                <span className="text-[10px] font-mono uppercase text-[#e31e24] font-extrabold">
                  Corporate Policy Protocol
                </span>
                <h3 className={`text-xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                  Privacy & Policy
                </h3>
                <p className={`text-[10px] font-mono ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                  Effective Date: June 16, 2026 | Document ID: AL-POL-2026-04
                </p>
              </div>

              <div className={`space-y-4 text-xs max-h-[350px] overflow-y-auto pr-2 scrollbar-thin ${isDark ? "scrollbar-thumb-slate-800" : "scrollbar-thumb-slate-200"}`}>
                <p className="leading-relaxed">
                  <strong className={isDark ? "text-white" : "text-slate-900"}>1. Corporate Commitment</strong> <br />
                  Asia Link Services (P.) Ltd. is committed to protecting the privacy and personal credentials of all recruit candidates, employer representatives, and website visitors. We ensure complete compliance with international human rights requirements and local laws of Nepal relating to personal data governance and privacy.
                </p>
                <p className="leading-relaxed">
                  <strong className={isDark ? "text-white" : "text-slate-900"}>2. Personal Data We Collect</strong> <br />
                  For international worker placement processing, we collect verified biometric stats, qualification records, passport details, medical reports, telephone contacts, and email coordinates. We only operate with legitimate information submitted voluntarily.
                </p>
                <p className="leading-relaxed">
                  <strong className={isDark ? "text-white" : "text-slate-900"}>3. Ethical Sourcing & Data Disclosure</strong> <br />
                  Your data is exclusively shared with licensed employers, diplomatic embassies, and administrative labor divisions of governments (e.g., Nepal DOFE). We absolute guarantee zero metadata renting or commercial monetization policies.
                </p>
                <p className="leading-relaxed">
                  <strong className={isDark ? "text-white" : "text-slate-900"}>4. System Security Architecture</strong> <br />
                  All profile data is encrypted at rest and in transit. We implement enterprise firewalls and secure administrative controls to block unauthorized credential harvesting.
                </p>
                <p className="leading-relaxed">
                  <strong className={isDark ? "text-white" : "text-slate-900"}>5. Candidate Rights & Access</strong> <br />
                  Under RBA Sourcing guidelines, all Nepalese candidates hold absolute rights of data correction, retrieval, and voluntary deletion. You can contact our legal counsel Mr. Nilam Gautam at <span className="text-cyan-600 dark:text-cyan-400 font-semibold italic">jobasialink119@gmail.com</span> at any moment.
                </p>
              </div>

              <div className={`pt-4 border-t flex justify-end ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                <button
                  onClick={() => setIsPrivacyOpen(false)}
                  className={`font-bold text-xs py-2.5 px-5 rounded-xl transition-all cursor-pointer ${
                    isDark ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                  }`}
                >
                  Close & Acknowledge
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {isTermsOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`rounded-3xl p-6 md:p-8 max-w-2xl w-full relative space-y-6 shadow-2xl border transition-colors ${
                isDark 
                  ? "bg-slate-900 border-slate-800 text-slate-300" 
                  : "bg-white border-slate-200 text-slate-650"
              }`}
            >
              <button
                onClick={() => setIsTermsOpen(false)}
                className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDark ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                <X className="w-5 h-5" />
              </button>

              <div className={`space-y-1 pb-2 border-b ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                <span className="text-[10px] font-mono uppercase text-[#e31e24] font-extrabold">
                  Corporate Sourcing Covenant
                </span>
                <h3 className={`text-xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                  Terms & Condition
                </h3>
                <p className={`text-[10px] font-mono ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                  Effective Date: June 16, 2026 | Document ID: AL-TOS-2026-09
                </p>
              </div>

              <div className={`space-y-4 text-xs max-h-[350px] overflow-y-auto pr-2 scrollbar-thin ${isDark ? "scrollbar-thumb-slate-800" : "scrollbar-thumb-slate-200"}`}>
                <p className="leading-relaxed">
                  <strong className={isDark ? "text-white" : "text-slate-900"}>1. Ethical Sourcing Policy (RBA Compliance)</strong> <br />
                  Asia Link Services maintains an uncompromising ethical recruitment covenant. We operate a compliant placement standard for all recruitment pipelines. Candidates are processed based strictly on verified capacity and qualified trade credentials.
                </p>
                <p className="leading-relaxed">
                  <strong className={isDark ? "text-white" : "text-slate-900"}>2. Legitimacy of Sourced Claims</strong> <br />
                  All foreign employment demand documents displayed are verified and licensed under government registries (e.g. Nepal Department of Foreign Employment, license 119/055/056). Users are advised to double-check LT Numbers on DOFE official portals.
                </p>
                <p className="leading-relaxed">
                  <strong className={isDark ? "text-white" : "text-slate-900"}>3. Sourcing and Training Assurances</strong> <br />
                  Candidates placed under certified training lines (e.g. through AKH Training Academy Nepal) carry certified trade-credentials. The agency reserves full authority over screening standards to verify eligibility.
                </p>
                <p className="leading-relaxed">
                  <strong className={isDark ? "text-white" : "text-slate-900"}>4. Bilateral Agreements</strong> <br />
                  The relationship between global employer agencies and Asia Link Services is strictly governed by the official Power of Attorney and Inter-Party Agreement documents endorsed by Chamber of Commerce bodies.
                </p>
                <p className="leading-relaxed">
                  <strong className={isDark ? "text-white" : "text-slate-900"}>5. Local Jurisdictional Scope</strong> <br />
                  These terms are exclusively interpreted under the courts of Kathmandu, Nepal, and matching destination treaty clauses of Middle Eastern state-laws, Japan JITCO rules, or similar sovereign authorities.
                </p>
              </div>

              <div className={`pt-4 border-t flex justify-end ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                <button
                  onClick={() => setIsTermsOpen(false)}
                  className={`font-bold text-xs py-2.5 px-5 rounded-xl transition-all cursor-pointer ${
                    isDark ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                  }`}
                >
                  Accept & Complete
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {isCsrOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`rounded-3xl p-6 md:p-8 max-w-2xl w-full relative space-y-6 shadow-2xl border transition-colors text-left ${
                isDark 
                  ? "bg-slate-900 border-slate-800 text-slate-300" 
                  : "bg-white border-slate-200 text-slate-650"
              }`}
            >
              <button
                onClick={() => setIsCsrOpen(false)}
                className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDark ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                <X className="w-5 h-5" />
              </button>

              <div className={`space-y-1 pb-2 border-b ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                <span className={`text-[10px] font-mono uppercase font-extrabold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                  Corporate Responsibility Covenant
                </span>
                <h3 className={`text-xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                  Corporate Social Responsibility (CSR)
                </h3>
                <p className={`text-[10px] font-mono ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                  Asia Link Services Pvt. Ltd. | Sustainable Development Commitment
                </p>
              </div>

              <div className={`space-y-4 text-xs max-h-[350px] overflow-y-auto pr-2 scrollbar-thin leading-relaxed text-left ${
                isDark ? "scrollbar-thumb-slate-800" : "scrollbar-thumb-slate-200"
              }`}>
                <p>
                  <strong className={isDark ? "text-white" : "text-slate-900"}>1. Ethical Recruitment & International Compliance</strong> <br />
                  Asia Link Services proudly advocates and strictly implements transparent and compliant recruitment standards. We work diligently with international partners to ensure all candidates are placed with absolute integrity, preserving fair practices and candidate welfare. We maintain complete compatibility with the Responsible Business Alliance (RBA) guidelines.
                </p>
                <p>
                  <strong className={isDark ? "text-white" : "text-slate-900"}>2. Community Welfare & Safe Remittance Seminars</strong> <br />
                  Our agency invests actively in local Nepalese community welfare. We regularly host free financial literacy, digital banking, and safe remittance seminars in suburban and rural provinces across Nepal. This ensures that workers can handle domestic savings security and protect their earned income.
                </p>
                <p>
                  <strong className={isDark ? "text-white" : "text-slate-900"}>3. Educational Opportunities & Youth Advocacy</strong> <br />
                  We provide direct support, school materials sponsorship, and professional technical vocational grants for children and dependent family members of deployed Nepalese candidates. This supports sustainable family growth and community levels in rural districts.
                </p>
                <p>
                  <strong className={isDark ? "text-white" : "text-slate-900"}>4. Environmental Sustainability & Green Headquarters</strong> <br />
                  At our headquarters in Bansbari, Kathmandu, we maintain environment-conscious workflows. Since 2024, our digital transformation strategy has transitioned over 85% of physical files into secure digital assets, significantly cutting local paper consumption. We also maintain energy-efficient systems to limit our carbon footprint.
                </p>
              </div>

              <div className={`pt-4 border-t flex justify-end ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                <button
                  onClick={() => setIsCsrOpen(false)}
                  className={`font-bold text-xs py-2.5 px-5 rounded-xl transition-all cursor-pointer ${
                    isDark ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                  }`}
                >
                  Close & Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* GOVERNANCE NOTICE DETAIL MODAL */}
        {selectedNoticeDetail && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`rounded-[2rem] p-6 md:p-8 max-w-2xl w-full relative space-y-6 shadow-2xl border transition-colors text-left ${
                isDark 
                  ? "bg-slate-900 border-slate-800 text-slate-300" 
                  : "bg-white border-slate-205 text-slate-650"
              }`}
            >
              <button
                onClick={() => setSelectedNoticeDetail(null)}
                className={`absolute top-5 right-5 p-2 rounded-xl transition-colors cursor-pointer ${
                  isDark ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className={`space-y-2 pb-4 border-b ${isDark ? "border-slate-800" : "border-slate-200/60"}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-mono uppercase font-extrabold px-2.5 py-0.5 rounded-full border ${
                    isDark ? "bg-slate-950 text-amber-400 border-slate-900" : "bg-slate-50 text-amber-700 border-slate-200"
                  }`}>
                    {selectedNoticeDetail.tag}
                  </span>
                  {selectedNoticeDetail.date && (
                    <span className={`text-[10px] font-mono flex items-center gap-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      <Calendar className="w-3.5 h-3.5 opacity-80" />
                      {new Date(selectedNoticeDetail.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </span>
                  )}
                </div>
                <h3 className={`text-xl md:text-2xl font-black tracking-tight leading-snug ${isDark ? "text-white" : "text-slate-900"}`}>
                  {selectedNoticeDetail.title}
                </h3>
              </div>

              <div className={`space-y-4 text-xs md:text-sm max-h-[400px] overflow-y-auto pr-2 scrollbar-thin leading-relaxed text-left ${
                isDark ? "scrollbar-thumb-slate-800" : "scrollbar-thumb-slate-200"
              }`}>
                {selectedNoticeDetail.imageUrl && (
                  <div className="mb-4 rounded-2xl overflow-hidden border border-slate-500/10 max-h-72 flex justify-center bg-slate-900/5">
                    <img 
                      src={selectedNoticeDetail.imageUrl} 
                      alt={selectedNoticeDetail.title} 
                      className="max-w-full max-h-72 object-contain" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                )}

                <p className={`${isDark ? "text-slate-250" : "text-slate-800"} text-sm md:text-base font-semibold leading-relaxed`}>
                  {selectedNoticeDetail.description}
                </p>

                <div className={`pt-4 border-t space-y-3 ${isDark ? "border-slate-800" : "border-slate-200/60"}`}>
                  <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                    isDark ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}>
                    <div className="p-1 rounded-lg bg-red-500/10 text-[#e31e24] border border-[#e31e24]/10 shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-[10px] uppercase font-mono tracking-wide text-red-500">Anonymous Whistleblower Hotline</p>
                      <p className="text-[11px] leading-relaxed">Report any unauthorized service demands or requests for administrative charges directly to: <span className="font-mono font-bold text-red-500">jobasialink119@gmail.com</span></p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`pt-4 border-t flex flex-wrap justify-between items-center gap-3 ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                <button
                  onClick={() => {
                    setSelectedNoticeDetail(null);
                    navigateToPage("notices");
                  }}
                  className={`font-black text-xs py-2.5 px-4 rounded-xl transition-all border flex items-center gap-1.5 cursor-pointer ${
                    isDark 
                      ? "bg-slate-950 hover:bg-slate-900 border-slate-800 text-slate-200" 
                      : "bg-white hover:bg-slate-50 border-slate-205 text-slate-700"
                  }`}
                >
                  <span>Go to Compliance Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setSelectedNoticeDetail(null)}
                  className={`font-black text-xs py-2.5 px-5 rounded-xl transition-all cursor-pointer ${
                    isDark ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-[#0073aa] hover:bg-[#006292] text-white"
                  }`}
                >
                  Close Notice Detail
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* GLOBAL CLIENT SEARCH CONSOLE */}
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-slate-950/80 backdrop-blur-md">
            
            {/* Backdrop click to close */}
            <div className="absolute inset-0 cursor-default" onClick={() => { setIsSearchOpen(false); setGlobalSearchQuery(""); }} />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`relative w-full max-w-2xl border rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.6)] overflow-hidden z-10 p-5 space-y-4 transition-colors ${
                isDark 
                  ? "bg-slate-950 border-slate-800 text-white" 
                  : "bg-white border-slate-200 text-slate-800"
              }`}
            >
              {/* Top search action bar */}
              <div className={`relative flex items-center border-b pb-4 ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                <Search className={`absolute left-3.5 top-2.5 w-5 h-5 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                <input
                  type="text"
                  placeholder="Query jobs, agencies, files, or site sections..."
                  className={`w-full rounded-2xl pl-11 pr-12 py-2.5 text-sm font-medium border outline-none transition-all ${
                    isDark
                      ? "bg-slate-900/60 text-white border-slate-800 focus:border-cyan-500/50 placeholder:text-slate-500"
                      : "bg-slate-50 text-slate-900 border-slate-200 focus:border-sky-500/50 placeholder:text-slate-400"
                  }`}
                  value={globalSearchQuery}
                  onChange={(e) => setGlobalSearchQuery(e.target.value)}
                  autoFocus
                />
                
                {/* Clear query or close button */}
                {globalSearchQuery ? (
                  <button
                    onClick={() => setGlobalSearchQuery("")}
                    className={`absolute right-3.5 top-2.5 p-1 rounded-md transition-all text-xs font-mono font-bold ${
                      isDark ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    Clear
                  </button>
                ) : (
                  <button
                    onClick={() => { setIsSearchOpen(false); setGlobalSearchQuery(""); }}
                    className={`absolute right-3.5 top-2.5 p-1 rounded-md transition-all text-xs font-mono font-bold ${
                      isDark ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    ESC
                  </button>
                )}
              </div>

              {/* Dynamic scrollable results panel */}
              <div className={`max-h-[380px] overflow-y-auto pr-1 space-y-4 scrollbar-thin ${isDark ? "scrollbar-thumb-slate-800" : "scrollbar-thumb-slate-200"}`}>
                {!globalSearchQuery.trim() ? (
                  <div className="py-8 text-center space-y-2">
                    <p className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>Try typing something to query the Asia Link Database...</p>
                    <div className="flex flex-wrap gap-2 justify-center pt-2">
                      {["HVAC", "Driver", "Saudi", "Japan", "License", "Team", "Contact"].map((term) => (
                        <button
                          key={term}
                          onClick={() => setGlobalSearchQuery(term)}
                          className={`px-3 py-1 border rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                            isDark
                              ? "bg-slate-900 border-slate-800 text-cyan-400 hover:border-cyan-500/40 hover:bg-cyan-950/10"
                              : "bg-slate-100 border-slate-200 text-sky-600 hover:border-sky-400/40 hover:bg-sky-50"
                          }`}
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className={`py-12 text-center text-xs space-y-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    <p className={`font-semibold ${isDark ? "text-slate-300" : "text-slate-800"}`}>No records matched your search query</p>
                    <p className="text-[10px]">Verify spellings or try other keywords like "Medical", "Hotel", or "UAE".</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Pages section */}
                    {searchResults.filter(r => r.type === "page").length > 0 && (
                      <div className="space-y-2">
                        <h4 className={`text-[10px] font-mono uppercase tracking-widest font-bold px-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>Pages & Sections</h4>
                        <div className="grid grid-cols-1 gap-1.5">
                          {searchResults.filter(r => r.type === "page").map((res, i) => (
                            <button
                              key={i}
                              onClick={res.action}
                              className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3 group ${
                                isDark
                                  ? "bg-slate-900/30 hover:bg-slate-900 border-slate-850 hover:border-slate-750"
                                  : "bg-slate-50 hover:bg-slate-100/80 border-slate-100/80 hover:border-slate-200"
                              }`}
                            >
                              <Info className="w-4 h-4 text-[#e31e24] mt-0.5 group-hover:scale-110 transition-transform shrink-0" />
                              <div>
                                <h5 className={`text-xs font-bold transition-colors ${isDark ? "text-white group-hover:text-cyan-400" : "text-slate-800 group-hover:text-sky-600"}`}>{res.title}</h5>
                                <p className={`text-[10px] line-clamp-1 mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{res.subtitle}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Careers segment */}
                    {searchResults.filter(r => r.type === "job").length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#e31e24] font-bold px-1">Active Career Openings</h4>
                        <div className="grid grid-cols-1 gap-1.5">
                          {searchResults.filter(r => r.type === "job").map((res, i) => (
                            <button
                              key={i}
                              onClick={res.action}
                              className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3 group ${
                                isDark
                                  ? "bg-slate-950/30 hover:bg-slate-900 border-slate-850 hover:border-[#e31e24]/30"
                                  : "bg-white hover:bg-slate-50 border-slate-150 hover:border-[#e31e24]/30 shadow-xs"
                              }`}
                            >
                              <Briefcase className="w-4 h-4 text-cyan-400 mt-0.5 group-hover:scale-110 transition-transform shrink-0" />
                              <div>
                                <h5 className={`text-xs font-bold transition-colors ${isDark ? "text-white group-hover:text-[#e31e24]" : "text-slate-800 group-hover:text-[#e31e24]"}`}>{res.title}</h5>
                                <p className={`text-[10px] line-clamp-1 mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{res.subtitle}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sectors segment */}
                    {searchResults.filter(r => r.type === "sector").length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-mono uppercase tracking-widest text-cyan-500 font-bold px-1">Occupational Sectors</h4>
                        <div className="grid grid-cols-1 gap-1.5">
                          {searchResults.filter(r => r.type === "sector").map((res, i) => (
                            <button
                              key={i}
                              onClick={res.action}
                              className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3 group ${
                                isDark
                                  ? "bg-slate-900/30 hover:bg-slate-900 border-slate-850 hover:border-cyan-500/30"
                                  : "bg-slate-50 hover:bg-slate-100/80 border-slate-100/80 hover:border-cyan-500/20"
                              }`}
                            >
                              <Globe className="w-4 h-4 text-amber-500 mt-0.5 group-hover:scale-110 transition-transform shrink-0" />
                              <div>
                                <h5 className={`text-xs font-bold transition-colors ${isDark ? "text-white group-hover:text-cyan-400" : "text-slate-800 group-hover:text-sky-600"}`}>{res.title}</h5>
                                <p className={`text-[10px] line-clamp-1 mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{res.subtitle}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Compliance Notices segment */}
                    {searchResults.filter(r => r.type === "notice").length > 0 && (
                      <div className="space-y-2">
                        <h4 className={`text-[10px] font-mono uppercase tracking-widest font-bold px-1 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>Regulations & Notices</h4>
                        <div className="grid grid-cols-1 gap-1.5">
                          {searchResults.filter(r => r.type === "notice").map((res, i) => (
                            <button
                              key={i}
                              onClick={res.action}
                              className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3 group ${
                                isDark
                                  ? "bg-slate-900/30 hover:bg-slate-900 border-slate-850 hover:border-emerald-500/30"
                                  : "bg-slate-50 hover:bg-slate-100/80 border-slate-100/80 hover:border-emerald-500/20"
                              }`}
                            >
                              <FileCheck className="w-4 h-4 text-emerald-550 dark:text-emerald-400 mt-0.5 group-hover:scale-110 transition-transform shrink-0" />
                              <div>
                                <h5 className={`text-xs font-bold transition-colors ${isDark ? "text-white group-hover:text-emerald-400" : "text-slate-800 group-hover:text-emerald-600"}`}>{res.title}</h5>
                                <p className={`text-[10px] line-clamp-1 mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{res.subtitle}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Executive Officers segment */}
                    {searchResults.filter(r => r.type === "team").length > 0 && (
                      <div className="space-y-2">
                        <h4 className={`text-[10px] font-mono uppercase tracking-widest font-bold px-1 ${isDark ? "text-purple-400" : "text-purple-600"}`}>Executive Officers</h4>
                        <div className="grid grid-cols-1 gap-1.5">
                          {searchResults.filter(r => r.type === "team").map((res, i) => (
                            <button
                              key={i}
                              onClick={res.action}
                              className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3 group ${
                                isDark
                                  ? "bg-slate-900/30 hover:bg-slate-900 border-slate-850 hover:border-purple-500/30"
                                  : "bg-slate-50 hover:bg-slate-100/80 border-slate-100/80 hover:border-purple-500/20"
                              }`}
                            >
                              <UserCheck className="w-4 h-4 text-purple-550 dark:text-purple-400 mt-0.5 group-hover:scale-110 transition-transform shrink-0" />
                              <div>
                                <h5 className={`text-xs font-bold transition-colors ${isDark ? "text-white group-hover:text-purple-400" : "text-slate-800 group-hover:text-purple-600"}`}>{res.title}</h5>
                                <p className={`text-[10px] line-clamp-1 mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{res.subtitle}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom footer guidelines */}
              <div className={`text-center pt-2 border-t ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                <span className={`text-[9px] font-mono ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                  Asia Link Search Engine • Real-time Compliance Indexing • ESC to cancel
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
export {};
