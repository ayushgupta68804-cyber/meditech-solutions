import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const features = [
  {
    title: "Medicine Inventory",
    description: "Track all medicines with batch numbers, expiry dates, and stock levels.",
    details: [
      "Add medicines with complete details",
      "Track batch numbers and manufacturing dates",
      "Monitor expiry dates automatically",
      "Real-time stock level updates",
    ],
  },
  {
    title: "Barcode Scanning",
    description: "Quick medicine lookup using barcode/QR scanning for faster billing.",
    details: [
      "Camera-based barcode scanning",
      "Instant medicine lookup",
      "Add to cart with single scan",
      "Manual barcode entry fallback",
    ],
  },
  {
    title: "Billing System",
    description: "Generate professional invoices with automatic stock reduction.",
    details: [
      "Multi-item billing support",
      "Automatic stock reduction",
      "Customer details tracking",
      "Professional invoice generation",
    ],
  },
  {
    title: "Smart Alerts",
    description: "Get notified for low stock and expiring medicines.",
    details: [
      "Low stock alerts (below 5 units)",
      "Expiry alerts (30/15/7 days)",
      "Out of stock notifications",
      "Dashboard alert summary",
    ],
  },
  {
    title: "Sales Analytics",
    description: "Comprehensive dashboards with charts for sales reports.",
    details: [
      "Real-time sales tracking",
      "Revenue analytics",
      "Top-selling medicines",
      "Custom date range reports",
    ],
  },
  {
    title: "Secure Access",
    description: "Role-based authentication with admin and staff access controls.",
    details: [
      "Admin and staff roles",
      "Secure password hashing",
      "Session management",
      "Access control policies",
    ],
  },
  {
    title: "AI Medicine Assistant",
    description: "Get instant information about any medicine with AI assistant.",
    details: [
      "Global medicine information",
      "Dosage and usage guidance",
      "Side effects and precautions",
      "Available in Hindi & English",
    ],
  },
  {
    title: "Audit Logs",
    description: "Complete history of all actions with timestamps.",
    details: [
      "Track all user actions",
      "Timestamp recording",
      "User identification",
      "Exportable logs",
    ],
  },
  {
    title: "Inventory Management",
    description: "Complete control over medicine stock with easy updates.",
    details: [
      "Stock level monitoring",
      "Inventory change logs",
      "Minimum threshold settings",
      "Supplier information",
    ],
  },
  {
    title: "Sales Records",
    description: "Maintain comprehensive sales records with customer details.",
    details: [
      "Complete transaction history",
      "Customer contact storage",
      "Staff sales tracking",
      "Searchable records",
    ],
  },
  {
    title: "Multi-User Support",
    description: "Multiple staff members can work simultaneously.",
    details: [
      "Concurrent user access",
      "Individual user tracking",
      "Staff performance metrics",
      "Secure multi-session support",
    ],
  },
  {
    title: "Business Reports",
    description: "Generate detailed business reports for operations management.",
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
        <section className="bg-secondary py-12">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold text-foreground mb-4">
                System Features
              </h1>
              <p className="text-muted-foreground">
                Complete features for efficient pharmacy management - from inventory to billing.
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-12">
          <div className="container">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="border border-border rounded p-4 bg-card"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-primary text-primary-foreground rounded flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <h3 className="font-bold text-foreground">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {feature.description}
                  </p>
                  <ul className="space-y-1">
                    {feature.details.map((detail) => (
                      <li
                        key={detail}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <span className="text-primary">•</span>
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
