# MediTeck - Smart Pharmacy Inventory Management System

<div align="center">
  <h3>🏥 A modern, full-stack pharmacy inventory management solution</h3>
  <p>Built with React, TypeScript, Tailwind CSS, and Supabase</p>
</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Running Locally](#running-locally)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 🎯 Overview

MediTeck is a comprehensive pharmacy inventory management system designed to help pharmacies efficiently manage their medicine stock, track expiry dates, handle sales, and receive automated alerts for low stock and expiring medicines.

---

## ✨ Features

### 🏪 Inventory Management
- Add, edit, and delete medicines
- Track batch numbers and expiry dates
- Barcode scanning support
- Minimum threshold alerts

### 💰 Sales & Billing
- Create sales transactions
- Customer information tracking
- Sales history and reports
- Revenue analytics

### 🔔 Smart Alerts
- Low stock notifications
- Expiry date warnings
- Email/SMS notification support
- Customizable alert settings

### 📊 Analytics & Reports
- Sales trend charts
- Inventory analytics
- Audit logs
- Exportable reports

### 👥 User Management
- Role-based access (Admin/User)
- Secure authentication
- User profiles
- Activity tracking

### 🤖 AI Assistant (MediBot)
- Medicine information lookup
- Inventory queries
- Smart suggestions

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Library |
| TypeScript | Type Safety |
| Vite | Build Tool & Dev Server |
| Tailwind CSS | Styling |
| shadcn/ui | UI Components |
| React Router DOM | Client-side Routing |
| TanStack Query | Server State Management |
| React Hook Form | Form Handling |
| Zod | Schema Validation |
| Recharts | Charts & Analytics |
| Lucide React | Icons |

### Backend (Lovable Cloud / Supabase)
| Technology | Purpose |
|------------|---------|
| PostgreSQL | Database |
| Supabase Auth | Authentication |
| Edge Functions | Serverless Functions |
| Row Level Security | Data Protection |

### Additional Libraries
| Library | Purpose |
|---------|---------|
| date-fns | Date Formatting |
| @zxing/library | Barcode Scanning |
| Sonner | Toast Notifications |

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** or **bun** - Package manager
- **Git** - [Download](https://git-scm.com/)
- **VS Code** (recommended) - [Download](https://code.visualstudio.com/)

### Recommended VS Code Extensions
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/mediteck.git
cd mediteck
```

### Step 2: Install Dependencies

Using npm:
```bash
npm install
```

Using bun:
```bash
bun install
```

### Step 3: Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration (Required)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

> ⚠️ **Note**: Get these values from your Lovable project settings or Supabase dashboard.

### Step 4: Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:8080`

---

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | ✅ | Supabase anonymous/public key |
| `VITE_SUPABASE_PROJECT_ID` | ✅ | Supabase project ID |

> ⚠️ **Important**: Never commit your `.env` file to version control!

---

## 📁 Project Structure

```
mediteck/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── dashboard/      # Dashboard-specific components
│   │   ├── home/           # Landing page components
│   │   └── layout/         # Layout components (Header, Footer)
│   ├── contexts/           # React contexts (Auth)
│   ├── hooks/              # Custom React hooks
│   │   ├── useAlerts.ts
│   │   ├── useAuditLogs.ts
│   │   ├── useMedicines.ts
│   │   ├── useNotificationSettings.ts
│   │   └── useSales.ts
│   ├── integrations/       # External integrations
│   │   └── supabase/       # Supabase client & types
│   ├── lib/                # Utility functions
│   ├── pages/              # Page components
│   │   ├── admin/          # Admin-only pages
│   │   └── dashboard/      # Dashboard pages
│   ├── App.tsx             # Main App component
│   ├── App.css             # Global styles
│   ├── index.css           # Tailwind directives
│   └── main.tsx            # Entry point
├── supabase/
│   ├── functions/          # Edge Functions
│   │   ├── check-alerts-cron/
│   │   ├── daily-alert-report/
│   │   ├── medicine-ai-chat/
│   │   ├── send-alert-notifications/
│   │   └── send-contact-email/
│   └── config.toml         # Supabase configuration
├── index.html              # HTML template
├── tailwind.config.ts      # Tailwind configuration
├── vite.config.ts          # Vite configuration
└── package.json            # Dependencies
```

---

## 🗄 Database Schema

### Tables Overview

| Table | Description |
|-------|-------------|
| `medicines` | Medicine inventory data |
| `sales` | Sales transactions |
| `sale_items` | Individual items in sales |
| `alerts` | System alerts (low stock, expiry) |
| `profiles` | User profiles and preferences |
| `user_roles` | User role assignments |
| `audit_logs` | Activity tracking |
| `inventory_logs` | Inventory change history |
| `notification_logs` | Notification delivery logs |

### Key Relationships

```
medicines ─────┬───── sale_items ───── sales
               │
               ├───── alerts
               │
               └───── inventory_logs

profiles ───── user_roles

alerts ───── notification_logs
```

---

## 🏃 Running Locally

### Development Mode

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

---

## 🌐 Deployment

### Deploy via Lovable

1. Click the **Publish** button in Lovable editor
2. Your app will be deployed to a `.lovable.app` subdomain
3. Optionally connect a custom domain in Settings

### Deploy to Other Platforms

The project can be deployed to any static hosting platform:

#### Vercel
```bash
npm run build
vercel deploy
```

#### Netlify
```bash
npm run build
netlify deploy --prod
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 📞 Support

For support, open an issue in the repository.

---

<div align="center">
  <p>Made with ❤️ by the MediTeck Team</p>
</div>
