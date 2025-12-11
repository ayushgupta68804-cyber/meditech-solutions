import {
  Pill,
  Scan,
  FileText,
  Bell,
  BarChart3,
  Shield,
  Users,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: Pill,
    title: "Medicine Inventory",
    description:
      "Track all medicines with batch numbers, expiry dates, and stock levels in real-time.",
  },
  {
    icon: Scan,
    title: "Barcode Scanning",
    description:
      "Quick medicine lookup using barcode/QR scanning for faster billing and inventory.",
  },
  {
    icon: FileText,
    title: "Billing System",
    description:
      "Generate professional invoices with automatic stock reduction and sales logging.",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description:
      "Get notified for low stock and expiring medicines before it's too late.",
  },
  {
    icon: BarChart3,
    title: "Sales Analytics",
    description:
      "Comprehensive dashboards with charts for daily, weekly, and monthly sales reports.",
  },
  {
    icon: Shield,
    title: "Secure Access",
    description:
      "Role-based authentication with separate admin and staff access controls.",
  },
  {
    icon: Users,
    title: "Multi-User Support",
    description:
      "Multiple staff members can work simultaneously with audit trail tracking.",
  },
  {
    icon: Clock,
    title: "Audit Logs",
    description:
      "Complete history of all actions with timestamps and user identification.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground">
            Features
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold text-foreground md:text-4xl">
            Everything You Need to Run Your Pharmacy
          </h2>
          <p className="mt-4 text-muted-foreground">
            Powerful features designed specifically for medical store management.
            From inventory to billing, we've got you covered.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group card-medical hover-lift cursor-default"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary transition-colors group-hover:bg-gradient-primary">
                <feature.icon className="h-6 w-6 text-secondary-foreground transition-colors group-hover:text-primary-foreground" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
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