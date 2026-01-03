import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const benefits = [
  "Easy medicine tracking",
  "Automated expiry alerts",
  "Real-time inventory updates",
  "Professional invoicing",
  "Detailed sales reports",
  "Secure role-based access",
];

const CTASection = () => {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Use MediTeck?
            </h2>
            <p className="mb-6 opacity-90">
              Start managing your medical store efficiently with our complete solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button variant="secondary" size="lg" asChild>
                <Link to="/login">Start Now</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-2 bg-primary-foreground/10 rounded p-3"
              >
                <span className="text-lg">✓</span>
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
