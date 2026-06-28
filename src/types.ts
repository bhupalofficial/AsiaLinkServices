export interface ContactInfo {
  phone: string;
  alternatePhone?: string;
  email: string;
  alternateEmail?: string;
  address: string;
  postalBox: string;
  website: string;
  websiteAlternate?: string;
  facebook?: string;
  whatsapp?: string;
  googleMapLink?: string;
  googleMapEmbed?: string;
}

export interface CompanyMeta {
  title: string;
  subtitle: string;
  govLicenseNo: string;
  jitcoNo: string;
  saudiIdNo: string;
  panNo: string;
  authorizedCapital: string;
  issuedCapital: string;
  banks: string[];
  legalAdvisor: string;
  memberships: string[];
  sisterCompanies: string[];
  heroBgUrl?: string;
}

export interface ChairmanMessage {
  name: string;
  title: string;
  mobile: string;
  avatarUrl: string;
  salutation: string;
  paragraphs: string[];
}

export interface GuidingValue {
  id: string;
  title: string;
  description: string;
  iconName: string; // lucide icon identifier
}

export interface CodeOfEthicsItem {
  id: string;
  text: string;
}

export interface CodeOfConductItem {
  id: string;
  text: string;
}

export interface ProvinceInfo {
  id: string;
  name: string;
  city: string;
  keyWorkerTraits: string;
}

export interface JobCategory {
  id: string;
  name: string;
  roles: string[];
}

export interface RecruitedCategoryGroup {
  id: string;
  title: string;
  categories: string[];
}

export interface SubJob {
  id: string;
  jobTitle: string;
  salary: string;
  positionsMale: number;
  positionsFemale: number;
}

export interface Vacancy {
  id: string;
  title: string;
  companyName: string;
  location: string; // KSA, UAE, Qatar, Japan, etc.
  positionsMale: number;
  positionsFemale: number;
  salary: string; // e.g. "AED 1000" or "QR 1200"
  foodAllowance: string; // e.g. "Provided", "Included", "AED 200"
  duration: string; // e.g. "2 Years"
  workingHours: string; // e.g. "8 hours/day"
  workingDays: number; // e.g. 6
  recruitmentQuotaCode?: string; // e.g. "LT. No. 320373"
  active: boolean;
  requiredDocuments?: string[];
  demandLetterUrl?: string;
  termsAndConditions?: string;
  subJobs?: SubJob[];
  ageMin?: number;
  ageMax?: number;
}

export interface ClientLogo {
  id: string;
  name: string;
  logoUrl?: string;
  industry: string;
  website?: string;
  description?: string;
}

export interface DocumentRequiredStep {
  id: string;
  title: string;
  description: string;
}

export interface SelectionStep {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface Notice {
  id: string;
  title: string;
  description: string;
  tag: string;
  color: string;
  date: string;
  imageUrl?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  shortDescription: string;
  photoUrl?: string;
}

export interface AppTheme {
  id: string;
  name: string;
  bgColor: string;
  textColor: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  cardBg: string;
  footerBg: string;
  glassClass: string;
  glowColor: string;
  gradientFrom: string;
  gradientTo: string;
}

export interface CMSData {
  contactInfo: ContactInfo;
  companyMeta: CompanyMeta;
  chairmanMessage: ChairmanMessage;
  guidingValues: GuidingValue[];
  codeOfEthics: CodeOfEthicsItem[];
  codeOfConduct: CodeOfConductItem[];
  provinces: ProvinceInfo[];
  categoryGroups: RecruitedCategoryGroup[];
  vacancies: Vacancy[];
  clients: ClientLogo[];
  documentsRequired: DocumentRequiredStep[];
  selectionSteps: SelectionStep[];
  aboutNepal: {
    summary: string;
    tallestMountainsCount: number;
    demographics: string;
    capital: string;
    currency: string;
    timezone: string;
  };
  quotes: {
    trustQuote: string;
    timeMoneyQuote: string;
  };
  notices?: Notice[];
  teamMembers?: TeamMember[];
  teamPhotoUrl?: string;
}

export const INITIAL_CMS_DATA: CMSData = {
  contactInfo: {
    phone: "+977-1-5903260",
    alternatePhone: "+977-9851116133",
    email: "info@asialinkservices.com.np",
    alternateEmail: "jobasialink119@gmail.com",
    address: "Maharajgunj-3, Bansbari, Kathmandu, Nepal",
    postalBox: "P. O. Box No.: 21574",
    website: "www.asialinkservices.com.np",
    websiteAlternate: "www.asialinkservices.com",
    facebook: "https://www.facebook.com/asialinkservicespvtltd",
    whatsapp: "https://wa.me/9779851330547",
    googleMapLink: "https://maps.app.goo.gl/QDaaqr6mcDDeKW7W6",
    googleMapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3531.116634351631!2d85.3408442!3d27.7422132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb191848fc8ac3%3A0x7d5be3143fbc88f4!2sAsia%20Link%20Services%20Pvt.Ltd!5e0!3m2!1sen!2snp!4v1718742230000!5m2!1sen!2snp"
  },
  companyMeta: {
    title: "Asia Link Services (P.) Ltd.",
    subtitle: "Nepal's Premier JITCO & GCC Licensed Recruitment Agency",
    govLicenseNo: "119/055/056",
    jitcoNo: "311",
    saudiIdNo: "491",
    panNo: "500189083",
    authorizedCapital: "20 Million Nepalese Rupees (USD 175,000)",
    issuedCapital: "10 Million Nepalese Rupees (USD 87,500)",
    banks: ["Prime Commercial Bank Ltd.", "Nepal Bank Limited"],
    legalAdvisor: "Mr. Nilam Gautam",
    memberships: [
      "Nepal Association of Foreign Employment Agencies (NAFEA)",
      "Nepal Chamber of Commerce"
    ],
    sisterCompanies: [
      "AKH Training Academy Nepal"
    ],
    heroBgUrl: ""
  },
  aboutNepal: {
    summary: "Nepal, officially the Federal Democratic Republic of Nepal, is a stunning landlocked sovereign state located in South Asia, nestled in the absolute heart of the majestic Himalayas. It is bordered to the north by China (Tibetan Autonomous Region) and to the south, east, and west by India. The mountainous north has eight of the world's ten tallest mountains, including Mount Everest (Sagarmatha), towering at 8,848m. The fertile, humid Terai region in the south is home to Lumbini, the sacred birthplace of Lord Gautam Buddha.",
    tallestMountainsCount: 8,
    demographics: "Hinduism is practiced by about 81.3% of Nepalis, making it the country with the highest density of Hindus, beautifully coexisting with rich Buddhist lineages (16.0%), Kirat (5.1%), Islam (4.4%), and Christianity (1.4%).",
    capital: "Kathmandu",
    currency: "Nepalese Rupee (NPR)",
    timezone: "NPT (UTC +5:45)"
  },
  quotes: {
    trustQuote: "Trust is built in honesty, and honesty is the absolute foundation of any strong, lifelong relationship.",
    timeMoneyQuote: "The greatest difference between Money and Time: Money and resources can easily be tracked and replaced, but time and the duration of our existence can never be predetermined."
  },
  chairmanMessage: {
    name: "Meelan Kattel",
    title: "Chairman",
    mobile: "+977-9851021756",
    avatarUrl: "", // Defaults to fallback or placeholder avatar
    salutation: "Namaste & Warm Greetings from Nepal,",
    paragraphs: [
      "Asia Link Services Pvt. Ltd. was established with a singular core belief: to offer genuine, customer-focused human resource recruitment solutions from the pristine labor markets of Nepal.",
      "Backed by a highly dedicated team of industry-certified HR professionals, ultra-modern assessment facilities, and a centrally located workspace in bansbari Kathmandu, we have built a historic and trusted brand. A relentless focus on candidate quality and client satisfaction is what sets Asia Link Services apart, ensuring long-term mutual growth and shared success.",
      "We provide highly qualified, energetic, and resilient Nepalese talent to major destinations across the Gulf Countries (GCC), Malaysia, Japan, Israel, and other nations. Working hand in hand with our clients, we make certain that we fulfill demands at zero-compromise speed. I thank our prestigious clients for their unwavering trust, and I look forward to proving that this corporate profile translates into real-world operational excellence.",
    ]
  },
  guidingValues: [
    {
      id: "val-1",
      title: "Integrity",
      description: "We adopt the highest ethical standards of our industry and operate with complete transparency, accountability, and unwavering trust.",
      iconName: "Shield"
    },
    {
      id: "val-2",
      title: "Compassion",
      description: "We care deeply for our workforce, treating every candidate and employer candidate with equal dignity, respect, and human-centric policies.",
      iconName: "Heart"
    },
    {
      id: "val-3",
      title: "Realization",
      description: "We are guided by fact-based reality, remaining deeply self-aware, and transforming every feedback cycle or failure into powerful learning.",
      iconName: "Eye"
    },
    {
      id: "val-4",
      title: "Excellence",
      description: "We always deliver what is promised, seeking absolute perfection in custom training, candidate testing, and deployment compliance.",
      iconName: "Award"
    },
    {
      id: "val-5",
      title: "Collaboration",
      description: "We believe in unified teamwork, enabling recruiters, training centers, and embassies to share expertise and skills to accelerate timelines.",
      iconName: "Users"
    }
  ],
  codeOfEthics: [
    { id: "e-1", text: "No Conflict of Interest inside any recruitment stages" },
    { id: "e-2", text: "Complete Security, Confidentiality & Privacy for candidates and partners" },
    { id: "e-3", text: "Zero tolerance for discrimination based on gender, tribe, or status" },
    { id: "e-4", text: "Strict Protection of candidate and corporate Intellectual Property" },
    { id: "e-5", text: "Anti-Bribery and strict Zero-Corruption standards during agent licensing" },
    { id: "e-6", text: "Fair Business and honest Advertising & Promotion practices" },
    { id: "e-7", text: "Freely Chosen Employment - absolutely zero forced labor" },
    { id: "e-8", text: "Vigorous compliance against any form of Human Trafficking or wage-slavery" },
    { id: "e-9", text: "Strict code of No Child Labor (minimum age strictly 18+)" },
    { id: "e-10", text: "Uncompromising Accuracy and Retention of Business Records and contracts" },
    { id: "e-11", text: "Total Compliance with Nepalese Laws, JITCO standards, and host countries" }
  ],
  codeOfConduct: [
    { id: "c-1", text: "Professionalism and Objectivity at every touchpoint" },
    { id: "c-2", text: "Full Disclosure of recruitment terms, contracts, and workplace conditions beforehand" },
    { id: "c-3", text: "RBA Code of Conduct compliance for fair and ethical treatment of immigrant labor" },
    { id: "c-4", text: "Commitment to invest at least 10% of our annual profit margins directly into local CSR (Corporate Social Responsibility)" },
    { id: "c-5", text: "Allocating 10% of corporate budgets annually for employee training, refreshment, and worker safety workshops" }
  ],
  provinces: [
    { id: "p-1", name: "Sudoorpashchim Province", city: "Godawari / Kailali", keyWorkerTraits: "Resilient agricultural experts, durable construction technicians, security specialists." },
    { id: "p-2", name: "Karnali Province", city: "Surkhet", keyWorkerTraits: "Extremely hardworking, mountain-hardy general workforce, loyal security wardens." },
    { id: "p-3", name: "Lumbini Province", city: "Dang / Deukhuri", keyWorkerTraits: "Trained hospitality stewards, skilled masonry supervisors, agricultural planners." },
    { id: "p-4", name: "Gandaki Province", city: "Pokhara", keyWorkerTraits: "Elite hospitality managers, ex-Gurkha tactical forces, international chefs." },
    { id: "p-5", name: "Bagamati Province", city: "Kathmandu (Capital)", keyWorkerTraits: "Certified IT programmers, administrators, bi-lingual office executives, heavy equipment operators." },
    { id: "p-6", name: "Madhesh Province", city: "Janakpur", keyWorkerTraits: "Industrial manufacturing line mechanics, high-accuracy textile weavers, retail staffs." },
    { id: "p-7", name: "Koshi Province", city: "Biratnagar", keyWorkerTraits: "Certified electrical and mechanical engineers, fabricators, logistic coordinators." }
  ],
  categoryGroups: [
    {
      id: "g-1",
      title: "Hotel & Catering Staff",
      categories: ["Manager and Asst. Manager", "Public Relation Officer", "Restaurant Captain", "Continental, Chinese, Indian & Arabic Cooks", "Asst. Cooks & Stewards", "Waiters & Fast Food Crews", "Food and Beverage Controller", "Bakers & Barman", "Kitchen Helpers", "Laundrymen & Housekeepers", "Janitors & Dishwashers"]
    },
    {
      id: "g-2",
      title: "Office & Executives",
      categories: ["Office Manager / HR Admin", "Marketing & Sales Manager", "Chartered Accountants & Cashiers", "Executive Secretaries", "Storekeepers & Purchasers", "Data Entry Operators", "Office Boys & Courier Clerks", "Receptionists"]
    },
    {
      id: "g-3",
      title: "Information Technology",
      categories: ["Computer Engineers", "System Administrators", "Software Engineers & Coders", "Systems Analysts", "Network Administrators", "IT Technicians & Data Operators", "Database Administrators"]
    },
    {
      id: "g-4",
      title: "Security Sector Group",
      categories: ["Security Officers & Duty Captains", "Security Supervisors", "Ex-British Gurkha Army Officers", "Ex-Indian Gurkha Army Officers", "Ex-Nepalese Army & Police", "Civil Security Guards", "Corporate Bodyguards", "Night Watchmen"]
    },
    {
      id: "g-5",
      title: "Supermarket & Retail",
      categories: ["Store Salesmen", "Merchandisers & Shelf Planners", "Check-out Cashiers", "Retail Stockers", "Trolley Boys", "Commercial Cleaners"]
    },
    {
      id: "g-6",
      title: "Heavy Equipment, Vehicle & Auto Mechanic",
      categories: ["Light Vehicle Drivers (Car/Van/Bus)", "Heavy Duty Auto Mechanics", "Diesel Mechanics & Wireless Techs", "Truck/Lorry/Trailer Drivers", "Forklift & Crane Operators", "Excavator/Dozer/Backhoe Operators", "Road Roller & Grader Operators", "Painters & Denters"]
    },
    {
      id: "g-7",
      title: "Engineering & Technical",
      categories: ["Electrical Engineers", "Mechanical Engineers", "Electronic Engineers", "Civil Engineers", "HVAC Engineers", "HVAC Foreman & Supervisors"]
    },
    {
      id: "g-8",
      title: "Hospital & Medical Staff",
      categories: ["Specialist Doctors (Gynecology, Surgeon, Urology)", "General Physicians (MD)", "Nursing Staff (ICU, Surgery, OT) - Diploma", "Midwifery & Ward Nurse - Diploma", "Lab Technicians", "X-ray Technicians", "Asst. Nursing Cleaners"]
    },
    {
      id: "g-9",
      title: "Building Maintenance & Construction",
      categories: ["Electricians & Assistants", "Plumbers & Pipe Fitters", "Electric & Gas Welders", "Steel Fixers & Foremen", "Carpenters (Finishing & Shuttering)", "Electronic Technicians", "Spray wall Painters", "Scaffolders & Riggers", "Mason (Tile, Brick, Marble, Concrete)"]
    },
    {
      id: "g-10",
      title: "Garments, Manufacturing & Farming",
      categories: ["Tailoring Masters & Cutting Leads", "Checkers & Tailors", "Industrial Machine Operators", "Landscape Architects & Gardeners", "Greenhouse/Farming Supervisors"]
    }
  ],
  vacancies: [
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
  ],
  clients: [
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
  ],
  documentsRequired: [
    {
      id: "doc-1",
      title: "Demand Letter",
      description: "A formal permit issued by the employer in favor of Asia Link Services, stating position categories, numbers needed, monthly salary in native currency, contract duration, and provisions for food, medical care, and housing. Must be endorsed by the Chamber of Commerce and Navy/Embassy of Nepal in the employer's home country."
    },
    {
      id: "doc-2",
      title: "Power of Attorney",
      description: "A legally certified document authorizing Asia Link Services to represent the employer company before the Department of Foreign Employment in Nepal, handle passport filings, clear embassy visa procedures, and sign temporary deployment accords."
    },
    {
      id: "doc-3",
      title: "Employment Contract",
      description: "A specimen copy signed directly by the employer, specifying salary, working hours (8 hrs max before OT), holidays, health benefits, and safe housing. Fully ratified in the Nepalese Embassy of the employing nation."
    },
    {
      id: "doc-4",
      title: "Inter-Party Agreement",
      description: "A formal bilateral accord executed on the Employer's letterhead, outlining recruit-fulfillment terms and legal guarantees regarding candidate replacement periods and dispute resolutions."
    },
    {
      id: "doc-5",
      title: "Guarantee Letter",
      description: "An official letter promising that Nepalese candidates deployed will only work in the verified country listed in the demand paper, and will not represent any unauthorized subcontractor or side-entity."
    },
    {
      id: "doc-6",
      title: "Consular Letter (Required for KSA Only)",
      description: "A specific warrant addressing the Royal Embassy of Saudi Arabia Consulate General, declaring Asia Link Services Pvt. Ltd. as the exclusive licensed processing agent for visas."
    }
  ],
  selectionSteps: [
    { id: "sel-1", title: "Pre-Labor Approval", description: "The Department of Foreign Employment in Nepal reviews authentic demand papers to rule out spoofing or unauthorized commissions.", order: 1 },
    { id: "sel-2", title: "Advertisement & Sourcing", description: "Job demands are published in state newspapers and registered directories to attract organic local talent nationwide.", order: 2 },
    { id: "sel-3", title: "Candidate Screening & Trade-Tests", description: "Candidates run through thorough evaluations and live operational tests at AKH Training Academy Nepal.", order: 3 },
    { id: "sel-4", title: "Employer Interviews", description: "Clients hold direct physical assessments, team trials, or interactive videoconferences to hand-select the candidates.", order: 4 },
    { id: "sel-5", title: "Medical Checkup", description: "Shortlisted candidates undergo full health examinations at government-approved and GAMCA-certified medical centers.", order: 5 },
    { id: "sel-6", title: "Embassy Visa Processing", description: "We run documents, biometric scans, and visa application sheets through the target country's embassy directly.", order: 6 },
    { id: "sel-7", title: "Compulsory Orientation Class", description: "Government-certified instruction on host laws, currency, airport processes, road safety, and social custom tolerances.", order: 7 },
    { id: "sel-8", title: "Final Labor Approval", description: "Final clearance issued by the Nepal Department of Foreign Employment, certifying insurance and candidate health registrations.", order: 8 },
    { id: "sel-9", title: "Airport Assistance & Deployment", description: "Candidates receive pre-flight guidelines and hand-offs at Tribhuvan International Airport (TIA) to finalize safe arrival in the host state.", order: 9 }
  ],
  notices: [
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
  ],
  teamMembers: [
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
  ],
  teamPhotoUrl: ""
};

export const PRESET_THEMES: AppTheme[] = [
  {
    id: "dark",
    name: "Asia Link Cosmic Dark",
    bgColor: "bg-[#0f172a]",
    textColor: "text-slate-100",
    primaryColor: "text-red-500 bg-red-500/10 border-red-500/20",
    secondaryColor: "text-sky-400 bg-sky-400/10 border-sky-400/20",
    accentColor: "from-red-500 to-sky-400",
    cardBg: "bg-slate-900/40 border-slate-800/80 backdrop-blur-md",
    footerBg: "bg-[#0b0f19]",
    glassClass: "backdrop-blur-xl bg-slate-950/40 border border-white/5",
    glowColor: "rgba(14, 165, 233, 0.15)",
    gradientFrom: "bg-gradient-to-r from-red-500 to-sky-400",
    gradientTo: "from-red-500 to-sky-400"
  },
  {
    id: "light",
    name: "Asia Link Premium Light",
    bgColor: "bg-slate-50",
    textColor: "text-slate-800",
    primaryColor: "text-red-600 bg-red-600/10 border-red-200",
    secondaryColor: "text-sky-600 bg-sky-600/10 border-sky-200",
    accentColor: "from-red-600 to-sky-600",
    cardBg: "bg-white/95 border-slate-200/90 shadow-sm",
    footerBg: "bg-slate-100",
    glassClass: "backdrop-blur-xl bg-white/70 border border-slate-200/50 shadow-sm",
    glowColor: "rgba(14, 165, 233, 0.12)",
    gradientFrom: "bg-gradient-to-r from-red-600 to-sky-500",
    gradientTo: "from-red-600 to-sky-500"
  }
];

