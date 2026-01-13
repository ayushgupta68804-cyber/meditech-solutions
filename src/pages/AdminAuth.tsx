import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Pill, ArrowLeft, Eye, EyeOff, Loader2, Shield } from 'lucide-react';
import { z } from 'zod';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or mobile is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const AdminAuth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const { signIn, user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      if (isAdmin) {
        navigate('/admin', { replace: true });
      } else {
        toast({
          variant: 'destructive',
          title: 'Access Denied',
          description: 'You do not have admin privileges',
        });
      }
    }
  }, [user, isAdmin, loading, navigate, toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = loginSchema.safeParse({ identifier, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(identifier, password);
    setIsLoading(false);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'Invalid credentials',
      });
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden w-1/2 bg-gradient-to-br from-primary via-primary to-accent lg:flex lg:flex-col lg:items-center lg:justify-center lg:p-12">
        <div className="max-w-md text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-foreground/10 backdrop-blur-sm">
              <Pill className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <h2 className="font-heading text-3xl font-bold text-primary-foreground">
            MediTeck Admin Portal
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            Full control over your medical store. Manage users, view reports, and oversee all operations.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-primary-foreground/10 p-4 text-left backdrop-blur-sm">
              <div className="text-2xl font-bold text-primary-foreground">Full</div>
              <div className="text-sm text-primary-foreground/80">Sales analytics</div>
            </div>
            <div className="rounded-lg bg-primary-foreground/10 p-4 text-left backdrop-blur-sm">
              <div className="text-2xl font-bold text-primary-foreground">Complete</div>
              <div className="text-sm text-primary-foreground/80">Audit logs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground">
                Admin Login
              </h1>
              <p className="text-sm text-muted-foreground">
                Access the admin dashboard
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="identifier">Email or Mobile</Label>
              <Input
                id="identifier"
                type="text"
                placeholder="Enter admin email or mobile"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="h-12"
              />
              {errors.identifier && (
                <p className="text-sm text-destructive">{errors.identifier}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="h-12 w-full bg-gradient-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In as Admin'
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Staff member?{' '}
            <Link to="/login" className="text-primary">
              Login as Staff
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
