const features = [
  {
    title: "Medicine Inventory",
    description: "Track all medicines with batch numbers, expiry dates, and stock levels.",
  },
  {
    title: "Barcode Scanning",
    description: "Quick medicine lookup using barcode/QR scanning for faster billing.",
  },
  {
    title: "Billing System",
    description: "Generate invoices with automatic stock reduction and sales logging.",
  },
  {
    title: "Smart Alerts",
    description: "Get notified for low stock and expiring medicines.",
  },
  {
    title: "Sales Analytics",
    description: "Dashboards with charts for daily, weekly, and monthly sales reports.",
  },
  {
    title: "Secure Access",
    description: "Role-based authentication with admin and staff access controls.",
  },
  {
    title: "Multi-User Support",
    description: "Multiple staff can work simultaneously with audit tracking.",
  },
  {
    title: "Audit Logs",
    description: "Complete history of all actions with timestamps.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            System Features
          </h2>
          <p className="text-muted-foreground">
            All the features you need to manage your pharmacy efficiently.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="border border-border rounded p-4 bg-card"
            >
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded flex items-center justify-center mb-3 text-sm font-bold">
                {index + 1}
              </div>
              <h3 className="font-bold text-foreground mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
