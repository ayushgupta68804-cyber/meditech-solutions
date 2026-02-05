# MediTeck - Medical Store Management System (MERN Stack)

## 🎯 Project Overview

Build a **complete Medical Store Management Web Application** called **MediTeck** using MERN Stack (MongoDB, Express.js, React.js, Node.js). This is a production-ready pharmacy management system with two user roles: **Admin** and **User/Staff**.

---

## 🛠️ Technology Stack

### Frontend:
- React.js 18+ with Vite
- TypeScript
- Tailwind CSS for styling
- React Router DOM for routing
- React Hook Form + Zod for form validation
- Recharts for analytics charts
- Lucide React for icons
- Sonner/React Hot Toast for notifications

### Backend:
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcrypt for password hashing
- Nodemailer for email notifications (optional)

---

## 📊 Database Schema (MongoDB Collections)

### 1. Users Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  mobile: String,
  password: String (hashed, required),
  role: String (enum: ['admin', 'user'], default: 'user'),
  notify_email: Boolean (default: true),
  notify_sms: Boolean (default: false),
  notify_low_stock: Boolean (default: true),
  notify_expiry: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
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
  price: Number,
  seller_info: String,
  created_by: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Sales Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: 'User'),
  customer_name: String,
  customer_contact: String,
  total_amount: Number,
  items: [{
    medicine_id: ObjectId (ref: 'Medicine'),
    medicine_name: String,
    quantity: Number,
    unit_price: Number,
    subtotal: Number
  }],
  createdAt: Date
}
```

### 4. Alerts Collection
```javascript
{
  _id: ObjectId,
  medicine_id: ObjectId (ref: 'Medicine'),
  type: String (enum: ['low_stock', 'out_of_stock', 'expiry_warning', 'expired']),
  message: String,
  is_read: Boolean (default: false),
  createdAt: Date
}
```

### 5. Audit Logs Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: 'User'),
  action: String,
  meta: Object,
  createdAt: Date
}
```

### 6. Inventory Logs Collection
```javascript
{
  _id: ObjectId,
  medicine_id: ObjectId (ref: 'Medicine'),
  change_amount: Number,
  reason: String,
  createdAt: Date
}
```

---

## 🔐 Authentication System

### Features:
1. **Separate Login Pages**:
   - `/login` - User/Staff login
   - `/admin-login` - Admin login

2. **JWT Authentication**:
   - Access token (short-lived: 15min-1hr)
   - Refresh token (long-lived: 7 days)
   - Token stored in httpOnly cookies or localStorage

3. **Role-Based Access Control (RBAC)**:
   - Middleware to check user role
   - Protected routes for admin-only pages

4. **Password Security**:
   - bcrypt hashing with salt rounds (10+)
   - Password validation (min 8 chars, uppercase, number)

---

## 👤 User/Staff Features

### 1. Dashboard (`/dashboard`)
- Welcome message with user name
- Quick stats cards:
  - Total Medicines count
  - Low Stock items count
  - Expiring Soon items count
  - Today's Sales count
- Recent alerts section
- Quick action buttons

### 2. Medicines Management (`/dashboard/medicines`)
- **View all medicines** in a searchable, sortable table
- **Add new medicine** with form:
  - Name, Description, Batch No, Barcode
  - MFG Date, Expiry Date
  - Quantity, Min Threshold, Price
  - Seller Info
- **Edit medicine** details
- **Delete medicine** (soft delete preferred)
- **Search** by name or barcode
- **Filter** by stock status (all, low stock, out of stock, expiring)

### 3. Barcode Scanner (`/dashboard/medicines`)
- **Camera-based barcode scanning** using device camera
- Uses `@zxing/library` for barcode detection
- On scan: Auto-fetch medicine details
- Add scanned medicine to billing cart
- Manual barcode entry as fallback

### 4. Billing System (`/dashboard/billing`)
- **Create new bill/invoice**:
  - Add customer name & contact (optional)
  - Search medicines by name or barcode
  - Add multiple items to cart
  - Quantity input with stock validation
  - Auto-calculate subtotals and grand total
- **Barcode scanner integration** for quick item add
- **Process sale**:
  - Validate stock availability
  - Deduct stock automatically (atomic operation)
  - Generate invoice/receipt
  - Create audit log entry
- **Invoice display** with print option

### 5. Alerts Page (`/dashboard/alerts`)
- View all alerts (low stock, expiry, out of stock)
- Mark alerts as read
- Filter by alert type
- Color-coded severity (red: critical, yellow: warning)

### 6. Notification Settings (`/dashboard/notifications`)
- Toggle email notifications
- Toggle SMS notifications
- Toggle low stock alerts
- Toggle expiry alerts

---

## 👨‍💼 Admin Features

### 1. Admin Dashboard (`/admin`)
- **Comprehensive stats cards**:
  - Total Revenue (today/week/month)
  - Total Sales count
  - Total Medicines
  - Active Alerts
- **Sales Trend Chart** (line/bar chart)
- **Inventory Analytics Chart** (pie/bar chart)
- **Date Range Picker** for filtering data

### 2. All User Features
- Admin has access to all user features
- Separate admin routes: `/admin/medicines`, `/admin/billing`, `/admin/alerts`

### 3. Sales Reports (`/admin/sales`)
- **View all sales** in table format
- **Filter by date range**
- **Sales summary**:
  - Total revenue
  - Total transactions
  - Average transaction value
- **Export to CSV**

### 4. Reports Page (`/admin/reports`)
- **Sales Reports**:
  - Daily, Weekly, Monthly sales
  - Custom date range
  - Top selling medicines
- **Inventory Reports**:
  - Low stock items
  - Near expiry items (30/15/7 days)
  - Out of stock items
- **Download reports as CSV**

### 5. Audit Logs (`/admin/audit-logs`)
- View all system activities
- Filter by action type
- Filter by user
- Filter by date range
- Columns: Timestamp, User, Action, Details

---

## 🤖 AI Health Chatbot (MediBot)

### Features:
- **Floating chat widget** on all pages (bottom-right corner)
- **Medicine Information**:
  - Generic & brand names
  - Uses and indications
  - Dosage guidelines
  - Side effects
  - Precautions & drug interactions
  - Storage instructions

- **Exercise Recommendations** for health conditions:
  - Back Pain: Cat-cow stretch, bird-dog, pelvic tilts, walking
  - Diabetes: Walking, cycling, swimming, strength training
  - Hypertension: Brisk walking, cycling, swimming, yoga breathing
  - Joint Pain: Water aerobics, gentle stretching, tai chi
  - Stress/Anxiety: Deep breathing, yoga, walking, meditation
  - Obesity: Cardio exercises, strength training, HIIT
  - Heart Health: Moderate cardio, walking, swimming
  - Migraine: Neck stretches, relaxation exercises, yoga

- **Response Format**:
  - Step-by-step exercise instructions
  - Duration & frequency recommendations
  - Benefits explanation
  - Safety precautions
  - Yoga/stretching suggestions

- **Bilingual Support**: Hindi and English
- **Medical Disclaimers**: Always included

### Implementation:
- Use OpenAI API / Gemini API / any LLM
- Rate limiting (50 messages per conversation)
- Message character limit (5000 chars)
- Requires user authentication

---

## ⏰ Automated Alert System (CRON Jobs)

### 1. Check Alerts CRON (runs every 6 hours)
```javascript
// Logic:
// 1. Find medicines with quantity <= min_threshold → Create "low_stock" alert
// 2. Find medicines with quantity = 0 → Create "out_of_stock" alert
// 3. Find medicines expiring within 30 days → Create "expiry_warning" alert
// 4. Find expired medicines → Create "expired" alert
// 5. Avoid duplicate alerts (check if alert already exists)
```

### 2. Daily Alert Report (runs daily at 8 AM)
- Compile all unread alerts
- Send email summary to users with email notifications enabled
- Include counts by alert type

### 3. Send Alert Notifications
- Triggered when new alerts are created
- Send email notifications to subscribed users
- Log all sent notifications

---

## 🎨 UI/UX Design Requirements

### Color Scheme:
- Primary: Medical blue (#0EA5E9 or similar)
- Secondary: Teal/Green (#14B8A6)
- Accent: Orange for warnings (#F97316)
- Background: Light gray (#F8FAFC)
- Text: Dark gray (#1E293B)

### Components:
- Modern card-based layout
- Responsive sidebar navigation
- Data tables with pagination, sorting, search
- Modal dialogs for forms
- Toast notifications for feedback
- Loading skeletons
- Empty states with illustrations

### Mobile Responsive:
- Hamburger menu on mobile
- Stacked cards on small screens
- Touch-friendly buttons
- Swipe gestures where applicable

---

## 🔒 Security Requirements

1. **Input Validation**: All inputs validated server-side
2. **SQL/NoSQL Injection Prevention**: Use parameterized queries
3. **XSS Prevention**: Sanitize all outputs, use React's built-in escaping
4. **CSRF Protection**: Use CSRF tokens for forms
5. **Rate Limiting**: Limit login attempts (5 per 15 min)
6. **Password Policy**: Min 8 chars, require complexity
7. **Secure Headers**: Helmet.js for Express
8. **HTTPS**: Required in production
9. **Atomic Operations**: Use MongoDB transactions for sales

---

## 📁 Project Structure

```
mediteck/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/         # Reusable UI components
│   │   │   ├── layout/     # Header, Footer, Sidebar
│   │   │   ├── dashboard/  # Dashboard components
│   │   │   ├── MediBot.tsx # AI Chatbot
│   │   │   └── BarcodeScanner.tsx
│   │   ├── pages/
│   │   │   ├── Index.tsx
│   │   │   ├── Auth.tsx
│   │   │   ├── AdminAuth.tsx
│   │   │   ├── dashboard/
│   │   │   └── admin/
│   │   ├── hooks/          # Custom React hooks
│   │   ├── contexts/       # Auth context, etc.
│   │   ├── lib/            # Utilities
│   │   └── App.tsx
│   └── package.json
│
├── server/                 # Express Backend
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── medicineController.js
│   │   ├── salesController.js
│   │   ├── alertController.js
│   │   └── reportController.js
│   ├── middleware/
│   │   ├── auth.js         # JWT verification
│   │   ├── admin.js        # Admin role check
│   │   └── validate.js     # Input validation
│   ├── models/
│   │   ├── User.js
│   │   ├── Medicine.js
│   │   ├── Sale.js
│   │   ├── Alert.js
│   │   └── AuditLog.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── medicines.js
│   │   ├── sales.js
│   │   ├── alerts.js
│   │   └── reports.js
│   ├── cron/
│   │   ├── checkAlerts.js
│   │   └── dailyReport.js
│   ├── utils/
│   │   └── helpers.js
│   ├── app.js
│   └── package.json
│
└── README.md
```

---

## 🚀 API Endpoints

### Auth Routes
```
POST /api/auth/register     - Register new user
POST /api/auth/login        - User login
POST /api/auth/admin-login  - Admin login
POST /api/auth/logout       - Logout
GET  /api/auth/me           - Get current user
PUT  /api/auth/profile      - Update profile
```

### Medicine Routes
```
GET    /api/medicines           - Get all medicines (with search, filter, pagination)
GET    /api/medicines/:id       - Get medicine by ID
GET    /api/medicines?barcode=X - Get medicine by barcode
POST   /api/medicines           - Create medicine
PUT    /api/medicines/:id       - Update medicine
DELETE /api/medicines/:id       - Delete medicine
```

### Sales Routes
```
GET  /api/sales          - Get all sales (admin: all, user: own)
GET  /api/sales/:id      - Get sale by ID
POST /api/sales          - Create new sale (with stock deduction)
```

### Alert Routes
```
GET   /api/alerts           - Get all alerts
PATCH /api/alerts/:id/read  - Mark alert as read
```

### Report Routes (Admin Only)
```
GET /api/reports/sales          - Sales report with date range
GET /api/reports/inventory      - Inventory report
GET /api/reports/low-stock      - Low stock report
GET /api/reports/expiring       - Expiring medicines report
GET /api/reports/export/csv     - Export report as CSV
```

### AI Chat Routes
```
POST /api/ai/chat - Send message to MediBot
```

---

## 📋 Sample Data for Testing

### Admin User
```javascript
{
  name: "Admin User",
  email: "admin@mediteck.com",
  password: "Admin@123",
  role: "admin"
}
```

### Sample Medicines
```javascript
[
  {
    name: "Paracetamol 500mg",
    batch_no: "PCM001",
    barcode: "8901234567890",
    quantity: 100,
    price: 25,
    expiry_date: "2025-12-31"
  },
  {
    name: "Amoxicillin 250mg",
    batch_no: "AMX002",
    barcode: "8901234567891",
    quantity: 3,  // Low stock
    price: 85,
    expiry_date: "2025-06-15"
  },
  {
    name: "Aspirin 75mg",
    batch_no: "ASP003",
    quantity: 0,  // Out of stock
    price: 15,
    expiry_date: "2025-03-01"  // Expiring soon
  }
]
```

---

## ✅ Checklist for Completion

- [ ] User authentication (login/register/logout)
- [ ] Admin authentication (separate login)
- [ ] Role-based access control
- [ ] Medicine CRUD operations
- [ ] Barcode scanner integration
- [ ] Billing/POS system
- [ ] Automatic stock deduction
- [ ] Alert system (low stock, expiry, out of stock)
- [ ] CRON jobs for automated alerts
- [ ] Admin dashboard with charts
- [ ] Sales reports with date filters
- [ ] Inventory reports
- [ ] CSV export functionality
- [ ] AI Chatbot (MediBot) for medicine & exercise info
- [ ] Notification settings
- [ ] Audit logging
- [ ] Responsive design
- [ ] Error handling & validation
- [ ] Security measures implemented

---

## 🎯 Key Points for Grok AI

1. **Start with database models** - Create all MongoDB schemas first
2. **Build auth system** - JWT with role-based access
3. **API routes** - RESTful endpoints with proper middleware
4. **Frontend components** - Start with layout, then pages
5. **Integration** - Connect frontend to backend APIs
6. **Testing** - Test all features thoroughly
7. **Security** - Implement all security measures
8. **Deployment** - Configure for production

---

## 💡 Additional Notes

- Use environment variables for all secrets
- Implement proper error handling throughout
- Add loading states for all async operations
- Use React Query or SWR for data fetching
- Implement optimistic updates where appropriate
- Add proper TypeScript types for everything
- Write clean, maintainable code with comments
- Follow ESLint/Prettier for code formatting

---

**Good luck building MediTeck! 🏥💊**
