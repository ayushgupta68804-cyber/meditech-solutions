import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type UserRole = 'admin' | 'user';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole | null;
  loading: boolean;
  signIn: (identifier: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, name: string, mobile?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching role:', error);
      return null;
    }
    return data?.role as UserRole | null;
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Use setTimeout to avoid Supabase auth deadlock
          setTimeout(async () => {
            const userRole = await fetchUserRole(session.user.id);
            setRole(userRole);
            setLoading(false);
          }, 0);
        } else {
          setRole(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        setLoading(false);
        return;
      }
      setSession(session);
      setUser(session.user);
      
      const userRole = await fetchUserRole(session.user.id);
      setRole(userRole);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (identifier: string, password: string) => {
    // Check if identifier is email or mobile
    const isEmail = identifier.includes('@');
    
    if (isEmail) {
      const { error } = await supabase.auth.signInWithPassword({
        email: identifier,
        password,
      });
      return { error };
    } else {
      // For mobile login, use security definer function to find email
      const { data: email, error: lookupError } = await supabase
        .rpc('get_email_by_mobile', { _mobile: identifier });

      if (lookupError || !email) {
        return { error: new Error('User not found with this mobile number') };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password,
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, name: string, mobile?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name,
          mobile: mobile || '',
        },
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole(null);
  };

  const value = {
    user,
    session,
    role,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin: role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
