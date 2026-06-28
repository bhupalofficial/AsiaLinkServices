import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import { db, initializeDatabase } from "./db/database.js";

function getEmailTemplate(title: string, subtitle: string, contentHtml: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="light dark">
      <meta name="supported-color-schemes" content="light dark">
      <title>${title}</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background-color: #f1f5f9;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          border: 1px solid #e2e8f0;
        }
        .header {
          background-color: #1e293b;
          background-image: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          padding: 32px 24px;
          text-align: center;
          color: #ffffff;
          border-bottom: 3px solid #e31e24;
        }
        .header h1 {
          margin: 0;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.025em;
          text-transform: uppercase;
        }
        .header p {
          margin: 6px 0 0 0;
          font-size: 13px;
          color: #94a3b8;
          font-weight: 500;
        }
        .body {
          padding: 32px 24px;
          color: #334155;
          line-height: 1.6;
          font-size: 15px;
        }
        .section-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin-top: 0;
          margin-bottom: 16px;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 8px;
        }
        .info-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          font-size: 14px;
        }
        .info-table th {
          background-color: #f8fafc;
          color: #64748b;
          text-align: left;
          padding: 10px 12px;
          border-bottom: 1px solid #e2e8f0;
          width: 35%;
          font-weight: 600;
        }
        .info-table td {
          padding: 10px 12px;
          border-bottom: 1px solid #e2e8f0;
          color: #1e293b;
        }
        .message-box {
          background-color: #f8fafc;
          border-left: 4px solid #3b82f6;
          padding: 16px;
          border-radius: 4px;
          margin: 20px 0;
          font-style: italic;
          color: #475569;
        }
        .button-container {
          text-align: center;
          margin: 30px 0 10px;
        }
        .button {
          background-color: #e31e24;
          color: #ffffff !important;
          padding: 12px 24px;
          text-decoration: none;
          font-weight: 600;
          border-radius: 6px;
          display: inline-block;
          font-size: 14px;
          box-shadow: 0 2px 4px rgba(227, 30, 36, 0.2);
        }
        .footer {
          background-color: #f8fafc;
          padding: 24px;
          text-align: center;
          font-size: 12px;
          color: #64748b;
          border-top: 1px solid #e2e8f0;
        }
        .footer p {
          margin: 4px 0;
        }

        /* Extremely robust dark mode theme overrides for major email clients */
        @media (prefers-color-scheme: dark) {
          body {
            background-color: #0f172a !important;
            color: #cbd5e1 !important;
          }
          .container {
            background-color: #1e293b !important;
            border-color: #334155 !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5) !important;
          }
          .body {
            color: #cbd5e1 !important;
          }
          .section-title {
            color: #f1f5f9 !important;
            border-bottom-color: #334155 !important;
          }
          .info-table th {
            background-color: #0f172a !important;
            color: #94a3b8 !important;
            border-bottom-color: #334155 !important;
          }
          .info-table td {
            color: #e2e8f0 !important;
            border-bottom-color: #334155 !important;
          }
          .message-box {
            background-color: #0f172a !important;
            color: #cbd5e1 !important;
            border-left-color: #e31e24 !important;
          }
          .footer {
            background-color: #0f172a !important;
            color: #94a3b8 !important;
            border-top-color: #334155 !important;
          }
          .employer-box {
            background-color: #064e3b !important;
            border-color: #065f46 !important;
          }
          .employer-title {
            color: #6ee7b7 !important;
          }
          .employer-text {
            color: #cbd5e1 !important;
          }
          .signature-box {
            border-top-color: #334155 !important;
            color: #94a3b8 !important;
          }
          .signature-title {
            color: #f1f5f9 !important;
          }
          .contact-link-inline {
            color: #f87171 !important;
          }
          /* Universal overrides inside .body to make sure inline-styled values behave */
          .body p, .body td, .body th, .body h2, .body h3, .body h4, .body span, .body div {
            color: #cbd5e1 !important;
          }
          .body b, .body strong {
            color: #f1f5f9 !important;
          }
          .body a {
            color: #38bdf8 !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${title}</h1>
          <p>${subtitle}</p>
        </div>
        <div class="body">
          ${contentHtml}
        </div>
        <div class="footer">
          <p><b>Asia Link Services Ltd.</b></p>
          <p>International Recruitment & Manpower Sourcing Sensation</p>
          <p>&copy; 2026 Asia Link Services. All rights reserved.</p>
          <p style="margin-top: 12px; font-size: 10px; color: #94a3b8;">This is an automated correspondence. Please contact support if you received this in error.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

async function startServer() {
  // Initialize our persistent JSON database
  initializeDatabase();

  const app = express();
  const PORT = 3000;

  // Make sure we can receive JSON payloads up to 50mb (for pdf and image uploads)
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Directories setup
  const publicDir = path.join(process.cwd(), "public");
  const uploadsDir = path.join(publicDir, "uploads");
  const cmsFilePath = path.join(publicDir, "cms_data.json");
  const adminConfigPath = path.join(process.cwd(), "admin_config.json");

  // Custom asset directories based on user request
  const assetsDemandDir = path.join(process.cwd(), "src", "assets", "demand");
  const assetsNoticeDir = path.join(process.cwd(), "src", "assets", "notice");
  const assetsVisitorUploadsDir = path.join(process.cwd(), "src", "assets", "visitoruploads");
  const assetsPartnerLogoDir = path.join(process.cwd(), "src", "assets", "partnerlogo");
  const assetsOurTeamDir = path.join(process.cwd(), "src", "assets", "ourteam");

  // Create directories if they do not exist
  [
    uploadsDir,
    assetsDemandDir,
    assetsNoticeDir,
    assetsVisitorUploadsDir,
    assetsPartnerLogoDir,
    assetsOurTeamDir
  ].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // --- Admin Authentication & SMTP Configuration Store ---
  const configStore = {
    adminEmail: process.env.ADMIN_EMAIL || "admin@asialink.com",
    adminPassword: process.env.ADMIN_PASSWORD || "Admin119Password!",
    smtpUser: process.env.SMTP_USER || "sender@gmail.com",
    smtpPass: process.env.SMTP_PASS || ""
  };

  // Synchronous config loader
  function reloadAdminConfig() {
    try {
      if (fs.existsSync(adminConfigPath)) {
        const raw = fs.readFileSync(adminConfigPath, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed.adminEmail) configStore.adminEmail = parsed.adminEmail;
        if (parsed.adminPassword) configStore.adminPassword = parsed.adminPassword;
        if (parsed.smtpUser !== undefined) configStore.smtpUser = parsed.smtpUser;
        if (parsed.smtpPass !== undefined) configStore.smtpPass = parsed.smtpPass;
      }
    } catch (err) {
      console.error("Failed to load admin config:", err);
    }
  }
  // Load initially
  reloadAdminConfig();

  // Memory store for valid active admin tokens
  const sessionTokens = new Set<string>();

  // Lockout tracking variables to defend against brute force
  let loginAttempts = 0;
  let lockoutUntil: number | null = null;

  // Helper middleware to restrict critical mutations to authenticatedadmins only
  function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
    const authorization = req.headers.authorization || "";
    const token = authorization.replace(/^Bearer\s+/, "").trim();
    if (!token || !sessionTokens.has(token)) {
      return res.status(401).json({ success: false, error: "Unauthorized access. Session expired or missing administrator token." });
    }
    next();
  }

  // --- API Routes ---

  // GET /api/admin/status - Query lockout status dynamically
  app.get("/api/admin/status", (req, res) => {
    try {
      if (lockoutUntil && Date.now() < lockoutUntil) {
        const remainingMs = lockoutUntil - Date.now();
        const remainingSeconds = Math.ceil(remainingMs / 1000);
        return res.json({ 
          locked: true, 
          lockoutUntil, 
          remainingSeconds 
        });
      }
      return res.json({ locked: false });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // POST /api/admin/login with robust lockout shield
  app.post("/api/admin/login", (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, error: "Email and password are both required." });
      }

      // 1. Verify lockout timeframe
      if (lockoutUntil && Date.now() < lockoutUntil) {
        const remainingMs = lockoutUntil - Date.now();
        const remainingSeconds = Math.ceil(remainingMs / 1000);
        return res.status(403).json({ 
          success: false, 
          locked: true,
          lockoutUntil,
          remainingSeconds,
          error: `Sign-in page is locked due to 5 consecutive failed login attempts. Please retry after the 1-hour cooldown expires.` 
        });
      }

      reloadAdminConfig();

      // 2. Validate email and password matches exactly
      if (
        email.trim().toLowerCase() === configStore.adminEmail.trim().toLowerCase() && 
        password === configStore.adminPassword
      ) {
        // Success: Clear history of failures and lockout timer
        loginAttempts = 0;
        lockoutUntil = null;

        // Generate dynamic random token
        const token = "als_" + Math.random().toString(36).substring(2) + Date.now().toString(36);
        sessionTokens.add(token);
        return res.json({ 
          success: true, 
          token, 
          email: configStore.adminEmail,
          message: "Sign-in successful. Welcome back to Control Hub!" 
        });
      }

      // 3. Increment failures on incorrect passwords
      loginAttempts += 1;
      
      if (loginAttempts >= 5) {
        // Active 1-hour lockout
        lockoutUntil = Date.now() + 60 * 60 * 1000;
        loginAttempts = 0; // Reset counter for next cycle
        return res.status(403).json({
          success: false,
          locked: true,
          lockoutUntil,
          remainingSeconds: 3600,
          error: "CRITICAL SECURITY BREACH PREVENTED: This sign-in portal has been locked for 1 hour following 5 consecutive incorrect attempts."
        });
      }

      const remainingAttempts = 5 - loginAttempts;
      return res.status(401).json({ 
        success: false, 
        remainingAttempts,
        error: `Invalid administrator email or password. Warning: ${remainingAttempts} attempts remaining before account lockout.` 
      });
    } catch (err: any) {
      console.error("Admin Login Error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // POST /api/admin/verify
  app.post("/api/admin/verify", (req, res) => {
    try {
      const authorization = req.headers.authorization || "";
      const token = authorization.replace(/^Bearer\s+/, "").trim();
      reloadAdminConfig();
      if (token && sessionTokens.has(token)) {
        return res.json({ success: true, email: configStore.adminEmail });
      }
      return res.status(401).json({ success: false, error: "Invalid/expired session token." });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // POST /api/admin/logout
  app.post("/api/admin/logout", (req, res) => {
    try {
      const authorization = req.headers.authorization || "";
      const token = authorization.replace(/^Bearer\s+/, "").trim();
      if (token) {
        sessionTokens.delete(token);
      }
      return res.json({ success: true, message: "Logged out effectively." });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // GET /api/admin/config
  app.get("/api/admin/config", requireAdmin, (req, res) => {
    try {
      reloadAdminConfig();
      return res.json({
        success: true,
        config: {
          adminEmail: configStore.adminEmail,
          adminPassword: configStore.adminPassword,
          smtpUser: configStore.smtpUser,
          smtpPass: configStore.smtpPass
        }
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // POST /api/admin/config
  app.post("/api/admin/config", requireAdmin, (req, res) => {
    try {
      const { adminEmail, adminPassword, smtpUser, smtpPass } = req.body;
      
      if (!adminEmail || !adminPassword) {
        return res.status(400).json({ success: false, error: "Admin email and password are both required." });
      }

      const updated = {
        adminEmail: adminEmail.trim(),
        adminPassword: adminPassword.trim(),
        smtpUser: (smtpUser || "").trim(),
        smtpPass: smtpPass || ""
      };

      // Write config to disk
      fs.writeFileSync(adminConfigPath, JSON.stringify(updated, null, 2), "utf-8");
      
      // Update our in-memory configuration state
      configStore.adminEmail = updated.adminEmail;
      configStore.adminPassword = updated.adminPassword;
      configStore.smtpUser = updated.smtpUser;
      configStore.smtpPass = updated.smtpPass;

      return res.json({ success: true, message: "Root control configurations updated successfully." });
    } catch (err: any) {
      console.error("Error saving admin root controls:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Helper to save base64 attachment files from public job submissions
  function saveBase64Attachment(base64Str: string | undefined, originalName: string): string {
    if (!base64Str) return "";
    try {
      // Extract media type and content
      const matches = base64Str.match(/^data:([A-Za-z0-9-+\/]+);base64,(.+)$/);
      let buffer: Buffer;
      if (matches && matches.length === 3) {
        buffer = Buffer.from(matches[2], "base64");
      } else {
        const cleanBase64 = base64Str.replace(/^data:[a-zA-Z0-9-+\/]+;base64,/, "");
        buffer = Buffer.from(cleanBase64, "base64");
      }
      
      const safeName = `${Date.now()}_${originalName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const targetSubdir = "src/assets/visitoruploads";
      const targetFolder = path.join(process.cwd(), targetSubdir);
      
      if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder, { recursive: true });
      }
      
      const targetFilePath = path.join(targetFolder, safeName);
      fs.writeFileSync(targetFilePath, buffer);
      
      // Also write in dist directory if in production state
      const distFolder = path.join(process.cwd(), "dist", targetSubdir);
      if (fs.existsSync(path.join(process.cwd(), "dist"))) {
        if (!fs.existsSync(distFolder)) {
          fs.mkdirSync(distFolder, { recursive: true });
        }
        fs.writeFileSync(path.join(distFolder, safeName), buffer);
      }
      
      return `/src/assets/visitoruploads/${safeName}`;
    } catch (err) {
      console.error("Failed to write base64 attachment:", err);
      return "";
    }
  }

  // Helper to delete a local file safely if its path starts with appropriate directories
  function deleteLocalFile(fileUrl: string | undefined) {
    if (!fileUrl) return;
    if (fileUrl.startsWith("/src/assets/") || fileUrl.startsWith("/uploads/") || fileUrl.startsWith("src/assets/")) {
      const cleanPath = fileUrl.startsWith("/") ? fileUrl.substring(1) : fileUrl;
      const fullPath = path.join(process.cwd(), cleanPath);
      try {
        if (fs.existsSync(fullPath) && fs.lstatSync(fullPath).isFile()) {
          fs.unlinkSync(fullPath);
          console.log(`[FILE CLEANUP] Automatically deleted file: ${fullPath}`);
          
          // Also try to delete from dist folder
          const distPath = path.join(process.cwd(), "dist", cleanPath);
          if (fs.existsSync(distPath) && fs.lstatSync(distPath).isFile()) {
            fs.unlinkSync(distPath);
            console.log(`[FILE CLEANUP] Automatically deleted dist file: ${distPath}`);
          }
        }
      } catch (err) {
        console.error(`[FILE CLEANUP] Failed to delete file ${fullPath}:`, err);
      }
    }
  }

  // Helper to compare old and new items and delete files that are no longer referenced
  function cleanupUnreferencedFiles<T extends { id: string }>(
    oldItems: T[],
    newItems: T[],
    getUrlField: (item: T) => string | undefined
  ) {
    try {
      const newItemsMap = new Map<string, T>();
      newItems.forEach(item => newItemsMap.set(item.id, item));

      oldItems.forEach(oldItem => {
        const newItem = newItemsMap.get(oldItem.id);
        const oldUrl = getUrlField(oldItem);

        if (!oldUrl) return;

        // If the item itself was deleted, or the URL field was modified/removed
        if (!newItem || getUrlField(newItem) !== oldUrl) {
          deleteLocalFile(oldUrl);
        }
      });
    } catch (err) {
      console.error("[FILE CLEANUP] Error during unreferenced files cleanup:", err);
    }
  }

  // POST /api/contact
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, phone, subject, message } = req.body;
      if (!name || !email || !phone || !subject || !message) {
        return res.status(400).json({ success: false, error: "All fields are required to submit inquiry." });
      }

      // 1. Persist the message in the contact form messages database table!
      const savedMsg = db.saveContactMessage({ name, email, phone, subject, message });

      reloadAdminConfig();

      // Dynamic Company Details setup
      const companyMeta = {
        name: "Asia Link Services (P.) Ltd.",
        license: "119/055/056",
        phone: "+977-1-4545084, 4545085",
        email: "info@asialink.com.np",
        address: "G.P.O. Box: 24707, Kathmandu, Nepal",
        website: "https://www.asialink.com.np"
      };

      try {
        if (fs.existsSync(cmsFilePath)) {
          const data = JSON.parse(fs.readFileSync(cmsFilePath, "utf-8"));
          if (data.companyMeta) {
            if (data.companyMeta.title) companyMeta.name = data.companyMeta.title;
            if (data.companyMeta.govLicenseNo) companyMeta.license = data.companyMeta.govLicenseNo;
          }
          if (data.contactInfo) {
            if (data.contactInfo.phone) companyMeta.phone = data.contactInfo.phone;
            if (data.contactInfo.email) companyMeta.email = data.contactInfo.email;
            if (data.contactInfo.address) companyMeta.address = data.contactInfo.address;
            if (data.contactInfo.website) companyMeta.website = data.contactInfo.website;
          }
        }
      } catch (err) {
        console.warn("Could not read company details from cms_data.json in /api/contact:", err);
      }

      const protocol = req.secure || req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
      const hostUrl = `${protocol}://${req.get("host")}`;

      // If SMTP is configured, send a real email using nodemailer!
      if (configStore.smtpUser && configStore.smtpPass) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: configStore.smtpUser,
            pass: configStore.smtpPass
          }
        });

        // Professional Email to Visitor (Thank You for Reaching Out)
        const visitorHtml = getEmailTemplate(
          companyMeta.name,
          "Thank you for reaching out!",
          `
          <h2 class="section-title">We Have Received Your Message</h2>
          <p>Dear ${name},</p>
          <p>Thank you for contacting <b>${companyMeta.name}</b>. We appreciate you reaching out to us. Our client relations team has received your inquiry and is currently reviewing it.</p>
          
          <p>Here are the details of the message we received:</p>
          <table class="info-table">
            <tr><th style="background-color: #f8fafc; color: #64748b; padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0;">Sender Name</th><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${name}</td></tr>
            <tr><th style="background-color: #f8fafc; color: #64748b; padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0;">Email Address</th><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${email}</td></tr>
            <tr><th style="background-color: #f8fafc; color: #64748b; padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0;">Contact Phone</th><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${phone}</td></tr>
            <tr><th style="background-color: #f8fafc; color: #64748b; padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0;">Subject</th><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${subject}</td></tr>
          </table>
          
          <p><b>Your Message:</b></p>
          <div class="message-box" style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 4px; margin: 20px 0; font-style: italic; color: #475569;">
            "${message.replace(/\n/g, '<br>')}"
          </div>
          
          <p>We aim to respond to all inquiries within 24 to 48 business hours. If your request is urgent, please call our support hotline directly.</p>
          
          <p>Warm regards,<br><b>The Client Relations Team</b><br>${companyMeta.name}</p>
          
          <div class="signature-box" style="margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #64748b; line-height: 1.6;">
            <p class="signature-title" style="margin: 0 0 6px 0; font-weight: 700; color: #0f172a; font-size: 13px;">${companyMeta.name}</p>
            <p style="margin: 0 0 4px 0;">Government License No: <b>${companyMeta.license}</b></p>
            <p style="margin: 0 0 4px 0;">Corporate HQ Address: ${companyMeta.address}</p>
            <p style="margin: 0 0 4px 0;">Official Telephone: ${companyMeta.phone}</p>
            <p style="margin: 0 0 4px 0;">Direct Email: <a href="mailto:${companyMeta.email}" style="color: #e31e24; text-decoration: none; font-weight: 600;">${companyMeta.email}</a></p>
          </div>
          `
        );

        // Professional Email to Admin (Notification)
        const adminHtml = getEmailTemplate(
          `${companyMeta.name} Portal`,
          "New Contact Form Inquiry",
          `
          <h2 class="section-title">New Inquiry Submitted</h2>
          <p>Hello Admin,</p>
          <p>A new visitor has submitted an inquiry through the contact form on your website. Here are the details:</p>
          
          <table class="info-table">
            <tr><th style="background-color: #f8fafc; color: #64748b; padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0;">Visitor Name</th><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${name}</td></tr>
            <tr><th style="background-color: #f8fafc; color: #64748b; padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0;">Email Address</th><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${email}</td></tr>
            <tr><th style="background-color: #f8fafc; color: #64748b; padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0;">Contact Phone</th><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${phone}</td></tr>
            <tr><th style="background-color: #f8fafc; color: #64748b; padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0;">Subject</th><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${subject}</td></tr>
            <tr><th style="background-color: #f8fafc; color: #64748b; padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0;">Submitted At</th><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${new Date().toLocaleString()}</td></tr>
          </table>
          
          <p><b>Message Content:</b></p>
          <div class="message-box" style="background-color: #f8fafc; border-left: 4px solid #ef4444; padding: 16px; border-radius: 4px; margin: 20px 0; color: #475569;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          
          <div class="button-container" style="text-align: center; margin: 30px 0 10px;">
            <a href="${hostUrl}/#/admin" class="button" style="background-color: #e31e24; color: #ffffff !important; padding: 12px 24px; text-decoration: none; font-weight: 600; border-radius: 6px; display: inline-block; font-size: 14px; box-shadow: 0 2px 4px rgba(227, 30, 36, 0.2);">Access Admin Panel to Reply</a>
          </div>
          `
        );

        // Fire SMTP tasks asynchronously in background so client receives response instantly
        transporter.sendMail({
          from: `"${companyMeta.name}" <${configStore.smtpUser}>`,
          to: email,
          replyTo: configStore.adminEmail,
          subject: `We have received your message: ${subject}`,
          html: visitorHtml
        }).then(() => {
          console.log(`[SMTP] Dispatched contact receipt confirmation to ${email}`);
        }).catch(err => {
          console.error(`[SMTP] Failed to send contact receipt confirmation to ${email}:`, err);
        });

        transporter.sendMail({
          from: `"${name}" <${configStore.smtpUser}>`,
          to: configStore.adminEmail,
          replyTo: email,
          subject: `[${companyMeta.name} Contact Form]: ${subject}`,
          html: adminHtml
        }).then(() => {
          console.log(`[SMTP] Dispatched admin notification for contact message from ${name}`);
        }).catch(err => {
          console.error(`[SMTP] Failed to send contact admin notification for ${name}:`, err);
        });

        return res.json({ 
          success: true, 
          message: "Message received, confirmation email dispatched to visitor, and admin notified successfully in the background.",
          record: savedMsg
        });
      } else {
        // Fallback simulation when SMTP is not configured yet
        console.log(`[SMTP Not Configured] Simulating Contact Form Submission:\n`, req.body);
        return res.json({ 
          success: true, 
          message: "Message received and stored securely in database logs (Configure Gmail SMTP in Admin Panel to receive real emails).",
          record: savedMsg
        });
      }
    } catch (err: any) {
      console.error("Error sending email via SMTP:", err);
      return res.status(500).json({ 
        success: false, 
        error: `Failed to dispatch email via SMTP: ${err.message}. Please verify your Gmail sender account and App Password configuration in the Admin Panel.` 
      });
    }
  });

  // GET CMS data - Dynamically builds and combines data from our specialized databases
  app.get("/api/cms", (req, res) => {
    try {
      let cmsData: any = {};
      if (fs.existsSync(cmsFilePath)) {
        const raw = fs.readFileSync(cmsFilePath, "utf-8");
        cmsData = JSON.parse(raw);
      }
      
      // Inject collections directly from our dynamic database files!
      cmsData.vacancies = db.getDemands();
      cmsData.notices = db.getNotices();
      cmsData.teamMembers = db.getTeam();
      cmsData.clients = db.getPartners();
      
      return res.json(cmsData);
    } catch (error: any) {
      console.error("Error reading CMS from database collections:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  // POST CMS data - Splits payload lists and commits them to individual database collections
  app.post("/api/cms", requireAdmin, (req, res) => {
    try {
      const payload = req.body;
      if (!payload || typeof payload !== "object") {
        return res.status(400).json({ success: false, error: "Invalid CMS payload" });
      }

      // Read current CMS data from disk to check for changes in teamPhotoUrl and chairman message avatarUrl
      let oldCmsData: any = {};
      try {
        if (fs.existsSync(cmsFilePath)) {
          oldCmsData = JSON.parse(fs.readFileSync(cmsFilePath, "utf-8"));
        }
      } catch (err) {
        console.warn("Could not read old cms_data.json:", err);
      }

      // Cleanup team group photo if changed or deleted
      if (oldCmsData.teamPhotoUrl && oldCmsData.teamPhotoUrl !== payload.teamPhotoUrl) {
        deleteLocalFile(oldCmsData.teamPhotoUrl);
      }

      // Cleanup chairman portrait photo if changed or deleted
      if (oldCmsData.chairmanMessage?.avatarUrl && oldCmsData.chairmanMessage.avatarUrl !== payload.chairmanMessage?.avatarUrl) {
        deleteLocalFile(oldCmsData.chairmanMessage.avatarUrl);
      }

      // Cleanup hero background image if changed or deleted
      if (oldCmsData.companyMeta?.heroBgUrl && oldCmsData.companyMeta.heroBgUrl !== payload.companyMeta?.heroBgUrl) {
        deleteLocalFile(oldCmsData.companyMeta.heroBgUrl);
      }

      // 1. Separate out the dynamic lists and write them to our specialized database tables!
      if (Array.isArray(payload.vacancies)) {
        const oldDemands = db.getDemands();
        cleanupUnreferencedFiles(oldDemands, payload.vacancies, (v) => v.demandLetterUrl);
        
        // Cascade delete applications and their attachments if the associated demand is deleted
        const newIds = new Set(payload.vacancies.map((v: any) => v.id));
        const deletedDemands = oldDemands.filter(d => !newIds.has(d.id));
        if (deletedDemands.length > 0) {
          const apps = db.getApplications();
          deletedDemands.forEach(deletedDemand => {
            const appsToDelete = apps.filter(a => a.selectedJobTitle === deletedDemand.title);
            appsToDelete.forEach(targetApp => {
              // Delete related files
              const fileFields = [targetApp.photoUrl, targetApp.passportUrl, targetApp.cvUrl];
              fileFields.forEach(fileUrl => {
                if (fileUrl) {
                  deleteLocalFile(fileUrl);
                }
              });
              // Delete the database record for this application
              db.deleteApplication(targetApp.id);
              console.log(`[CASCADE CLEANUP] Deleted application ${targetApp.id} for job "${targetApp.selectedJobTitle}"`);
            });
          });
        }

        db.saveDemands(payload.vacancies);
      }
      if (Array.isArray(payload.notices)) {
        const oldNotices = db.getNotices();
        cleanupUnreferencedFiles(oldNotices, payload.notices, (n: any) => n.imageUrl || n.fileUrl);
        db.saveNotices(payload.notices);
      }
      if (Array.isArray(payload.teamMembers)) {
        const oldTeam = db.getTeam();
        cleanupUnreferencedFiles(oldTeam, payload.teamMembers, (m) => m.photoUrl);
        db.saveTeam(payload.teamMembers);
      }
      if (Array.isArray(payload.clients)) {
        const oldPartners = db.getPartners();
        cleanupUnreferencedFiles(oldPartners, payload.clients, (p) => p.logoUrl);
        db.savePartners(payload.clients);
      }

      // 2. Remove the heavy database arrays from the config payload so that cms_data.json remains lightweight
      const staticPayload = { ...payload };
      delete staticPayload.vacancies;
      delete staticPayload.notices;
      delete staticPayload.teamMembers;
      delete staticPayload.clients;

      // Write static part to public folder
      fs.writeFileSync(cmsFilePath, JSON.stringify(staticPayload, null, 2), "utf-8");

      // Also copy to dist/cms_data.json if building or running in prod
      const distCmsPath = path.join(process.cwd(), "dist", "cms_data.json");
      const distDir = path.join(process.cwd(), "dist");
      if (fs.existsSync(distDir)) {
        fs.writeFileSync(distCmsPath, JSON.stringify(staticPayload, null, 2), "utf-8");
      }

      return res.json({ success: true, message: "CMS configurations and databases updated successfully on disk." });
    } catch (error: any) {
      console.error("Error saving CMS data:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  // PUBLIC: POST /api/applications - Candidate job applications submission
  app.post("/api/applications", async (req, res) => {
    try {
      const { 
        fullName, email, phone, permanentAddress, temporaryAddress, 
        passportNo, dateOfBirth, academicQualification, experience, 
        selectedJobTitle, photoBase64, photoName, passportBase64, 
        passportName, cvBase64, cvName 
      } = req.body;

      if (!fullName || !email || !phone || !selectedJobTitle) {
        return res.status(400).json({ success: false, error: "Required fields (Full Name, Email, Phone, Job Title) are missing." });
      }

      // Write files to attachments folders
      const photoUrl = saveBase64Attachment(photoBase64, photoName || "candidate_photo.jpg");
      const passportUrl = saveBase64Attachment(passportBase64, passportName || "passport_copy.pdf");
      const cvUrl = saveBase64Attachment(cvBase64, cvName || "resume_cv.pdf");

      // Save application database record
      const record = db.saveApplication({
        fullName,
        email,
        phone,
        permanentAddress: permanentAddress || "",
        temporaryAddress: temporaryAddress || "",
        passportNo: passportNo || "",
        dateOfBirth: dateOfBirth || "",
        academicQualification: academicQualification || "",
        experience: experience || "",
        selectedJobTitle,
        photoUrl,
        passportUrl,
        cvUrl
      });

      // If SMTP is configured, send emails!
      try {
        reloadAdminConfig();
        if (configStore.smtpUser && configStore.smtpPass) {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: configStore.smtpUser,
              pass: configStore.smtpPass
            }
          });

          // Dynamic Company Details setup
          const companyMeta = {
            name: "Asia Link Services (P.) Ltd.",
            license: "119/055/056",
            phone: "+977-1-4545084, 4545085",
            email: "info@asialink.com.np",
            address: "G.P.O. Box: 24707, Kathmandu, Nepal",
            website: "https://www.asialink.com.np"
          };

          try {
            if (fs.existsSync(cmsFilePath)) {
              const data = JSON.parse(fs.readFileSync(cmsFilePath, "utf-8"));
              if (data.companyMeta) {
                if (data.companyMeta.title) companyMeta.name = data.companyMeta.title;
                if (data.companyMeta.govLicenseNo) companyMeta.license = data.companyMeta.govLicenseNo;
              }
              if (data.contactInfo) {
                if (data.contactInfo.phone) companyMeta.phone = data.contactInfo.phone;
                if (data.contactInfo.email) companyMeta.email = data.contactInfo.email;
                if (data.contactInfo.address) companyMeta.address = data.contactInfo.address;
                if (data.contactInfo.website) companyMeta.website = data.contactInfo.website;
              }
            }
          } catch (err) {
            console.warn("Could not read company details from cms_data.json:", err);
          }

          const protocol = req.secure || req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
          const hostUrl = `${protocol}://${req.get("host")}`;

          // Lookup employer company details applied for
          let employerCompany = "";
          let jobLocation = "";
          let jobSalary = "";

          try {
            const demands = db.getDemands();
            const matchedVacancy = demands.find((v: any) => {
              if (v.title === selectedJobTitle) return true;
              if (v.subJobs && Array.isArray(v.subJobs)) {
                return v.subJobs.some((sub: any) => sub.jobTitle === selectedJobTitle);
              }
              return false;
            });
            if (matchedVacancy) {
              employerCompany = matchedVacancy.companyName || "";
              jobLocation = matchedVacancy.location || "";
              if (matchedVacancy.title === selectedJobTitle) {
                jobSalary = matchedVacancy.salary || "";
              } else if (matchedVacancy.subJobs && Array.isArray(matchedVacancy.subJobs)) {
                const sub = matchedVacancy.subJobs.find((s: any) => s.jobTitle === selectedJobTitle);
                if (sub) {
                  jobSalary = sub.salary || "";
                }
              }
            }
          } catch (err) {
            console.warn("Could not fetch employer company details from database:", err);
          }

          // 1. Send confirmation email to candidate
          const candidateHtml = getEmailTemplate(
            companyMeta.name,
            "Application Received Successfully",
            `
            <h2 class="section-title">Thank You For Your Application</h2>
            <p>Dear ${fullName},</p>
            <p>Thank you for submitting your application for the <b>${selectedJobTitle}</b> position. We have received your profile details and your documents have been successfully uploaded and cataloged in our sourcing database.</p>
            
            ${employerCompany ? `
            <div class="employer-box" style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin: 20px 0; font-size: 13px;">
              <p class="employer-title" style="margin: 0 0 8px 0; font-weight: bold; color: #166534; font-size: 14px;">Employer & Placement Details</p>
              <p class="employer-text" style="margin: 0 0 4px 0; color: #1e293b;"><b>Employer / Hiring Company:</b> ${employerCompany}</p>
              <p class="employer-text" style="margin: 0 0 4px 0; color: #1e293b;"><b>Job Location:</b> ${jobLocation || "As specified in demand letter"}</p>
              <p class="employer-text" style="margin: 0; color: #1e293b;"><b>Monthly Salary Offered:</b> ${jobSalary || "As per company standards"}</p>
            </div>
            ` : ""}

            <p>Below is a summary of the credentials you submitted:</p>
            <table class="info-table">
              <tr><th style="background-color: #f8fafc; color: #64748b; padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0;">Position Applied</th><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><b>${selectedJobTitle}</b></td></tr>
              <tr><th style="background-color: #f8fafc; color: #64748b; padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0;">Full Name</th><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${fullName}</td></tr>
              <tr><th style="background-color: #f8fafc; color: #64748b; padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0;">Email Address</th><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${email}</td></tr>
              <tr><th style="background-color: #f8fafc; color: #64748b; padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0;">Phone Number</th><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${phone}</td></tr>
              <tr><th style="background-color: #f8fafc; color: #64748b; padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0;">Passport Number</th><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${passportNo || "Not Specified"}</td></tr>
              <tr><th style="background-color: #f8fafc; color: #64748b; padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0;">Date of Birth</th><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${dateOfBirth || "Not Specified"}</td></tr>
            </table>
            
            <p><b>Your Qualifications:</b></p>
            <p style="background: #f8fafc; padding: 12px; border-radius: 6px; font-size: 14px; margin-bottom: 16px; border: 1px solid #e2e8f0;" class="message-box">
              ${academicQualification || "Not Specified"}
            </p>
            
            <p><b>Work Experience Summary:</b></p>
            <p style="background: #f8fafc; padding: 12px; border-radius: 6px; font-size: 14px; border: 1px solid #e2e8f0;" class="message-box">
              ${experience || "Not Specified"}
            </p>
            
            <p>Our recruitment team will review your application materials (including your CV and passport copies) against the criteria of the hiring employer. If your credentials match the vacancy requirements, we will contact you for a formal interview.</p>
            
            <p>If you have any questions, feel free to visit our <a href="${hostUrl}/#/contact" class="contact-link-inline" style="color: #e31e24; font-weight: 600; text-decoration: none;">Contact Page</a> to reach our recruitment desk directly.</p>

            <p>We wish you the absolute best of luck in your career search!</p>
            
            <div class="signature-box" style="margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #64748b; line-height: 1.6;">
              <p class="signature-title" style="margin: 0 0 6px 0; font-weight: 700; color: #0f172a; font-size: 13px;">${companyMeta.name}</p>
              <p style="margin: 0 0 4px 0;">Government License No: <b>${companyMeta.license}</b></p>
              <p style="margin: 0 0 4px 0;">Corporate HQ Address: ${companyMeta.address}</p>
              <p style="margin: 0 0 4px 0;">Official Telephone: ${companyMeta.phone}</p>
              <p style="margin: 0 0 4px 0;">Direct Email: <a href="mailto:${companyMeta.email}" style="color: #e31e24; text-decoration: none; font-weight: 600;">${companyMeta.email}</a></p>
              <p style="margin: 0;">Official Website: <a href="${companyMeta.website}" target="_blank" style="color: #e31e24; text-decoration: none; font-weight: 600;">${companyMeta.website}</a></p>
            </div>
            `
          );

          // 2. Send alert email to Admin with attachments
          const adminAppHtml = getEmailTemplate(
            `${companyMeta.name} Sourcing Alert`,
            "New Candidate Application Profile",
            `
            <h2 class="section-title">New Vacancy Application Received</h2>
            <p>Hello Admin,</p>
            <p>A new candidate has submitted an application for the <b>${selectedJobTitle}</b> position. The passport, photograph, and CV files have been processed, saved, and attached directly to this notification email.</p>
            
            ${employerCompany ? `
            <div class="employer-box" style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin: 20px 0; font-size: 13px;">
              <p class="employer-title" style="margin: 0 0 8px 0; font-weight: bold; color: #166534; font-size: 14px;">Applied Job / Employer Details</p>
              <p class="employer-text" style="margin: 0 0 4px 0; color: #1e293b;"><b>Employer / Hiring Company:</b> ${employerCompany}</p>
              <p class="employer-text" style="margin: 0 0 4px 0; color: #1e293b;"><b>Job Location:</b> ${jobLocation || "As specified"}</p>
              <p class="employer-text" style="margin: 0; color: #1e293b;"><b>Salary:</b> ${jobSalary || "As per demand specifications"}</p>
            </div>
            ` : ""}
 
            <p><b>Candidate Profile Summary:</b></p>
            <table class="info-table">
              <tr><th style="background-color: #f8fafc; color: #64748b; padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0;">Job Code / Position</th><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><b>${selectedJobTitle}</b></td></tr>
              <tr><th style="background-color: #f8fafc; color: #64748b; padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0;">Full Name</th><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${fullName}</td></tr>
              <tr><th style="background-color: #f8fafc; color: #64748b; padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0;">Email Address</th><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${email}</td></tr>
              <tr><th style="background-color: #f8fafc; color: #64748b; padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0;">Phone Number</th><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${phone}</td></tr>
              <tr><th style="background-color: #f8fafc; color: #64748b; padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0;">Passport No.</th><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${passportNo || "Not Specified"}</td></tr>
              <tr><th style="background-color: #f8fafc; color: #64748b; padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0;">Date of Birth</th><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${dateOfBirth || "Not Specified"}</td></tr>
              <tr><th style="background-color: #f8fafc; color: #64748b; padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0;">Permanent Address</th><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${permanentAddress || "Not Specified"}</td></tr>
              <tr><th style="background-color: #f8fafc; color: #64748b; padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0;">Temporary Address</th><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${temporaryAddress || "Not Specified"}</td></tr>
              <tr><th style="background-color: #f8fafc; color: #64748b; padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0;">Submitted At</th><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${new Date().toLocaleString()}</td></tr>
            </table>
            
            <p><b>Academic Credentials / Qualifications:</b></p>
            <p style="background: #f8fafc; padding: 12px; border-radius: 6px; font-size: 14px; margin-bottom: 16px; border: 1px solid #e2e8f0;" class="message-box">
              ${academicQualification || "Not Specified"}
            </p>
            
            <p><b>Experience Details / Custom Message:</b></p>
            <p style="background: #f8fafc; padding: 12px; border-radius: 6px; font-size: 14px; border: 1px solid #e2e8f0;" class="message-box">
              ${experience || "Not Specified"}
            </p>
            
            <p>Please find the uploaded files (Passport, Photo, CV) attached to this email.</p>
 
            <div class="signature-box" style="margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 12px; color: #64748b; line-height: 1.6;">
              <p class="signature-title" style="margin: 0 0 4px 0; font-weight: bold; color: #0f172a;">${companyMeta.name}</p>
              <p style="margin: 0 0 4px 0;">Government License No: ${companyMeta.license}</p>
              <p style="margin: 0;">HQ Address: ${companyMeta.address}</p>
            </div>
            `
          );

          const emailAttachments = [];
          if (photoUrl) {
            emailAttachments.push({
              filename: photoName || "candidate_photo.jpg",
              path: path.join(process.cwd(), photoUrl.substring(1))
            });
          }
          if (passportUrl) {
            emailAttachments.push({
              filename: passportName || "passport_copy.pdf",
              path: path.join(process.cwd(), passportUrl.substring(1))
            });
          }
          if (cvUrl) {
            emailAttachments.push({
              filename: cvName || "resume_cv.pdf",
              path: path.join(process.cwd(), cvUrl.substring(1))
            });
          }

          // Fire SMTP tasks asynchronously in background so client receives response instantly
          transporter.sendMail({
            from: `"${companyMeta.name}" <${configStore.smtpUser}>`,
            to: email,
            replyTo: configStore.adminEmail,
            subject: `Thank you for submitting your application for ${selectedJobTitle} - ${companyMeta.name}`,
            html: candidateHtml
          }).then(() => {
            console.log(`[SMTP] Dispatched application confirmation to candidate ${email}`);
          }).catch(err => {
            console.error(`[SMTP] Failed to send candidate confirmation email to ${email}:`, err);
          });

          transporter.sendMail({
            from: `"${companyMeta.name} Sourcing" <${configStore.smtpUser}>`,
            to: configStore.adminEmail,
            subject: `[New Candidate]: ${fullName} applied for ${selectedJobTitle}`,
            html: adminAppHtml,
            attachments: emailAttachments
          }).then(() => {
            console.log(`[SMTP] Dispatched admin recruitment notification for ${fullName}`);
          }).catch(err => {
            console.error(`[SMTP] Failed to send admin recruitment notification for ${fullName}:`, err);
          });
        }
      } catch (smtpErr: any) {
        console.error("Failed to setup SMTP transporter or dispatch emails in background:", smtpErr);
      }

      return res.json({ 
        success: true, 
        message: "Your comprehensive recruitment application has been stored securely and dispatched via email successfully.",
        record 
      });
    } catch (error: any) {
      console.error("Error processing candidate application:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  // ADMIN: GET /api/admin/applications - Retrieve all submitted job applications
  app.get("/api/admin/applications", requireAdmin, (req, res) => {
    try {
      const list = db.getApplications();
      return res.json({ success: true, applications: list });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  // ADMIN: DELETE /api/admin/applications/:id - Erase a job application
  app.delete("/api/admin/applications/:id", requireAdmin, (req, res) => {
    try {
      const { id } = req.params;
      const apps = db.getApplications();
      const targetApp = apps.find(a => a.id === id);
      
      if (targetApp) {
        // Delete related files
        const fileFields = [targetApp.photoUrl, targetApp.passportUrl, targetApp.cvUrl];
        fileFields.forEach(fileUrl => {
          if (fileUrl) {
            deleteLocalFile(fileUrl);
          }
        });
      }

      const success = db.deleteApplication(id);
      if (success) {
        return res.json({ success: true, message: "Job application profile and related files erased." });
      }
      return res.status(404).json({ success: false, error: "Application profile not found." });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  // ADMIN: GET /api/admin/messages - Retrieve contact form inquiries
  app.get("/api/admin/messages", requireAdmin, (req, res) => {
    try {
      const list = db.getContactMessages();
      return res.json({ success: true, messages: list });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  // ADMIN: DELETE /api/admin/messages/:id - Remove a contact inquiry
  app.delete("/api/admin/messages/:id", requireAdmin, (req, res) => {
    try {
      const { id } = req.params;
      const success = db.deleteContactMessage(id);
      if (success) {
        return res.json({ success: true, message: "Contact message log removed from database." });
      }
      return res.status(404).json({ success: false, error: "Message log not found." });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  // ADMIN: POST /api/admin/messages/:id/reply - Reply to a contact inquiry via email
  app.post("/api/admin/messages/:id/reply", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { replyMessage } = req.body;
      
      if (!replyMessage || !replyMessage.trim()) {
        return res.status(400).json({ success: false, error: "Reply message content cannot be empty." });
      }

      const msgs = db.getContactMessages();
      const targetMsg = msgs.find(m => m.id === id);
      if (!targetMsg) {
        return res.status(404).json({ success: false, error: "Original contact message not found." });
      }

      reloadAdminConfig();

      if (configStore.smtpUser && configStore.smtpPass) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: configStore.smtpUser,
            pass: configStore.smtpPass
          }
        });

        const replyHtml = getEmailTemplate(
          "Asia Link Services Support",
          "Official Message Reply",
          `
          <h2 class="section-title">Reply to Your Inquiry</h2>
          <p>Dear ${targetMsg.name},</p>
          <p>Thank you for contacting Asia Link Services. Our administration team has reviewed your message and compiled the official response below:</p>
          
          <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 20px; border-radius: 8px; font-size: 15px; color: #1e3a8a; line-height: 1.6; margin: 24px 0;">
            ${replyMessage.trim().replace(/\n/g, '<br>')}
          </div>
          
          <p>If you have any further questions or require additional support, please do not hesitate to contact us by replying directly to this email or calling our help desk.</p>
          
          <p>Warm regards,<br><b>Asia Link Support Operations Team</b><br>Asia Link Services</p>
          
          <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            <p style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: bold; letter-spacing: 0.05em; margin-bottom: 8px;">Original Inquiry Details:</p>
            <table class="info-table" style="font-size: 12px; margin: 0 0 12px 0;">
              <tr><th style="background-color: #f8fafc; color: #64748b; text-align: left; padding: 6px; border-bottom: 1px solid #e2e8f0; width: 25%; font-size: 11px;">Subject</th><td style="padding: 6px; border-bottom: 1px solid #e2e8f0;">${targetMsg.subject}</td></tr>
              <tr><th style="background-color: #f8fafc; color: #64748b; text-align: left; padding: 6px; border-bottom: 1px solid #e2e8f0; width: 25%; font-size: 11px;">Date Submitted</th><td style="padding: 6px; border-bottom: 1px solid #e2e8f0;">${new Date(targetMsg.submittedAt).toLocaleString()}</td></tr>
            </table>
            <div style="font-size: 12px; color: #64748b; font-style: italic; background-color: #f8fafc; padding: 12px; border-radius: 4px; border-left: 2px solid #cbd5e1;">
              "${targetMsg.message}"
            </div>
          </div>
          `
        );

        const mailOptions = {
          from: `"Asia Link Support" <${configStore.smtpUser}>`,
          to: targetMsg.email,
          replyTo: configStore.adminEmail,
          subject: `Re: ${targetMsg.subject}`,
          html: replyHtml
        };

        await transporter.sendMail(mailOptions);
        
        // Update database record to log the reply
        db.updateContactMessage(id, {
          replyText: replyMessage.trim(),
          repliedAt: new Date().toISOString()
        });

        return res.json({ 
          success: true, 
          message: "Reply sent successfully via Gmail SMTP and logged in the database.",
          record: { ...targetMsg, replyText: replyMessage.trim(), repliedAt: new Date().toISOString() }
        });
      } else {
        // Log in the database as local draft simulation if SMTP is not active
        db.updateContactMessage(id, {
          replyText: replyMessage.trim(),
          repliedAt: new Date().toISOString()
        });

        return res.json({ 
          success: true, 
          message: "Reply stored locally in database log. Note: configure SMTP credentials in Admin Panel to deliver actual emails.",
          record: { ...targetMsg, replyText: replyMessage.trim(), repliedAt: new Date().toISOString() }
        });
      }
    } catch (error: any) {
      console.error("Error sending admin message reply via SMTP:", error);
      return res.status(500).json({ success: false, error: `Failed to dispatch reply via SMTP: ${error.message}` });
    }
  });

  // POST /api/upload-pdf
  app.post("/api/upload-pdf", requireAdmin, (req, res) => {
    try {
      const { base64 } = req.body;
      if (!base64) {
        return res.status(400).json({ success: false, error: "Missing file base64 content" });
      }

      // Extract pure base64 database stream
      const cleanBase64 = base64.replace(/^data:application\/pdf;base64,/, "");
      const buffer = Buffer.from(cleanBase64, "base64");

      const pdfFilename = "Asia Link Services Company Profile.pdf";
      const targetPublicPath = path.join(publicDir, pdfFilename);
      const targetDistPath = path.join(process.cwd(), "dist", pdfFilename);

      // Overwrite public folder file (this automatically replaces/deletes previous file)
      fs.writeFileSync(targetPublicPath, buffer);

      // Copier to dist folder if in production state
      if (fs.existsSync(path.join(process.cwd(), "dist"))) {
        fs.writeFileSync(targetDistPath, buffer);
      }

      return res.json({ 
        success: true, 
        message: "Company Profile PDF updated on disk successfully.",
        path: `/${pdfFilename}`
      });
    } catch (error: any) {
      console.error("Error writing PDF:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  // POST /api/upload-herobg - Upload hero background image directly to public directory
  app.post("/api/upload-herobg", requireAdmin, (req, res) => {
    try {
      const { base64, filename } = req.body;
      if (!base64 || !filename) {
        return res.status(400).json({ success: false, error: "Missing metadata (base64/filename)" });
      }

      const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let buffer: Buffer;
      let extension = "jpg";
      
      if (matches && matches.length === 3) {
        buffer = Buffer.from(matches[2], "base64");
        const mime = matches[1];
        if (mime.includes("png")) extension = "png";
        else if (mime.includes("webp")) extension = "webp";
        else if (mime.includes("gif")) extension = "gif";
      } else {
        const cleanBase64 = base64.replace(/^data:image\/[a-zA-Z]+;base64,/, "");
        buffer = Buffer.from(cleanBase64, "base64");
        const extMatch = filename.match(/\.([a-zA-Z0-9]+)$/);
        if (extMatch) {
          extension = extMatch[1].toLowerCase();
        }
      }

      const bgFilename = `hero_background.${extension}`;
      const targetPublicPath = path.join(publicDir, bgFilename);
      const targetDistPath = path.join(process.cwd(), "dist", bgFilename);

      // Overwrite public folder file
      fs.writeFileSync(targetPublicPath, buffer);

      // Copy to dist folder if in production state
      if (fs.existsSync(path.join(process.cwd(), "dist"))) {
        fs.writeFileSync(targetDistPath, buffer);
      }

      return res.json({ 
        success: true, 
        message: "Hero background image updated on disk successfully.",
        path: `/${bgFilename}?t=${Date.now()}`
      });
    } catch (error: any) {
      console.error("Error writing hero background image:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  // POST /api/upload-image
  app.post("/api/upload-image", requireAdmin, (req, res) => {
    try {
      const { base64, filename, category } = req.body;
      if (!base64 || !filename) {
        return res.status(400).json({ success: false, error: "Missing metadata (base64/filename)" });
      }

      // Parse matches, e.g. data:image/png;base64,iVBOR...
      const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let buffer: Buffer;
      
      if (matches && matches.length === 3) {
        buffer = Buffer.from(matches[2], "base64");
      } else {
        const cleanBase64 = base64.replace(/^data:image\/[a-zA-Z]+;base64,/, "");
        buffer = Buffer.from(cleanBase64, "base64");
      }

      // Determine folder path based on category
      let targetSubdir = "uploads";
      let urlPrefix = "/uploads";

      if (category === "demand") {
        targetSubdir = "src/assets/demand";
        urlPrefix = "/src/assets/demand";
      } else if (category === "notice") {
        targetSubdir = "src/assets/notice";
        urlPrefix = "/src/assets/notice";
      } else if (category === "partner") {
        targetSubdir = "src/assets/partnerlogo";
        urlPrefix = "/src/assets/partnerlogo";
      } else if (category === "team") {
        targetSubdir = "src/assets/ourteam";
        urlPrefix = "/src/assets/ourteam";
      } else if (category === "visitoruploads") {
        targetSubdir = "src/assets/visitoruploads";
        urlPrefix = "/src/assets/visitoruploads";
      } else if (category === "chairman" || category === "ourteam" || category === "teamphoto" || category === "herobg") {
        targetSubdir = "src/assets/images";
        urlPrefix = "/src/assets/images";
      }

      const safeFilename = `${Date.now()}_${filename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const targetFolder = path.join(process.cwd(), targetSubdir);
      
      if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder, { recursive: true });
      }
      
      const targetFilePath = path.join(targetFolder, safeFilename);
      fs.writeFileSync(targetFilePath, buffer);

      // Also write in dist directory if in production state
      const distFolder = path.join(process.cwd(), "dist", targetSubdir);
      if (fs.existsSync(path.join(process.cwd(), "dist"))) {
        if (!fs.existsSync(distFolder)) {
          fs.mkdirSync(distFolder, { recursive: true });
        }
        fs.writeFileSync(path.join(distFolder, safeFilename), buffer);
      }

      return res.json({ 
        success: true, 
        path: `${urlPrefix}/${safeFilename}` 
      });
    } catch (error: any) {
      console.error("Error writing image:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  });


  // --- Vite & Production asset rendering ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    
    // Aggressive caching options for production static assets (1 year max-age, immutable)
    const cacheOptions = {
      maxAge: 31536000000, // 1 year in milliseconds
      immutable: true,
      etag: true,
      setHeaders: (res: any, filePath: string) => {
        // Prevent caching of index.html so updates are immediate
        if (filePath.endsWith(".html")) {
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        }
      }
    };

    app.use("/src/assets", express.static(path.join(process.cwd(), "src/assets"), cacheOptions));
    app.use(express.static(distPath, cacheOptions));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[MICRO-CMS FULLSTACK] Server running on http://localhost:${PORT}`);
  });
}

startServer();
