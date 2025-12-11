import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

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
    <section className="relative overflow-hidden bg-gradient-primary py-20 lg:py-28">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-primary-foreground blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-primary-foreground blur-3xl" />
      </div>

      <div className="container relative">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6 text-center lg:text-left">
            <h2 className="font-heading text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl">
              Ready to Transform Your Medical Store?
            </h2>
            <p className="mx-auto max-w-lg text-lg text-primary-foreground/80 lg:mx-0">
              Join hundreds of pharmacies already using MediTeck to streamline
              their operations and boost productivity.
            </p>
            <div className="flex flex-col items-center gap-4 pt-4 sm:flex-row lg:justify-start">
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="gap-2 px-8"
              >
                <Link to="/login/admin">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="gap-2 border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link to="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div
                key={benefit}
                className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 p-4 backdrop-blur-sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary-foreground" />
                <span className="text-sm font-medium text-primary-foreground">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;