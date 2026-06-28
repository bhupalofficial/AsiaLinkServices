import React, { useState, useEffect, useRef } from "react";
import { 
  Lock, KeyRound, Save, Plus, Trash2, Edit, Check, AlertCircle, 
  Upload, FileText, Globe, Users, FileCheck, ArrowLeft, Settings, Info, Clock, CheckCircle2,
  Mail, LogOut, Eye, EyeOff, Search, Calendar, ChevronLeft, ChevronRight, X,
  Image, Inbox, GripVertical, Menu, CornerDownRight, Reply, Send,
  FileSpreadsheet, Printer, Download
} from "lucide-react";
import * as XLSX from "xlsx";
import { CMSData, Vacancy, Notice, TeamMember, ClientLogo } from "../types";

interface AdminPanelProps {
  cmsData: CMSData;
  onSaveCMS: (updatedData: CMSData) => Promise<void>;
  onExit: () => void;
  isDark: boolean;
  theme: any;
}

export default function AdminPanel({ cmsData, onSaveCMS, onExit, isDark, theme }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isVerifyingSession, setIsVerifyingSession] = useState(true);
  const [lockoutRemaining, setLockoutRemaining] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"demands" | "notices" | "partners" | "team" | "pdf" | "root-settings" | "company-details" | "applications" | "messages" >(() => {
    const savedTab = sessionStorage.getItem("asialink_admin_active_tab");
    const allowedTabs = ["demands", "notices", "partners", "team", "pdf", "root-settings", "company-details", "applications", "messages"];
    if (savedTab && allowedTabs.includes(savedTab)) {
      return savedTab as any;
    }
    return "demands";
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync activeTab to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("asialink_admin_active_tab", activeTab);
  }, [activeTab]);

  // Root Settings states
  const [rootEmail, setRootEmail] = useState("");
  const [rootPassword, setRootPassword] = useState("");
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [showRootPassword, setShowRootPassword] = useState(false);
  const [showSmtpPass, setShowSmtpPass] = useState(false);
  const [isFetchingConfig, setIsFetchingConfig] = useState(false);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // Company Settings states
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyAltPhone, setCompanyAltPhone] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyAltEmail, setCompanyAltEmail] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyPostalBox, setCompanyPostalBox] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyFacebook, setCompanyFacebook] = useState("");
  const [companyWhatsapp, setCompanyWhatsapp] = useState("");
  const [companyGoogleMapLink, setCompanyGoogleMapLink] = useState("");
  const [companyGoogleMapEmbed, setCompanyGoogleMapEmbed] = useState("");
  const [heroBgUrl, setHeroBgUrl] = useState("");
  const [isHeroDragActive, setIsHeroDragActive] = useState(false);
  const [isSavingCompany, setIsSavingCompany] = useState(false);

  // Reply states for contact inquiries
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);

  // JSON Database Collections States
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messageSubTab, setMessageSubTab] = useState<"active" | "resolved">("active");
  const [messagePage, setMessagePage] = useState(1);

  // Excel Spreadsheet states
  const [activeCell, setActiveCell] = useState<{ row: number; col: string } | null>(null);
  const [cellFocusValue, setCellFocusValue] = useState<string>("");
  const [selectedCandidateForModal, setSelectedCandidateForModal] = useState<any | null>(null);

  // Load applications from our JSON database
  const loadApplications = async () => {
    setIsLoadingApps(true);
    try {
      const token = sessionStorage.getItem("asialink_admin_token") || "";
      const res = await fetch("/api/admin/applications", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setApplications(data.applications || []);
      } else {
        notifyError(data.error || "Failed to load job applications.");
      }
    } catch (err: any) {
      notifyError(`Failed to fetch applications: ${err.message}`);
    } finally {
      setIsLoadingApps(false);
    }
  };

  // Load contact inquiries from our JSON database
  const loadMessages = async () => {
    setIsLoadingMessages(true);
    try {
      const token = sessionStorage.getItem("asialink_admin_token") || "";
      const res = await fetch("/api/admin/messages", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessages(data.messages || []);
      } else {
        notifyError(data.error || "Failed to load contact inquiries.");
      }
    } catch (err: any) {
      notifyError(`Failed to fetch contact inquiries: ${err.message}`);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Delete a job application profile permanently (called after custom modal confirmation)
  const deleteApplication = async (id: string) => {
    try {
      const token = sessionStorage.getItem("asialink_admin_token") || "";
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        notifySuccess("Job application deleted from database.");
        setApplications(prev => prev.filter(a => a.id !== id));
      } else {
        notifyError(data.error || "Failed to delete application.");
      }
    } catch (err: any) {
      notifyError(`Deletion error: ${err.message}`);
    }
  };

  // Delete a contact message log permanently (called after custom modal confirmation)
  const deleteMessage = async (id: string) => {
    try {
      const token = sessionStorage.getItem("asialink_admin_token") || "";
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        notifySuccess("Contact inquiry erased from database.");
        setMessages(prev => prev.filter(m => m.id !== id));
      } else {
        notifyError(data.error || "Failed to delete message.");
      }
    } catch (err: any) {
      notifyError(`Deletion error: ${err.message}`);
    }
  };

  // Reply to contact message via server API
  const handleSendReply = async (id: string) => {
    if (!replyContent.trim()) {
      notifyError("Reply message content cannot be empty.");
      return;
    }
    setIsSendingReply(true);
    try {
      const token = sessionStorage.getItem("asialink_admin_token") || "";
      const res = await fetch(`/api/admin/messages/${id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ replyMessage: replyContent })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        notifySuccess(data.message || "Reply email successfully dispatched via SMTP.");
        await loadMessages();
        setActiveReplyId(null);
        setReplyContent("");
      } else {
        notifyError(data.error || "Failed to deliver message reply.");
      }
    } catch (err: any) {
      notifyError(`Error delivering reply: ${err.message}`);
    } finally {
      setIsSendingReply(false);
    }
  };

  // Automatically fetch database lists when their respective tabs are activated
  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === "demands" || activeTab === "applications") {
        loadApplications();
      }
      if (activeTab === "messages") {
        loadMessages();
      }
    }
  }, [activeTab, isAuthenticated]);

  // Sync CMS contactInfo into states
  useEffect(() => {
    if (cmsData?.contactInfo) {
      setCompanyPhone(cmsData.contactInfo.phone || "");
      setCompanyAltPhone(cmsData.contactInfo.alternatePhone || "");
      setCompanyEmail(cmsData.contactInfo.email || "");
      setCompanyAltEmail(cmsData.contactInfo.alternateEmail || "");
      setCompanyAddress(cmsData.contactInfo.address || "");
      setCompanyPostalBox(cmsData.contactInfo.postalBox || "");
      setCompanyWebsite(cmsData.contactInfo.website || "");
      setCompanyFacebook(cmsData.contactInfo.facebook || "");
      setCompanyWhatsapp(cmsData.contactInfo.whatsapp || "");
      setCompanyGoogleMapLink(cmsData.contactInfo.googleMapLink || "");
      setCompanyGoogleMapEmbed(cmsData.contactInfo.googleMapEmbed || "");
    }
    if (cmsData?.companyMeta) {
      setHeroBgUrl(cmsData.companyMeta.heroBgUrl || "");
    }
  }, [cmsData]);

  // Sync CMS clients list to localClients
  useEffect(() => {
    if (cmsData?.clients) {
      setLocalClients(cmsData.clients);
    } else {
      setLocalClients([]);
    }
  }, [cmsData?.clients]);

  // Partner Drag & Drop Reordering handlers
  const handlePartnerDragStart = (e: React.DragEvent, index: number) => {
    setDraggedPartnerIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handlePartnerDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedPartnerIndex === null || draggedPartnerIndex === index) return;

    const updated = [...localClients];
    const draggedItem = updated[draggedPartnerIndex];
    updated.splice(draggedPartnerIndex, 1);
    updated.splice(index, 0, draggedItem);

    setDraggedPartnerIndex(index);
    setLocalClients(updated);
  };

  const handlePartnerDragEnd = async () => {
    setDraggedPartnerIndex(null);
    try {
      await onSaveCMS({ ...cmsData, clients: localClients });
    } catch (err: any) {
      notifyError(`Failed to save partners order: ${err.message}`);
    }
  };

  // Sync CMS team list to localTeamMembers
  useEffect(() => {
    if (cmsData?.teamMembers) {
      setLocalTeamMembers(cmsData.teamMembers);
    } else {
      setLocalTeamMembers([]);
    }
  }, [cmsData?.teamMembers]);

  // Team Member Drag & Drop Reordering handlers
  const handleMemberDragStart = (e: React.DragEvent, index: number) => {
    setDraggedMemberIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleMemberDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedMemberIndex === null || draggedMemberIndex === index) return;

    const updated = [...localTeamMembers];
    const draggedItem = updated[draggedMemberIndex];
    updated.splice(draggedMemberIndex, 1);
    updated.splice(index, 0, draggedItem);

    setDraggedMemberIndex(index);
    setLocalTeamMembers(updated);
  };

  const handleMemberDragEnd = async () => {
    setDraggedMemberIndex(null);
    try {
      await onSaveCMS({ ...cmsData, teamMembers: localTeamMembers });
    } catch (err: any) {
      notifyError(`Failed to save team member order: ${err.message}`);
    }
  };

  // Sync CMS teamPhotoUrl to state
  useEffect(() => {
    if (cmsData?.teamPhotoUrl) {
      setGroupPhotoUrl(cmsData.teamPhotoUrl);
    }
  }, [cmsData?.teamPhotoUrl]);

  // Sync CMS chairmanMessage details to state
  useEffect(() => {
    if (cmsData?.chairmanMessage) {
      setChairmanName(cmsData.chairmanMessage.name || "");
      setChairmanTitle(cmsData.chairmanMessage.title || "");
      setChairmanMobile(cmsData.chairmanMessage.mobile || "");
      setChairmanAvatarUrl(cmsData.chairmanMessage.avatarUrl || "");
      setChairmanSalutation(cmsData.chairmanMessage.salutation || "");
      setChairmanParagraphs(cmsData.chairmanMessage.paragraphs?.join("\n\n") || "");
    }
  }, [cmsData?.chairmanMessage]);

  // Sync CMS vacancies list to localVacancies
  useEffect(() => {
    if (cmsData?.vacancies) {
      setLocalVacancies(cmsData.vacancies);
    } else {
      setLocalVacancies([]);
    }
  }, [cmsData?.vacancies]);

  // Vacancy Drag & Drop Reordering handlers
  const handleVacancyDragStart = (e: React.DragEvent, index: number) => {
    setDraggedVacancyIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleVacancyDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedVacancyIndex === null || draggedVacancyIndex === index) return;

    const updated = [...localVacancies];
    const draggedItem = updated[draggedVacancyIndex];
    updated.splice(draggedVacancyIndex, 1);
    updated.splice(index, 0, draggedItem);

    setDraggedVacancyIndex(index);
    setLocalVacancies(updated);
  };

  const handleVacancyDragEnd = async () => {
    setDraggedVacancyIndex(null);
    try {
      await onSaveCMS({ ...cmsData, vacancies: localVacancies });
    } catch (err: any) {
      notifyError(`Failed to save vacancies order: ${err.message}`);
    }
  };

  const handleSaveCompanyDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyPhone.trim() || !companyEmail.trim() || !companyAddress.trim()) {
      notifyError("Phone number, primary email, and physical address are required.");
      return;
    }

    setIsSavingCompany(true);
    try {
      const updatedContactInfo = {
        ...cmsData.contactInfo,
        phone: companyPhone.trim(),
        alternatePhone: companyAltPhone.trim(),
        email: companyEmail.trim(),
        alternateEmail: companyAltEmail.trim(),
        address: companyAddress.trim(),
        postalBox: companyPostalBox.trim(),
        website: companyWebsite.trim(),
        facebook: companyFacebook.trim(),
        whatsapp: companyWhatsapp.trim(),
        googleMapLink: companyGoogleMapLink.trim(),
        googleMapEmbed: companyGoogleMapEmbed.trim(),
      };

      const updatedCompanyMeta = {
        ...cmsData.companyMeta,
        heroBgUrl: heroBgUrl.trim()
      };

      await onSaveCMS({
        ...cmsData,
        contactInfo: updatedContactInfo,
        companyMeta: updatedCompanyMeta
      });
      notifySuccess("Company contact and social details updated successfully across the entire site!");
    } catch (err: any) {
      notifyError(`Failed to save company settings: ${err.message}`);
    } finally {
      setIsSavingCompany(false);
    }
  };

  // Notifications
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Loading States
  const [isSaving, setIsSaving] = useState(false);
  const [pdfUploading, setPdfUploading] = useState(false);

  // Edit / Add States
  const [editingDemand, setEditingDemand] = useState<Partial<Vacancy> | null>(null);
  const [requiredDocsInput, setRequiredDocsInput] = useState("");
  const lastEditingIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (editingDemand) {
      if (editingDemand.id !== lastEditingIdRef.current) {
        lastEditingIdRef.current = editingDemand.id;
        const docs = editingDemand.requiredDocuments || [];
        setRequiredDocsInput(docs.join(", "));
      }
    } else {
      lastEditingIdRef.current = undefined;
      setRequiredDocsInput("");
    }
  }, [editingDemand]);
  const [editingNotice, setEditingNotice] = useState<Partial<Notice> | null>(null);
  const [editingPartner, setEditingPartner] = useState<Partial<ClientLogo> | null>(null);
  const [editingMember, setEditingMember] = useState<Partial<TeamMember> | null>(null);

  // Drag-and-drop sorting state for prestigious partners
  const [draggedPartnerIndex, setDraggedPartnerIndex] = useState<number | null>(null);
  const [localClients, setLocalClients] = useState<ClientLogo[]>([]);

  // Drag-and-drop sorting state for team members
  const [draggedMemberIndex, setDraggedMemberIndex] = useState<number | null>(null);
  const [localTeamMembers, setLocalTeamMembers] = useState<TeamMember[]>([]);

  // Drag-and-drop sorting state for active demands
  const [draggedVacancyIndex, setDraggedVacancyIndex] = useState<number | null>(null);
  const [localVacancies, setLocalVacancies] = useState<Vacancy[]>([]);
  const [expandedVacancyId, setExpandedVacancyId] = useState<string | null>(null);
  const [viewingVacancyAppsId, setViewingVacancyAppsId] = useState<string | null>(null);
  const [candidateSearchQuery, setCandidateSearchQuery] = useState("");

  // Team Photo state
  const [groupPhotoUrl, setGroupPhotoUrl] = useState(cmsData.teamPhotoUrl || "");

  // Chairman details states
  const [chairmanName, setChairmanName] = useState(cmsData.chairmanMessage?.name || "");
  const [chairmanTitle, setChairmanTitle] = useState(cmsData.chairmanMessage?.title || "");
  const [chairmanMobile, setChairmanMobile] = useState(cmsData.chairmanMessage?.mobile || "");
  const [chairmanAvatarUrl, setChairmanAvatarUrl] = useState(cmsData.chairmanMessage?.avatarUrl || "");
  const [chairmanSalutation, setChairmanSalutation] = useState(cmsData.chairmanMessage?.salutation || "");
  const [chairmanParagraphs, setChairmanParagraphs] = useState(cmsData.chairmanMessage?.paragraphs?.join("\n\n") || "");

  // Custom confirmation modal state for sandboxed iframes
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "demand" | "notice" | "partner" | "member" | "application" | "message";
    id: string;
    title: string;
  } | null>(null);

  // Notices Filter & Pagination States
  const [noticeSearch, setNoticeSearch] = useState("");
  const [noticeDateFilter, setNoticeDateFilter] = useState("");
  const [noticePage, setNoticePage] = useState(1);
  const noticesPerPage = 5;

  // Fetch dynamic root settings config when mounting setting tab
  useEffect(() => {
    if (activeTab === "root-settings" && isAuthenticated) {
      const fetchAdminConfig = async () => {
        setIsFetchingConfig(true);
        try {
          const token = sessionStorage.getItem("asialink_admin_token");
          const res = await fetch("/api/admin/config", {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          const data = await res.json();
          if (data.success && data.config) {
            setRootEmail(data.config.adminEmail || "");
            setRootPassword(data.config.adminPassword || "");
            setSmtpUser(data.config.smtpUser || "");
            setSmtpPass(data.config.smtpPass || "");
          } else {
            notifyError(data.error || "Failed to load root configurations.");
          }
        } catch (err: any) {
          notifyError(`Connection failed: ${err.message}`);
        } finally {
          setIsFetchingConfig(false);
        }
      };
      fetchAdminConfig();
    }
  }, [activeTab, isAuthenticated]);

  const handleSaveRootSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rootEmail.trim() || !rootPassword.trim()) {
      notifyError("Admin login email and password cannot be empty.");
      return;
    }

    setIsSavingConfig(true);
    try {
      const token = sessionStorage.getItem("asialink_admin_token");
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          adminEmail: rootEmail.trim(),
          adminPassword: rootPassword.trim(),
          smtpUser: smtpUser.trim(),
          smtpPass: smtpPass
        })
      });
      const data = await res.json();
      if (data.success) {
        notifySuccess("Root control settings saved to disk! All updates applied instantly.");
      } else {
        notifyError(data.error || "Failed to save root control settings.");
      }
    } catch (err: any) {
      notifyError(`Failed to connect: ${err.message}`);
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Active countdown timer for brute force cooldown
  useEffect(() => {
    if (lockoutRemaining === null || lockoutRemaining <= 0) return;
    const interval = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutRemaining]);

  // Query server and sessionStorage lockout status on component load
  useEffect(() => {
    const checkLockoutStatus = async () => {
      try {
        // First check client-side session cache
        const localLockout = sessionStorage.getItem("asialink_lockout_until");
        if (localLockout) {
          const expiration = parseInt(localLockout, 10);
          if (expiration > Date.now()) {
            const secsLeft = Math.ceil((expiration - Date.now()) / 1000);
            setLockoutRemaining(secsLeft);
          } else {
            sessionStorage.removeItem("asialink_lockout_until");
          }
        }

        // Cross-verify with back-end active lockout registry
        const res = await fetch("/api/admin/status");
        const data = await res.json();
        if (data.locked && data.remainingSeconds) {
          setLockoutRemaining(data.remainingSeconds);
          const expiresAt = Date.now() + data.remainingSeconds * 1000;
          sessionStorage.setItem("asialink_lockout_until", expiresAt.toString());
        }
      } catch (err) {
        console.error("Lockout status check failed:", err);
      }
    };
    checkLockoutStatus();
  }, []);

  // Auto session verification on mounting
  useEffect(() => {
    const existingToken = sessionStorage.getItem("asialink_admin_token");
    if (!existingToken) {
      setIsVerifyingSession(false);
      return;
    }

    const verifySession = async () => {
      try {
        const res = await fetch("/api/admin/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${existingToken}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setIsAuthenticated(true);
        } else {
          sessionStorage.removeItem("asialink_admin_token");
        }
      } catch (err) {
        console.error("Session automatic check failed:", err);
      } finally {
        setIsVerifyingSession(false);
      }
    };
    verifySession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemaining !== null && lockoutRemaining > 0) {
      setLoginError("This administrative terminal is currently locked out.");
      return;
    }
    if (!email.trim() || !password) {
      setLoginError("Please fill out both email and password.");
      return;
    }

    setIsLoggingIn(true);
    setLoginError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password })
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        sessionStorage.removeItem("asialink_lockout_until");
        sessionStorage.setItem("asialink_admin_token", data.token);
        setIsAuthenticated(true);
        setLoginError("");
        notifySuccess("Authenticated effectively! Welcome to Asia Link Control Panel.");
      } else {
        if (data.locked && data.remainingSeconds) {
          const expiresAt = Date.now() + data.remainingSeconds * 1000;
          sessionStorage.setItem("asialink_lockout_until", expiresAt.toString());
          setLockoutRemaining(data.remainingSeconds);
        }
        setLoginError(data.error || "Access denied. Invalid administrator email or password.");
      }
    } catch (err: any) {
      setLoginError(`Server connection failed: ${err.message}`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    const token = sessionStorage.getItem("asialink_admin_token");
    try {
      if (token) {
        await fetch("/api/admin/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
      }
    } catch (e) {
      console.warn("Logout request skipped on remote check:", e);
    }
    sessionStorage.removeItem("asialink_admin_token");
    sessionStorage.removeItem("asialink_admin_active_tab");
    setActiveTab("demands");
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
    notifySuccess("Administrator logged out safely.");
  };

  const notifySuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const notifyError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 4000);
  };

  // Helper trigger to handle file base64 parse
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Upload custom file/image with authorization header
  const handleImageUpload = async (file: File, category: string, callback: (path: string) => void) => {
    try {
      const base64 = await fileToBase64(file);
      const token = sessionStorage.getItem("asialink_admin_token") || "";
      const res = await fetch("/api/upload-image", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ base64, filename: file.name, category })
      });
      const data = await res.json();
      if (data.success && data.path) {
        callback(data.path);
        notifySuccess(`File uploaded successfully to: ${data.path}`);
      } else {
        notifyError(data.error || "Image storage failed");
      }
    } catch (e: any) {
      notifyError(`Upload error: ${e.message}`);
    }
  };

  // Upload dynamic Company Profile PDF on the server with authorization header
  const handlePdfUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      notifyError("Please upload a valid PDF file only.");
      return;
    }
    setPdfUploading(true);
    try {
      const base64 = await fileToBase64(file);
      const token = sessionStorage.getItem("asialink_admin_token") || "";
      const res = await fetch("/api/upload-pdf", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ base64 })
      });
      const data = await res.json();
      if (data.success) {
        notifySuccess("Company Profile PDF updated on disk successfully. Old file deleted.");
      } else {
        notifyError(data.error || "PDF overwrite failed");
      }
    } catch (e: any) {
      notifyError(`PDF sync error: ${e.message}`);
    } finally {
      setPdfUploading(false);
    }
  };

  // Upload custom Hero Background Image on the server with authorization header
  const handleHeroBgUpload = async (file: File) => {
    try {
      const base64 = await fileToBase64(file);
      const token = sessionStorage.getItem("asialink_admin_token") || "";
      const res = await fetch("/api/upload-herobg", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ base64, filename: file.name })
      });
      const data = await res.json();
      if (data.success && data.path) {
        setHeroBgUrl(data.path);
        notifySuccess("Hero background image updated on disk successfully. Old background overwritten.");
      } else {
        notifyError(data.error || "Hero BG upload failed");
      }
    } catch (e: any) {
      notifyError(`Hero BG sync error: ${e.message}`);
    }
  };

  // --- DEMANDS ACTIONS ---

  const saveDemand = async () => {
    if (!editingDemand?.title || !editingDemand?.companyName) {
      notifyError("Title and Company Name are required fields.");
      return;
    }
    setIsSaving(true);
    try {
      const vacancies = [...(cmsData.vacancies || [])];

      // Auto-calculate positions & salary from sub-jobs if sub-jobs exist
      const subJobs = editingDemand.subJobs || [];
      let calculatedPositionsMale = Number(editingDemand.positionsMale) || 0;
      let calculatedPositionsFemale = Number(editingDemand.positionsFemale) || 0;
      let calculatedSalary = editingDemand.salary || "Negotiable/Based on experience";

      if (subJobs.length > 0) {
        calculatedPositionsMale = subJobs.reduce((sum, sj) => sum + (Number(sj.positionsMale) || 0), 0);
        calculatedPositionsFemale = subJobs.reduce((sum, sj) => sum + (Number(sj.positionsFemale) || 0), 0);
        
        // Extract unique salaries
        const salaries = Array.from(new Set(subJobs.map(sj => sj.salary.trim()).filter(Boolean)));
        if (salaries.length === 1) {
          calculatedSalary = salaries[0];
        } else if (salaries.length > 1) {
          calculatedSalary = salaries.join(" / ");
        }
      }

      const updatedDemand = {
        ...editingDemand,
        positionsMale: calculatedPositionsMale,
        positionsFemale: calculatedPositionsFemale,
        salary: calculatedSalary,
        subJobs,
        ageMin: editingDemand.ageMin !== undefined && editingDemand.ageMin !== "" ? Number(editingDemand.ageMin) : undefined,
        ageMax: editingDemand.ageMax !== undefined && editingDemand.ageMax !== "" ? Number(editingDemand.ageMax) : undefined,
      };

      if (editingDemand.id) {
        // Edit Operation
        const idx = vacancies.findIndex(v => v.id === editingDemand.id);
        if (idx !== -1) {
          vacancies[idx] = { ...vacancies[idx], ...updatedDemand } as Vacancy;
        }
      } else {
        // Create Operation
        const newDemand: Vacancy = {
          id: `vac-${Date.now()}`,
          title: updatedDemand.title || "",
          companyName: updatedDemand.companyName || "",
          location: updatedDemand.location || "GCC",
          positionsMale: updatedDemand.positionsMale,
          positionsFemale: updatedDemand.positionsFemale,
          salary: updatedDemand.salary,
          foodAllowance: updatedDemand.foodAllowance || "Provided",
          duration: updatedDemand.duration || "2 Years",
          workingHours: updatedDemand.workingHours || "8 hours/day",
          workingDays: Number(updatedDemand.workingDays) || 6,
          recruitmentQuotaCode: updatedDemand.recruitmentQuotaCode || "",
          active: updatedDemand.active !== false,
          requiredDocuments: updatedDemand.requiredDocuments || ["Passport", "Bio Profile"],
          demandLetterUrl: updatedDemand.demandLetterUrl || "",
          termsAndConditions: updatedDemand.termsAndConditions || "",
          subJobs: updatedDemand.subJobs,
          ageMin: updatedDemand.ageMin,
          ageMax: updatedDemand.ageMax
        };
        vacancies.unshift(newDemand);
      }

      await onSaveCMS({ ...cmsData, vacancies });
      setEditingDemand(null);
      notifySuccess("Demand Vacancy updated successfully.");
    } catch (e: any) {
      notifyError(`Failed to save: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteDemand = async (id: string) => {
    try {
      const vacancies = (cmsData.vacancies || []).filter(v => v.id !== id);
      await onSaveCMS({ ...cmsData, vacancies });
      notifySuccess("Demand vacancy deleted.");
    } catch (e: any) {
      notifyError(`Delete failed: ${e.message}`);
    }
  };

  // --- NOTICES ACTIONS ---

  const saveNotice = async () => {
    if (!editingNotice?.title || !editingNotice?.description) {
      notifyError("Notice title and description are strictly required.");
      return;
    }
    setIsSaving(true);
    try {
      const notices = [...(cmsData.notices || [])];
      if (editingNotice.id) {
        const idx = notices.findIndex(n => n.id === editingNotice.id);
        if (idx !== -1) {
          notices[idx] = { ...notices[idx], ...editingNotice } as Notice;
        }
      } else {
        const newNotice: Notice = {
          id: `n-${Date.now()}`,
          title: editingNotice.title || "",
          description: editingNotice.description || "",
          tag: editingNotice.tag || "Compliance",
          color: editingNotice.color || "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
          date: editingNotice.date || new Date().toISOString().split("T")[0]
        };
        notices.unshift(newNotice);
      }

      await onSaveCMS({ ...cmsData, notices });
      setEditingNotice(null);
      notifySuccess("Notice posted successfully.");
    } catch (e: any) {
      notifyError(`Failed to save notice: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteNotice = async (id: string) => {
    try {
      const notices = (cmsData.notices || []).filter(n => n.id !== id);
      await onSaveCMS({ ...cmsData, notices });
      notifySuccess("Notice deleted successfully.");
    } catch (e: any) {
      notifyError(e.message);
    }
  };

  // --- PARTNERS ACTIONS ---

  const savePartner = async () => {
    if (!editingPartner?.name || !editingPartner?.industry) {
      notifyError("Partner name and industry category are required.");
      return;
    }
    setIsSaving(true);
    try {
      const clients = [...(cmsData.clients || [])];
      if (editingPartner.id) {
        const idx = clients.findIndex(c => c.id === editingPartner.id);
        if (idx !== -1) {
          clients[idx] = { ...clients[idx], ...editingPartner } as ClientLogo;
        }
      } else {
        const newPartner: ClientLogo = {
          id: `c-logo-${Date.now()}`,
          name: editingPartner.name || "",
          industry: editingPartner.industry || "",
          logoUrl: editingPartner.logoUrl || "",
          website: editingPartner.website || "",
          description: editingPartner.description || ""
        };
        clients.push(newPartner);
      }

      await onSaveCMS({ ...cmsData, clients });
      setEditingPartner(null);
      notifySuccess("Affiliate partner updated successfully.");
    } catch (e: any) {
      notifyError(e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deletePartner = async (id: string) => {
    try {
      const clients = (cmsData.clients || []).filter(c => c.id !== id);
      await onSaveCMS({ ...cmsData, clients });
      notifySuccess("Partner removed.");
    } catch (e: any) {
      notifyError(e.message);
    }
  };

  // --- MEMBERS ACTIONS ---

  const saveMember = async () => {
    if (!editingMember?.name || !editingMember?.role) {
      notifyError("Member name and role are required.");
      return;
    }
    setIsSaving(true);
    try {
      const teamMembers = [...(cmsData.teamMembers || [])];
      if (editingMember.id) {
        const idx = teamMembers.findIndex(m => m.id === editingMember.id);
        if (idx !== -1) {
          teamMembers[idx] = { ...teamMembers[idx], ...editingMember } as TeamMember;
        }
      } else {
        const newMember: TeamMember = {
          id: `m-${Date.now()}`,
          name: editingMember.name || "",
          role: editingMember.role || "",
          shortDescription: editingMember.shortDescription || "",
          photoUrl: editingMember.photoUrl || ""
        };
        teamMembers.push(newMember);
      }

      await onSaveCMS({ ...cmsData, teamMembers });
      setEditingMember(null);
      notifySuccess("Team Member updated successfully.");
    } catch (e: any) {
      notifyError(e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteMember = async (id: string) => {
    try {
      const teamMembers = (cmsData.teamMembers || []).filter(m => m.id !== id);
      await onSaveCMS({ ...cmsData, teamMembers });
      notifySuccess("Team member retired successfully.");
    } catch (e: any) {
      notifyError(e.message);
    }
  };

  // --- RENDER LOGIN GATES ---
  if (isVerifyingSession) {
    return (
      <div className="admin-panel-container max-w-md mx-auto p-12 text-center space-y-4 animate-pulse mt-20">
        <div className="w-10 h-10 border-4 border-t-[#e31e24] border-slate-200 rounded-full animate-spin mx-auto"></div>
        <p className={`text-xs font-mono ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          Securing administrative session lock...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    const isLocked = lockoutRemaining !== null && lockoutRemaining > 0;

    const formatTime = (totalSecs: number) => {
      const h = Math.floor(totalSecs / 3600);
      const m = Math.floor((totalSecs % 3600) / 60);
      const s = totalSecs % 60;
      return [
        h > 0 ? String(h).padStart(2, "0") : null,
        String(m).padStart(2, "0"),
        String(s).padStart(2, "0")
      ].filter(Boolean).join(":");
    };

    return (
      <div className={`admin-panel-container max-w-md mx-auto p-8 rounded-[2rem] border mt-16 space-y-6 animate-fadeIn ${
        isDark ? "bg-slate-950 border-slate-900" : "bg-white border-slate-200 shadow-xl"
      }`}>
        <div className="text-center space-y-2">
          <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center ${
            isLocked
              ? "bg-[#e31e24]/20 text-[#e31e24] animate-bounce"
              : isDark 
                ? "bg-[#e31e24]/10 text-[#e31e24]" 
                : "bg-red-50 text-[#e31e24]"
          }`}>
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className={`text-lg font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              {isLocked ? "Terminal Lockdown Active" : "Asia Link Control Hub Sign-In"}
            </h3>
            <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              {isLocked 
                ? "Brute force prevention active. Access has been temporarily suspended."
                : "Authorized administrative personnel only."
              }
            </p>
          </div>
        </div>

        {isLocked ? (
          <div className={`p-6 rounded-2xl border text-center space-y-4 ${
            isDark ? "bg-red-950/10 border-red-900/50" : "bg-red-50/50 border-red-100"
          }`}>
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-black uppercase tracking-wider text-red-500">
                COOLDOWN COUNTDOWN
              </span>
              <div className="text-3xl font-mono font-black text-red-600 tracking-widest animate-pulse">
                {formatTime(lockoutRemaining!)}
              </div>
            </div>
            <p className={`text-[11.5px] leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              This administrative portal has been locked for <b>1 hour</b> following 5 consecutive incorrect sign-in requests. Please wait for this secure cooldown to elapse before attempting another sign-in.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onExit}
                className={`w-full py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  isDark 
                    ? "border-slate-800 text-slate-300 hover:bg-slate-900" 
                    : "border-slate-205 text-slate-700 bg-white hover:bg-slate-50 shadow-sm"
                }`}
              >
                Return to Homepage
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email field */}
            <div className="space-y-1.5">
              <label className={`text-[11px] font-extrabold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@asialink.com"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border text-xs outline-none focus:ring-1 transition-all ${
                    isDark 
                      ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-red-500 focus:ring-red-500/20" 
                      : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#e31e24] focus:ring-red-500/10"
                  }`}
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className={`text-[11px] font-extrabold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Access Password
                </label>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter confidential password"
                  className={`w-full pl-11 pr-11 py-3 rounded-xl border text-xs outline-none focus:ring-1 transition-all tracking-wider ${
                    isDark 
                      ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-red-500 focus:ring-red-500/20" 
                      : "bg-slate-50 border-slate-200 text-slate-950 placeholder-slate-400 focus:border-[#e31e24] focus:ring-red-500/10"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="flex items-start gap-2 text-[11px] text-red-500 font-bold p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                disabled={isLoggingIn}
                onClick={onExit}
                className={`py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  isDark 
                    ? "border-slate-800 text-slate-400 hover:bg-slate-900 disabled:opacity-50" 
                    : "border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100 disabled:opacity-50"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoggingIn}
                className={`py-2.5 rounded-xl text-xs font-bold text-white transition-all bg-[#e31e24] hover:bg-red-600 cursor-pointer shadow-md disabled:bg-red-700/50 flex items-center justify-center gap-2`}
              >
                {isLoggingIn ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Access Center</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  // Derived filtered & paginated notices
  const filteredNotices = (cmsData.notices || []).filter((notice) => {
    const matchesSearch = !noticeSearch.trim() || 
      notice.title.toLowerCase().includes(noticeSearch.toLowerCase()) ||
      notice.description.toLowerCase().includes(noticeSearch.toLowerCase()) ||
      notice.tag.toLowerCase().includes(noticeSearch.toLowerCase());
      
    const matchesDate = !noticeDateFilter || 
      (notice.date && notice.date.includes(noticeDateFilter));
      
    return matchesSearch && matchesDate;
  });

  const totalNoticePages = Math.ceil(filteredNotices.length / noticesPerPage) || 1;
  const currentNoticePage = Math.min(noticePage, totalNoticePages);
  const startNoticeIndex = (currentNoticePage - 1) * noticesPerPage;
  const paginatedNotices = filteredNotices.slice(startNoticeIndex, startNoticeIndex + noticesPerPage);

  return (
    <div className={`admin-panel-container w-full h-screen overflow-hidden font-sans flex flex-col ${
      isDark ? "bg-slate-950" : "bg-white"
    }`}>
      
      {/* Dynamic Notifications Banner */}
      {successMsg && (
        <div className="bg-emerald-500 text-white px-6 py-3.5 text-xs font-bold flex items-center gap-2 font-mono justify-center border-b border-emerald-600 shrink-0">
          <Check className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="bg-[#e31e24] text-white px-6 py-3.5 text-xs font-bold flex items-center gap-2 font-mono justify-center border-b border-red-700 shrink-0">
          <AlertCircle className="w-4 h-4 animate-bounce" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* MOBILE DRAWER OVERLAY (3-BAR SIDE MENU) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar Drawer container */}
          <div className={`relative flex flex-col w-full max-w-xs h-full p-6 shadow-2xl transition-transform ${
            isDark ? "bg-slate-950 border-r border-slate-900 text-slate-100" : "bg-white border-r border-slate-200 text-slate-955"
          }`}>
            {/* Header / Brand with Close Button */}
            <div className="flex items-center justify-between pb-6 border-b border-dashed border-slate-300/20">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-gradient-to-br from-[#e31e24]/10 to-red-500/20 rounded-xl">
                  <Settings className="w-4 h-4 text-[#e31e24] animate-spin-slow" />
                </div>
                <div className="text-left">
                  <h3 className={`text-xs font-black tracking-widest uppercase ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                    Asia Link
                  </h3>
                  <p className={`text-[9px] font-mono leading-none mt-0.5 ${isDark ? "text-slate-500" : "text-[#e31e24]"}`}>
                    CMS CONTROL-HUB
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`p-2 rounded-xl border cursor-pointer transition-colors ${
                  isDark ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-white" : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
                }`}
                title="Close Menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
              {[
                { id: "demands", label: "Active Demands", icon: FileCheck },
                { id: "messages", label: "Contact Inquiries", icon: Mail },
                { id: "notices", label: "Notice Board", icon: Info },
                { id: "partners", label: "Global Affiliates", icon: Globe },
                { id: "team", label: "Our Team", icon: Users },
                { id: "company-details", label: "Company Details", icon: Settings },
                { id: "pdf", label: "Company Profile PDF", icon: FileText },
                { id: "root-settings", label: "Root Controls", icon: Lock },
              ].map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setIsMobileMenuOpen(false);
                      setEditingDemand(null);
                      setEditingNotice(null);
                      setEditingPartner(null);
                      setEditingMember(null);
                    }}
                    className={`w-full px-4 py-3 text-xs font-extrabold flex items-center gap-3 transition-all rounded-xl border relative cursor-pointer text-left ${
                      isActive
                        ? isDark
                          ? "bg-[#e31e24]/10 border-[#e31e24]/20 text-[#e31e24]"
                          : "bg-[#e31e24]/5 border-[#e31e24]/15 text-[#e31e24]"
                        : isDark
                          ? "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                          : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-3 bottom-3 w-1 bg-[#e31e24] rounded-r-md" />
                    )}
                    <TabIcon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Bottom Actions inside Mobile Drawer */}
            <div className="pt-4 border-t border-dashed border-slate-300/20 space-y-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className={`w-full px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                  isDark 
                    ? "bg-red-950/20 border-red-900/40 text-red-400 hover:bg-[#e31e24]/20 hover:text-red-300" 
                    : "bg-red-50 border-red-100 text-[#e31e24] hover:bg-red-100"
                }`}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onExit();
                }}
                className={`w-full px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                  isDark 
                    ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white" 
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Exit Panel</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[75vh] md:min-h-0 md:flex-1 items-stretch overflow-hidden">
        {/* LEFTSIDEBAR COLUMNS */}
        <div className={`hidden md:flex md:col-span-3 border-r flex-col justify-between md:h-full md:overflow-y-auto ${
          isDark ? "border-slate-900 bg-slate-950/25" : "border-slate-100 bg-slate-50/40"
        }`}>
          <div>
            {/* Sidebar Branding Title */}
            <div className={`p-6 border-b flex items-center gap-2.5 ${isDark ? "border-slate-900" : "border-slate-150"}`}>
              <div className="p-2 bg-gradient-to-br from-[#e31e24]/10 to-red-500/20 rounded-xl">
                <Settings className="w-4 h-4 text-[#e31e24] animate-spin-slow" />
              </div>
              <div>
                <h3 className={`text-xs font-black tracking-widest uppercase ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                  Asia Link
                </h3>
                <p className={`text-[9px] font-mono leading-none mt-0.5 ${isDark ? "text-slate-500" : "text-[#e31e24]"}`}>
                  CMS CONTROL-HUB
                </p>
              </div>
            </div>

            {/* Vertically Aligned Interactive Nav Group */}
            <nav className="p-4 space-y-1">
              {[
                { id: "demands", label: "Active Demands", icon: FileCheck },
                { id: "messages", label: "Contact Inquiries", icon: Mail },
                { id: "notices", label: "Notice Board", icon: Info },
                { id: "partners", label: "Global Affiliates", icon: Globe },
                { id: "team", label: "Our Team", icon: Users },
                { id: "company-details", label: "Company Details", icon: Settings },
                { id: "pdf", label: "Company Profile PDF", icon: FileText },
                { id: "root-settings", label: "Root Controls", icon: Lock },
              ].map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setEditingDemand(null);
                      setEditingNotice(null);
                      setEditingPartner(null);
                      setEditingMember(null);
                    }}
                    className={`w-full px-4 py-3 text-xs font-extrabold flex items-center gap-3 transition-all rounded-xl border relative cursor-pointer ${
                      isActive
                        ? isDark
                          ? "bg-[#e31e24]/10 border-[#e31e24]/20 text-[#e31e24]"
                          : "bg-[#e31e24]/5 border-[#e31e24]/15 text-[#e31e24]"
                        : isDark
                          ? "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                          : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-3 bottom-3 w-1 bg-[#e31e24] rounded-r-md" />
                    )}
                    <TabIcon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Persistent Return Button at bottom of sidebar */}
          <div className={`p-4 border-t space-y-2 ${isDark ? "border-slate-900" : "border-slate-150"}`}>
            <button
              onClick={handleLogout}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                isDark 
                  ? "bg-red-950/20 border-red-900/40 text-red-400 hover:bg-[#e31e24]/20 hover:text-red-300" 
                  : "bg-red-50 border-red-100 text-[#e31e24] hover:bg-red-100"
              }`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
            <button
              onClick={onExit}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                isDark 
                  ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white" 
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit Panel</span>
            </button>
          </div>
        </div>

        {/* RIGHT WORKSPACE ELEMENT */}
        <div className="col-span-1 md:col-span-9 flex flex-col md:h-full md:overflow-hidden">
          {/* Header of workspace showcasing specific guidance text */}
          <div className={`px-6 md:px-8 py-5 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0 ${
            isDark ? "border-slate-900 bg-slate-950/15" : "border-slate-100 bg-slate-50/15"
          }`}>
            <div className="flex items-center gap-3">
              {/* Mobile hamburger 3-bar menu trigger */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={`md:hidden p-2 rounded-xl border cursor-pointer transition-colors ${
                  isDark 
                    ? "bg-slate-900 border-slate-800 text-slate-100 hover:bg-slate-850" 
                    : "bg-white border-slate-205 text-slate-800 hover:bg-slate-50"
                }`}
                title="Open Navigation Menu"
              >
                <Menu className="w-4 h-4 text-[#e31e24]" />
              </button>

              <div className="space-y-0.5">
                <h4 className={`text-xs sm:text-sm font-bold capitalize ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                {activeTab === "demands" && "Active Vacancy Deployments"}
                {activeTab === "applications" && "Submitted Job Applications (Database)"}
                {activeTab === "messages" && "Contact Form Inquiries (Database)"}
                {activeTab === "notices" && "Notice Board Alerts & Compliances"}
                {activeTab === "partners" && "Affiliate Partners & Clients"}
                {activeTab === "team" && "Core Administrative Team Profile"}
                {activeTab === "pdf" && "Company Profile Document Database"}
                {activeTab === "root-settings" && "Root Administration Controls"}
                {activeTab === "company-details" && "Corporate Contact & Map Hub"}
              </h4>
              <p className={`text-[10px] font-mono ${isDark ? "text-slate-500" : "text-slate-555"}`}>
                {activeTab === "demands" && "Deploy or edit international recruitment vacancies in real-time."}
                {activeTab === "applications" && "Audit and manage comprehensive candidate profiles, passports, and CV files."}
                {activeTab === "messages" && "Review organic inquiries and feedback submitted via the Contact form."}
                {activeTab === "notices" && "Ensure ethical sourcing with Ministry of Labour rules & notices."}
                {activeTab === "partners" && "Manage logos, industries, and links of trusted partner agencies."}
                {activeTab === "team" && "Configure leadership bios, titles, and avatar photos."}
                {activeTab === "pdf" && "Directly ingest brand profile PDFs into the public assets folders."}
                {activeTab === "root-settings" && "Manage master admin credentials and Gmail SMTP server app passwords."}
                {activeTab === "company-details" && "Modify telephone, email, physical locations, map URLs, and social profiles centrally."}
              </p>
            </div>
          </div>
        </div>

          {/* Main Workspace content viewport rendering */}
          <div className="p-6 md:p-8 flex-1 min-h-[50vh] md:min-h-0 md:overflow-y-auto">
        
        {/* ======================================= */}
        {/* TAB 1: ACTIVE DEMANDS & VACANCIES */}
        {/* ======================================= */}
        {activeTab === "demands" && (
          <div className="space-y-6">
            {viewingVacancyAppsId ? (
              (() => {
                const selectedVacancy = localVacancies.find(v => v.id === viewingVacancyAppsId);
                const selectedVacancyApps = selectedVacancy 
                  ? applications.filter(app => {
                      if (app.selectedJobTitle === selectedVacancy.title) return true;
                      if (selectedVacancy.subJobs && Array.isArray(selectedVacancy.subJobs)) {
                        return selectedVacancy.subJobs.some((sub: any) => sub.jobTitle === app.selectedJobTitle);
                      }
                      return false;
                    })
                  : [];
                const filteredApps = selectedVacancyApps.filter(app => {
                  const query = candidateSearchQuery.toLowerCase();
                  return (
                    app.fullName?.toLowerCase().includes(query) ||
                    app.email?.toLowerCase().includes(query) ||
                    app.phone?.toLowerCase().includes(query) ||
                    app.passportNo?.toLowerCase().includes(query) ||
                    app.academicQualification?.toLowerCase().includes(query) ||
                    app.experience?.toLowerCase().includes(query)
                  );
                });

                return (
                  <div className="space-y-6 animate-fadeIn">
                    {/* Back Button & Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-500/5 p-4 rounded-xl border border-slate-500/10">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setViewingVacancyAppsId(null);
                            setCandidateSearchQuery("");
                          }}
                          className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                            isDark 
                              ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850" 
                              : "bg-white border-slate-205 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Back to Active Demands</span>
                        </button>
                        <div className="h-6 w-[1px] bg-slate-500/20" />
                        <div>
                          <h4 className={`text-sm font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
                            {selectedVacancy?.title || "Vacancy Details"}
                          </h4>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {selectedVacancy?.companyName} • {selectedVacancy?.location}
                          </p>
                        </div>
                      </div>

                      {/* Summary Metrics */}
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border ${
                          isDark ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" : "bg-cyan-50 border-cyan-150 text-cyan-700"
                        }`}>
                          Applications Sourced: <b>{selectedVacancyApps.length}</b>
                        </span>
                        {selectedVacancy?.slots && (
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border ${
                            isDark ? "bg-slate-800/40 border-slate-800/60 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-600"
                          }`}>
                            Demand Quota: <b>{selectedVacancy.slots} openings</b>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Excel Sheet Controller Toolbar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-500/5 p-4 rounded-xl border border-slate-500/10">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-500">
                          <FileSpreadsheet className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className={`text-xs font-black tracking-tight ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                            APPLICANT DIRECTORY SPREADSHEET
                          </h4>
                          <p className={`text-[10px] font-mono ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                            Spreadsheet View • Live database collection synchronization
                          </p>
                        </div>
                      </div>

                      {/* Clean & Simplified Export Commands */}
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => {
                            if (filteredApps.length === 0) {
                              notifyError("No candidate data available to export.");
                              return;
                            }
                            try {
                              const title = selectedVacancy?.title || "Vacancy_Applicants";
                              
                              const uniqueCompanies = Array.from(new Set(filteredApps.map(app => {
                                const matchedVac = localVacancies.find(v => {
                                  if (v.title === app.selectedJobTitle) return true;
                                  if (v.subJobs && Array.isArray(v.subJobs)) {
                                    return v.subJobs.some((sub: any) => sub.jobTitle === app.selectedJobTitle);
                                  }
                                  return false;
                                });
                                return matchedVac?.companyName || selectedVacancy?.companyName || "";
                              }).filter(Boolean)));
                              const companyHeaderDisplay = uniqueCompanies.length > 0 
                                ? uniqueCompanies.join(", ") 
                                : (selectedVacancy?.companyName || "N/A");

                              // Recruiter Company Header Rows for the XLSX Document
                              const wsRows = [
                                ["RECRUITER PROFILE:", "ASIA LINK SERVICES PVT. LTD."],
                                ["Govt. License No:", "1249/074/075"],
                                ["Office Address:", cmsData?.contactInfo?.address || "Kathmandu, Nepal"],
                                ["Official Telephone:", cmsData?.contactInfo?.phone || "+977-1-4515281"],
                                ["Contact Email:", cmsData?.contactInfo?.email || "info@asialink.com.np"],
                                ["Corporate Website:", cmsData?.contactInfo?.website || "www.asialink.com.np"],
                                ["Recruitment Pool:", title],
                                ["Employer Company:", companyHeaderDisplay],
                                ["Export Date/Time:", new Date().toLocaleString()],
                                [], // spacing separator row
                                // Data Header Row
                                [
                                  "S.No",
                                  "Application ID",
                                  "Candidate Name",
                                  "Applied Position",
                                  "Email Address",
                                  "Contact Number",
                                  "Passport Number",
                                  "Date of Birth",
                                  "Permanent Address",
                                  "Academic Qualifications",
                                  "Work Experience Summary",
                                  "Applied Date",
                                  "Photo URL",
                                  "Passport File Copy",
                                  "Resume / CV Copy"
                                ]
                              ];

                              // Map actual candidate records
                              filteredApps.forEach((app, index) => {
                                wsRows.push([
                                  index + 1,
                                  app.id,
                                  app.fullName,
                                  app.selectedJobTitle || "N/A",
                                  app.email,
                                  app.phone,
                                  app.passportNo || "N/A",
                                  app.dateOfBirth || "N/A",
                                  app.permanentAddress || "N/A",
                                  app.academicQualification || "N/A",
                                  app.experience || "N/A",
                                  new Date(app.submittedAt).toLocaleDateString(),
                                  app.photoUrl ? `${window.location.origin}${app.photoUrl}` : "None",
                                  app.passportUrl ? `${window.location.origin}${app.passportUrl}` : "None",
                                  app.cvUrl ? `${window.location.origin}${app.cvUrl}` : "None"
                                ]);
                              });

                              const ws = XLSX.utils.aoa_to_sheet(wsRows);
                              const wb = XLSX.utils.book_new();
                              XLSX.utils.book_append_sheet(wb, ws, "Sourced Candidates");

                              // Auto widths
                              ws["!cols"] = [
                                { wch: 8 },  // S.No
                                { wch: 25 }, // ID / Company details text
                                { wch: 25 }, // Name
                                { wch: 25 }, // Applied Position
                                { wch: 25 }, // Email
                                { wch: 18 }, // Phone
                                { wch: 16 }, // Passport No
                                { wch: 14 }, // DOB
                                { wch: 28 }, // Address
                                { wch: 35 }, // Qualifications
                                { wch: 35 }, // Experience
                                { wch: 14 }, // Date
                                { wch: 40 }, // Photo URL
                                { wch: 40 }, // Passport URL
                                { wch: 40 }  // CV URL
                              ];

                              XLSX.writeFile(wb, `${title.replace(/\s+/g, "_")}_Applicants_Report.xlsx`);
                              notifySuccess("Successfully exported Microsoft Excel (.xlsx) file with Recruiter Company Details!");
                            } catch (err: any) {
                              notifyError(`Excel Export Failed: ${err.message}`);
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 transition-all bg-emerald-600 hover:bg-emerald-700 text-white border-transparent cursor-pointer"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                          <span>Export XLSX</span>
                        </button>

                        <button
                          onClick={() => {
                            if (filteredApps.length === 0) {
                              notifyError("No candidate data available to export.");
                              return;
                            }
                            const title = selectedVacancy?.title || "Vacancy Applicants";
                            
                            const uniqueCompanies = Array.from(new Set(filteredApps.map(app => {
                              const matchedVac = localVacancies.find(v => {
                                if (v.title === app.selectedJobTitle) return true;
                                if (v.subJobs && Array.isArray(v.subJobs)) {
                                  return v.subJobs.some((sub: any) => sub.jobTitle === app.selectedJobTitle);
                                  }
                                return false;
                              });
                              return matchedVac?.companyName || selectedVacancy?.companyName || "";
                            }).filter(Boolean)));
                            const companyHeaderDisplay = uniqueCompanies.length > 0 
                              ? uniqueCompanies.join(", ") 
                              : (selectedVacancy?.companyName || "N/A");

                            const printWindow = window.open("", "_blank");
                            if (!printWindow) {
                              notifyError("Please allow pop-ups to print reports.");
                              return;
                            }

                            const rowsHtml = filteredApps.map((app, index) => `
                              <tr>
                                <td style="text-align: center; font-weight: bold; font-family: monospace;">${index + 1}</td>
                                <td>
                                  <b style="color: #0f172a; font-size: 13px;">${app.fullName}</b>
                                  <div style="font-size: 10px; color: #64748b; font-family: monospace; margin-top: 2px;">ID: ${app.id}</div>
                                </td>
                                <td>
                                  <span style="font-weight: 500; display: block; color: #0f172a;">${app.selectedJobTitle || "N/A"}</span>
                                </td>
                                <td><a href="mailto:${app.email}" style="color: #2563eb; text-decoration: none;">${app.email}</a></td>
                                <td style="font-family: monospace;">${app.phone}</td>
                                <td style="font-family: monospace; font-weight: bold;">${app.passportNo || "N/A"}</td>
                                <td style="font-family: monospace;">${app.dateOfBirth || "N/A"}</td>
                                <td style="font-size: 11px;">${app.permanentAddress || "N/A"}</td>
                                <td style="font-size: 11px; max-width: 150px; white-space: normal; word-break: break-word;">${app.academicQualification || "N/A"}</td>
                                <td style="font-size: 11px; max-width: 180px; white-space: normal; word-break: break-word;">${app.experience || "N/A"}</td>
                                <td style="text-align: center; font-size: 10px; line-height: 1.6;">
                                  <div style="margin-bottom: 2px;">Photo: <b style="color: ${app.photoUrl ? '#10b981' : '#f43f5e'}">${app.photoUrl ? '✓ YES' : '✗ NO'}</b></div>
                                  <div style="margin-bottom: 2px;">Passport: <b style="color: ${app.passportUrl ? '#10b981' : '#f43f5e'}">${app.passportUrl ? '✓ YES' : '✗ NO'}</b></div>
                                  <div>CV/Resume: <b style="color: ${app.cvUrl ? '#10b981' : '#f43f5e'}">${app.cvUrl ? '✓ YES' : '✗ NO'}</b></div>
                                </td>
                              </tr>
                            `).join("");

                            printWindow.document.write(`
                              <html>
                                <head>
                                  <title>Asia Link Services - Candidates Directory Report</title>
                                  <style>
                                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                                    body {
                                      font-family: 'Inter', sans-serif;
                                      color: #0f172a;
                                      margin: 24px;
                                      background-color: #ffffff;
                                      -webkit-print-color-adjust: exact;
                                      print-color-adjust: exact;
                                    }
                                    .header {
                                      display: flex;
                                      justify-content: space-between;
                                      align-items: flex-start;
                                      border-bottom: 3px solid #e31e24;
                                      padding-bottom: 14px;
                                      margin-bottom: 24px;
                                    }
                                    .title-area h1 {
                                      font-size: 20px;
                                      font-weight: 700;
                                      letter-spacing: -0.02em;
                                      margin: 0;
                                      color: #e31e24;
                                    }
                                    .title-area h2 {
                                      font-size: 14px;
                                      font-weight: 600;
                                      margin: 4px 0 0 0;
                                      color: #1e293b;
                                    }
                                    .title-area p {
                                      font-size: 11px;
                                      color: #64748b;
                                      margin: 4px 0 0 0;
                                    }
                                    .meta-info {
                                      text-align: right;
                                      font-size: 11px;
                                      color: #475569;
                                      line-height: 1.5;
                                    }
                                    table {
                                      width: 100%;
                                      border-collapse: collapse;
                                      font-size: 11px;
                                      box-shadow: 0 1px 3px rgba(0,0,0,0.02);
                                    }
                                    th {
                                      background-color: #f8fafc;
                                      color: #475569;
                                      font-weight: 700;
                                      text-transform: uppercase;
                                      font-size: 10px;
                                      letter-spacing: 0.05em;
                                      border: 1px solid #cbd5e1;
                                      padding: 10px 8px;
                                      text-align: left;
                                    }
                                    td {
                                      border: 1px solid #e2e8f0;
                                      padding: 10px 8px;
                                      vertical-align: top;
                                      word-break: break-all;
                                      line-height: 1.4;
                                    }
                                    tr:nth-child(even) td {
                                      background-color: #f8fafc;
                                    }
                                    .footer {
                                      margin-top: 40px;
                                      border-top: 1px solid #e2e8f0;
                                      padding-top: 12px;
                                      font-size: 10px;
                                      color: #64748b;
                                      text-align: center;
                                      display: flex;
                                      justify-content: space-between;
                                    }
                                    @page {
                                      size: A4 landscape;
                                      margin: 1.2cm;
                                    }
                                  </style>
                                </head>
                                <body>
                                  <div class="header">
                                    <div class="title-area">
                                      <h1>ASIA LINK SERVICES PVT. LTD.</h1>
                                      <div style="font-size: 11px; color: #475569; margin-top: 4px; font-weight: 500;">
                                        Govt. License No: 1249/074/075 | ISO 9001:2015 Certified Agency
                                      </div>
                                      <div style="font-size: 10px; color: #64748b; margin-top: 2px;">
                                        Address: ${cmsData?.contactInfo?.address || "Kathmandu, Nepal"} | Tel: ${cmsData?.contactInfo?.phone || "+977-1-4515281"}
                                      </div>
                                      <div style="font-size: 10px; color: #64748b; margin-top: 1px;">
                                        Email: ${cmsData?.contactInfo?.email || "info@asialink.com.np"} | Web: ${cmsData?.contactInfo?.website || "www.asialink.com.np"}
                                      </div>
                                      <h2 style="margin-top: 12px; font-size: 14px; color: #1e293b; font-weight: 600;">Sourced Candidates Directory Report</h2>
                                      <p style="margin-top: 4px; font-size: 11px; color: #64748b;">Applied Vacancy: <b style="color: #0f172a;">${title}</b>${companyHeaderDisplay !== "N/A" ? ` | Employer Company: <b style="color: #0f172a;">${companyHeaderDisplay}</b>` : ""}</p>
                                    </div>
                                    <div class="meta-info">
                                      <p>Report Date: <b>${new Date().toLocaleString()}</b></p>
                                      <p>Total Filtered Records: <b>${filteredApps.length}</b></p>
                                    </div>
                                  </div>
                                  <table>
                                    <thead>
                                      <tr>
                                        <th style="width: 3%; text-align: center;">A: S.N.</th>
                                        <th style="width: 14%;">B: Candidate Name</th>
                                        <th style="width: 12%;">C: Applied Position</th>
                                        <th style="width: 13%;">D: Email Address</th>
                                        <th style="width: 9%;">E: Mobile Phone</th>
                                        <th style="width: 7%;">F: Passport No</th>
                                        <th style="width: 7%;">G: Date of Birth</th>
                                        <th style="width: 10%;">H: Permanent Address</th>
                                        <th style="width: 10%;">I: Qualifications</th>
                                        <th style="width: 11%;">J: Experience Profile</th>
                                        <th style="width: 4%; text-align: center;">K: Attachments</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      ${rowsHtml}
                                    </tbody>
                                  </table>
                                  <div class="footer">
                                    <span>Confidential Directory Statement • Authorized Personnel Only</span>
                                    <span>© Asia Link Services Pvt. Ltd.</span>
                                  </div>
                                  <script>
                                    window.onload = function() {
                                      window.print();
                                      setTimeout(function() { window.close(); }, 500);
                                    }
                                  </script>
                                </body>
                              </html>
                            `);
                            printWindow.document.close();
                            notifySuccess("Dispatched landscape PDF layout print window with Recruiter Company details!");
                          }}
                          className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isDark 
                              ? "bg-slate-900 border-slate-800 hover:border-slate-750 text-slate-200 hover:bg-slate-850" 
                              : "bg-white border-slate-205 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <Printer className="w-3.5 h-3.5 text-blue-500" />
                          <span>Export PDF / Print</span>
                        </button>
                      </div>
                    </div>

                    {/* Search Bar / Filter Bar */}
                    <div className="flex items-center gap-3 bg-slate-500/5 p-3 rounded-xl border border-slate-500/10 my-4">
                      <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                      <input
                        type="text"
                        value={candidateSearchQuery}
                        onChange={(e) => setCandidateSearchQuery(e.target.value)}
                        placeholder="Filter candidates by name, email, phone, passport ID, credentials or cover letter keywords..."
                        className={`w-full bg-transparent border-none text-xs outline-none ${
                          isDark ? "text-white placeholder-slate-500" : "text-slate-900 placeholder-slate-400"
                        }`}
                      />
                      {candidateSearchQuery && (
                        <button
                          onClick={() => setCandidateSearchQuery("")}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-500/10 text-slate-400 hover:text-white"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    {/* Interactive Excel Sheet Grid Container */}
                    {filteredApps.length === 0 ? (
                      <div className={`p-16 text-center rounded-2xl border ${
                        isDark ? "border-slate-900 bg-slate-950/20" : "border-slate-150 bg-slate-50/50"
                      } space-y-3`}>
                        <Inbox className="w-10 h-10 text-slate-400 mx-auto animate-pulse" />
                        <h4 className={`text-sm font-extrabold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                          No Candidate Matches Found
                        </h4>
                        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                          {selectedVacancyApps.length === 0
                            ? "No candidates have applied for this vacancy yet. As soon as applications are completed in the careers flow, they will be registered."
                            : "Your search filters do not match any candidates in this specific recruitment pool. Try tweaking your query parameters."}
                        </p>
                      </div>
                    ) : (
                      <div className={`border rounded-xl overflow-hidden ${
                        isDark ? "border-slate-850 bg-slate-900/10" : "border-slate-200 bg-white"
                      }`}>
                        <div className="overflow-x-auto max-w-full">
                          <table className="w-full border-collapse min-w-[1600px]">
                            {/* Column Letters Row (A, B, C...) */}
                            <thead>
                              <tr className={`border-b ${isDark ? "border-slate-800 bg-slate-950/40" : "border-slate-200 bg-slate-100/70"}`}>
                                <th className={`w-10 text-center font-mono text-[9px] font-bold border-r py-1 select-none ${
                                  isDark ? "border-slate-800 text-slate-500 bg-slate-950" : "border-slate-200 text-slate-400 bg-slate-150"
                                }`}>
                                  #
                                </th>
                                <th className={`w-14 text-center font-mono text-[9px] font-bold border-r select-none ${isDark ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-400"}`}>A</th>
                                <th className={`w-48 text-left font-mono text-[9px] font-bold border-r select-none px-2 ${isDark ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-400"}`}>B</th>
                                <th className={`w-44 text-left font-mono text-[9px] font-bold border-r select-none px-2 ${isDark ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-400"}`}>C</th>
                                <th className={`w-44 text-left font-mono text-[9px] font-bold border-r select-none px-2 ${isDark ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-400"}`}>D</th>
                                <th className={`w-36 text-left font-mono text-[9px] font-bold border-r select-none px-2 ${isDark ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-400"}`}>E</th>
                                <th className={`w-32 text-left font-mono text-[9px] font-bold border-r select-none px-2 ${isDark ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-400"}`}>F</th>
                                <th className={`w-28 text-left font-mono text-[9px] font-bold border-r select-none px-2 ${isDark ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-400"}`}>G</th>
                                <th className={`w-44 text-left font-mono text-[9px] font-bold border-r select-none px-2 ${isDark ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-400"}`}>H</th>
                                <th className={`w-52 text-left font-mono text-[9px] font-bold border-r select-none px-2 ${isDark ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-400"}`}>I</th>
                                <th className={`w-64 text-left font-mono text-[9px] font-bold border-r select-none px-2 ${isDark ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-400"}`}>J</th>
                                <th className={`w-36 text-center font-mono text-[9px] font-bold border-r select-none px-2 ${isDark ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-400"}`}>K</th>
                                <th className={`w-56 text-center font-mono text-[9px] font-bold border-r select-none px-2 ${isDark ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-400"}`}>L</th>
                                <th className="w-24 text-center font-mono text-[9px] font-bold select-none px-2 text-slate-500 dark:text-slate-500">M</th>
                              </tr>

                              {/* Column Text Labels Row */}
                              <tr className={`border-b text-[10px] ${isDark ? "border-slate-800 bg-slate-900/60" : "border-slate-200 bg-slate-50"}`}>
                                <th className={`font-mono font-normal border-r text-center py-2 ${isDark ? "border-slate-800 text-slate-500 bg-slate-950" : "border-slate-200 text-slate-400 bg-slate-150"}`}>
                                  SN
                                </th>
                                <th className={`font-semibold border-r text-center py-2 px-1 ${isDark ? "border-slate-800 text-slate-300" : "border-slate-200 text-slate-600"}`}>RECORD ID</th>
                                <th className={`font-semibold border-r text-left py-2 px-2.5 ${isDark ? "border-slate-800 text-slate-300" : "border-slate-200 text-slate-600"}`}>CANDIDATE NAME</th>
                                <th className={`font-semibold border-r text-left py-2 px-2.5 ${isDark ? "border-slate-800 text-slate-300" : "border-slate-200 text-slate-600"}`}>APPLIED POSITION</th>
                                <th className={`font-semibold border-r text-left py-2 px-2.5 ${isDark ? "border-slate-800 text-slate-300" : "border-slate-200 text-slate-600"}`}>EMAIL ADDRESS</th>
                                <th className={`font-semibold border-r text-left py-2 px-2.5 ${isDark ? "border-slate-800 text-slate-300" : "border-slate-200 text-slate-600"}`}>PHONE NUMBER</th>
                                <th className={`font-semibold border-r text-left py-2 px-2.5 ${isDark ? "border-slate-800 text-slate-300" : "border-slate-200 text-slate-600"}`}>PASSPORT NO</th>
                                <th className={`font-semibold border-r text-left py-2 px-2.5 ${isDark ? "border-slate-800 text-slate-300" : "border-slate-200 text-slate-600"}`}>DATE OF BIRTH</th>
                                <th className={`font-semibold border-r text-left py-2 px-2.5 ${isDark ? "border-slate-800 text-slate-300" : "border-slate-200 text-slate-600"}`}>PERMANENT ADDRESS</th>
                                <th className={`font-semibold border-r text-left py-2 px-2.5 ${isDark ? "border-slate-800 text-slate-300" : "border-slate-200 text-slate-600"}`}>ACADEMIC QUALS</th>
                                <th className={`font-semibold border-r text-left py-2 px-2.5 ${isDark ? "border-slate-800 text-slate-300" : "border-slate-200 text-slate-600"}`}>WORK EXPERIENCE</th>
                                <th className={`font-semibold border-r text-center py-2 px-2.5 ${isDark ? "border-slate-800 text-slate-300" : "border-slate-200 text-slate-600"}`}>DATE SOURCED</th>
                                <th className={`font-semibold border-r text-center py-2 px-2.5 ${isDark ? "border-slate-800 text-slate-300" : "border-slate-200 text-slate-600"}`}>ATTACHMENTS (PHOTO/PPT/CV)</th>
                                <th className={`font-semibold text-center py-2 px-2.5 ${isDark ? "text-slate-300" : "text-slate-600"}`}>ACTIONS</th>
                              </tr>
                            </thead>

                            {/* Spreadsheet Grid Rows */}
                            <tbody className="text-[11px] font-mono">
                              {filteredApps.map((app, index) => {
                                const rowNum = index + 1;
                                
                                // Local active cell styling helper
                                const getCellClass = (col: string, val: string) => {
                                  const isActive = activeCell?.row === index && activeCell?.col === col;
                                  return `border-r py-2.5 px-2.5 text-left truncate align-middle cursor-pointer transition-colors relative select-none max-w-[220px] ${
                                    isDark 
                                      ? "border-slate-800 hover:bg-slate-800/40" 
                                      : "border-slate-200 hover:bg-slate-100/50"
                                  } ${
                                    isActive 
                                      ? "outline-2 outline-emerald-500 outline-offset-[-2.5px] z-10 bg-emerald-500/10 dark:bg-emerald-500/15" 
                                      : ""
                                  }`;
                                };

                                return (
                                  <tr 
                                    key={app.id} 
                                    className={`border-b transition-all ${
                                      isDark 
                                        ? "border-slate-800 hover:bg-slate-900/40 odd:bg-slate-900/10 even:bg-slate-900/3" 
                                        : "border-slate-200 hover:bg-slate-50/40 odd:bg-white even:bg-slate-50/30"
                                    }`}
                                  >
                                    {/* Left Row Header Index Column */}
                                    <td className={`font-mono text-[9px] font-bold text-center py-2.5 select-none border-r ${
                                      isDark ? "border-slate-800 text-slate-500 bg-slate-950" : "border-slate-200 text-slate-400 bg-slate-150"
                                    }`}>
                                      {rowNum}
                                    </td>

                                    {/* A: ID */}
                                    <td 
                                      onClick={() => {
                                        setActiveCell({ row: index, col: "A" });
                                        setCellFocusValue(app.id);
                                      }}
                                      className={getCellClass("A", app.id)}
                                    >
                                      <span className="text-slate-400 text-[10px]">{app.id}</span>
                                    </td>

                                    {/* B: Candidate Name */}
                                    <td 
                                      onClick={() => {
                                        setActiveCell({ row: index, col: "B" });
                                        setCellFocusValue(app.fullName);
                                      }}
                                      className={`${getCellClass("B", app.fullName)} font-sans font-bold ${
                                        isDark ? "text-slate-100" : "text-slate-900"
                                      }`}
                                    >
                                      {app.fullName}
                                    </td>

                                    {/* C: Applied Position */}
                                    <td 
                                      onClick={() => {
                                        setActiveCell({ row: index, col: "C" });
                                        setCellFocusValue(app.selectedJobTitle || "N/A");
                                      }}
                                      className={`${getCellClass("C", app.selectedJobTitle || "N/A")} text-emerald-500 font-bold dark:text-emerald-400`}
                                    >
                                      {app.selectedJobTitle || "N/A"}
                                    </td>

                                    {/* D: Email */}
                                    <td 
                                      onClick={() => {
                                        setActiveCell({ row: index, col: "D" });
                                        setCellFocusValue(app.email);
                                      }}
                                      className={getCellClass("D", app.email)}
                                    >
                                      <span className="font-mono text-slate-400">{app.email}</span>
                                    </td>

                                    {/* E: Phone */}
                                    <td 
                                      onClick={() => {
                                        setActiveCell({ row: index, col: "E" });
                                        setCellFocusValue(app.phone);
                                      }}
                                      className={getCellClass("E", app.phone)}
                                    >
                                      <span className="font-mono text-slate-400">{app.phone}</span>
                                    </td>

                                    {/* F: Passport No */}
                                    <td 
                                      onClick={() => {
                                        setActiveCell({ row: index, col: "F" });
                                        setCellFocusValue(app.passportNo || "N/A");
                                      }}
                                      className={`${getCellClass("F", app.passportNo || "N/A")} font-bold text-slate-400`}
                                    >
                                      {app.passportNo || "N/A"}
                                    </td>

                                    {/* G: Date of Birth */}
                                    <td 
                                      onClick={() => {
                                        setActiveCell({ row: index, col: "G" });
                                        setCellFocusValue(app.dateOfBirth || "N/A");
                                      }}
                                      className={getCellClass("G", app.dateOfBirth || "N/A")}
                                    >
                                      {app.dateOfBirth || "N/A"}
                                    </td>

                                    {/* H: Permanent Address */}
                                    <td 
                                      onClick={() => {
                                        setActiveCell({ row: index, col: "H" });
                                        setCellFocusValue(app.permanentAddress || "N/A");
                                      }}
                                      className={getCellClass("H", app.permanentAddress || "N/A")}
                                    >
                                      {app.permanentAddress || "N/A"}
                                    </td>

                                    {/* I: Qualifications */}
                                    <td 
                                      onClick={() => {
                                        setActiveCell({ row: index, col: "I" });
                                        setCellFocusValue(app.academicQualification || "None");
                                      }}
                                      className={getCellClass("I", app.academicQualification || "None")}
                                    >
                                      {app.academicQualification || "Not Specified"}
                                    </td>

                                    {/* J: Experience Summary */}
                                    <td 
                                      onClick={() => {
                                        setActiveCell({ row: index, col: "J" });
                                        setCellFocusValue(app.experience || "None");
                                      }}
                                      className={getCellClass("J", app.experience || "None")}
                                    >
                                      {app.experience || "Not Specified"}
                                    </td>

                                    {/* K: Date Sourced */}
                                    <td 
                                      onClick={() => {
                                        setActiveCell({ row: index, col: "K" });
                                        setCellFocusValue(new Date(app.submittedAt).toLocaleString());
                                      }}
                                      className={`${getCellClass("K", new Date(app.submittedAt).toLocaleString())} text-center`}
                                    >
                                      {new Date(app.submittedAt).toLocaleDateString()}
                                    </td>

                                    {/* L: Combined Document Downloads Attachments (including Photo, PPT, CV) */}
                                    <td 
                                      onClick={() => {
                                        setActiveCell({ row: index, col: "L" });
                                        setCellFocusValue(`Photo: ${app.photoUrl || "None"}, Passport Doc: ${app.passportUrl || "None"}, CV Doc: ${app.cvUrl || "None"}`);
                                      }}
                                      className={`${getCellClass("L", "")} text-center`}
                                    >
                                      <div className="flex items-center justify-center gap-1.5">
                                        {/* Thumbnail Photo inline */}
                                        {app.photoUrl ? (
                                          <a 
                                            href={app.photoUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="w-5 h-5 rounded border border-slate-500/20 bg-slate-500/5 overflow-hidden shrink-0 group block"
                                            title="View Passport Photo"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            <img src={app.photoUrl} alt={app.fullName} className="w-full h-full object-cover group-hover:scale-125 transition-transform" />
                                          </a>
                                        ) : (
                                          <span className="text-[9px] text-slate-500 dark:text-slate-600 font-mono">-</span>
                                        )}

                                        {app.passportUrl ? (
                                          <a 
                                            href={app.passportUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all cursor-pointer flex items-center gap-0.5 shrink-0"
                                            title="View / Download Passport COPY"
                                          >
                                            <FileText className="w-2.5 h-2.5" />
                                            <span>PPT</span>
                                          </a>
                                        ) : (
                                          <span className="text-[9px] text-slate-500 dark:text-slate-600 font-mono">-</span>
                                        )}
                                        {app.cvUrl ? (
                                          <a 
                                            href={app.cvUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer flex items-center gap-0.5 shrink-0"
                                            title="View / Download CV / Resume"
                                          >
                                            <FileText className="w-2.5 h-2.5" />
                                            <span>CV</span>
                                          </a>
                                        ) : (
                                          <span className="text-[9px] text-slate-550 dark:text-slate-600">-</span>
                                        )}
                                      </div>
                                    </td>

                                    {/* L: Interactive Rows Actions */}
                                    <td className="text-center py-2.5 px-2 align-middle">
                                      <div className="flex items-center justify-center gap-1.5">
                                        {/* Inspector Slide Over Trigger */}
                                        <button
                                          onClick={() => setSelectedCandidateForModal(app)}
                                          className={`p-1 rounded-md border transition-all cursor-pointer ${
                                            isDark 
                                              ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800" 
                                              : "bg-slate-50 border-slate-205 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                          }`}
                                          title="View Complete Candidate Card Profile"
                                        >
                                          <Eye className="w-3.5 h-3.5" />
                                        </button>

                                        {/* Row Deleter */}
                                        <button
                                          onClick={() => setDeleteConfirm({
                                            type: "application",
                                            id: app.id,
                                            title: `${app.fullName} - ${app.selectedJobTitle}`
                                          })}
                                          className="p-1 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition-all cursor-pointer border border-transparent"
                                          title="Erase Application Record"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Candidate Details Inspector Drawer Modal Overlay */}
                    {selectedCandidateForModal && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
                        <div className={`w-full max-w-2xl rounded-2xl border shadow-2xl p-6 md:p-8 relative ${
                          isDark ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-white border-slate-150 text-slate-800"
                        }`}>
                          {/* Close button */}
                          <button
                            onClick={() => setSelectedCandidateForModal(null)}
                            className={`absolute top-4 right-4 p-2 rounded-xl transition-all cursor-pointer ${
                              isDark ? "hover:bg-slate-800 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-slate-900"
                            }`}
                          >
                            <X className="w-5 h-5" />
                          </button>

                          <div className="flex flex-col md:flex-row gap-6">
                            {/* Left Side: Photo Column */}
                            <div className="flex flex-col items-center shrink-0">
                              <div className="w-28 h-28 rounded-2xl border overflow-hidden bg-slate-500/10 border-slate-300/20 flex items-center justify-center shadow-inner">
                                {selectedCandidateForModal.photoUrl ? (
                                  <img src={selectedCandidateForModal.photoUrl} alt={selectedCandidateForModal.fullName} className="w-full h-full object-cover" />
                                ) : (
                                  <Users className="w-12 h-12 text-slate-400" />
                                )}
                              </div>
                              {selectedCandidateForModal.photoUrl && (
                                <button
                                  onClick={async () => {
                                    const ext = selectedCandidateForModal.photoUrl.split(".").pop()?.split("?")[0] || "jpg";
                                    const nameStr = selectedCandidateForModal.fullName.replace(/\s+/g, "_");
                                    try {
                                      const res = await fetch(selectedCandidateForModal.photoUrl);
                                      const blob = await res.blob();
                                      const bUrl = window.URL.createObjectURL(blob);
                                      const link = document.createElement("a");
                                      link.href = bUrl;
                                      link.download = `${nameStr}_passport_photo.${ext}`;
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                      window.URL.revokeObjectURL(bUrl);
                                      notifySuccess("Downloaded image file successfully.");
                                    } catch (e) {
                                      window.open(selectedCandidateForModal.photoUrl, "_blank");
                                    }
                                  }}
                                  className="mt-3 w-full px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  <span>Download Photo</span>
                                </button>
                              )}
                            </div>

                            {/* Right Side: Information Panel */}
                            <div className="flex-1 space-y-4">
                              <div>
                                <span className="text-[10px] text-rose-500 font-mono tracking-wider block uppercase font-bold">
                                  Applied Vacancy Record
                                </span>
                                <h3 className={`text-xl font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
                                  {selectedCandidateForModal.fullName}
                                </h3>
                                <p className="text-xs text-slate-400 font-mono mt-0.5">
                                  Application ID: {selectedCandidateForModal.id} • Sourced On: {new Date(selectedCandidateForModal.submittedAt).toLocaleString()}
                                </p>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 border-t border-b border-dashed border-slate-500/10 py-4 text-xs">
                                <div className="min-w-0">
                                  <span className="text-[9px] text-slate-500 font-mono block uppercase tracking-wider mb-0.5">Email Address</span>
                                  <a href={`mailto:${selectedCandidateForModal.email}`} className="font-semibold text-rose-550 hover:underline break-all block">
                                    {selectedCandidateForModal.email}
                                  </a>
                                </div>
                                <div className="min-w-0">
                                  <span className="text-[9px] text-slate-500 font-mono block uppercase tracking-wider mb-0.5">Phone Number</span>
                                  <span className={`font-semibold break-all block ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                                    {selectedCandidateForModal.phone}
                                  </span>
                                </div>
                                <div className="min-w-0">
                                  <span className="text-[9px] text-slate-500 font-mono block uppercase tracking-wider mb-0.5">Passport ID Number</span>
                                  <span className="font-mono font-bold text-emerald-500 break-all block">
                                    {selectedCandidateForModal.passportNo || "N/A"}
                                  </span>
                                </div>
                                <div className="min-w-0">
                                  <span className="text-[9px] text-slate-500 font-mono block uppercase tracking-wider mb-0.5">Date of Birth</span>
                                  <span className={`font-semibold break-all block ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                                    {selectedCandidateForModal.dateOfBirth || "N/A"}
                                  </span>
                                </div>
                                <div className="sm:col-span-2 min-w-0">
                                  <span className="text-[9px] text-slate-500 font-mono block uppercase tracking-wider mb-0.5">Permanent Residence</span>
                                  <span className={`font-semibold break-words block ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                                    {selectedCandidateForModal.permanentAddress || "N/A"}
                                  </span>
                                </div>
                              </div>

                              {/* Qualifications & Message */}
                              <div className="space-y-3">
                                <div>
                                  <span className="text-[9px] text-slate-500 font-mono block uppercase">Academic Credentials / Qualifications</span>
                                  <p className={`p-3 rounded-lg border text-xs leading-relaxed ${
                                    isDark ? "bg-slate-950/40 border-slate-850" : "bg-slate-50 border-slate-150"
                                  }`}>
                                    {selectedCandidateForModal.academicQualification || "No academic qualification details specified."}
                                  </p>
                                </div>

                                <div>
                                  <span className="text-[9px] text-slate-500 font-mono block uppercase">Work Experience Summary / Cover Message</span>
                                  <p className={`p-3 rounded-lg border text-xs leading-relaxed max-h-36 overflow-y-auto ${
                                    isDark ? "bg-slate-950/40 border-slate-850" : "bg-slate-50 border-slate-150"
                                  }`}>
                                    {selectedCandidateForModal.experience || "No experience summary or cover letter provided."}
                                  </p>
                                </div>
                              </div>

                              {/* Document Downloads */}
                              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-500/10">
                                {selectedCandidateForModal.passportUrl && (
                                  <a 
                                    href={selectedCandidateForModal.passportUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all bg-blue-500 text-white border-transparent hover:bg-blue-600 cursor-pointer shadow-2xs"
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                    <span>Download Passport copy</span>
                                  </a>
                                )}
                                {selectedCandidateForModal.cvUrl && (
                                  <a 
                                    href={selectedCandidateForModal.cvUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all bg-emerald-600 text-white border-transparent hover:bg-emerald-700 cursor-pointer shadow-2xs"
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                    <span>Download CV / Resume</span>
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()
            ) : !editingDemand ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-500/5 p-4 rounded-xl">
                  <div className="flex flex-col gap-0.5">
                    <span className={`text-xs font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                      Managing {localVacancies.length} recorded vacancies
                    </span>
                    <span className={`text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      💡 Tip: Click and drag any vacancy by the handle to reorder the active demands display sequence instantly.
                    </span>
                  </div>
                  <button
                    onClick={() => setEditingDemand({})}
                    className="px-4 py-2 bg-[#e31e24] hover:bg-red-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Deploy New Demand</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {localVacancies.map((vac, index) => {
                    const isDragging = draggedVacancyIndex === index;
                    const matchingApps = applications.filter(app => {
                      if (app.selectedJobTitle === vac.title) return true;
                      if (vac.subJobs && Array.isArray(vac.subJobs)) {
                        return vac.subJobs.some((sub: any) => sub.jobTitle === app.selectedJobTitle);
                      }
                      return false;
                    });
                    return (
                      <div key={vac.id} className="space-y-2">
                        {/* Draggable Header Card */}
                        <div 
                          draggable={true}
                          onDragStart={(e) => handleVacancyDragStart(e, index)}
                          onDragOver={(e) => handleVacancyDragOver(e, index)}
                          onDragEnd={handleVacancyDragEnd}
                          className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all cursor-grab active:cursor-grabbing select-none ${
                            isDragging
                              ? isDark
                                ? "bg-slate-900/60 border-dashed border-red-500/50 scale-[0.98] opacity-50"
                                : "bg-slate-50 border-dashed border-red-500/50 scale-[0.98] opacity-50"
                              : isDark
                                ? "bg-slate-900/20 border-slate-900 hover:bg-slate-905 hover:border-slate-800"
                                : "bg-white border-slate-150 shadow-xs hover:bg-slate-50 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {/* Drag handle */}
                            <div className={`p-1 rounded cursor-grab ${isDark ? "text-slate-600 hover:text-slate-400" : "text-slate-300 hover:text-slate-500"}`}>
                              <GripVertical className="w-4 h-4 shrink-0" />
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${vac.active ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-500/10 text-slate-400"}`}>
                                  {vac.active ? "LIVEVACANCY" : "ARCHIVED"}
                                </span>
                                {vac.demandLetterUrl ? (
                                  <span className="text-[9px] font-mono font-black uppercase text-cyan-500 bg-cyan-500/10 px-1.5 py-0.5 rounded flex items-center gap-1 leading-none shrink-0 border border-cyan-500/15">
                                    <Image className="w-2.5 h-2.5" />
                                    Demand Image
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-mono text-slate-400 bg-slate-500/5 px-1.5 py-0.5 rounded leading-none shrink-0 border border-slate-500/10">
                                    No image
                                  </span>
                                )}
                                <h4 className={`text-xs font-bold leading-none ${isDark ? "text-white" : "text-slate-900"}`}>
                                  {vac.title}
                                </h4>
                              </div>
                              <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                                {vac.companyName} • {vac.location} | Salary: {vac.salary}
                              </p>
                              
                              {/* Received Applications Badge / Open Full Page Link */}
                              <div className="pt-1.5 flex items-center gap-2" onDragStart={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
                                {matchingApps.length > 0 ? (
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setViewingVacancyAppsId(vac.id);
                                    }}
                                    className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-1.5 cursor-pointer bg-cyan-500/10 border-cyan-500/20 text-cyan-500 hover:bg-cyan-500/20`}
                                  >
                                    <Inbox className="w-3.5 h-3.5" />
                                    <span>Received Applications ({matchingApps.length})</span>
                                    <span className="text-[8px] opacity-75">→ View Full Page</span>
                                  </button>
                                ) : (
                                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-mono border ${
                                    isDark ? "bg-slate-800/40 border-slate-800/60 text-slate-500" : "bg-slate-100 border-slate-200 text-slate-500"
                                  }`}>
                                    No applications received
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0" onDragStart={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setEditingDemand(vac)}
                              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                                isDark ? "border-slate-800 text-slate-300 hover:bg-slate-800" : "border-slate-250 text-slate-700 hover:bg-slate-100"
                              }`}
                              title="Edit Vacancy Card"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ type: "demand", id: vac.id, title: vac.title })}
                              className={`p-2 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer`}
                              title="Exterminate Demand"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className={`p-6 rounded-2xl border space-y-6 ${isDark ? "bg-slate-900/40 border-slate-800/80" : "bg-slate-50/50 border-slate-205"}`}>
                <h4 className={`text-sm font-bold uppercase tracking-wider ${isDark ? "text-white" : "text-slate-900"}`}>
                  {editingDemand.id ? "Edit Real-time Vacancy" : "Create New Recruitment Demand"}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-mono tracking-wider ${isDark ? "text-slate-400" : "text-slate-700"}`}>Vacancy Title *</label>
                    <input
                      type="text"
                      value={editingDemand.title || ""}
                      onChange={(e) => setEditingDemand({ ...editingDemand, title: e.target.value })}
                      placeholder="e.g., HVAC Technician / Heavy Equipment Operator"
                      className={`w-full p-2.5 rounded-lg border text-xs outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white placeholder-slate-600 focus:border-cyan-400" : "bg-white border-slate-250 text-slate-900 placeholder-slate-400 focus:border-[#0073aa]"}`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-mono tracking-wider ${isDark ? "text-slate-400" : "text-slate-700"}`}>Employing Corporate Brand *</label>
                    <input
                      type="text"
                      value={editingDemand.companyName || ""}
                      onChange={(e) => setEditingDemand({ ...editingDemand, companyName: e.target.value })}
                      placeholder="e.g., Emrill Services LLC"
                      className={`w-full p-2.5 rounded-lg border text-xs outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-250 text-slate-900"}`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-mono tracking-wider ${isDark ? "text-slate-400" : "text-slate-700"}`}>Destination Country & City</label>
                    <input
                      type="text"
                      value={editingDemand.location || ""}
                      onChange={(e) => setEditingDemand({ ...editingDemand, location: e.target.value })}
                      placeholder="e.g., Dubai, United Arab Emirates (UAE)"
                      className={`w-full p-2.5 rounded-lg border text-xs outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-250 text-slate-900"}`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-mono tracking-wider ${isDark ? "text-slate-400" : "text-slate-700"}`}>Government License Code (LT. No)</label>
                    <input
                      type="text"
                      value={editingDemand.recruitmentQuotaCode || ""}
                      onChange={(e) => setEditingDemand({ ...editingDemand, recruitmentQuotaCode: e.target.value })}
                      placeholder="e.g., LT. No. 317722"
                      className={`w-full p-2.5 rounded-lg border text-xs outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-250 text-slate-900"}`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-mono tracking-wider ${isDark ? "text-slate-400" : "text-slate-700"}`}>Min Age Limit</label>
                    <input
                      type="number"
                      value={editingDemand.ageMin ?? ""}
                      onChange={(e) => setEditingDemand({ ...editingDemand, ageMin: e.target.value !== "" ? Number(e.target.value) : undefined })}
                      placeholder="e.g., 18"
                      className={`w-full p-2.5 rounded-lg border text-xs outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-250 text-slate-900"}`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-mono tracking-wider ${isDark ? "text-slate-400" : "text-slate-700"}`}>Max Age Limit</label>
                    <input
                      type="number"
                      value={editingDemand.ageMax ?? ""}
                      onChange={(e) => setEditingDemand({ ...editingDemand, ageMax: e.target.value !== "" ? Number(e.target.value) : undefined })}
                      placeholder="e.g., 45"
                      className={`w-full p-2.5 rounded-lg border text-xs outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-250 text-slate-900"}`}
                    />
                  </div>
                  {/* Specific Job Positions (Sub-Jobs) placed directly here instead of Positions & Monthly Salary fields */}
                  <div className="md:col-span-2 border-y border-slate-500/10 py-4 my-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className={`text-xs font-mono font-black uppercase tracking-wider ${isDark ? "text-slate-300" : "text-slate-800"}`}>
                        Specific Job Positions (Sub-Jobs) *
                      </h5>
                      <button
                        type="button"
                        onClick={() => {
                          const currentSubJobs = editingDemand.subJobs || [];
                          setEditingDemand({
                            ...editingDemand,
                            subJobs: [
                              ...currentSubJobs,
                              {
                                id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                                jobTitle: "",
                                salary: "",
                                positionsMale: 0,
                                positionsFemale: 0
                              }
                            ]
                          });
                        }}
                        className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-[10px] font-bold transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                      >
                        <span>+ Add Job Title</span>
                      </button>
                    </div>
                    
                    <p className="text-[10px] text-slate-450 italic">
                      * Add multiple specific jobs inside this vacancy demand. Each sub-job must have its own custom job title, salary and required number of positions. Visitors will select from a dropdown list while submitting the form.
                    </p>

                    <div className="space-y-3 pt-2">
                      {(!editingDemand.subJobs || editingDemand.subJobs.length === 0) ? (
                        <div className={`p-4 border border-dashed rounded-xl text-center text-[11px] ${isDark ? "border-slate-800 text-slate-500" : "border-slate-205 text-slate-400"}`}>
                          No specific Job Titles added yet. Add at least one if this vacancy comprises multiple roles.
                        </div>
                      ) : (
                        editingDemand.subJobs.map((sub, idx) => (
                          <div key={sub.id} className={`p-4 rounded-xl border grid grid-cols-1 md:grid-cols-12 gap-3 items-end relative ${isDark ? "bg-slate-950/40 border-slate-800/60" : "bg-slate-100/50 border-slate-205"}`}>
                            <div className="md:col-span-4 space-y-1">
                              <label className={`text-[9px] font-mono tracking-wider ${isDark ? "text-slate-400" : "text-slate-600"}`}>Job Title *</label>
                              <input
                                type="text"
                                required
                                value={sub.jobTitle}
                                onChange={(e) => {
                                  const updated = [...(editingDemand.subJobs || [])];
                                  updated[idx] = { ...updated[idx], jobTitle: e.target.value };
                                  setEditingDemand({ ...editingDemand, subJobs: updated });
                                }}
                                placeholder="e.g. Electrician"
                                className={`w-full p-2 rounded-lg border text-xs outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-205 text-slate-900"}`}
                              />
                            </div>

                            <div className="md:col-span-3 space-y-1">
                              <label className={`text-[9px] font-mono tracking-wider ${isDark ? "text-slate-400" : "text-slate-600"}`}>Salary Rate *</label>
                              <input
                                type="text"
                                required
                                value={sub.salary}
                                onChange={(e) => {
                                  const updated = [...(editingDemand.subJobs || [])];
                                  updated[idx] = { ...updated[idx], salary: e.target.value };
                                  setEditingDemand({ ...editingDemand, subJobs: updated });
                                }}
                                placeholder="e.g. AED 1200 + OT"
                                className={`w-full p-2 rounded-lg border text-xs outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-205 text-slate-900"}`}
                              />
                            </div>

                            <div className="md:col-span-2 space-y-1">
                              <label className={`text-[9px] font-mono tracking-wider ${isDark ? "text-slate-400" : "text-slate-600"}`}>Positions (M)</label>
                              <input
                                type="number"
                                value={sub.positionsMale}
                                onChange={(e) => {
                                  const updated = [...(editingDemand.subJobs || [])];
                                  updated[idx] = { ...updated[idx], positionsMale: Number(e.target.value) };
                                  setEditingDemand({ ...editingDemand, subJobs: updated });
                                }}
                                placeholder="0"
                                className={`w-full p-2 rounded-lg border text-xs outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-205 text-slate-900"}`}
                              />
                            </div>

                            <div className="md:col-span-2 space-y-1">
                              <label className={`text-[9px] font-mono tracking-wider ${isDark ? "text-slate-400" : "text-slate-600"}`}>Positions (F)</label>
                              <input
                                type="number"
                                value={sub.positionsFemale}
                                onChange={(e) => {
                                  const updated = [...(editingDemand.subJobs || [])];
                                  updated[idx] = { ...updated[idx], positionsFemale: Number(e.target.value) };
                                  setEditingDemand({ ...editingDemand, subJobs: updated });
                                }}
                                placeholder="0"
                                className={`w-full p-2 rounded-lg border text-xs outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-205 text-slate-900"}`}
                              />
                            </div>

                            <div className="md:col-span-1 flex justify-center pb-0.5">
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = (editingDemand.subJobs || []).filter((_, sIdx) => sIdx !== idx);
                                  setEditingDemand({ ...editingDemand, subJobs: updated });
                                }}
                                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                                  isDark 
                                    ? "border-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-900" 
                                    : "border-slate-205 text-slate-400 hover:text-red-600 hover:bg-slate-100"
                                }`}
                                title="Remove Job Title"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-mono tracking-wider ${isDark ? "text-slate-400" : "text-slate-700"}`}>Food / Catering Allowance</label>
                    <input
                      type="text"
                      value={editingDemand.foodAllowance || ""}
                      onChange={(e) => setEditingDemand({ ...editingDemand, foodAllowance: e.target.value })}
                      placeholder="e.g., Provided free / AED 250"
                      className={`w-full p-2.5 rounded-lg border text-xs outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-250 text-slate-900"}`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <label className={`text-[10px] font-mono tracking-wider ${isDark ? "text-slate-400" : "text-slate-700"}`}>Contract Duration</label>
                      <input
                        type="text"
                        value={editingDemand.duration || ""}
                        onChange={(e) => setEditingDemand({ ...editingDemand, duration: e.target.value })}
                        placeholder="e.g., 2 Years"
                        className={`w-full p-2.5 rounded-lg border text-xs outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white font-bold" : "bg-white border-slate-250 text-slate-900 font-bold"}`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-[10px] font-mono tracking-wider ${isDark ? "text-slate-400" : "text-slate-700"}`}>Working Days / Week</label>
                      <input
                        type="number"
                        value={editingDemand.workingDays ?? ""}
                        onChange={(e) => setEditingDemand({ ...editingDemand, workingDays: Number(e.target.value) })}
                        placeholder="e.g., 6"
                        className={`w-full p-2.5 rounded-lg border text-xs outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white font-bold" : "bg-white border-slate-250 text-slate-900 font-bold"}`}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-mono tracking-wider ${isDark ? "text-slate-400" : "text-slate-700"}`}>Working Hours / Day</label>
                    <input
                      type="text"
                      value={editingDemand.workingHours || ""}
                      onChange={(e) => setEditingDemand({ ...editingDemand, workingHours: e.target.value })}
                      placeholder="e.g., 8 Hours / Day"
                      className={`w-full p-2.5 rounded-lg border text-xs outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-250 text-slate-900"}`}
                    />
                  </div>

                  {/* Demand Letter Attachment Section (Must be image file) */}
                  <div className="space-y-1.5 md:col-span-2 border-t border-dashed border-slate-500/10 pt-4">
                    <label className={`text-[10px] font-mono tracking-wider ${isDark ? "text-slate-400" : "text-slate-700"} block mb-1`}>
                      Demand Letter Attachment (Must be an image file)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-8">
                        <div 
                          className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                            isDark 
                              ? "border-slate-800 hover:border-cyan-500 bg-slate-950/40" 
                              : "border-slate-250 hover:border-[#0073aa] bg-slate-50"
                          }`}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files?.[0];
                            if (file) {
                              if (!file.type.startsWith("image/")) {
                                notifyError("Only image files are permitted as demand letter attachments.");
                                return;
                              }
                              handleImageUpload(file, "demand", (p) => setEditingDemand({ ...editingDemand, demandLetterUrl: p }));
                            }
                          }}
                          onClick={() => document.getElementById("demand-letter-input")?.click()}
                        >
                          <input
                            type="file"
                            id="demand-letter-input"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (!file.type.startsWith("image/")) {
                                  notifyError("Only image files are permitted as demand letter attachments.");
                                  return;
                                }
                                handleImageUpload(file, "demand", (p) => setEditingDemand({ ...editingDemand, demandLetterUrl: p }));
                              }
                            }}
                          />
                          <div className="flex flex-col items-center justify-center space-y-1.5">
                            <Upload className="w-6 h-6 text-cyan-500 animate-pulse" />
                            <span className={`text-[11px] font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                              Drag & Drop Demand Letter image or <span className="text-cyan-500 underline">Browse</span>
                            </span>
                            <span className="text-[9px] text-slate-400">
                              PNG, JPG, JPEG, WEBP etc. (Must be image format)
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="md:col-span-4 flex flex-col items-center justify-center">
                        {editingDemand.demandLetterUrl ? (
                          <div className="relative group rounded-xl overflow-hidden border border-slate-500/10">
                            <img 
                              referrerPolicy="no-referrer"
                              src={editingDemand.demandLetterUrl} 
                              alt="Demand Letter preview" 
                              className="w-full max-h-24 object-contain rounded-xl"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingDemand({ ...editingDemand, demandLetterUrl: "" });
                                }}
                                className="p-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
                                title="Remove Attachment"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className={`w-full py-6 rounded-xl border border-dashed flex flex-col items-center justify-center text-center ${
                            isDark ? "bg-slate-900/10 border-slate-800" : "bg-slate-50/20 border-slate-205"
                          }`}>
                            <Image className="w-5 h-5 text-slate-400 mb-1" />
                            <span className="text-[10px] text-slate-400 italic">No image attached</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Required Documents list (Comma separated) */}
                  <div className="space-y-1.5 md:col-span-2 pt-2">
                    <label className={`text-[10px] font-mono tracking-wider ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                      Required Documents (Comma Separated)
                    </label>
                    <input
                      type="text"
                      value={requiredDocsInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        setRequiredDocsInput(val);
                        const parsed = val.split(",").map(s => s.trim()).filter(Boolean);
                        setEditingDemand({ ...editingDemand, requiredDocuments: parsed });
                      }}
                      placeholder="e.g., Passport, Bio Profile, Academic Certificate, Experience Letter"
                      className={`w-full p-2.5 rounded-lg border text-xs outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-250 text-slate-900"}`}
                    />
                    <p className="text-[9px] text-slate-450 italic">* Separate multiple documents with commas. These will be required during candidate sign-up.</p>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="space-y-1.5 md:col-span-2 pt-2">
                    <label className={`text-[10px] font-mono tracking-wider ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                      Terms & Conditions / Contractual Clauses
                    </label>
                    <textarea
                      rows={3}
                      value={editingDemand.termsAndConditions || ""}
                      onChange={(e) => setEditingDemand({ ...editingDemand, termsAndConditions: e.target.value })}
                      placeholder="e.g., Age limit: 21-40, Food allowance is provided separately, Contract duration is 2 years renewable, Standard health insurance..."
                      className={`w-full p-2.5 rounded-lg border text-xs outline-none resize-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-250 text-slate-900"}`}
                    />
                    <p className="text-[9px] text-slate-450 italic">* List any specific terms, rules, age limitations, or standard legal conditions for this placement.</p>
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="vac-active-chk"
                      checked={editingDemand.active !== false}
                      onChange={(e) => setEditingDemand({ ...editingDemand, active: e.target.checked })}
                      className="w-4.5 h-4.5 accent-cyan-400 rounded cursor-pointer"
                    />
                    <label htmlFor="vac-active-chk" className={`text-xs font-bold leading-none cursor-pointer ${isDark ? "text-slate-300" : "text-slate-800"}`}>
                      Actively Recruit (Mark vacancy as green on CMS pages)
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t pt-4 border-slate-500/10">
                  <button
                    onClick={() => setEditingDemand(null)}
                    disabled={isSaving}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${isDark ? "border-slate-800 text-slate-400 hover:bg-slate-900" : "border-slate-250 text-slate-600 hover:bg-slate-100"}`}
                  >
                    Discard
                  </button>
                  <button
                    onClick={saveDemand}
                    disabled={isSaving}
                    className={`px-5 py-2.5 bg-[#e31e24] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md`}
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? "Saving Vacancy Logs..." : "Commit Demand"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================= */}
        {/* TAB 2: GENERAL NOTICES & REGULATIONS */}
        {/* ======================================= */}
        {activeTab === "notices" && (
          <div className="space-y-6">
            {!editingNotice ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-500/5 p-4 rounded-xl">
                  <span className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Managing {(cmsData.notices || []).length} dynamic legal warnings & notices
                  </span>
                  <button
                    onClick={() => setEditingNotice({})}
                    className="px-4 py-2 bg-[#e31e24] hover:bg-red-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publish Official Notice</span>
                  </button>
                </div>

                {/* Search & Date Filter Panel */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-8 relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search notices by headline, description, tag..."
                      value={noticeSearch}
                      onChange={(e) => {
                        setNoticeSearch(e.target.value);
                        setNoticePage(1);
                      }}
                      className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-xs outline-none focus:ring-1 focus:ring-[#e31e24] ${
                        isDark 
                          ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-[#e31e24]" 
                          : "bg-white border-slate-205 text-slate-900 placeholder-slate-400 focus:border-[#e31e24]"
                      }`}
                    />
                    {noticeSearch && (
                      <button
                        onClick={() => {
                          setNoticeSearch("");
                          setNoticePage(1);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-500/10 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="sm:col-span-4 relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="date"
                      value={noticeDateFilter}
                      onChange={(e) => {
                        setNoticeDateFilter(e.target.value);
                        setNoticePage(1);
                      }}
                      className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-xs outline-none focus:ring-1 focus:ring-[#e31e24] ${
                        isDark 
                          ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-[#e31e24] [color-scheme:dark]" 
                          : "bg-white border-slate-205 text-slate-900 placeholder-slate-400 focus:border-[#e31e24]"
                      }`}
                    />
                    {noticeDateFilter && (
                      <button
                        onClick={() => {
                          setNoticeDateFilter("");
                          setNoticePage(1);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-500/10 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {filteredNotices.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {paginatedNotices.map((notice) => (
                      <div 
                        key={notice.id} 
                        className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                          isDark ? "bg-slate-900/20 border-slate-900 hover:bg-slate-905" : "bg-white border-slate-150 shadow-xs hover:bg-slate-50"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 uppercase tracking-wider">
                              {notice.tag}
                            </span>
                            {notice.date && (
                              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isDark ? "bg-slate-850 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
                                {notice.date}
                              </span>
                            )}
                            <h4 className={`text-xs font-bold leading-none ${isDark ? "text-white" : "text-slate-900"}`}>
                              {notice.title}
                            </h4>
                          </div>
                          <p className={`text-[11px] line-clamp-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                            {notice.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => setEditingNotice(notice)}
                            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                              isDark ? "border-slate-800 text-slate-300 hover:bg-slate-800" : "border-slate-250 text-slate-700 hover:bg-slate-100"
                            }`}
                            title="Edit notice detail mapping"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: "notice", id: notice.id, title: notice.title })}
                            className="p-2 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Exterminate Notice"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`p-12 text-center rounded-2xl border ${
                    isDark ? "bg-slate-900/10 border-slate-900" : "bg-slate-50 border-slate-150"
                  }`}>
                    <Info className="w-8 h-8 text-[#e31e24] mx-auto opacity-70 mb-3" />
                    <h5 className={`text-xs font-mono font-extrabold uppercase tracking-wide mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      No matching notices found
                    </h5>
                    <p className={`text-[11px] ${isDark ? "text-slate-500" : "text-slate-600"}`}>
                      Try refining your search query or date filter selection, or clear them to view all notices.
                    </p>
                    <button
                      onClick={() => {
                        setNoticeSearch("");
                        setNoticeDateFilter("");
                        setNoticePage(1);
                      }}
                      className="mt-4 px-4 py-2 bg-[#e31e24] hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}

                {/* Pagination Controls Footer */}
                {filteredNotices.length > 0 && (
                  <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border mt-4 ${
                    isDark ? "bg-slate-950/40 border-slate-900/60" : "bg-slate-50/50 border-slate-150"
                  }`}>
                    <span className={`text-[11px] font-mono ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      Showing <span className="font-extrabold">{startNoticeIndex + 1}</span> to{" "}
                      <span className="font-extrabold">
                        {Math.min(startNoticeIndex + noticesPerPage, filteredNotices.length)}
                      </span>{" "}
                      of <span className="font-extrabold">{filteredNotices.length}</span> notices
                      {(noticeSearch || noticeDateFilter) && " (filtered)"}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        disabled={currentNoticePage === 1}
                        onClick={() => setNoticePage(prev => Math.max(prev - 1, 1))}
                        className={`px-3 py-2 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          currentNoticePage === 1
                            ? "opacity-40 cursor-not-allowed border-slate-200/10 text-slate-400"
                            : isDark
                              ? "border-slate-800 text-slate-200 hover:bg-slate-900 hover:border-slate-700"
                              : "border-slate-205 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Previous</span>
                      </button>

                      <div className={`text-xs font-mono px-3 py-1.5 rounded-lg border font-extrabold ${
                        isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-205 text-slate-900"
                      }`}>
                        Page {currentNoticePage} of {totalNoticePages}
                      </div>

                      <button
                        disabled={currentNoticePage === totalNoticePages}
                        onClick={() => setNoticePage(prev => Math.min(prev + 1, totalNoticePages))}
                        className={`px-3 py-2 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          currentNoticePage === totalNoticePages
                            ? "opacity-40 cursor-not-allowed border-slate-200/10 text-slate-400"
                            : isDark
                              ? "border-slate-800 text-slate-200 hover:bg-slate-900 hover:border-slate-700"
                              : "border-slate-205 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span>Next</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className={`p-6 rounded-2xl border space-y-6 ${isDark ? "bg-slate-900/40 border-slate-800/80" : "bg-slate-50/50 border-slate-205"}`}>
                <h4 className={`text-sm font-bold uppercase tracking-wider ${isDark ? "text-white" : "text-slate-900"}`}>
                  {editingNotice.id ? "Edit Legal/Governance Notice" : "Write Official Regulatory Warning"}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className={`text-[10px] font-mono tracking-wider ${isDark ? "text-slate-400" : "text-slate-700"}`}>Notice Headline *</label>
                    <input
                      type="text"
                      value={editingNotice.title || ""}
                      onChange={(e) => setEditingNotice({ ...editingNotice, title: e.target.value })}
                      placeholder="e.g. Mandatory Orientation or Strict Biometric updates"
                      className={`w-full p-2.5 rounded-lg border text-xs outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-205 text-slate-900"}`}
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className={`text-[10px] font-mono tracking-wider ${isDark ? "text-slate-400" : "text-slate-700"}`}>Detailed description of compliant guidelines *</label>
                    <textarea
                      rows={4}
                      value={editingNotice.description || ""}
                      onChange={(e) => setEditingNotice({ ...editingNotice, description: e.target.value })}
                      placeholder="Provide thorough detail for candidates and employers..."
                      className={`w-full p-2.5 rounded-lg border text-xs outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-205 text-slate-900"}`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-mono tracking-wider ${isDark ? "text-slate-400" : "text-slate-700"}`}>Regulatory Category / Tag</label>
                    <select
                      value={editingNotice.tag || "Compliance"}
                      onChange={(e) => setEditingNotice({ ...editingNotice, tag: e.target.value })}
                      className={`w-full p-2.5 rounded-lg border text-xs outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-205 text-slate-900"}`}
                    >
                      {["Security", "Health", "Legal", "Compliance", "Verification", "Audit", "Logistics", "Standards", "Excellence"].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-mono tracking-wider ${isDark ? "text-slate-400" : "text-slate-705"}`}>Date of publish state</label>
                    <input
                      type="date"
                      value={editingNotice.date || new Date().toISOString().split("T")[0]}
                      onChange={(e) => setEditingNotice({ ...editingNotice, date: e.target.value })}
                      className={`w-full p-2.5 rounded-lg border text-xs outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-205 text-slate-900"}`}
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className={`text-[10px] font-mono tracking-wider ${isDark ? "text-slate-400" : "text-slate-700"}`}>Optional Notice Banner / Attachment Image</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(file, "notice", (p) => setEditingNotice({ ...editingNotice, imageUrl: p }));
                          }
                        }}
                        className="hidden"
                        id="notice-banner-input"
                      />
                      <label
                        htmlFor="notice-banner-input"
                        className={`px-4 py-2.5 border rounded-lg hover:bg-slate-500/5 cursor-pointer text-xs font-bold flex items-center gap-1.5 transition-colors ${
                          isDark ? "border-slate-800 text-slate-300" : "border-slate-250 text-slate-700"
                        }`}
                      >
                        <Upload className="w-4 h-4 text-emerald-500" />
                        <span>Upload Banner Image</span>
                      </label>
                      {editingNotice.imageUrl && (
                        <div className="flex items-center gap-2">
                          <img src={editingNotice.imageUrl} alt="Notice Preview" className="w-10 h-10 object-cover rounded-lg border border-slate-500/20" />
                          <button
                            type="button"
                            onClick={() => setEditingNotice({ ...editingNotice, imageUrl: "" })}
                            className="px-2 py-1 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded text-[10px] font-bold cursor-pointer transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t pt-4 border-slate-500/10">
                  <button
                    onClick={() => setEditingNotice(null)}
                    disabled={isSaving}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${isDark ? "border-slate-800 text-slate-400 hover:bg-slate-900" : "border-slate-250 text-slate-600 hover:bg-slate-100"}`}
                  >
                    Discard
                  </button>
                  <button
                    onClick={saveNotice}
                    disabled={isSaving}
                    className={`px-5 py-2.5 bg-[#e31e24] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md`}
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? "Publishing on disk..." : "Commit Notice"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================= */}
        {/* TAB 3: INTERNATIONAL PARTNERS (CLIENTS) */}
        {/* ======================================= */}
        {activeTab === "partners" && (
          <div className="space-y-6">
            {!editingPartner ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-500/5 p-4 rounded-xl">
                  <div className="flex flex-col gap-0.5">
                    <span className={`text-xs font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                      Managing {localClients.length} registered international affiliates
                    </span>
                    <span className={`text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      💡 Tip: Click and drag any card by the handle to reorder the brand display sequence instantly.
                    </span>
                  </div>
                  <button
                    onClick={() => setEditingPartner({})}
                    className="px-4 py-2 bg-[#e31e24] hover:bg-red-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Register Brand Partner</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {localClients.map((cli, index) => {
                    const isDragging = draggedPartnerIndex === index;
                    return (
                      <div 
                        key={cli.id} 
                        draggable={true}
                        onDragStart={(e) => handlePartnerDragStart(e, index)}
                        onDragOver={(e) => handlePartnerDragOver(e, index)}
                        onDragEnd={handlePartnerDragEnd}
                        className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all cursor-grab active:cursor-grabbing select-none ${
                          isDragging
                            ? isDark
                              ? "bg-slate-900/60 border-dashed border-red-500/50 scale-[0.98] opacity-50"
                              : "bg-slate-50 border-dashed border-red-500/50 scale-[0.98] opacity-50"
                            : isDark
                              ? "bg-slate-900/20 border-slate-905 hover:bg-slate-900/40 hover:border-slate-800"
                              : "bg-white border-slate-150 shadow-xs hover:bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Drag handle */}
                          <div className={`p-1 rounded cursor-grab ${isDark ? "text-slate-600 hover:text-slate-400" : "text-slate-300 hover:text-slate-500"}`}>
                            <GripVertical className="w-4 h-4 shrink-0" />
                          </div>

                          {cli.logoUrl ? (
                            <img src={cli.logoUrl} alt={cli.name} className="w-10 h-10 rounded-lg object-contain bg-white border p-1 shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold text-sm shrink-0">
                              {cli.name[0]}
                            </div>
                          )}
                          <div>
                            <h4 className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{cli.name}</h4>
                            <p className={`text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>{cli.industry}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => setEditingPartner(cli)}
                            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                              isDark ? "border-slate-800 text-slate-300 hover:bg-slate-800" : "border-slate-250 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: "partner", id: cli.id, title: cli.name })}
                            className="p-2 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className={`p-6 rounded-2xl border space-y-6 ${isDark ? "bg-slate-900/40 border-slate-800/80" : "bg-slate-50/50 border-slate-205"}`}>
                <h4 className={`text-sm font-bold uppercase tracking-wider ${isDark ? "text-white" : "text-slate-900"}`}>
                  {editingPartner.id ? "Edit Registered Partner" : "Register Prestigious International Affiliate"}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-mono tracking-wider ${isDark ? "text-slate-400" : "text-slate-700"}`}>Partner Brand Name *</label>
                    <input
                      type="text"
                      value={editingPartner.name || ""}
                      onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })}
                      placeholder="e.g. Al Mukhtar Cleaning Services"
                      className={`w-full p-2.5 rounded-lg border text-xs outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-205 text-slate-900"}`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-mono tracking-wider ${isDark ? "text-slate-400" : "text-slate-700"}`}>Sourcing Sector / Industry *</label>
                    <input
                      type="text"
                      value={editingPartner.industry || ""}
                      onChange={(e) => setEditingPartner({ ...editingPartner, industry: e.target.value })}
                      placeholder="e.g. Facilities Management or Engineering"
                      className={`w-full p-2.5 rounded-lg border text-xs outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-205 text-slate-900"}`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-mono tracking-wider ${isDark ? "text-slate-400" : "text-slate-700"}`}>Affiliate Website URL (Optional)</label>
                    <input
                      type="text"
                      value={editingPartner.website || ""}
                      onChange={(e) => setEditingPartner({ ...editingPartner, website: e.target.value })}
                      placeholder="e.g., https://almukhtargroup.com"
                      className={`w-full p-2.5 rounded-lg border text-xs outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-205 text-slate-900"}`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-mono tracking-wider ${isDark ? "text-slate-405" : "text-slate-700"}`}>Logo Upload (Replaces Previous)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(file, "partner", (p) => setEditingPartner({ ...editingPartner, logoUrl: p }));
                          }
                        }}
                        className="hidden"
                        id="part-logo-input"
                      />
                      <label
                        htmlFor="part-logo-input"
                        className="px-4 py-2.5 border rounded-lg hover:bg-slate-500/5 cursor-pointer text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Upload className="w-4 h-4 text-emerald-500" />
                        <span>Upload Logo</span>
                      </label>
                      {editingPartner.logoUrl && (
                        <span className="text-[10px] text-emerald-500 font-mono italic">Logo attached!</span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className={`text-[10px] font-mono tracking-wider ${isDark ? "text-slate-400" : "text-slate-750"}`}>Short description (displayed directly on hovering partner card)*</label>
                    <textarea
                      rows={2}
                      value={editingPartner.description || ""}
                      onChange={(e) => setEditingPartner({ ...editingPartner, description: e.target.value })}
                      placeholder="e.g., Elite provider of facilities compliance across Dubai Airport terminals and hospitality nodes."
                      className={`w-full p-2.5 rounded-lg border text-xs outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-205 text-slate-900"}`}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t pt-4 border-slate-500/10">
                  <button
                    onClick={() => setEditingPartner(null)}
                    disabled={isSaving}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${isDark ? "border-slate-800 text-slate-400 hover:bg-slate-900" : "border-slate-250 text-slate-600 hover:bg-slate-100"}`}
                  >
                    Discard
                  </button>
                  <button
                    onClick={savePartner}
                    disabled={isSaving}
                    className={`px-5 py-2.5 bg-[#e31e24] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md`}
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? "Saving details..." : "Register Partner"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================= */}
        {/* TAB 4: OUR TEAM LOGISTICS & PROFILES */}
        {/* ======================================= */}
        {activeTab === "team" && (
          <div className="space-y-6">
            {!editingMember ? (
              <div className="space-y-4">
                {/* CORPORATE TEAM GROUP PHOTO */}
                <div className={`p-5 rounded-2xl border ${isDark ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-200/90 shadow-xs"} space-y-4`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className={`text-sm font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                        Corporate Team Group Photo
                      </h4>
                      <p className={`text-[11px] leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        Provide a custom image/photo of your full corporate team. This photo appears at the absolute top of the public "Our Team" page on full screen.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => {
                          try {
                            await onSaveCMS({ ...cmsData, teamPhotoUrl: groupPhotoUrl });
                            notifySuccess("Team group photo path saved successfully!");
                          } catch (err: any) {
                            notifyError(`Failed to save team photo: ${err.message}`);
                          }
                        }}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Photo Path</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Preview (4 cols) */}
                    <div className="md:col-span-4 flex flex-col items-center justify-center">
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-300/40 bg-slate-500/5 group">
                        {groupPhotoUrl ? (
                          <>
                            <img 
                              src={groupPhotoUrl} 
                              alt="Team group photo preview" 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <span className="text-[10px] text-white font-mono bg-black/60 px-2 py-1 rounded">
                                Current Preview
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center p-4 h-full">
                            <Users className="w-8 h-8 text-slate-400 mb-1" />
                            <span className="text-[10px] text-slate-500 font-medium font-sans">No team photo uploaded yet</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Inputs & Uploader (8 cols) */}
                    <div className="md:col-span-8 space-y-3">
                      <div className="space-y-1.5">
                        <label className={`text-[10px] font-mono tracking-wider uppercase ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                          Custom Image URL or File Path
                        </label>
                        <input
                          type="text"
                          value={groupPhotoUrl}
                          onChange={(e) => setGroupPhotoUrl(e.target.value)}
                          placeholder="e.g. /src/assets/ourteam/full_team.jpg or https://images.unsplash.com/..."
                          className={`w-full p-2.5 rounded-xl border text-xs outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-205 text-slate-900"}`}
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <label className={`inline-flex items-center justify-center gap-2 w-full p-2.5 rounded-xl border-2 border-dashed text-xs cursor-pointer transition-colors ${
                            isDark 
                              ? "border-slate-800 hover:border-red-500/40 bg-slate-900/40 text-slate-300 hover:bg-slate-900/60" 
                              : "border-slate-205 hover:border-[#e31e24]/40 bg-slate-50/50 text-slate-650 hover:bg-slate-100/50"
                          }`}>
                            <Upload className="w-4 h-4 text-[#e31e24]" />
                            <span>Upload Group Team Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleImageUpload(file, "ourteam", async (path) => {
                                    setGroupPhotoUrl(path);
                                    try {
                                      await onSaveCMS({ ...cmsData, teamPhotoUrl: path });
                                    } catch (err: any) {
                                      notifyError(`Failed to save team photo: ${err.message}`);
                                    }
                                  });
                                }
                              }}
                            />
                          </label>
                        </div>
                        {groupPhotoUrl && (
                          <button
                            onClick={async () => {
                              setGroupPhotoUrl("");
                              try {
                                await onSaveCMS({ ...cmsData, teamPhotoUrl: "" });
                                notifySuccess("Group photo reference cleared.");
                              } catch (err: any) {
                                notifyError(`Failed to clear team photo: ${err.message}`);
                              }
                            }}
                            className="px-3 py-2.5 rounded-xl border border-red-500/25 text-red-500 hover:bg-red-500/10 text-xs font-semibold cursor-pointer shrink-0 transition-colors"
                            title="Clear Photo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* CHAIRMAN PROFILE & MESSAGE EDIT OPTION */}
                <div className={`p-5 rounded-2xl border ${isDark ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-200/90 shadow-xs"} space-y-4`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className={`text-sm font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                        Chairman Profile & Message details
                      </h4>
                      <p className={`text-[11px] leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        Modify the main Chairman's Name, Title, Contact details, Portrait photo, and official statement displayed on the Chairman's Message page.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => {
                          try {
                            const updatedChairman = {
                              ...cmsData.chairmanMessage,
                              name: chairmanName,
                              title: chairmanTitle,
                              mobile: chairmanMobile,
                              avatarUrl: chairmanAvatarUrl,
                              salutation: chairmanSalutation,
                              paragraphs: chairmanParagraphs.split("\n").map(p => p.trim()).filter(p => p.length > 0)
                            };
                            await onSaveCMS({
                              ...cmsData,
                              chairmanMessage: updatedChairman
                            });
                            notifySuccess("Chairman details and address updated successfully!");
                          } catch (err: any) {
                            notifyError(`Failed to save chairman details: ${err.message}`);
                          }
                        }}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Chairman Details</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    {/* Portrait Photo preview & upload */}
                    <div className="md:col-span-4 flex flex-col items-center justify-start space-y-3">
                      <div className="w-full text-left">
                        <label className={`text-[10px] font-mono tracking-wider uppercase ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                          Portrait Photo
                        </label>
                      </div>
                      <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden border border-slate-300/40 bg-slate-500/5 group flex items-center justify-center">
                        {chairmanAvatarUrl ? (
                          <>
                            <img 
                              src={chairmanAvatarUrl} 
                              alt="Chairman portrait preview" 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <span className="text-[10px] text-white font-mono bg-black/60 px-2 py-1 rounded">
                                Portrait Preview
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center p-4">
                            <Users className="w-8 h-8 text-slate-400 mb-1" />
                            <span className="text-[10px] text-slate-500 font-medium">No portrait uploaded</span>
                          </div>
                        )}
                      </div>

                      <div className="w-full space-y-2">
                        <input
                          type="text"
                          value={chairmanAvatarUrl}
                          onChange={(e) => setChairmanAvatarUrl(e.target.value)}
                          placeholder="Image URL or local file path"
                          className={`w-full p-2 rounded-lg border text-xs outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-205 text-slate-900"}`}
                        />
                        <label className={`inline-flex items-center justify-center gap-2 w-full p-2 rounded-xl border-2 border-dashed text-xs cursor-pointer transition-colors ${
                          isDark 
                            ? "border-slate-800 hover:border-[#e31e24]/40 bg-slate-900/40 text-slate-300 hover:bg-slate-900/60" 
                            : "border-slate-205 hover:border-[#e31e24]/40 bg-slate-50/50 text-slate-650 hover:bg-slate-100/50"
                        }`}>
                          <Upload className="w-3.5 h-3.5 text-[#e31e24]" />
                          <span>Upload Portrait</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUpload(file, "chairman", (path) => {
                                  setChairmanAvatarUrl(path);
                                });
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Form Fields & Paragraphs */}
                    <div className="md:col-span-8 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className={`text-[10px] font-mono tracking-wider uppercase ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                            Chairman Full Name
                          </label>
                          <input
                            type="text"
                            value={chairmanName}
                            onChange={(e) => setChairmanName(e.target.value)}
                            placeholder="e.g. Meelan Kattel"
                            className={`w-full p-2.5 rounded-xl border text-xs outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-205 text-slate-900"}`}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className={`text-[10px] font-mono tracking-wider uppercase ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                            Official Role / Title
                          </label>
                          <input
                            type="text"
                            value={chairmanTitle}
                            onChange={(e) => setChairmanTitle(e.target.value)}
                            placeholder="e.g. Founder & Chairman"
                            className={`w-full p-2.5 rounded-xl border text-xs outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-205 text-slate-900"}`}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className={`text-[10px] font-mono tracking-wider uppercase ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                            Mobile Contact Details
                          </label>
                          <input
                            type="text"
                            value={chairmanMobile}
                            onChange={(e) => setChairmanMobile(e.target.value)}
                            placeholder="e.g. +977-9851021756"
                            className={`w-full p-2.5 rounded-xl border text-xs outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-205 text-slate-900"}`}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className={`text-[10px] font-mono tracking-wider uppercase ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                            Message Salutation
                          </label>
                          <input
                            type="text"
                            value={chairmanSalutation}
                            onChange={(e) => setChairmanSalutation(e.target.value)}
                            placeholder="e.g. Namaste & Warm Greetings from Nepal,"
                            className={`w-full p-2.5 rounded-xl border text-xs outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-205 text-slate-900"}`}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className={`text-[10px] font-mono tracking-wider uppercase ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                            Official Address / Message Paragraphs
                          </label>
                          <span className="text-[9px] text-slate-500 italic">Separate paragraphs with empty line</span>
                        </div>
                        <textarea
                          rows={6}
                          value={chairmanParagraphs}
                          onChange={(e) => setChairmanParagraphs(e.target.value)}
                          placeholder="Type or paste the paragraphs of the official address here..."
                          className={`w-full p-3 rounded-xl border text-xs outline-none font-sans leading-relaxed ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-205 text-slate-900"}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-slate-500/5 p-4 rounded-xl">
                  <div className="flex flex-col gap-0.5">
                    <span className={`text-xs font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                      Managing {localTeamMembers.length} executive staff profiles
                    </span>
                    <span className={`text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      💡 Tip: Click and drag any member card by the handle to reorder the staff display sequence instantly.
                    </span>
                  </div>
                  <button
                    onClick={() => setEditingMember({})}
                    className="px-4 py-2 bg-[#e31e24] hover:bg-red-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Member Details</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {localTeamMembers.map((member, index) => {
                    const isDragging = draggedMemberIndex === index;
                    return (
                      <div 
                        key={member.id} 
                        draggable={true}
                        onDragStart={(e) => handleMemberDragStart(e, index)}
                        onDragOver={(e) => handleMemberDragOver(e, index)}
                        onDragEnd={handleMemberDragEnd}
                        className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all cursor-grab active:cursor-grabbing select-none ${
                          isDragging
                            ? isDark
                              ? "bg-slate-900/60 border-dashed border-red-500/50 scale-[0.98] opacity-50"
                              : "bg-slate-50 border-dashed border-red-500/50 scale-[0.98] opacity-50"
                            : isDark
                              ? "bg-slate-900/20 border-slate-905 hover:bg-slate-950 hover:border-slate-800"
                              : "bg-white border-slate-150 shadow-xs hover:bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Drag handle */}
                          <div className={`p-1 rounded cursor-grab ${isDark ? "text-slate-600 hover:text-slate-400" : "text-slate-300 hover:text-slate-500"}`}>
                            <GripVertical className="w-4 h-4 shrink-0" />
                          </div>

                          {member.photoUrl ? (
                            <img src={member.photoUrl} alt={member.name} className="w-10 h-10 rounded-full object-cover border shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-extrabold text-xs shrink-0">
                              {member.name.split(" ").map(n=>n[0]).join("")}
                            </div>
                          )}
                          <div>
                            <h4 className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{member.name}</h4>
                            <span className="text-[10px] font-mono text-cyan-500 uppercase">{member.role}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => setEditingMember(member)}
                            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                              isDark ? "border-slate-800 text-slate-300 hover:bg-slate-850" : "border-slate-250 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: "member", id: member.id, title: member.name })}
                            className="p-2 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className={`p-6 rounded-2xl border space-y-6 ${isDark ? "bg-slate-900/40 border-slate-800/80" : "bg-slate-50/50 border-slate-205"}`}>
                <h4 className={`text-sm font-bold uppercase tracking-wider ${isDark ? "text-white" : "text-slate-900"}`}>
                  {editingMember.id ? "Edit Team Executive Details" : "Induct New Executive Council Member"}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-mono tracking-wider ${isDark ? "text-slate-400" : "text-slate-700"}`}>Full Name *</label>
                    <input
                      type="text"
                      value={editingMember.name || ""}
                      onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                      placeholder="e.g. Meelan Kattel"
                      className={`w-full p-2.5 rounded-lg border text-xs outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-205 text-slate-900"}`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-mono tracking-wider ${isDark ? "text-slate-400" : "text-slate-700"}`}>Designated Role *</label>
                    <input
                      type="text"
                      value={editingMember.role || ""}
                      onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                      placeholder="e.g. Managing Director or Operations Manager"
                      className={`w-full p-2.5 rounded-lg border text-xs outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-205 text-slate-900"}`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-mono tracking-wider ${isDark ? "text-slate-400" : "text-slate-700"}`}>Attach Member Photo</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(file, "team", (p) => setEditingMember({ ...editingMember, photoUrl: p }));
                          }
                        }}
                        className="hidden"
                        id="member-photo-input"
                      />
                      <label
                        htmlFor="member-photo-input"
                        className="px-4 py-2.5 border rounded-lg hover:bg-slate-500/5 cursor-pointer text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Upload className="w-4 h-4 text-emerald-500" />
                        <span>Upload Photograph</span>
                      </label>
                      {editingMember.photoUrl && (
                        <span className="text-[10px] text-emerald-500 font-mono italic">Photo registered!</span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className={`text-[10px] font-mono tracking-wider ${isDark ? "text-slate-400" : "text-slate-705"}`}>Short description of executive background *</label>
                    <textarea
                      rows={3}
                      value={editingMember.shortDescription || ""}
                      onChange={(e) => setEditingMember({ ...editingMember, shortDescription: e.target.value })}
                      placeholder="Strategic head driving operations with 20+ years of human resource credentials..."
                      className={`w-full p-2.5 rounded-lg border text-xs outline-none ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-205 text-slate-900"}`}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t pt-4 border-slate-500/10">
                  <button
                    onClick={() => setEditingMember(null)}
                    disabled={isSaving}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${isDark ? "border-slate-800 text-slate-300 hover:bg-slate-905" : "border-slate-250 text-slate-600 hover:bg-slate-100"}`}
                  >
                    Discard
                  </button>
                  <button
                    onClick={saveMember}
                    disabled={isSaving}
                    className={`px-5 py-2.5 bg-[#e31e24] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md`}
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? "Enlisting..." : "Induct Member"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================= */}
        {/* TAB 5: COMPANY PROFILE PDF MANAGEMENT */}
        {/* ======================================= */}
        {activeTab === "pdf" && (
          <div className="space-y-6 text-center max-w-lg mx-auto py-8">
            <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center ${
              isDark ? "bg-red-500/10 text-[#e31e24]" : "bg-red-50 text-[#e31e24]"
            }`}>
              <FileText className="w-6 h-6" />
            </div>
            
            <div className="space-y-2">
              <h3 className={`text-base font-extrabold ${isDark ? "text-white" : "text-slate-950"}`}>
                Upload Corporate Profile PDF
              </h3>
              <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-655"}`}>
                Replacing this document will instantly delete the previous and overwrite <strong>"Asia Link Services Company Profile.pdf"</strong> on the workspace filesystem.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border ${
              isDark ? "bg-slate-900/10 border-slate-900" : "bg-slate-50 border-slate-205"
            } space-y-4`}>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handlePdfUpload(file);
                  }
                }}
                className="hidden"
                id="profile-pdf-uploader"
                disabled={pdfUploading}
              />
              <label
                htmlFor="profile-pdf-uploader"
                className={`px-8 py-3 bg-[#e31e24] hover:bg-red-600 text-white font-extrabold text-xs rounded-xl inline-flex items-center gap-2 cursor-pointer transition-colors shadow-md ${
                  pdfUploading ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>{pdfUploading ? "Deleting Old & Syncing New PDF..." : "Select & Replace PDF Document"}</span>
              </label>

              <div className="text-[10px] font-mono text-slate-405">
                Target Action: /public/Asia Link Services Company Profile.pdf
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* TAB 6: ROOT CONTROL SETTINGS */}
        {/* ======================================= */}
        {activeTab === "root-settings" && (
          <div className="space-y-6 max-w-2xl mx-auto py-2">
            <div className={`p-5 rounded-2xl border flex gap-4 text-xs ${
              isDark 
                ? "bg-slate-900/10 border-slate-900 text-slate-300" 
                : "bg-blue-50/50 border-blue-100 text-slate-700"
            }`}>
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-extrabold text-[13px] text-blue-600 dark:text-blue-400">System Credentials & SMTP</p>
                <p className="leading-relaxed text-[11px] opacity-90">
                  Update the master administrator login email and password here. You can also configure a Gmail SMTP sender account and an App Password (generated via your Google Account Settings &rarr; Security &rarr; App Passwords) to send real contact messages from your website contact form.
                </p>
              </div>
            </div>

            {isFetchingConfig ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <svg className="animate-spin h-6 w-6 text-[#e31e24]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-xs font-mono text-slate-500">Querying Root Configurations...</span>
              </div>
            ) : (
              <form onSubmit={handleSaveRootSettings} className="space-y-5">
                
                {/* 1. Admin Login Credentials Section */}
                <div className={`p-6 rounded-2xl border ${isDark ? "bg-slate-900/20 border-slate-900" : "bg-white border-slate-150 shadow-xs"} space-y-4`}>
                  <h3 className={`text-xs font-mono uppercase tracking-wider font-extrabold flex items-center gap-2 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                    <KeyRound className="w-4 h-4 text-[#e31e24]" />
                    <span>Master Admin Sign-in Details</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={`text-[10px] font-mono tracking-wider font-extrabold block ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                        Login Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={rootEmail}
                        onChange={(e) => setRootEmail(e.target.value)}
                        placeholder="admin@asialink.com"
                        className={`w-full p-2.5 rounded-lg border text-xs outline-none focus:ring-1 focus:ring-[#e31e24] ${
                          isDark 
                            ? "bg-slate-950 border-slate-800 text-white placeholder-slate-750 focus:border-[#e31e24]" 
                            : "bg-slate-50 border-slate-205 text-slate-900 placeholder-slate-400 focus:border-[#e31e24]"
                        }`}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className={`text-[10px] font-mono tracking-wider font-extrabold block ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                        Login Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showRootPassword ? "text" : "password"}
                          required
                          value={rootPassword}
                          onChange={(e) => setRootPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className={`w-full p-2.5 pr-10 rounded-lg border text-xs outline-none focus:ring-1 focus:ring-[#e31e24] ${
                            isDark 
                              ? "bg-slate-950 border-slate-800 text-white placeholder-slate-750 focus:border-[#e31e24]" 
                              : "bg-slate-50 border-slate-205 text-slate-900 placeholder-slate-400 focus:border-[#e31e24]"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowRootPassword(!showRootPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                        >
                          {showRootPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. SMTP Server Configuration Section */}
                <div className={`p-6 rounded-2xl border ${isDark ? "bg-slate-900/20 border-slate-900" : "bg-white border-slate-150 shadow-xs"} space-y-4`}>
                  <h3 className={`text-xs font-mono uppercase tracking-wider font-extrabold flex items-center gap-2 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                    <Mail className="w-4 h-4 text-[#e31e24]" />
                    <span>Gmail SMTP Server Connection</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={`text-[10px] font-mono tracking-wider block ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                        Gmail Sender Account
                      </label>
                      <input
                        type="email"
                        value={smtpUser}
                        onChange={(e) => setSmtpUser(e.target.value)}
                        placeholder="sender@gmail.com"
                        className={`w-full p-2.5 rounded-lg border text-xs outline-none focus:ring-1 focus:ring-[#e31e24] ${
                          isDark 
                            ? "bg-slate-950 border-slate-800 text-white placeholder-slate-750 focus:border-[#e31e24]" 
                            : "bg-slate-50 border-slate-205 text-slate-900 placeholder-slate-400 focus:border-[#e31e24]"
                        }`}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className={`text-[10px] font-mono tracking-wider block ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                        Gmail App Password
                      </label>
                      <div className="relative">
                        <input
                          type={showSmtpPass ? "text" : "password"}
                          value={smtpPass}
                          onChange={(e) => setSmtpPass(e.target.value)}
                          placeholder="abcd efgh ijkl mnop"
                          className={`w-full p-2.5 pr-10 rounded-lg border text-xs outline-none focus:ring-1 focus:ring-[#e31e24] ${
                            isDark 
                              ? "bg-slate-950 border-slate-800 text-white placeholder-slate-750 focus:border-[#e31e24]" 
                              : "bg-slate-50 border-slate-205 text-slate-900 placeholder-slate-400 focus:border-[#e31e24]"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowSmtpPass(!showSmtpPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                        >
                          {showSmtpPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Action Controls */}
                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="submit"
                    disabled={isSavingConfig}
                    className={`px-6 py-3 bg-[#e31e24] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-md hover:bg-red-600 transition-all ${
                      isSavingConfig ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingConfig ? "Applying settings..." : "Save Config Options"}</span>
                  </button>
                </div>

              </form>
            )}
          </div>
        )}

        {/* ======================================= */}
        {/* TAB 7: COMPANY DETAILS CONFIGURATION */}
        {/* ======================================= */}
        {activeTab === "company-details" && (
          <div className="space-y-6 max-w-4xl mx-auto py-2">
            <div className={`p-5 rounded-2xl border flex gap-4 text-xs ${
              isDark 
                ? "bg-slate-900/10 border-slate-900 text-slate-300" 
                : "bg-blue-50/50 border-blue-100 text-slate-700"
            }`}>
              <Info className="w-5 h-5 text-[#e31e24] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-extrabold text-[13px] text-[#e31e24] dark:text-[#f43f5e]">Centralized Company Details Hub</p>
                <p className="leading-relaxed text-[11px] opacity-90">
                  Update your contact phone numbers, email addresses, office map URLs, and social networks from this single dashboard. All changes will be saved to disk and dynamically reflect in real time across all views of the live website (including headers, footers, CTAs, and contact pages).
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveCompanyDetails} className="space-y-6">
              
              {/* SECTION A: Primary Contact Details */}
              <div className={`p-6 rounded-2xl border ${isDark ? "bg-slate-900/20 border-slate-900" : "bg-white border-slate-150 shadow-xs"} space-y-4`}>
                <h3 className={`text-xs font-mono uppercase tracking-wider font-extrabold flex items-center gap-2 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e31e24]" />
                  <span>Primary Contacts & Address</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-mono tracking-wider font-extrabold block ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                      Telephone/Phone Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={companyPhone}
                      onChange={(e) => setCompanyPhone(e.target.value)}
                      placeholder="+977-1-4015639"
                      className={`w-full p-2.5 rounded-lg border text-xs outline-none focus:ring-1 focus:ring-[#e31e24] ${
                        isDark 
                          ? "bg-slate-950 border-slate-800 text-white placeholder-slate-400 focus:border-[#e31e24]" 
                          : "bg-slate-50 border-slate-205 text-slate-900 placeholder-slate-400 focus:border-[#e31e24]"
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-mono tracking-wider block ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                      Alternate Phone Number
                    </label>
                    <input
                      type="text"
                      value={companyAltPhone}
                      onChange={(e) => setCompanyAltPhone(e.target.value)}
                      placeholder="+977-1-4015701"
                      className={`w-full p-2.5 rounded-lg border text-xs outline-none focus:ring-1 focus:ring-[#e31e24] ${
                        isDark 
                          ? "bg-slate-950 border-slate-800 text-white placeholder-slate-400 focus:border-[#e31e24]" 
                          : "bg-slate-50 border-slate-205 text-slate-900 placeholder-slate-400 focus:border-[#e31e24]"
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-mono tracking-wider font-extrabold block ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                      Primary Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      placeholder="info@asialinkservices.com"
                      className={`w-full p-2.5 rounded-lg border text-xs outline-none focus:ring-1 focus:ring-[#e31e24] ${
                        isDark 
                          ? "bg-slate-950 border-slate-800 text-white placeholder-slate-400 focus:border-[#e31e24]" 
                          : "bg-slate-50 border-slate-205 text-slate-900 placeholder-slate-400 focus:border-[#e31e24]"
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-mono tracking-wider block ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                      Alternate Email Address
                    </label>
                    <input
                      type="email"
                      value={companyAltEmail}
                      onChange={(e) => setCompanyAltEmail(e.target.value)}
                      placeholder="jobasialink119@gmail.com"
                      className={`w-full p-2.5 rounded-lg border text-xs outline-none focus:ring-1 focus:ring-[#e31e24] ${
                        isDark 
                          ? "bg-slate-950 border-slate-800 text-white placeholder-slate-400 focus:border-[#e31e24]" 
                          : "bg-slate-50 border-slate-205 text-slate-900 placeholder-slate-400 focus:border-[#e31e24]"
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className={`text-[10px] font-mono tracking-wider font-extrabold block ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                      Physical Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      placeholder="Bansbari, Ring Road (Opposite to Bhatbhateni Super Market), Kathmandu, Nepal"
                      className={`w-full p-2.5 rounded-lg border text-xs outline-none focus:ring-1 focus:ring-[#e31e24] ${
                        isDark 
                          ? "bg-slate-950 border-slate-800 text-white placeholder-slate-400 focus:border-[#e31e24]" 
                          : "bg-slate-50 border-slate-205 text-slate-900 placeholder-slate-400 focus:border-[#e31e24]"
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-mono tracking-wider block ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                      P.O. Box Number
                    </label>
                    <input
                      type="text"
                      value={companyPostalBox}
                      onChange={(e) => setCompanyPostalBox(e.target.value)}
                      placeholder="P.O. Box: 21844"
                      className={`w-full p-2.5 rounded-lg border text-xs outline-none focus:ring-1 focus:ring-[#e31e24] ${
                        isDark 
                          ? "bg-slate-950 border-slate-800 text-white placeholder-slate-400 focus:border-[#e31e24]" 
                          : "bg-slate-50 border-slate-205 text-slate-900 placeholder-slate-400 focus:border-[#e31e24]"
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-mono tracking-wider block ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                      Official Website Address
                    </label>
                    <input
                      type="text"
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      placeholder="https://asialinkservices.com"
                      className={`w-full p-2.5 rounded-lg border text-xs outline-none focus:ring-1 focus:ring-[#e31e24] ${
                        isDark 
                          ? "bg-slate-950 border-slate-800 text-white placeholder-slate-400 focus:border-[#e31e24]" 
                          : "bg-slate-50 border-slate-205 text-slate-900 placeholder-slate-400 focus:border-[#e31e24]"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION B: Social Networks */}
              <div className={`p-6 rounded-2xl border ${isDark ? "bg-slate-900/20 border-slate-900" : "bg-white border-slate-150 shadow-xs"} space-y-4`}>
                <h3 className={`text-xs font-mono uppercase tracking-wider font-extrabold flex items-center gap-2 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <span>Social Media & Chat Links</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-mono tracking-wider block ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                      Facebook Page URL
                    </label>
                    <input
                      type="url"
                      value={companyFacebook}
                      onChange={(e) => setCompanyFacebook(e.target.value)}
                      placeholder="https://www.facebook.com/asialinkservicespvtltd"
                      className={`w-full p-2.5 rounded-lg border text-xs outline-none focus:ring-1 focus:ring-blue-500 ${
                        isDark 
                          ? "bg-slate-950 border-slate-800 text-white placeholder-slate-400 focus:border-blue-500" 
                          : "bg-slate-50 border-slate-205 text-slate-900 placeholder-slate-400 focus:border-blue-500"
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-mono tracking-wider block ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                      WhatsApp Share Link / Mobile Direct
                    </label>
                    <input
                      type="text"
                      value={companyWhatsapp}
                      onChange={(e) => setCompanyWhatsapp(e.target.value)}
                      placeholder="https://wa.me/9779851330547"
                      className={`w-full p-2.5 rounded-lg border text-xs outline-none focus:ring-1 focus:ring-emerald-500 ${
                        isDark 
                          ? "bg-slate-950 border-slate-800 text-white placeholder-slate-400 focus:border-emerald-500" 
                          : "bg-slate-50 border-slate-205 text-slate-900 placeholder-slate-400 focus:border-emerald-500"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION C: Google Maps Coordinates & Integration */}
              <div className={`p-6 rounded-2xl border ${isDark ? "bg-slate-900/20 border-slate-900" : "bg-white border-slate-150 shadow-xs"} space-y-4`}>
                <h3 className={`text-xs font-mono uppercase tracking-wider font-extrabold flex items-center gap-2 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e31e24]" />
                  <span>Google Map Integrations</span>
                </h3>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-mono tracking-wider block ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                      Google Maps Share Link (Redirect URL)
                    </label>
                    <input
                      type="url"
                      value={companyGoogleMapLink}
                      onChange={(e) => setCompanyGoogleMapLink(e.target.value)}
                      placeholder="https://maps.app.goo.gl/QDaaqr6mcDDeKW7W6"
                      className={`w-full p-2.5 rounded-lg border text-xs outline-none focus:ring-1 focus:ring-[#e31e24] ${
                        isDark 
                          ? "bg-slate-950 border-slate-800 text-white placeholder-slate-400 focus:border-[#e31e24]" 
                          : "bg-slate-50 border-slate-205 text-slate-900 placeholder-slate-400 focus:border-[#e31e24]"
                      }`}
                    />
                    <p className="text-[10px] text-slate-400">Used for the floating action badges, "View Map" links, and CTAs across the pages.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-mono tracking-wider block ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                      Google Maps Iframe Embed SRC URL
                    </label>
                    <textarea
                      rows={3}
                      value={companyGoogleMapEmbed}
                      onChange={(e) => setCompanyGoogleMapEmbed(e.target.value)}
                      placeholder="https://www.google.com/maps/embed?pb=!1m18!1m12!3m3!..."
                      className={`w-full p-2.5 rounded-lg border text-xs outline-none focus:ring-1 focus:ring-[#e31e24] ${
                        isDark 
                          ? "bg-slate-950 border-slate-800 text-white placeholder-slate-400 focus:border-[#e31e24]" 
                          : "bg-slate-50 border-slate-205 text-slate-900 placeholder-slate-400 focus:border-[#e31e24]"
                      }`}
                    />
                    <p className="text-[10px] text-slate-400">Used for rendering the live interactive map element inside the Contact View section. Paste only the <b>src="..."</b> parameter inside the iframe tag generated from Google Maps Share option.</p>
                  </div>
                </div>
              </div>

              {/* SECTION D: Hero Section Background Image */}
              <div className={`p-6 rounded-2xl border ${isDark ? "bg-slate-900/20 border-slate-900" : "bg-white border-slate-150 shadow-xs"} space-y-5`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-xs font-mono uppercase tracking-wider font-extrabold flex items-center gap-2 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e31e24]" />
                    <span>Hero Section Banner Background</span>
                  </h3>
                  {heroBgUrl && (
                    <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/10 flex items-center gap-1 animate-pulse">
                      <span className="w-1 h-1 rounded-full bg-emerald-500" />
                      Live Custom Banner Active
                    </span>
                  )}
                </div>

                {/* Drag and Drop Zone Card with Live Context Mockup Preview */}
                <div 
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsHeroDragActive(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsHeroDragActive(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsHeroDragActive(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      handleHeroBgUpload(file);
                    }
                  }}
                  className={`relative overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300 ${
                    isHeroDragActive
                      ? "border-[#e31e24] bg-[#e31e24]/5 scale-[0.99] shadow-inner"
                      : heroBgUrl 
                        ? "border-slate-300/40 hover:border-slate-400/60" 
                        : isDark
                          ? "border-slate-800 hover:border-[#e31e24]/40 bg-slate-950/40"
                          : "border-slate-200 hover:border-[#e31e24]/40 bg-slate-50/50"
                  }`}
                >
                  {heroBgUrl ? (
                    /* High-Fidelity Mockup Container with full visual preview of the banner inside the website's Hero Section header */
                    <div className="relative group min-h-[220px] md:min-h-[260px] flex flex-col justify-between p-6">
                      {/* Live Image Background */}
                      <img 
                        src={heroBgUrl} 
                        alt="Hero Banner Live Preview" 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Dark Overlay with Radial Vignette */}
                      <div className="absolute inset-0 bg-black/60 transition-opacity duration-300 group-hover:bg-black/55" />

                      {/* Top Bar of the Mockup */}
                      <div className="relative z-10 flex justify-between items-start">
                        <div className="bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Interactive Banner Sandbox</span>
                        </div>
                        <div className="flex gap-2">
                          {/* File input selector overlay */}
                          <label className="px-3 py-1.5 bg-[#e31e24] hover:bg-[#c21419] text-white rounded-lg text-[11px] font-extrabold shadow-lg cursor-pointer flex items-center gap-1.5 transition-all active:scale-95">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Replace Banner</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleHeroBgUpload(file);
                                }
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setHeroBgUrl("")}
                            className="p-1.5 bg-black/65 hover:bg-red-600/90 text-slate-300 hover:text-white rounded-lg border border-slate-850 transition-all cursor-pointer"
                            title="Remove Banner"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Simulated Hero Text overlaying the banner */}
                      <div className="relative z-10 max-w-md mt-6 space-y-1 md:space-y-2 select-none pointer-events-none text-left">
                        <p className="text-[#e31e24] font-mono text-[9px] font-extrabold tracking-wider uppercase bg-black/35 px-2 py-0.5 rounded-sm inline-block backdrop-blur-xs">
                          Asia Link Services
                        </p>
                        <h1 className="text-white font-bold text-lg md:text-xl leading-tight tracking-tight drop-shadow-md">
                          Nepal's Premier Licensed Recruitment Agency
                        </h1>
                        <p className="text-slate-250 text-[10px] line-clamp-1 drop-shadow-sm font-medium">
                          Fulfilling global manpower demands with ethical, certified Nepalese workforces.
                        </p>
                      </div>

                      {/* Bottom Image Spec Bar */}
                      <div className="relative z-10 mt-4 flex items-center justify-between text-[10px] font-mono text-slate-300 bg-black/55 backdrop-blur-sm -mx-6 -mb-6 px-4 py-2 border-t border-white/5">
                        <span className="truncate max-w-[250px] md:max-w-md">{heroBgUrl}</span>
                        <span className="shrink-0 bg-white/10 px-1.5 py-0.5 rounded">JPG / PNG / WEBP</span>
                      </div>
                    </div>
                  ) : (
                    /* Redesigned Empty State / Upload Zone with Gorgeous Hover/Drag effects */
                    <label className="flex flex-col items-center justify-center p-8 min-h-[220px] text-center cursor-pointer group w-full">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleHeroBgUpload(file);
                          }
                        }}
                      />
                      
                      <div className={`p-4 rounded-full border-2 border-dashed mb-3.5 transition-all duration-300 ${
                        isHeroDragActive 
                          ? "bg-[#e31e24]/10 border-[#e31e24] scale-110" 
                          : "bg-slate-500/5 border-slate-300/50 group-hover:border-[#e31e24]/55 group-hover:bg-[#e31e24]/5 group-hover:rotate-12"
                      }`}>
                        <Upload className={`w-6 h-6 transition-colors duration-300 ${
                          isHeroDragActive 
                            ? "text-[#e31e24]" 
                            : "text-slate-400 group-hover:text-[#e31e24]"
                        }`} />
                      </div>

                      <span className={`text-xs font-extrabold mb-1 tracking-tight ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                        {isHeroDragActive ? "Drop your banner file here!" : "Drag & drop your custom banner image"}
                      </span>
                      <span className="text-[10px] text-slate-400 max-w-xs mb-3.5">
                        Supports high-resolution PNG, JPG, or WEBP. Max size 10MB.
                      </span>

                      <span className={`px-4 py-2 border rounded-lg text-[11px] font-extrabold shadow-xs transition-all ${
                        isDark 
                          ? "border-slate-800 bg-slate-900 text-slate-300 group-hover:bg-slate-800/80 group-hover:text-white" 
                          : "border-slate-200 bg-white text-slate-700 group-hover:border-slate-300 group-hover:shadow-sm"
                      }`}>
                        Select Image from Computer
                      </span>
                    </label>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="submit"
                  disabled={isSavingCompany}
                  className={`px-6 py-3 bg-[#e31e24] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-md hover:bg-red-600 transition-all ${
                    isSavingCompany ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingCompany ? "Saving Company Info..." : "Apply Corporate Details"}</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* ======================================= */}
        {/* TAB: JOB APPLICATIONS (DATABASE-BACKED) */}
        {/* ======================================= */}
        {activeTab === "applications" && (
          <div className="space-y-6 max-w-6xl mx-auto py-2">
            {isLoadingApps ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-3">
                <svg className="animate-spin h-6 w-6 text-[#e31e24]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-xs font-mono text-slate-500">Querying Application Index...</span>
              </div>
            ) : applications.length === 0 ? (
              <div className={`p-12 text-center rounded-2xl border ${isDark ? "border-slate-900 bg-slate-950/20" : "border-slate-150 bg-slate-50/50"} space-y-2`}>
                <Inbox className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}>No Applications Registered</h4>
                <p className="text-[10px] text-slate-500">When candidates apply for active job demands, their profiles will populate here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {applications.map((app) => (
                  <div 
                    key={app.id} 
                    className={`p-6 rounded-2xl border flex flex-col lg:flex-row gap-6 relative transition-all ${
                      isDark ? "bg-slate-900/10 border-slate-900 hover:border-slate-800" : "bg-white border-slate-150 shadow-xs hover:shadow-md"
                    }`}
                  >
                    {/* Delete Icon Button */}
                    <button
                      onClick={() => setDeleteConfirm({
                        type: "application",
                        id: app.id,
                        title: `${app.fullName} - ${app.selectedJobTitle}`
                      })}
                      className="absolute top-4 right-4 p-2 bg-red-500/15 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all cursor-pointer border border-transparent hover:border-red-500/30"
                      title="Delete Application Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Candidate Photo */}
                    <div className="w-24 h-24 rounded-2xl border overflow-hidden shrink-0 bg-slate-500/10 border-slate-300/20 flex items-center justify-center">
                      {app.photoUrl ? (
                        <img src={app.photoUrl} alt={app.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <Users className="w-10 h-10 text-slate-400" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-4">
                      <div className="space-y-1">
                        <span className="px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md bg-[#e31e24]/10 text-[#e31e24]">
                          {app.selectedJobTitle}
                        </span>
                        <h4 className={`text-sm font-black ${isDark ? "text-white" : "text-slate-900"}`}>{app.fullName}</h4>
                        <p className="text-[10px] text-slate-400 font-mono">ID: {app.id} | Applied: {new Date(app.submittedAt).toLocaleString()}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 text-xs">
                        <div>
                          <p className="text-[10px] text-slate-500 font-mono uppercase">Email Address</p>
                          <p className={`font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}>{app.email}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 font-mono uppercase">Contact Phone</p>
                          <p className={`font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}>{app.phone}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 font-mono uppercase">Passport Details</p>
                          <p className={`font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                            {app.passportNo ? `No: ${app.passportNo}` : "Not Provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 font-mono uppercase">Permanent Province / Location</p>
                          <p className={`font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}>{app.permanentAddress || "Not Provided"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 font-mono uppercase">Current Location Address</p>
                          <p className={`font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}>{app.temporaryAddress || "Not Provided"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 font-mono uppercase">Date of Birth</p>
                          <p className={`font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}>{app.dateOfBirth || "Not Provided"}</p>
                        </div>
                      </div>

                      <div className="space-y-1 bg-slate-500/5 p-3.5 rounded-xl border border-dashed border-slate-500/10">
                        <p className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">Qualifications & Vocational Trade Trials</p>
                        <p className={`text-xs ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                          <b>Academic Credentials:</b> {app.academicQualification || "None specified"}
                        </p>
                        <p className={`text-xs ${isDark ? "text-slate-300" : "text-slate-700"} mt-1`}>
                          <b>Past Experience / Message:</b> {app.experience || "None specified"}
                        </p>
                      </div>

                      {/* Attachment Download Elements */}
                      <div className="flex flex-wrap gap-3 pt-2">
                        {app.passportUrl && (
                          <a 
                            href={app.passportUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`px-3.5 py-2 rounded-lg text-[10px] font-bold border flex items-center gap-1.5 transition-all ${
                              isDark 
                                ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white" 
                                : "bg-slate-50 border-slate-205 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            <FileText className="w-3.5 h-3.5 text-blue-500" />
                            <span>Download Passport Copy</span>
                          </a>
                        )}
                        {app.cvUrl && (
                          <a 
                            href={app.cvUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`px-3.5 py-2 rounded-lg text-[10px] font-bold border flex items-center gap-1.5 transition-all ${
                              isDark 
                                ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white" 
                                : "bg-slate-50 border-slate-205 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            <FileText className="w-3.5 h-3.5 text-[#e31e24]" />
                            <span>Download Resume / CV Document</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================= */}
        {/* TAB: CONTACT FORM INQUIRIES (DATABASE-BACKED) */}
        {/* ======================================= */}
        {activeTab === "messages" && (() => {
          const activeMessages = messages.filter(m => !m.replyText);
          const resolvedMessages = messages.filter(m => m.replyText);

          const totalCount = messages.length;
          const activeCount = activeMessages.length;
          const resolvedCount = resolvedMessages.length;
          const responseRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;

          const currentList = messageSubTab === "active" ? activeMessages : resolvedMessages;
          const itemsPerPage = 10;
          const totalPages = Math.max(1, Math.ceil(currentList.length / itemsPerPage));
          
          // Enforce bounds
          const currentPage = Math.min(messagePage, totalPages);
          const startIndex = (currentPage - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const paginatedMessages = currentList.slice(startIndex, endIndex);

          return (
            <div className="space-y-6 w-full max-w-none py-2">
              {/* PROFESSIONAL METRICS DASHBOARD HEADER */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Active Tickets Card */}
                <div className={`p-3 rounded-xl border transition-all duration-300 flex items-start gap-3 ${
                  isDark ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-150 shadow-xs"
                }`}>
                  <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/20">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400">Active Tickets</span>
                    <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                      {activeCount}
                    </h3>
                    <p className="text-[9px] text-slate-500">Awaiting support response</p>
                  </div>
                </div>

                {/* Resolved Tickets Card */}
                <div className={`p-3 rounded-xl border transition-all duration-300 flex items-start gap-3 ${
                  isDark ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-150 shadow-xs"
                }`}>
                  <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400">Resolved Tickets</span>
                    <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                      {resolvedCount}
                    </h3>
                    <p className="text-[9px] text-slate-500">Official response sent via SMTP</p>
                  </div>
                </div>

                {/* Response Performance Card */}
                <div className={`p-3 rounded-xl border transition-all duration-300 ${
                  isDark ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-150 shadow-xs"
                }`}>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg border border-indigo-500/20">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 flex-1">
                      <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400">Response Rate</span>
                      <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                        {responseRate}%
                      </h3>
                      <div className="w-full bg-slate-500/10 h-1 rounded-full mt-1.5 overflow-hidden border border-slate-500/5">
                        <div 
                          className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${responseRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION CONTROLS: FILTER TABS */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-500/10 pb-1">
                <div className="flex items-center gap-2 p-1 bg-slate-500/5 rounded-xl border border-slate-500/5 max-w-xs sm:max-w-md">
                  <button
                    type="button"
                    onClick={() => { setMessageSubTab("active"); setMessagePage(1); }}
                    className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      messageSubTab === "active"
                        ? "bg-[#e31e24] text-white shadow-md"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Active Tickets</span>
                    <span className={`px-1.5 py-0.5 text-[9px] font-mono rounded-md ${
                      messageSubTab === "active" ? "bg-white/20 text-white" : "bg-slate-500/10 text-slate-500"
                    }`}>
                      {activeCount}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMessageSubTab("resolved"); setMessagePage(1); }}
                    className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      messageSubTab === "resolved"
                        ? "bg-[#e31e24] text-white shadow-md"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Resolved Tickets</span>
                    <span className={`px-1.5 py-0.5 text-[9px] font-mono rounded-md ${
                      messageSubTab === "resolved" ? "bg-white/20 text-white" : "bg-slate-500/10 text-slate-500"
                    }`}>
                      {resolvedCount}
                    </span>
                  </button>
                </div>

                <div className="text-[10px] font-mono text-slate-400">
                  Total indexed database inquiries: {totalCount}
                </div>
              </div>

              {isLoadingMessages ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                  <svg className="animate-spin h-6 w-6 text-[#e31e24]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="text-xs font-mono text-slate-500">Querying Inbox Logs...</span>
                </div>
              ) : currentList.length === 0 ? (
                <div className={`p-16 text-center rounded-2xl border ${
                  isDark ? "border-slate-900 bg-slate-950/20" : "border-slate-150 bg-slate-50/50"
                } space-y-3 max-w-xl mx-auto`}>
                  <div className="w-12 h-12 bg-slate-500/5 text-slate-400 rounded-full flex items-center justify-center mx-auto border border-slate-500/10">
                    <Inbox className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className={`text-sm font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      No {messageSubTab === "active" ? "Active" : "Resolved"} Inquiries Found
                    </h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                      {messageSubTab === "active" 
                        ? "Great job! All incoming guest queries are currently resolved." 
                        : "No tickets have been officially resolved via response replies yet."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {paginatedMessages.map((msg) => {
                      const firstInitial = msg.name ? msg.name.charAt(0).toUpperCase() : "G";
                      
                      return (
                        <div 
                          key={msg.id} 
                          className={`p-4 rounded-xl border relative transition-all duration-300 hover:shadow-md flex flex-col justify-between space-y-3 h-full ${
                            isDark 
                              ? "bg-slate-900/20 border-slate-800 hover:border-slate-750" 
                              : "bg-white border-slate-150 shadow-xs hover:border-slate-200"
                          }`}
                        >
                          <div className="space-y-3 flex-1 flex flex-col">
                            {/* Card Top Metadata Bar */}
                            <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 flex-wrap">
                              <span className={`px-1.5 py-0.5 text-[8px] font-mono font-semibold uppercase tracking-wider rounded ${
                                isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"
                              }`}>
                                ID: {msg.id.substring(0, 8)}
                              </span>
                              
                              <div className="flex items-center gap-1">
                                {msg.replyText ? (
                                  <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/15 flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                                    <span>Resolved</span>
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/15 flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse"></span>
                                    <span>Active</span>
                                  </span>
                                )}
                                
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirm({ type: "message", id: msg.id, title: `Contact Inquiry from ${msg.name}` })}
                                  className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                                  title="Delete Inquiry Log"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {/* Sender details and avatar */}
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-black text-xs border ${
                                isDark 
                                  ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" 
                                  : "bg-indigo-50 text-indigo-600 border-indigo-100"
                              }`}>
                                {firstInitial}
                              </div>
                              <div className="space-y-0.5 min-w-0 flex-1">
                                <h4 className={`text-xs font-bold leading-tight truncate ${isDark ? "text-white" : "text-slate-900"}`} title={msg.name}>
                                  {msg.name}
                                </h4>
                                <p className="text-[9px] text-slate-400 flex items-center gap-1">
                                  <Calendar className="w-2.5 h-2.5 flex-shrink-0" />
                                  <span>{new Date(msg.submittedAt).toLocaleString()}</span>
                                </p>
                              </div>
                            </div>

                            {/* Subject block */}
                            <div className={`p-2 rounded-lg text-[11px] font-semibold border flex items-start gap-1 ${
                              isDark 
                                ? "bg-slate-950/40 border-slate-850/80 text-slate-200" 
                                : "bg-slate-50 border-slate-100 text-slate-800"
                            }`}>
                              <span className="text-[8px] text-slate-400 uppercase font-mono tracking-wider mt-0.5 flex-shrink-0">Subject:</span>
                              <span className="break-words line-clamp-2">{msg.subject || "General Inquiry / Feedback"}</span>
                            </div>

                            {/* SENDER CONTACT INFO GRID (Stacked vertically to prevent overlaps) */}
                            <div className="space-y-1.5">
                              <div className={`p-1.5 rounded-lg border flex flex-col gap-0.5 min-w-0 ${
                                isDark ? "bg-slate-950/20 border-slate-900" : "bg-slate-50/50 border-slate-100"
                              }`}>
                                <span className="text-[7.5px] text-slate-400 uppercase font-mono tracking-wider">Email Address</span>
                                <p className={`text-[11px] font-bold ${isDark ? "text-indigo-300" : "text-indigo-600"} truncate`}>
                                  <a href={`mailto:${msg.email}`} className="hover:underline flex items-center gap-1 min-w-0" title={msg.email}>
                                    <Mail className="w-3 h-3 flex-shrink-0 text-slate-400" />
                                    <span className="truncate">{msg.email}</span>
                                  </a>
                                </p>
                              </div>
                              
                              <div className={`p-1.5 rounded-lg border flex flex-col gap-0.5 min-w-0 ${
                                isDark ? "bg-slate-950/20 border-slate-900" : "bg-slate-50/50 border-slate-100"
                              }`}>
                                <span className="text-[7.5px] text-slate-400 uppercase font-mono tracking-wider">Telephone Coordinates</span>
                                <p className={`text-[11px] font-bold ${isDark ? "text-slate-300" : "text-slate-800"} truncate`}>
                                  {msg.phone ? (
                                    <a href={`tel:${msg.phone}`} className="hover:underline flex items-center gap-1 min-w-0" title={msg.phone}>
                                      <span className="flex-shrink-0 text-[10px]">📞</span>
                                      <span className="truncate">{msg.phone}</span>
                                    </a>
                                  ) : (
                                    <span className="text-slate-400 italic">Not specified</span>
                                  )}
                                </p>
                              </div>
                            </div>

                            {/* Inquiry message body block with max-height and custom scrollbar */}
                            <div className="space-y-1 flex-1 flex flex-col min-h-[80px]">
                              <span className="text-[8px] text-slate-400 uppercase font-mono tracking-wider">Guest Inquirer Message Payload</span>
                              <div className={`p-2 rounded-lg border text-[11px] leading-relaxed whitespace-pre-wrap flex-1 max-h-24 overflow-y-auto custom-scrollbar ${
                                isDark 
                                  ? "bg-slate-950/60 border-slate-900/80 text-slate-300" 
                                  : "bg-slate-50/60 border-slate-150 text-slate-700"
                              }`}>
                                {msg.message}
                              </div>
                            </div>
                          </div>

                          {/* Team Response / Action Center */}
                          <div className="pt-2 border-t border-slate-500/10 space-y-2">
                            {msg.replyText ? (
                              <div className={`p-2 rounded-lg border ${
                                isDark ? "bg-emerald-950/20 border-emerald-900/30 text-emerald-300" : "bg-emerald-50/60 border-emerald-100 text-emerald-900"
                              } space-y-1.5`}>
                                <div className="flex items-center justify-between flex-wrap gap-2 text-[8px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                  <div className="flex items-center gap-1">
                                    <CornerDownRight className="w-3 h-3" />
                                    <span>SMTP Response logs</span>
                                  </div>
                                </div>
                                <div className="text-[11px] leading-relaxed whitespace-pre-wrap font-medium p-2 rounded bg-white/5 dark:bg-slate-950/20 border border-emerald-500/10 font-mono max-h-20 overflow-y-auto custom-scrollbar">
                                  {msg.replyText}
                                </div>
                                <div className="text-[8px] text-slate-400 font-mono text-right">
                                  Delivered: {msg.repliedAt ? new Date(msg.repliedAt).toLocaleString() : "Date Log Missing"}
                                </div>
                              </div>
                            ) : activeReplyId === msg.id ? (
                              <div className={`p-2 rounded-lg border space-y-2 ${
                                isDark ? "bg-slate-950/40 border-slate-850" : "bg-slate-50/50 border-slate-200"
                              }`}>
                                <div className="flex items-center justify-between flex-wrap gap-1">
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-blue-500 flex items-center gap-1">
                                    <Reply className="w-2.5 h-2.5 flex-shrink-0" />
                                    Drafting response
                                  </span>
                                  <span className="text-[9px] font-mono text-slate-500">
                                    {replyContent.length} chars
                                  </span>
                                </div>
                                
                                <textarea
                                  value={replyContent}
                                  onChange={(e) => setReplyContent(e.target.value)}
                                  placeholder="Type support response. Sends HTML email & resolves ticket..."
                                  rows={3}
                                  className={`w-full text-[11px] p-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                    isDark 
                                      ? "bg-slate-900 border-slate-850 text-slate-100 focus:border-blue-500" 
                                      : "bg-white border-slate-250 text-slate-800 focus:border-blue-500 shadow-xs"
                                  }`}
                                />
                                
                                <div className="flex items-center justify-end gap-1.5 pt-0.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveReplyId(null);
                                      setReplyContent("");
                                    }}
                                    disabled={isSendingReply}
                                    className={`px-2 py-1 text-[9px] font-bold rounded-md border transition-all cursor-pointer ${
                                      isDark 
                                        ? "border-slate-800 text-slate-400 hover:bg-slate-900" 
                                        : "border-slate-200 text-slate-600 hover:bg-slate-100"
                                    }`}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      await handleSendReply(msg.id);
                                    }}
                                    disabled={isSendingReply}
                                    className="px-2.5 py-1 bg-blue-600 text-white hover:bg-blue-700 text-[9px] font-bold rounded-md flex items-center gap-1 disabled:opacity-50 transition-all shadow-xs cursor-pointer"
                                  >
                                    {isSendingReply ? (
                                      <span className="animate-spin h-2.5 w-2.5 border-2 border-white border-t-transparent rounded-full" />
                                    ) : (
                                      <>
                                        <Send className="w-2.5 h-2.5" />
                                        <span>Send & Resolve</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex justify-end pt-0.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveReplyId(msg.id);
                                    setReplyContent("");
                                  }}
                                  className="w-full justify-center px-3 py-1.5 bg-blue-500/10 text-blue-500 hover:bg-blue-600 hover:text-white rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 border border-transparent hover:border-blue-500/20 cursor-pointer"
                                >
                                  <Reply className="w-3 h-3" />
                                  <span>Draft Response & Resolve</span>
                                </button>
                              </div>
                            )}
                          </div>

                        </div>
                      );
                    })}
                  </div>

                  {/* CUSTOM PROFESSIONAL PAGINATION CONTROLLER */}
                  {totalPages > 1 && (
                    <div className={`flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl border ${
                      isDark ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-150 shadow-xs"
                    } gap-4`}>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Showing <span className="font-bold text-slate-800 dark:text-slate-200">{startIndex + 1}</span> to{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">{Math.min(currentList.length, endIndex)}</span> of{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">{currentList.length}</span> {messageSubTab === "active" ? "active" : "resolved"} inquiries
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={currentPage === 1}
                          onClick={() => setMessagePage(prev => Math.max(1, prev - 1))}
                          className={`px-3 py-1.5 text-[11px] font-bold rounded-lg border flex items-center gap-1 transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer ${
                            isDark 
                              ? "border-slate-800 text-slate-400 hover:bg-slate-900 bg-slate-950/20" 
                              : "border-slate-200 text-slate-600 hover:bg-slate-100 bg-white"
                          }`}
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Previous</span>
                        </button>
                        
                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalPages }).map((_, idx) => {
                            const p = idx + 1;
                            const isCurrent = p === currentPage;
                            return (
                              <button
                                key={p}
                                type="button"
                                onClick={() => setMessagePage(p)}
                                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  isCurrent 
                                    ? "bg-[#e31e24] text-white shadow-sm" 
                                    : isDark 
                                      ? "text-slate-400 hover:bg-slate-900" 
                                      : "text-slate-600 hover:bg-slate-100"
                                }`}
                              >
                                {p}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          type="button"
                          disabled={currentPage === totalPages}
                          onClick={() => setMessagePage(prev => Math.min(totalPages, prev + 1))}
                          className={`px-3 py-1.5 text-[11px] font-bold rounded-lg border flex items-center gap-1 transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer ${
                            isDark 
                              ? "border-slate-800 text-slate-400 hover:bg-slate-900 bg-slate-950/20" 
                              : "border-slate-200 text-slate-600 hover:bg-slate-100 bg-white"
                          }`}
                        >
                          <span>Next</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })()}

          </div>
        </div>
      </div>

      {/* ======================================= */}
      {/* CUSTOM SECURE DELETE CONFIRMATION MODAL (SANDBOX IMMUNE) */}
      {/* ======================================= */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
          <div className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl space-y-6 ${
            isDark ? "bg-slate-950 border-slate-850" : "bg-white border-slate-150"
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h3 className={`text-sm font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                  Confirm Deletion Action
                </h3>
                <p className={`text-[10px] uppercase font-mono tracking-wider font-extrabold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Destructive operations registry
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                Are you absolutely sure you want to delete this {deleteConfirm.type === "demand" ? "active recruitment demand" : deleteConfirm.type === "notice" ? "general notice" : deleteConfirm.type === "partner" ? "affiliate partner" : "executive team member"}?
              </p>
              <div className={`p-3.5 rounded-xl border text-xs font-mono font-bold leading-relaxed break-words ${
                isDark ? "bg-slate-900/60 border-slate-850 text-slate-100" : "bg-slate-50 border-slate-205 text-slate-900"
              }`}>
                {deleteConfirm.title}
              </div>
              <p className="text-[10px] text-red-500 font-extrabold">
                * Warning: This operational payload is permanent and cannot be reversed.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className={`py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  isDark 
                    ? "border-slate-800 text-slate-400 bg-slate-900/40 hover:bg-slate-900 hover:text-white" 
                    : "border-slate-205 text-slate-600 bg-slate-50 hover:bg-slate-100"
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const { type, id } = deleteConfirm;
                  setDeleteConfirm(null);
                  if (type === "demand") {
                    await deleteDemand(id);
                  } else if (type === "notice") {
                    await deleteNotice(id);
                  } else if (type === "partner") {
                    await deletePartner(id);
                  } else if (type === "member") {
                    await deleteMember(id);
                  } else if (type === "application") {
                    await deleteApplication(id);
                  } else if (type === "message") {
                    await deleteMessage(id);
                  }
                }}
                className="py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all cursor-pointer shadow-md flex items-center justify-center"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
