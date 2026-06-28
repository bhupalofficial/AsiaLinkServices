# Asia Link Services Pvt. Ltd. - Web Application Hub

A highly optimized, professional, and secure corporate web application and recruitment governance portal built for **Asia Link Services Pvt. Ltd.** (Government License: 119/055/056), a premier human resources and ethical worker placement agency based in Kathmandu, Nepal.

---

## 🚀 Key Features

- **Ethical Recruitment Sourcing Portal:** Detailed listings of verified, active international job demands categorized by sector, salary range, and company.
- **Interactive Sourced Candidates Directory (CMS Admin Panel):** Full admin console for reviewing applications, managing candidate statuses, and exporting candidate spreadsheets.
- **Compliance & Transparency Hub:** Dedicated workspace for official Ministry of Labor (Nepal DOFE) notices, RBA ethical sourcing declarations, and security guidelines.
- **Interactive Geographical Candidate Mapping:** Informative metrics mapping Nepalese province candidate traits with high-precision recruitment analytics.
- **Enterprise-Grade Security:** Locked-down administrative panel with instant lockout guards after consecutive failed credentials, brute-force mitigation, and secure SMTP mail controls.

---

## 🛠️ Local Development & Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` or `.env.local` file in the root directory and configure the variables described in `.env.example`:
```env
# Google Gemini API key for smart verification and AI processing
GEMINI_API_KEY="your_google_gemini_api_key"

# The hosted URL of this website
APP_URL="http://localhost:3000"

# Optional Master Administrator Credentials
ADMIN_EMAIL="admin@asialink.com"
ADMIN_PASSWORD="Admin119Password!"
```

### 3. Start the Development Server
```bash
npm run dev
```
The application will boot up and be accessible locally at `http://localhost:3000`.

---

## 📦 Production Build & Deployment

To prepare the application for a standalone, production-ready environment (e.g. Docker, Cloud Run, AWS, VPS):

### 1. Build the App
Compile both the React front-end application and the high-efficiency Express web server into optimization bundles:
```bash
npm run build
```
This script runs `vite build` for the front-end and bundles the TypeScript backend files using `esbuild` to generate a self-contained, high-performance CJS file in `dist/server.cjs`.

### 2. Run the Production Build
Start the optimized Node.js server directly:
```bash
npm run start
```
The server binds to port `3000` on interface `0.0.0.0`, routing asset requests and API calls automatically.

---

## 🔒 Security & Admin Panel SMTP Setup

The administration suite allows managing dynamic vacancy lists and reviewing candidate applications. It is located at the `/admin` route or reachable via the site footer.

- **Admin Email & Password:** Configurable via `.env` files. If not explicitly set, the platform uses standard default credentials.
- **Gmail SMTP Configuration:** In the Admin "Settings" tab, you can configure your own SMTP sender account and a secure Gmail **App Password** (generated via your Google Account's Security panel). Once configured, the system sends immediate notifications for candidate signups.
- **Spreadsheet/Print Exports:** Direct candidates data spreadsheet export (XLSX) or printer-friendly directory records reports include dynamic recruiter company headers automatically.
