import fs from "fs";
import path from "path";

const DB_DIR = path.join(process.cwd(), "db");

// Helper to ensure the db directory exists
function ensureDbDir() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
}

// Low-level read helper
function readJsonFile<T>(filename: string, defaultValue: T): T {
  ensureDbDir();
  const filePath = path.join(DB_DIR, filename);
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content) as T;
    }
  } catch (error) {
    console.error(`Error reading database file ${filename}:`, error);
  }
  // Return the default value and write it if the file doesn't exist yet
  writeJsonFile(filename, defaultValue);
  return defaultValue;
}

// Low-level write helper
function writeJsonFile<T>(filename: string, data: T): void {
  ensureDbDir();
  const filePath = path.join(DB_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error writing database file ${filename}:`, error);
  }
}

// Types for the DB records (mirrored from src/types.ts)
export interface ApplicationRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  permanentAddress: string;
  temporaryAddress: string;
  passportNo: string;
  dateOfBirth: string;
  academicQualification: string;
  experience: string;
  selectedJobTitle: string;
  photoUrl: string;
  passportUrl: string;
  cvUrl: string;
  submittedAt: string;
}

export interface ContactMessageRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  submittedAt: string;
  replyText?: string;
  repliedAt?: string;
}

export interface DemandRecord {
  id: string;
  title: string;
  companyName: string;
  location: string;
  positionsMale: number;
  positionsFemale: number;
  salary: string;
  foodAllowance: string;
  duration: string;
  workingHours: string;
  workingDays: number;
  recruitmentQuotaCode?: string;
  active: boolean;
  requiredDocuments?: string[];
  demandLetterUrl?: string;
  termsAndConditions?: string;
  subJobs?: any[];
  ageMin?: number;
  ageMax?: number;
}

export interface NoticeRecord {
  id: string;
  title: string;
  description: string;
  tag: string;
  color: string;
  date: string;
}

export interface TeamRecord {
  id: string;
  name: string;
  role: string;
  shortDescription: string;
  photoUrl?: string;
}

export interface PartnerRecord {
  id: string;
  name: string;
  logoUrl?: string;
  industry: string;
  website?: string;
  description?: string;
}

// Initial default data for seeding
const defaultDemands: DemandRecord[] = [
  {
    id: "vac-1",
    title: "Premium Cleaners (Male/Female)",
    companyName: "Emrill Services LLC",
    location: "Dubai, United Arab Emirates (UAE)",
    positionsMale: 150,
    positionsFemale: 50,
    salary: "AED 800",
    foodAllowance: "AED 250 (Or fully provided by company)",
    duration: "2 Years (Renewable)",
    workingHours: "8 Hours / Day",
    workingDays: 6,
    recruitmentQuotaCode: "LT. No. 317722",
    active: true,
    requiredDocuments: ["Passport with 1-year validity minimum", "6 Passport size white background photos", "Police Clearance Report from Nepal Police"]
  },
  {
    id: "vac-2",
    title: "Commercial Cleaning Crews & Light Drivers",
    companyName: "Al Mukhtar Cleaning Services",
    location: "Doha, State of Qatar",
    positionsMale: 268,
    positionsFemale: 35,
    salary: "QR 1000 - 1700",
    foodAllowance: "Provided free of charge",
    duration: "2 Years",
    workingHours: "8 Hours",
    workingDays: 6,
    recruitmentQuotaCode: "LT. No. 320373",
    active: true,
    requiredDocuments: ["Passport Copy", "GCC Driving License for Light Drivers", "Medical Fitness Certificate"]
  },
  {
    id: "vac-3",
    title: "Infrastructure Building Labourers & Carpenters",
    companyName: "United International Group",
    location: "Abu Dhabi, UAE",
    positionsMale: 450,
    positionsFemale: 0,
    salary: "AED 800 - 1200",
    foodAllowance: "Provided free of charge",
    duration: "2 Years",
    workingHours: "8 Hours / Day",
    workingDays: 6,
    recruitmentQuotaCode: "LT. No. 305201",
    active: true,
    requiredDocuments: ["Experience certificate of carpentry if applicable", "Basic English or Arabic speaking skills"]
  },
  {
    id: "vac-4",
    title: "Hospitality Crew, Cashiers & Retail Staff",
    companyName: "Pivot Contracting and Hospitality Group",
    location: "Riyadh & Jeddah, Kingdom of Saudi Arabia (KSA)",
    positionsMale: 80,
    positionsFemale: 40,
    salary: "SR 1200 - 1800",
    foodAllowance: "SR 300 allowance provided monthly",
    duration: "2 Years (Renewable)",
    workingHours: "8 Hours / Day",
    workingDays: 6,
    active: true
  },
  {
    id: "vac-5",
    title: "HVAC Technicians & Industrial Electricians",
    companyName: "Trojan Construction Group",
    location: "Abu Dhabi, UAE",
    positionsMale: 120,
    positionsFemale: 0,
    salary: "AED 1300 - 1800",
    foodAllowance: "Provided free of charge",
    duration: "2 Years",
    workingHours: "8 Hours",
    workingDays: 6,
    active: true,
    recruitmentQuotaCode: "LT. No. 312044"
  },
  {
    id: "vac-6",
    title: "Security Guards & Officers (Ex-Army/Civil)",
    companyName: "Wira Security Services",
    location: "Kuala Lumpur, Malaysia",
    positionsMale: 85,
    positionsFemale: 15,
    salary: "MYR 1800 - 2400",
    foodAllowance: "Allowance of MYR 300 provided",
    duration: "2 Years",
    workingHours: "12 Hours / Day (Including OT)",
    workingDays: 6,
    active: true,
    recruitmentQuotaCode: "LT. No. 294021"
  },
  {
    id: "vac-7",
    title: "Heavy Equipment & Forklift Operators",
    companyName: "CSCEC Middle East",
    location: "Dubai, UAE",
    positionsMale: 60,
    positionsFemale: 0,
    salary: "AED 1800 - 2200",
    foodAllowance: "Provided free of charge",
    duration: "2 Years",
    workingHours: "8 Hours / Day",
    workingDays: 6,
    active: true,
    recruitmentQuotaCode: "LT. No. 308819"
  },
  {
    id: "vac-8",
    title: "Agricultural & Greenhouse Growers",
    companyName: "Nippon Agri-Partners",
    location: "Tokyo & Ibaraki, Japan",
    positionsMale: 25,
    positionsFemale: 15,
    salary: "JPY 160,000 - 180,000",
    foodAllowance: "Subsidized meals provided",
    duration: "1-3 Years",
    workingHours: "8 Hours / Day",
    workingDays: 5,
    active: true,
    recruitmentQuotaCode: "JITCO No. 34110"
  },
  {
    id: "vac-9",
    title: "Scaffolders & Steel Fixers",
    companyName: "Almusallam Group",
    location: "Riyadh, Kingdom of Saudi Arabia (KSA)",
    positionsMale: 200,
    positionsFemale: 0,
    salary: "SR 1100 - 1400",
    foodAllowance: "Provided free of charge",
    duration: "2 Years",
    workingHours: "8 Hours / Day",
    workingDays: 6,
    active: true,
    recruitmentQuotaCode: "LT. No. 325112"
  },
  {
    id: "vac-10",
    title: "Hotel Housekeepers, Stewards & Waiters",
    companyName: "Bhatia General Contracting",
    location: "Doha, State of Qatar",
    positionsMale: 45,
    positionsFemale: 45,
    salary: "QR 1100 - 1500",
    foodAllowance: "Meals provided during shift",
    duration: "2 Years",
    workingHours: "8 Hours / Day",
    workingDays: 6,
    active: true,
    recruitmentQuotaCode: "LT. No. 316521"
  }
];

const defaultNotices: NoticeRecord[] = [
  {
    id: "n-1",
    title: "Ethical Sourcing Assurance",
    description: "In alignment with the RBA Code of Conduct, Asia Link enforces a strict fair sourcing and transparency policy. Any unauthorized demand for commissions must be reported immediately.",
    tag: "Security",
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    date: "2026-06-15"
  },
  {
    id: "n-2",
    title: "Compulsory Bio-Metrics Sourcing",
    description: "All candidate listings are strictly evaluated, requiring mandatory GAMCA-certified medical clearance and biometric registration at authorized centers.",
    tag: "Health",
    color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
    date: "2026-06-10"
  },
  {
    id: "n-3",
    title: "Statutory License Endorsements",
    description: "Our operations strictly comply with government license number 119/055/056 authorized by the Ministry of Labour, Employment and Social Security, Nepal.",
    tag: "Legal",
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    date: "2026-06-01"
  },
  {
    id: "n-4",
    title: "Pre-Departure Orientation Covenants",
    description: "Pursuant to Department of Foreign Employment rules, pre-departure orientation remains compulsory to secure safe transition and legal clearance.",
    tag: "Compliance",
    color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
    date: "2026-05-20"
  },
  {
    id: "n-5",
    title: "Embassy Contract Endorsement",
    description: "No candidate is deployed without physical employment contract ratification at the respectve Nepalese Embassy in the trade destination country.",
    tag: "Verification",
    color: "text-[#e31e24] bg-red-500/5 border-[#e31e24]/20",
    date: "2026-05-15"
  },
  {
    id: "n-6",
    title: "Minimum Age Requirement Check",
    description: "Strict age limits are observed. Candidate eligibility requires a verified age of exactly 18+ years at the time of passport filings under law.",
    tag: "Audit",
    color: "text-sky-500 bg-sky-500/10 border-sky-500/20",
    date: "2026-05-02"
  },
  {
    id: "n-7",
    title: "Direct Flight Routing Policy",
    description: "All travel sequences are booked via direct or approved flights from Tribhuvan International Airport (TIA) to maintain safe transit coordinates.",
    tag: "Logistics",
    color: "text-teal-500 bg-teal-500/10 border-teal-500/20",
    date: "2026-04-28"
  },
  {
    id: "n-8",
    title: "Secure Grievance Resolution Desk",
    description: "Direct reporting and conflict-resolution emails are protected. Flag unauthorized requests at jobasialink119@gmail.com with total anonymity.",
    tag: "Audit",
    color: "text-[#e31e24] bg-red-500/5 border-[#e31e24]/20",
    date: "2026-04-10"
  },
  {
    id: "n-9",
    title: "Vetted Trade Evaluations",
    description: "Sourced candidates undergo meticulous vocational screenings and trials conducted at elite partner labs and the AKH Training Academy.",
    tag: "Standards",
    color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    date: "2026-03-15"
  },
  {
    id: "n-10",
    title: "Integrity Verification Process",
    description: "To prevent external spoofing, all demand quotas are cross-referenced directly with state agencies before publication across public boards.",
    tag: "Excellence",
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    date: "2026-02-28"
  }
];

const defaultTeam: TeamRecord[] = [
  {
    id: "m-1",
    name: "Meelan Kattel",
    role: "Founder & Chairman",
    shortDescription: "Strategic head driving Asia Link Services with 25+ years of certified recruitment excellence across Europe, Japan, and the GCC.",
    photoUrl: ""
  },
  {
    id: "m-2",
    name: "Sunita Sharma",
    role: "Executive Recruitment Director",
    shortDescription: "Oversees foreign embassy relations, government approvals, and JITCO training coordination with unmatched dedication.",
    photoUrl: ""
  },
  {
    id: "m-3",
    name: "Bhupal Bhattarai",
    role: "Operations & IT Manager",
    shortDescription: "Drives modern automation tools, secure compliance databases, and trade-testing systems for zero-compromise speed.",
    photoUrl: ""
  }
];

const defaultPartners: PartnerRecord[] = [
  { id: "c-logo-1", name: "United International Group", industry: "General Contracting" },
  { id: "c-logo-2", name: "Emrill Services LLC", industry: "Facility Management" },
  { id: "c-logo-3", name: "Al Mukhtar Cleaning Services", industry: "Hospitality & Cleaning" },
  { id: "c-logo-4", name: "Legacious Manpower", industry: "Corporate Personnel" },
  { id: "c-logo-5", name: "Pivot General Contacting", industry: "Engineering & Hospitality" },
  { id: "c-logo-6", name: "Trojan Construction Group", industry: "Real Estate & Civil Engineering" },
  { id: "c-logo-7", name: "CSCEC Middle East", industry: "Infrastructure" },
  { id: "c-logo-8", name: "Wira Security Services", industry: "Armed Protection" },
  { id: "c-logo-9", name: "Bhatia General Contracting", industry: "Hotel Developments" },
  { id: "c-logo-10", name: "Almusallam Group", industry: "Trading & Logistics" }
];

// Helper to seed all database tables with premium default data
export function initializeDatabase() {
  ensureDbDir();
  
  // Create /db/applications.json if not exist
  readJsonFile<ApplicationRecord[]>("applications.json", []);
  
  // Create /db/contact_messages.json if not exist
  readJsonFile<ContactMessageRecord[]>("contact_messages.json", []);

  // Create & seed /db/demands.json
  readJsonFile<DemandRecord[]>("demands.json", defaultDemands);

  // Create & seed /db/notices.json
  readJsonFile<NoticeRecord[]>("notices.json", defaultNotices);

  // Create & seed /db/team.json
  readJsonFile<TeamRecord[]>("team.json", defaultTeam);

  // Create & seed /db/partners.json
  readJsonFile<PartnerRecord[]>("partners.json", defaultPartners);
  
  console.log("[JSON DATABASE ENGINE] All tables verified and seed checked in 'db' folder.");
}

// Database actions interface
export const db = {
  // 1. Applications (Job Applications submitted)
  getApplications: (): ApplicationRecord[] => {
    return readJsonFile<ApplicationRecord[]>("applications.json", []);
  },
  saveApplication: (app: Omit<ApplicationRecord, "id" | "submittedAt">): ApplicationRecord => {
    const apps = readJsonFile<ApplicationRecord[]>("applications.json", []);
    const newApp: ApplicationRecord = {
      ...app,
      id: `app-${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      submittedAt: new Date().toISOString()
    };
    apps.unshift(newApp);
    writeJsonFile("applications.json", apps);
    return newApp;
  },
  deleteApplication: (id: string): boolean => {
    const apps = readJsonFile<ApplicationRecord[]>("applications.json", []);
    const filtered = apps.filter(a => a.id !== id);
    if (filtered.length !== apps.length) {
      writeJsonFile("applications.json", filtered);
      return true;
    }
    return false;
  },

  // 2. Contact Messages
  getContactMessages: (): ContactMessageRecord[] => {
    const msgs = readJsonFile<ContactMessageRecord[]>("contact_messages.json", []);
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const activeMsgs = msgs.filter(m => {
      try {
        if (!m.replyText) {
          return true; // Keep all active (unresolved) tickets regardless of age
        }
        // For resolved tickets, check if resolved (repliedTo) or submitted more than 30 days ago
        const compareTimeStr = m.repliedAt || m.submittedAt;
        const compareTime = new Date(compareTimeStr).getTime();
        return compareTime >= thirtyDaysAgo;
      } catch (e) {
        return true; // Keep if invalid date format
      }
    });
    if (activeMsgs.length !== msgs.length) {
      writeJsonFile("contact_messages.json", activeMsgs);
    }
    return activeMsgs;
  },
  saveContactMessage: (msg: Omit<ContactMessageRecord, "id" | "submittedAt">): ContactMessageRecord => {
    const msgs = readJsonFile<ContactMessageRecord[]>("contact_messages.json", []);
    const newMsg: ContactMessageRecord = {
      ...msg,
      id: `msg-${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      submittedAt: new Date().toISOString()
    };
    msgs.unshift(newMsg);
    writeJsonFile("contact_messages.json", msgs);
    return newMsg;
  },
  deleteContactMessage: (id: string): boolean => {
    const msgs = readJsonFile<ContactMessageRecord[]>("contact_messages.json", []);
    const filtered = msgs.filter(m => m.id !== id);
    if (filtered.length !== msgs.length) {
      writeJsonFile("contact_messages.json", filtered);
      return true;
    }
    return false;
  },
  updateContactMessage: (id: string, updates: Partial<ContactMessageRecord>): boolean => {
    const msgs = readJsonFile<ContactMessageRecord[]>("contact_messages.json", []);
    const idx = msgs.findIndex(m => m.id === id);
    if (idx !== -1) {
      msgs[idx] = { ...msgs[idx], ...updates };
      writeJsonFile("contact_messages.json", msgs);
      return true;
    }
    return false;
  },

  // 3. Demands (Vacancies)
  getDemands: (): DemandRecord[] => {
    return readJsonFile<DemandRecord[]>("demands.json", defaultDemands);
  },
  saveDemands: (demands: DemandRecord[]): void => {
    writeJsonFile("demands.json", demands);
  },

  // 4. Notices
  getNotices: (): NoticeRecord[] => {
    return readJsonFile<NoticeRecord[]>("notices.json", defaultNotices);
  },
  saveNotices: (notices: NoticeRecord[]): void => {
    writeJsonFile("notices.json", notices);
  },

  // 5. Team Details
  getTeam: (): TeamRecord[] => {
    return readJsonFile<TeamRecord[]>("team.json", defaultTeam);
  },
  saveTeam: (team: TeamRecord[]): void => {
    writeJsonFile("team.json", team);
  },

  // 6. Partners
  getPartners: (): PartnerRecord[] => {
    return readJsonFile<PartnerRecord[]>("partners.json", defaultPartners);
  },
  savePartners: (partners: PartnerRecord[]): void => {
    writeJsonFile("partners.json", partners);
  }
};
