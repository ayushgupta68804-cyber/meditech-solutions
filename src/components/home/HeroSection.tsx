import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="py-16 bg-secondary">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Smart Pharmacy Solution
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            A complete solution for managing medicine inventory, billing, sales tracking, 
            and expiry alerts for pharmacy stores.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Button size="lg" asChild>
              <Link to="/login">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/features">View Features</Link>
            </Button>
          </div>

          {/* Simple Stats Box */}
          <div className="bg-card border border-border rounded p-6">
            <h3 className="text-lg font-bold mb-4 text-primary">System Overview</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-secondary rounded">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Stores</div>
              </div>
              <div className="p-3 bg-secondary rounded">
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Medicines</div>
              </div>
              <div className="p-3 bg-secondary rounded">
                <div className="text-2xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
