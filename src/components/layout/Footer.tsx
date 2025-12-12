import { Link } from "react-router-dom";
import { Pill, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
                <Pill className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-heading text-xl font-bold text-foreground">
                Medi<span className="text-primary">Teck</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Complete medical store management solution. Streamline inventory,
              billing, and sales tracking with ease.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-foreground">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link
                to="/"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Home
              </Link>
              <Link
                to="/features"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Features
              </Link>
              <Link
                to="/about"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-foreground">Features</h4>
            <nav className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">
                Medicine Inventory
              </span>
              <span className="text-sm text-muted-foreground">
                Barcode Scanning
              </span>
              <span className="text-sm text-muted-foreground">
                Billing System
              </span>
              <span className="text-sm text-muted-foreground">
                Sales Reports
              </span>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-foreground">Contact Us</h4>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:ayushgupta69904@gmail.com"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <Mail className="h-4 w-4" />
                ayushgupta69904@gmail.com
              </a>
              <a
                href="tel:+919022053701"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <Phone className="h-4 w-4" />
                +91 90220 53701
              </a>
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                123 Medical Plaza, Bramhanand Nagar, Kamatghar, Bhiwandi, Thane 421305
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MediTeck. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;