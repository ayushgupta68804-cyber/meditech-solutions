import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Pill, Shield, BarChart3, Scan } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-20 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute left-1/4 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-20 right-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container relative">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
              <Pill className="h-4 w-4" />
              Medical Store Management System
            </div>

            <h1 className="font-heading text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
              Manage Your{" "}
              <span className="text-gradient">Medical Store</span>{" "}
              With Ease
            </h1>

            <p className="mx-auto max-w-xl text-lg text-muted-foreground lg:mx-0">
              Complete solution for medicine inventory, billing, sales tracking,
              and expiry management. Streamline your pharmacy operations with
              powerful tools designed for healthcare professionals.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Button size="lg" asChild className="gap-2 bg-gradient-primary btn-glow px-8">
                <Link to="/login/admin">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="gap-2">
                <Link to="/features">
                  Explore Features
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center lg:text-left">
                <div className="font-heading text-2xl font-bold text-primary md:text-3xl">
                  500+
                </div>
                <div className="text-sm text-muted-foreground">Active Stores</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="font-heading text-2xl font-bold text-primary md:text-3xl">
                  50K+
                </div>
                <div className="text-sm text-muted-foreground">Medicines Tracked</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="font-heading text-2xl font-bold text-primary md:text-3xl">
                  99.9%
                </div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative hidden lg:block">
            <div className="relative mx-auto max-w-md">
              {/* Main Card */}
              <div className="card-medical animate-fade-in space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
                    <BarChart3 className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-heading font-semibold text-foreground">
                      Sales Dashboard
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Real-time analytics
                    </div>
                  </div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-3/4 rounded-full bg-gradient-primary" />
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="rounded-lg bg-secondary p-3">
                    <div className="font-semibold text-secondary-foreground">₹45K</div>
                    <div className="text-xs text-muted-foreground">Today</div>
                  </div>
                  <div className="rounded-lg bg-secondary p-3">
                    <div className="font-semibold text-secondary-foreground">₹320K</div>
                    <div className="text-xs text-muted-foreground">Week</div>
                  </div>
                  <div className="rounded-lg bg-secondary p-3">
                    <div className="font-semibold text-secondary-foreground">₹1.2M</div>
                    <div className="text-xs text-muted-foreground">Month</div>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -left-12 top-1/3 animate-float card-medical w-48 space-y-2">
                <div className="flex items-center gap-2">
                  <Scan className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">Barcode Scan</span>
                </div>
                <div className="text-xs text-muted-foreground">Quick medicine lookup</div>
              </div>

              <div className="absolute -right-8 bottom-1/4 animate-float card-medical w-48 space-y-2" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-accent" />
                  <span className="text-sm font-medium text-foreground">Secure Access</span>
                </div>
                <div className="text-xs text-muted-foreground">Role-based permissions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;