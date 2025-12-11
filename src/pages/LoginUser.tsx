import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pill, Users, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LoginUser = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login - replace with actual auth
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Login Successful",
        description: "Welcome to MediTeck Staff Dashboard",
      });
    }, 1500);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
              <Users className="h-6 w-6 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground">
                Staff Login
              </h1>
              <p className="text-sm text-muted-foreground">
                Access your staff dashboard
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  className="h-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="h-12 w-full bg-gradient-primary btn-glow"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Need admin access?{" "}
            <Link to="/login/admin" className="text-primary hover:underline">
              Login as Admin
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Branding */}
      <div className="hidden w-1/2 bg-gradient-primary lg:flex lg:flex-col lg:items-center lg:justify-center lg:p-12">
        <div className="max-w-md text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-foreground/10 backdrop-blur-sm">
              <Pill className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <h2 className="font-heading text-3xl font-bold text-primary-foreground">
            MediTeck Staff Portal
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            Manage inventory, create bills, and track medicines efficiently from
            your staff dashboard.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-primary-foreground/10 p-4 text-left backdrop-blur-sm">
              <div className="text-2xl font-bold text-primary-foreground">
                Quick
              </div>
              <div className="text-sm text-primary-foreground/80">
                Barcode scanning
              </div>
            </div>
            <div className="rounded-lg bg-primary-foreground/10 p-4 text-left backdrop-blur-sm">
              <div className="text-2xl font-bold text-primary-foreground">
                Easy
              </div>
              <div className="text-sm text-primary-foreground/80">
                Bill generation
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginUser;