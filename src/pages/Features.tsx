import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Pill,
  Scan,
  FileText,
  Bell,
  BarChart3,
  Shield,
  Users,
  Clock,
  Bot,
  Package,
  Receipt,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: Pill,
    title: "Medicine Inventory",
    description:
      "Track all medicines with batch numbers, expiry dates, and stock levels in real-time. Comprehensive database with search and filter capabilities.",
    details: [
      "Add medicines with complete details",
      "Track batch numbers and manufacturing dates",
      "Monitor expiry dates automatically",
      "Real-time stock level updates",
    ],
  },
  {
    icon: Scan,
    title: "Barcode Scanning",
    description:
      "Quick medicine lookup using barcode/QR scanning for faster billing and inventory management.",
    details: [
      "Camera-based barcode scanning",
      "Instant medicine lookup",
      "Add to cart with single scan",
      "Manual barcode entry fallback",
    ],
  },
  {
    icon: FileText,
    title: "Billing System",
    description:
      "Generate professional invoices with automatic stock reduction and comprehensive sales logging.",
    details: [
      "Multi-item billing support",
      "Automatic stock reduction",
      "Customer details tracking",
      "Professional invoice generation",
    ],
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description:
      "Get notified for low stock and expiring medicines before it's too late. Never miss critical inventory issues.",
    details: [
      "Low stock alerts (below 5 units)",
      "Expiry alerts (30/15/7 days)",
      "Out of stock notifications",
      "Dashboard alert summary",
    ],
  },
  {
    icon: BarChart3,
    title: "Sales Analytics",
    description:
      "Comprehensive dashboards with charts for daily, weekly, and monthly sales reports and insights.",
    details: [
      "Real-time sales tracking",
      "Revenue analytics",
      "Top-selling medicines",
      "Custom date range reports",
    ],
  },
  {
    icon: Shield,
    title: "Secure Access",
    description:
      "Role-based authentication with separate admin and staff access controls for maximum security.",
    details: [
      "Admin and staff roles",
      "Secure password hashing",
      "Session management",
      "Access control policies",
    ],
  },
  {
    icon: Bot,
    title: "AI Medicine Assistant",
    description:
      "Get instant information about any medicine worldwide with our AI-powered MediBot assistant.",
    details: [
      "Global medicine information",
      "Dosage and usage guidance",
      "Side effects and precautions",
      "Available in Hindi & English",
    ],
  },
  {
    icon: Clock,
    title: "Audit Logs",
    description:
      "Complete history of all actions with timestamps and user identification for compliance and security.",
    details: [
      "Track all user actions",
      "Timestamp recording",
      "User identification",
      "Exportable logs",
    ],
  },
  {
    icon: Package,
    title: "Inventory Management",
    description:
      "Complete control over your medicine stock with easy updates and tracking of all inventory changes.",
    details: [
      "Stock level monitoring",
      "Inventory change logs",
      "Minimum threshold settings",
      "Supplier information",
    ],
  },
  {
    icon: Receipt,
    title: "Sales Records",
    description:
      "Maintain comprehensive sales records with customer details and transaction history.",
    details: [
      "Complete transaction history",
      "Customer contact storage",
      "Staff sales tracking",
      "Searchable records",
    ],
  },
  {
    icon: Users,
    title: "Multi-User Support",
    description:
      "Multiple staff members can work simultaneously with complete audit trail tracking.",
    details: [
      "Concurrent user access",
      "Individual user tracking",
      "Staff performance metrics",
      "Secure multi-session support",
    ],
  },
  {
    icon: TrendingUp,
    title: "Business Reports",
    description:
      "Generate detailed business reports for sales, inventory, and operations management.",
    details: [
      "Daily/weekly/monthly reports",
      "Exportable to CSV",
      "Visual charts and graphs",
      "Custom date ranges",
    ],
  },
];

const Features = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-block rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground">
                Features
              </span>
              <h1 className="mt-4 font-heading text-4xl font-bold text-foreground md:text-5xl">
                Powerful Features for Modern Pharmacy Management
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Everything you need to run your medical store efficiently. From
                inventory management to AI-powered assistance, we've got you
                covered.
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="card-medical hover-lift"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-primary">
                    <feature.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    {feature.description}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {feature.details.map((detail) => (
                      <li
                        key={detail}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Features;
