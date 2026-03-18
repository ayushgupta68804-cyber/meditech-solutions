import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t-2 border-primary bg-secondary">
      <div className="container py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h4 className="font-bold text-primary text-lg mb-2">MediTech</h4>
            <p className="text-sm text-muted-foreground">
              Smart Pharmacy Solution - A complete platform for pharmacy operations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-foreground mb-2">Quick Links</h4>
            <nav className="flex flex-col gap-1">
              <Link to="/" className="text-sm text-muted-foreground">Home</Link>
              <Link to="/features" className="text-sm text-muted-foreground">Features</Link>
              <Link to="/about" className="text-sm text-muted-foreground">About Us</Link>
              <Link to="/contact" className="text-sm text-muted-foreground">Contact</Link>
            </nav>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-bold text-foreground mb-2">Features</h4>
            <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
              <li>Medicine Inventory</li>
              <li>Barcode Scanning</li>
              <li>Billing System</li>
              <li>Sales Reports</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-foreground mb-2">Contact Us</h4>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              <p>Email: ayushgupta69904@gmail.com</p>
              <p>Phone: +91 90220 53701</p>
              <p>Address: 123 Medical Plaza, Bramhanand Nagar, Kamatghar, Bhiwandi, Thane 421305</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MediTech - Smart Pharmacy Solution
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Developed for Mumbai University Project
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
