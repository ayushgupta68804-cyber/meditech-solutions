# 🏥 MediTeck - Complete Medical Store Management System
## Bolt.new MERN Stack Prompt — Copy & Paste Ready

---

## 🎯 PROJECT OVERVIEW

Build a **complete, production-ready Medical Store Management Web Application** called **MediTeck** using the MERN Stack (MongoDB, Express.js, React.js, Node.js). This is a full-featured pharmacy management system with **two user roles: Admin and Staff (User)**.

The system manages medicine inventory, billing/POS, barcode scanning, automated alerts, sales analytics, audit logging, AI chatbot, and email/SMS notifications.

**Currency:** Indian Rupees (₹)  
**Languages:** English + Hindi (for AI chatbot)

---

## 🛠️ TECHNOLOGY STACK

### Frontend:
- React.js 18+ with Vite
- TypeScript (strict mode)
- Tailwind CSS for styling
- shadcn/ui component library (Button, Card, Dialog, Table, Tabs, etc.)
- React Router DOM v6 for routing
- React Hook Form + Zod for form validation
- Recharts for analytics charts (AreaChart, PieChart, BarChart)
- @tanstack/react-query for data fetching & caching
- Lucide React for icons
- Sonner for toast notifications
- @zxing/library for barcode scanning
- date-fns for date formatting
- cmdk for command palette/search

### Backend:
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication (access token + refresh token)
- bcrypt for password hashing (10+ salt rounds)
- node-cron for scheduled alert jobs
- Nodemailer / Resend for email notifications
- Twilio SDK for SMS notifications (optional)
- Helmet.js for security headers
- cors, express-rate-limit, express-validator

---

## 🎨 UI DESIGN SYSTEM

### Color Scheme (HSL-based, Medical Green Theme):
```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 15%;
  --card: 0 0% 100%;
  --card-foreground: 0 0% 15%;
  --primary: 142 70% 40%;        /* Medical Green */
  --primary-foreground: 0 0% 100%;
  --secondary: 142 20% 96%;
  --secondary-foreground: 142 70% 40%;
  --muted: 0 0% 96%;
  --muted-foreground: 0 0% 45%;
  --accent: 160 60% 35%;          /* Teal */
  --accent-foreground: 0 0% 100%;
  --destructive: 0 84% 60%;       /* Red for errors */
  --destructive-foreground: 0 0% 100%;
  --border: 0 0% 85%;
  --success: 142 70% 35%;
  --warning: 38 92% 50%;          /* Orange for warnings */
  --radius: 0.5rem;
}
```

### Gradient:
```css
.bg-gradient-primary {
  background: linear-gradient(135deg, hsl(142 70% 40%) 0%, hsl(160 60% 35%) 100%);
}
```

### Layout:
- Modern card-based dashboard layout
- Responsive sidebar navigation (collapsible on mobile with hamburger menu)
- Data tables with search, filter, sort, pagination
- Modal dialogs for forms (Add/Edit)
- Toast notifications for all user feedback
- Loading states and empty states

### Font: Arial / Helvetica / sans-serif (system fonts)

---

## 📊 DATABASE SCHEMA (MongoDB Collections)

### 1. Users Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, lowercase),
  mobile: String,
  password: String (hashed with bcrypt, required),
  role: String (enum: ['admin', 'user'], default: 'user'),
  notify_email: Boolean (default: true),
  notify_sms: Boolean (default: false),
  notify_low_stock: Boolean (default: true),
  notify_expiry: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### 2. Medicines Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String,
  batch_no: String,
  barcode: String (unique, sparse),
  mfg_date: Date,
  expiry_date: Date,
  quantity: Number (default: 0),
  min_threshold: Number (default: 5),
  price: Number (default: 0),
  seller_info: String,
  created_by: ObjectId (ref: 'User'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### 3. Sales Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: 'User', required),
  customer_name: String,
  customer_contact: String,
  total_amount: Number (default: 0),
  createdAt: Date (auto)
}
```

### 4. Sale Items Collection
```javascript
{
  _id: ObjectId,
  sale_id: ObjectId (ref: 'Sale', required),
  medicine_id: ObjectId (ref: 'Medicine', required),
  quantity: Number (required),
  unit_price: Number (required),
  createdAt: Date (auto)
}
```

### 5. Alerts Collection
```javascript
{
  _id: ObjectId,
  medicine_id: ObjectId (ref: 'Medicine'),
  type: String (enum: ['low_stock', 'out_of_stock', 'expiry', 'expired']),
  message: String (required),
  is_read: Boolean (default: false),
  createdAt: Date (auto)
}
```

### 6. Audit Logs Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: 'User'),
  action: String (required),
  meta_json: Object,
  createdAt: Date (auto)
}
```

### 7. Inventory Logs Collection
```javascript
{
  _id: ObjectId,
  medicine_id: ObjectId (ref: 'Medicine'),
  change_amount: Number (required),
  reason: String,
  createdAt: Date (auto)
}
```

### 8. Notification Logs Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: 'User'),
  alert_id: ObjectId (ref: 'Alert'),
  notification_type: String (enum: ['email', 'sms']),
  recipient: String (required),
  subject: String,
  message: String (required),
  status: String (default: 'pending'),
  error_message: String,
  createdAt: Date (auto)
}
```

---

## 📁 PROJECT STRUCTURE

```
mediteck/
├── client/                          # React Frontend (Vite)
│   ├── public/
│   │   ├── favicon.ico
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                  # shadcn/ui components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── switch.tsx
│   │   │   │   ├── textarea.tsx
│   │   │   │   ├── popover.tsx
│   │   │   │   ├── command.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── scroll-area.tsx
│   │   │   │   ├── progress.tsx
│   │   │   │   ├── separator.tsx
│   │   │   │   ├── skeleton.tsx
│   │   │   │   └── tooltip.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx       # Public page header with nav
│   │   │   │   └── Footer.tsx       # Public page footer
│   │   │   ├── dashboard/
│   │   │   │   ├── DashboardLayout.tsx  # Sidebar + topbar layout
│   │   │   │   ├── SalesTrendChart.tsx  # Recharts AreaChart
│   │   │   │   ├── InventoryAnalyticsChart.tsx  # Pie + Bar charts
│   │   │   │   └── DateRangePicker.tsx  # Date range selector
│   │   │   ├── home/
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── FeaturesSection.tsx
│   │   │   │   └── CTASection.tsx
│   │   │   ├── BarcodeScanner.tsx    # Camera barcode scanner
│   │   │   ├── MediBot.tsx           # AI Chatbot floating widget
│   │   │   ├── NavLink.tsx
│   │   │   └── ProtectedRoute.tsx    # Auth + role guard
│   │   ├── pages/
│   │   │   ├── Index.tsx             # Landing page (Hero + Features + CTA)
│   │   │   ├── Features.tsx          # Features listing page
│   │   │   ├── About.tsx             # About page
│   │   │   ├── Contact.tsx           # Contact page
│   │   │   ├── Auth.tsx              # Staff login/register
│   │   │   ├── AdminAuth.tsx         # Admin login
│   │   │   ├── NotFound.tsx          # 404 page
│   │   │   ├── dashboard/
│   │   │   │   ├── UserDashboard.tsx           # Staff dashboard
│   │   │   │   ├── MedicinesPage.tsx           # CRUD medicines table
│   │   │   │   ├── BillingPage.tsx             # POS / billing system
│   │   │   │   ├── AlertsPage.tsx              # View & dismiss alerts
│   │   │   │   └── NotificationSettingsPage.tsx # Notification prefs
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.tsx   # Admin analytics dashboard
│   │   │       ├── SalesPage.tsx        # Sales overview + filtering
│   │   │       ├── ReportsPage.tsx      # Reports with CSV export
│   │   │       └── AuditLogsPage.tsx    # System audit trail
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx       # Auth state, login, register, logout
│   │   ├── hooks/
│   │   │   ├── useMedicines.ts       # Medicine CRUD hooks
│   │   │   ├── useSales.ts           # Sales data hooks
│   │   │   ├── useAlerts.ts          # Alerts hooks
│   │   │   ├── useAuditLogs.ts       # Audit logs hook
│   │   │   └── useNotificationSettings.ts  # Notification prefs hook
│   │   ├── lib/
│   │   │   └── utils.ts              # cn() utility
│   │   ├── App.tsx                   # Router setup
│   │   ├── main.tsx
│   │   └── index.css                 # Tailwind + CSS variables
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── server/                          # Express Backend
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── models/
│   │   ├── User.js
│   │   ├── Medicine.js
│   │   ├── Sale.js
│   │   ├── SaleItem.js
│   │   ├── Alert.js
│   │   ├── AuditLog.js
│   │   ├── InventoryLog.js
│   │   └── NotificationLog.js
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification middleware
│   │   ├── admin.js                 # Admin role check middleware
│   │   ├── validate.js              # Input validation middleware
│   │   └── rateLimiter.js           # Rate limiting
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── medicineController.js
│   │   ├── salesController.js
│   │   ├── alertController.js
│   │   ├── reportController.js
│   │   ├── auditLogController.js
│   │   └── notificationController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── medicines.js
│   │   ├── sales.js
│   │   ├── alerts.js
│   │   ├── reports.js
│   │   ├── auditLogs.js
│   │   └── notifications.js
│   ├── cron/
│   │   ├── checkAlerts.js           # Every 6 hours: scan for alerts
│   │   └── dailyReport.js           # Daily 8 AM: send alert digest
│   ├── services/
│   │   ├── emailService.js          # Resend/Nodemailer
│   │   └── smsService.js            # Twilio SMS
│   ├── utils/
│   │   └── helpers.js
│   ├── app.js                       # Express app setup
│   ├── server.js                    # Entry point
│   └── package.json
│
├── .env.example
└── README.md
```

---

## 🔐 AUTHENTICATION SYSTEM

### Login Pages:
1. **`/login`** — Staff/User login + registration (email + password)
2. **`/admin-login`** — Admin login only (no registration)

### Auth Flow:
- User registers with: name, email, password, mobile (optional)
- Password hashed with bcrypt (10+ salt rounds)
- JWT access token generated on login (stored in localStorage or httpOnly cookie)
- AuthContext wraps entire app, provides: user, role, isAdmin, signIn, signUp, signOut
- Mobile login supported: user can login with mobile number instead of email (system looks up email from profile)

### Protected Routes:
```
ProtectedRoute component checks:
  - Is user authenticated? → If not, redirect to /login
  - Does route require admin? → Check role === 'admin', else redirect
```

### Role-Based Access:
- **Admin**: Full access — dashboard analytics, all medicines, sales, reports, audit logs, alerts
- **Staff/User**: Limited access — dashboard stats, medicines (view/add/edit), billing, alerts, notification settings

---

## 📄 PAGES & FEATURES (DETAILED)

---

### 🏠 PUBLIC PAGES

#### 1. Landing Page (`/`)
- Header with navigation: Home, Features, About, Contact, Login, Admin Login
- **Hero Section**: Title "Medical Store Management System", description, "Get Started" + "View Features" buttons, stats box (500+ Stores, 50K+ Medicines, 99.9% Uptime)
- **Features Section**: 8 feature cards in 4-column grid — Medicine Inventory, Barcode Scanning, Billing System, Smart Alerts, Sales Analytics, Secure Access, Multi-User Support, Audit Logs
- **CTA Section**: Call to action with login button
- Footer with copyright

#### 2. Features Page (`/features`)
#### 3. About Page (`/about`)
#### 4. Contact Page (`/contact`) — contact form that sends email

---

### 👤 STAFF/USER DASHBOARD PAGES

#### 5. Staff Dashboard (`/dashboard`)
- Welcome message
- **4 Stats Cards**: Total Medicines, Low Stock Items, Today's Sales (₹ amount), Active Alerts
- **Low Stock Alert Card**: Shows top 5 low stock medicines with quantities
- **Expiring Soon Card**: Shows top 5 medicines expiring within 30 days

#### 6. Medicines Page (`/dashboard/medicines`)
- **Search bar**: Filter by name, batch no, or barcode (real-time)
- **Add Medicine button**: Opens dialog form with fields:
  - Name (required), Batch No, Barcode, Quantity, Price (₹), Min Threshold (default: 5), MFG Date, Expiry Date, Seller Info, Description
- **Medicine Table**: Columns — Name, Batch, Qty, Price, Expiry Date, Status (badges), Actions (Edit/Delete)
- **Status Badges**: "Expired" (red), "Expiring Soon" (yellow, ≤30 days), "Low Stock" (red, below threshold)
- **Edit**: Pre-fills form in dialog
- **Delete**: Confirmation prompt before deletion

#### 7. Billing Page (`/dashboard/billing`) ⭐ KEY FEATURE
- **3-Column Layout**: Left (barcode + search + cart), Right (checkout summary)
- **Barcode Scanner Section**:
  - Manual barcode text input + "Add" button
  - "Scan" button → Opens camera-based barcode scanner (fullscreen overlay)
  - Uses `@zxing/library` BrowserMultiFormatReader
  - Auto-detects back camera, supports camera switching
  - On scan → auto-fetches medicine, adds to cart
- **Medicine Search**: Command palette (cmdk) popover — search by name or barcode, shows stock + price, click to add
- **Cart Table**: Medicine name, Price, Quantity (+ / - buttons with stock validation), Subtotal, Remove button
- **Checkout Panel** (sticky):
  - Customer Name (optional), Customer Contact (optional)
  - Grand Total (₹)
  - "Complete Sale" button
- **Sale Processing**:
  - Validates stock availability for each item
  - Creates sale record + sale items
  - **Atomically decrements medicine quantity** (prevents race conditions)
  - Creates audit log entry
  - Clears cart on success
  - Toast notification for success/error

#### 8. Alerts Page (`/dashboard/alerts`)
- Shows all unread alerts
- **Color-coded cards**: 
  - Low Stock → yellow left border + warning icon
  - Expiry → red left border + calendar icon
  - Out of Stock → red left border + alert triangle icon
- Each alert shows: message, medicine name, timestamp
- **"Dismiss" button** marks alert as read
- Empty state: "No Active Alerts - All systems running smoothly!"

#### 9. Notification Settings (`/dashboard/notifications`)
- **Notification Channels**:
  - Email toggle (ON/OFF)
  - SMS toggle (ON/OFF) — shows mobile number input when enabled
- **Alert Types**:
  - Low Stock Alerts toggle
  - Expiry Alerts toggle
- **Test Notifications**: "Send Test Alert" button
- **Info Box**: Explains instant alerts vs daily reports

---

### 👨‍💼 ADMIN DASHBOARD PAGES

#### 10. Admin Dashboard (`/admin`) ⭐ KEY FEATURE
- **Date Range Picker**: Default last 14 days, filters all metrics & charts
- **6 Stats Cards**: Total Medicines, Period Sales (₹), Inventory Value (₹), Low Stock Items, Expiring Soon, Period Transactions
- **Sales Trend Chart**: Recharts AreaChart showing daily sales over selected period
- **Inventory Analytics Chart**: Pie chart (stock status distribution) + Bar chart (top medicines by value)
- **Recent Activity Feed**: Latest 10 audit log entries with timestamps

#### 11. Sales Page (`/admin/sales`)
- **3 Summary Cards**: Today's Sales, This Week, This Month (₹ amounts + transaction counts)
- **Sales Trend Chart**: Last 14 days area chart
- **Date Filter**: From/To date inputs with filtered count display
- **Sales History Table**: Date, Customer, Contact, Amount (₹)

#### 12. Reports Page (`/admin/reports`) ⭐ KEY FEATURE
- **Charts Row**: Sales Trend (30 days) + Inventory Analytics (side by side)
- **Tabbed Reports**:
  - **Low Stock Tab**: Table with Name, Batch, Current Qty, Threshold, Shortage + **Export CSV** button
  - **Expiring Tab**: Table with Name, Batch, Expiry Date, Days Left (color-coded: ≤7 red, else yellow), Quantity + **Export CSV**
  - **Inventory Tab**: Full inventory table with Name, Batch, Quantity, Price, Value (Qty × Price) + **Export CSV**
  - **Sales Tab**: Last 30 days sales summary (total ₹ + transaction count) + sales table + **Export CSV**
- **CSV Export Function**: Generates and downloads CSV file with timestamped filename

#### 13. Audit Logs Page (`/admin/audit-logs`)
- **Activity History Table**: Timestamp, Action (with color-coded icons), User, Details (JSON meta truncated)
- Action colors: Green for add/create, Red for delete, Yellow for update, Blue for others
- Action icons: Package for medicine, Receipt for sale, User for user, Settings for others
- Shows last 100 logs

---

## 🤖 AI CHATBOT — MediBot ⭐ KEY FEATURE

### UI:
- **Floating button**: Fixed bottom-right corner, round, with Bot icon
- **Chat window**: 380px wide card, slides in on click
- **Header**: MediBot name + sparkle icon + close button
- **Message area**: 350px scrollable, user messages (right, primary color bg) + bot messages (left, muted bg)
- **Input**: Text input + send button, disabled when not authenticated
- **Initial state**: Welcome message with quick suggestion buttons (Paracetamol, Azithromycin, Metformin)
- **Auth gate**: Shows "Login Required" message if not authenticated

### AI Backend:
- **POST /api/ai/chat** endpoint
- Requires JWT authentication
- Accepts `{ messages: [{role, content}] }` array
- **Streaming SSE response** (Server-Sent Events)
- Rate limits: max 50 messages per conversation, max 5000 chars per message

### System Prompt (IMPORTANT — Use this exact prompt):
```
You are MediBot, an expert AI health assistant for MediTeck pharmacy. Your role is to provide helpful information about medicines AND recommend suitable exercises for health conditions.

When a user asks about a medicine, provide:
1. **Generic Name & Brand Names**
2. **Uses** - What conditions it treats
3. **Dosage** - Typical dosage instructions
4. **Side Effects** - Common side effects
5. **Precautions** - Important warnings and drug interactions
6. **Storage** - How to store properly

When a user mentions a health issue or asks for exercises, provide:
1. **Recommended Exercises** - Specific exercises for their condition
2. **How to Do It** - Step-by-step instructions
3. **Duration & Frequency** - How long and how often
4. **Benefits** - How exercises help
5. **Precautions** - When to avoid or modify
6. **Yoga/Stretching** - Relevant yoga poses

Common conditions and exercises:
- Back Pain: Cat-cow stretch, bird-dog, pelvic tilts, walking
- Diabetes: Walking, cycling, swimming, strength training
- Hypertension: Brisk walking, cycling, swimming, yoga breathing
- Joint Pain: Water aerobics, gentle stretching, tai chi
- Stress/Anxiety: Deep breathing, yoga, walking, meditation
- Obesity: Cardio exercises, strength training, HIIT
- Heart Health: Moderate cardio, walking, swimming
- Migraine: Neck stretches, relaxation exercises, yoga

Always include disclaimers:
- For medicines: "This information is for educational purposes only. Always consult a doctor or pharmacist."
- For exercises: "Consult your doctor before starting any new exercise routine."

Respond in the same language the user uses (Hindi or English).
```

### LLM Options (choose one):
- OpenAI GPT-4 / GPT-3.5 Turbo API
- Google Gemini 2.5 Flash API
- Any other LLM with streaming support

---

## ⏰ AUTOMATED ALERT SYSTEM (CRON JOBS)

### 1. Check Alerts CRON — Runs every 6 hours
```
Logic:
1. Fetch all medicines from database
2. For each medicine:
   a. If quantity === 0 → Create "out_of_stock" alert (if not already exists)
   b. If quantity <= min_threshold → Create "low_stock" alert (if not already exists)
   c. If expiry_date within 30 days → Create "expiry" alert (if not already exists)
3. Duplicate prevention: Check if unread alert of same type for same medicine already exists
4. After creating alerts → trigger instant notification sending
```

### 2. Daily Alert Report — Runs at 8:00 AM daily
```
Logic:
1. Compile all unread alerts
2. Group by type (low_stock, expiry, out_of_stock)
3. Send consolidated email to all users with notify_email = true
4. Send SMS summary to users with notify_sms = true and valid mobile
5. Log all sent notifications in notification_logs
```

### 3. Send Alert Notifications — Triggered on new alert creation
```
Logic:
1. Receive alert IDs
2. Fetch users with matching notification preferences
3. Send email via Resend/Nodemailer
4. Send SMS via Twilio (if configured)
5. Log results (success/failure) in notification_logs
```

---

## 🔒 SECURITY REQUIREMENTS

1. **Input Validation**: All inputs validated server-side with express-validator
2. **NoSQL Injection Prevention**: Use Mongoose parameterized queries, sanitize inputs
3. **XSS Prevention**: Sanitize outputs, React's built-in escaping
4. **CSRF Protection**: Use CSRF tokens for state-changing requests
5. **Rate Limiting**: Login attempts limited to 5 per 15 minutes
6. **Password Policy**: Min 8 characters, require uppercase + number
7. **Secure Headers**: Helmet.js middleware on Express
8. **HTTPS**: Required in production
9. **Atomic Operations**: Use MongoDB `$inc` operator for stock decrement (prevent race conditions)
10. **JWT Expiry**: Access token 1 hour, refresh token 7 days
11. **Auth Middleware**: All API routes (except login/register) require valid JWT

---

## 🔌 API ENDPOINTS

### Auth Routes
```
POST   /api/auth/register          - Register new user (name, email, password, mobile?)
POST   /api/auth/login             - User login (email/mobile + password) → returns JWT
POST   /api/auth/admin-login       - Admin login
POST   /api/auth/logout            - Logout (invalidate token)
GET    /api/auth/me                - Get current user profile
PUT    /api/auth/profile           - Update profile
PUT    /api/auth/notification-settings - Update notification preferences
```

### Medicine Routes (Auth required)
```
GET    /api/medicines              - Get all medicines (with ?search=, ?filter=, ?barcode=)
GET    /api/medicines/:id          - Get medicine by ID
POST   /api/medicines              - Create medicine (admin only)
PUT    /api/medicines/:id          - Update medicine (admin only)
DELETE /api/medicines/:id          - Delete medicine (admin only)
```

### Sales Routes (Auth required)
```
GET    /api/sales                  - Get all sales (admin: all, user: own)
GET    /api/sales/:id              - Get sale with items
POST   /api/sales                  - Create sale (with items array, auto stock deduction)
```

### Alert Routes (Auth required)
```
GET    /api/alerts                 - Get all unread alerts
PATCH  /api/alerts/:id/read       - Mark alert as read (dismiss)
```

### Report Routes (Admin only)
```
GET    /api/reports/sales          - Sales report (with ?from=, ?to= date range)
GET    /api/reports/inventory      - Full inventory report
GET    /api/reports/low-stock      - Low stock medicines
GET    /api/reports/expiring       - Expiring medicines (within 30 days)
GET    /api/reports/export/csv     - Export any report as CSV
```

### Audit Log Routes (Admin only)
```
GET    /api/audit-logs             - Get audit logs (with ?limit=, ?action=, ?user=)
```

### Notification Routes (Auth required)
```
POST   /api/notifications/test     - Send test notification
GET    /api/notifications/logs     - Get notification history
```

### AI Chat Routes (Auth required)
```
POST   /api/ai/chat               - Send message to MediBot (streaming SSE response)
```

---

## 🎛️ DASHBOARD LAYOUT (DashboardLayout Component)

### Structure:
- **Sidebar** (left, 64px wide, fixed): Logo + role badge + navigation links + user info + sign out
- **Top bar**: Hamburger menu (mobile), bell icon with alert count badge
- **Main content**: Scrollable page area
- **MediBot**: Floating chat widget

### Staff Navigation:
1. Dashboard (LayoutDashboard icon)
2. Medicines (Package icon)
3. Billing (Receipt icon)
4. Alerts (Bell icon) — shows unread count badge
5. Notifications (Settings icon)

### Admin Navigation:
1. Dashboard (LayoutDashboard icon)
2. Medicines (Package icon)
3. Sales (BarChart3 icon)
4. Reports (FileText icon)
5. Audit Logs (Shield icon)
6. Alerts (Bell icon) — shows unread count badge

### Role Badge:
- Admin: Red badge with Shield icon
- Staff: Green badge with Users icon

---

## 📋 SAMPLE SEED DATA

### Admin User (pre-seed):
```javascript
{
  name: "Admin User",
  email: "admin@mediteck.com",
  password: "Admin@123",  // hash with bcrypt before inserting
  role: "admin"
}
```

### Sample Medicines:
```javascript
[
  { name: "Paracetamol 500mg", batch_no: "PCM001", barcode: "8901234567890", quantity: 100, price: 25, min_threshold: 10, expiry_date: "2026-12-31", mfg_date: "2024-01-15", seller_info: "Sun Pharma" },
  { name: "Amoxicillin 250mg", batch_no: "AMX002", barcode: "8901234567891", quantity: 3, price: 85, min_threshold: 5, expiry_date: "2025-06-15", seller_info: "Cipla" },
  { name: "Aspirin 75mg", batch_no: "ASP003", barcode: "8901234567892", quantity: 0, price: 15, min_threshold: 5, expiry_date: "2025-03-01", seller_info: "Dr. Reddy's" },
  { name: "Metformin 500mg", batch_no: "MET004", barcode: "8901234567893", quantity: 200, price: 30, min_threshold: 15, expiry_date: "2027-06-30", seller_info: "Lupin" },
  { name: "Cetirizine 10mg", batch_no: "CET005", barcode: "8901234567894", quantity: 50, price: 12, min_threshold: 5, expiry_date: "2026-09-30", seller_info: "Zydus" },
  { name: "Omeprazole 20mg", batch_no: "OMP006", barcode: "8901234567895", quantity: 4, price: 45, min_threshold: 5, expiry_date: "2025-08-15", seller_info: "Torrent" },
  { name: "Azithromycin 500mg", batch_no: "AZI007", barcode: "8901234567896", quantity: 30, price: 120, min_threshold: 5, expiry_date: "2026-04-20", seller_info: "Alkem" },
  { name: "Ibuprofen 400mg", batch_no: "IBU008", barcode: "8901234567897", quantity: 75, price: 20, min_threshold: 10, expiry_date: "2026-11-30", seller_info: "Abbott" }
]
```

---

## 🚀 ROUTING MAP

```
/                          → Landing Page (public)
/features                  → Features Page (public)
/about                     → About Page (public)
/contact                   → Contact Page (public)
/login                     → Staff Login/Register (public)
/admin-login               → Admin Login (public)
/dashboard                 → Staff Dashboard (protected: user)
/dashboard/medicines       → Medicines CRUD (protected: user)
/dashboard/billing         → Billing/POS (protected: user)
/dashboard/alerts          → Alerts (protected: user)
/dashboard/notifications   → Notification Settings (protected: user)
/admin                     → Admin Dashboard (protected: admin)
/admin/medicines           → Medicines CRUD (protected: admin)
/admin/sales               → Sales Overview (protected: admin)
/admin/reports             → Reports + CSV Export (protected: admin)
/admin/audit-logs          → Audit Logs (protected: admin)
/admin/alerts              → Alerts (protected: admin)
*                          → 404 Not Found
```

---

## ✅ FEATURE CHECKLIST

### Authentication:
- [x] Staff login with email or mobile number
- [x] Staff registration (name, email, password, mobile)
- [x] Admin login (separate page, no registration)
- [x] JWT token authentication
- [x] Role-based access control (admin vs user)
- [x] Protected routes with redirect
- [x] Sign out

### Medicine Management:
- [x] Add medicine with all fields (name, batch, barcode, qty, price, threshold, dates, seller, description)
- [x] Edit medicine via dialog form
- [x] Delete medicine with confirmation
- [x] Search/filter by name, batch, barcode
- [x] Status badges: Expired, Expiring Soon, Low Stock
- [x] Sortable table columns

### Barcode Scanner:
- [x] Camera-based scanning using @zxing/library
- [x] Auto-detect back camera, camera switching
- [x] Fullscreen scanner overlay with guide frame
- [x] Manual barcode text input fallback
- [x] Auto-add scanned medicine to billing cart

### Billing/POS System:
- [x] Medicine search (Command palette with name + barcode)
- [x] Barcode scanner integration
- [x] Cart management (add, update qty, remove)
- [x] Stock validation (prevent overselling)
- [x] Customer info (name, contact — optional)
- [x] Auto-calculate subtotals and grand total
- [x] Atomic stock deduction on sale
- [x] Sale record + sale items creation
- [x] Audit log on sale
- [x] Toast notifications for success/error

### Alert System:
- [x] Low stock alerts (qty < threshold)
- [x] Out of stock alerts (qty === 0)
- [x] Expiry warning alerts (within 30 days)
- [x] Color-coded alert cards (yellow: warning, red: critical)
- [x] Dismiss/mark as read
- [x] Alert count badge in sidebar + topbar
- [x] CRON job: check alerts every 6 hours
- [x] CRON job: daily digest report at 8 AM
- [x] Duplicate alert prevention
- [x] Instant email/SMS notifications on new alerts

### Notification System:
- [x] Email notifications (via Resend/Nodemailer)
- [x] SMS notifications (via Twilio)
- [x] Toggle email ON/OFF
- [x] Toggle SMS ON/OFF (with mobile number input)
- [x] Toggle low stock alerts ON/OFF
- [x] Toggle expiry alerts ON/OFF
- [x] Send test notification button
- [x] Notification logs tracking

### Admin Dashboard:
- [x] Date range picker (default 14 days)
- [x] 6 stats cards (medicines, sales, value, low stock, expiring, transactions)
- [x] Sales trend AreaChart (Recharts)
- [x] Inventory analytics PieChart + BarChart
- [x] Recent activity feed
- [x] All data filtered by selected date range

### Sales & Reports:
- [x] Sales overview (today, week, month totals)
- [x] Date range filtering
- [x] Sales history table
- [x] Low stock report with CSV export
- [x] Expiring medicines report with CSV export
- [x] Full inventory report with CSV export
- [x] Sales report with CSV export

### Audit Logs:
- [x] Activity history table (timestamp, action, user, details)
- [x] Color-coded actions (green: create, red: delete, yellow: update)
- [x] Action-type icons

### AI MediBot:
- [x] Floating chat widget (bottom-right)
- [x] Medicine information (uses, dosage, side effects, precautions)
- [x] Exercise recommendations for health conditions
- [x] Streaming responses (SSE)
- [x] Auth-gated (login required)
- [x] Rate limiting (50 messages, 5000 chars)
- [x] Hindi + English support
- [x] Quick suggestion buttons
- [x] Medical disclaimers

### UI/UX:
- [x] Responsive sidebar dashboard layout
- [x] Mobile hamburger menu
- [x] Card-based design
- [x] Loading states
- [x] Empty states
- [x] Toast notifications
- [x] Modal dialogs for forms
- [x] Data tables with search
- [x] Medical green color theme
- [x] Dark mode support (CSS variables ready)

---

## 🔧 ENVIRONMENT VARIABLES (.env)

```env
# Server
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/mediteck
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_jwt_secret

# Email (Resend)
RESEND_API_KEY=your_resend_api_key

# SMS (Twilio - optional)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# AI Chat (choose one)
OPENAI_API_KEY=your_openai_key
# or
GEMINI_API_KEY=your_gemini_key

# CRON
CRON_SECRET_KEY=your_cron_secret

# Client
VITE_API_URL=http://localhost:5000/api
```

---

## 💡 CRITICAL IMPLEMENTATION NOTES

1. **Atomic Stock Deduction**: When processing a sale, use MongoDB `$inc: { quantity: -amount }` operator to prevent race conditions. Validate stock > 0 before decrementing.

2. **Audit Logging**: Every medicine add/edit/delete and every sale should create an audit log entry with the user ID and action metadata.

3. **Streaming Chat**: The AI chat endpoint should use Server-Sent Events (SSE) format. Send `data: {json}\n\n` for each chunk and `data: [DONE]\n\n` when complete.

4. **CSV Export**: Generate CSV client-side from data arrays. Use Blob + download link pattern. Filename includes date: `report_2025-01-15.csv`.

5. **Barcode Scanner**: Use `@zxing/library` BrowserMultiFormatReader. Prefer back camera. Show scanning overlay with guide frame. Auto-close scanner on successful scan.

6. **Date Range Picker**: Uses react-day-picker DateRange type. Default to last 14 days. All admin dashboard metrics and charts filter by this range using useMemo.

7. **No Hardcoded Data**: All data must be dynamic from the database. Only the seed script provides initial data.

8. **Indian Currency**: All monetary values displayed as `₹{amount.toFixed(2)}`.

---

## 🎯 BUILD ORDER (Recommended)

1. **Setup**: Initialize MERN project structure, install dependencies
2. **Database**: Create all Mongoose models with validations
3. **Auth**: Build JWT auth system with role-based middleware
4. **Medicines API**: CRUD endpoints + barcode lookup
5. **Sales API**: Create sale with atomic stock deduction
6. **Alerts**: Alert model + CRON jobs
7. **Reports**: Report endpoints with date filtering
8. **Frontend Auth**: Login/Register pages + AuthContext
9. **Dashboard Layout**: Sidebar + navigation + protected routes
10. **Medicines UI**: Table + search + CRUD dialogs
11. **Billing UI**: POS system + barcode scanner + cart
12. **Admin Dashboard**: Charts + stats + date range picker
13. **Reports UI**: Tabbed reports + CSV export
14. **MediBot**: AI chat widget with streaming
15. **Notifications**: Email/SMS service + settings page
16. **Landing Page**: Hero + Features + CTA + public pages
17. **Testing & Polish**: Error handling, edge cases, responsive design

---

**🏥 MediTeck — Your Complete Pharmacy Management Solution! 💊**
