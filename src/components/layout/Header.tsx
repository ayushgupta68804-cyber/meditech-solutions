import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-primary bg-background">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">
            MediTeck
          </span>
          <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
            Pharmacy System
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-medium hover:text-primary hover:underline">
            Home
          </Link>
          <Link to="/features" className="text-sm font-medium hover:text-primary hover:underline">
            Features
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary hover:underline">
            About
          </Link>
          <Link to="/contact" className="text-sm font-medium hover:text-primary hover:underline">
            Contact
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="outline" size="sm" asChild>
            <Link to="/login">Staff Login</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/admin-login">Admin Login</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex h-9 w-9 items-center justify-center border border-border rounded md:hidden"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-border bg-background p-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link to="/" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/features" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
              Features
            </Link>
            <Link to="/about" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <Link to="/contact" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
            <hr className="my-2" />
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link to="/login">Staff Login</Link>
            </Button>
            <Button size="sm" asChild className="w-full">
              <Link to="/admin-login">Admin Login</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
