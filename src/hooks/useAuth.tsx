import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface GuestUser {
  id: string;
  display_name: string;
  avatar_url: string;
  isGuest: true;
}

interface AuthContextType {
  user: User | GuestUser | null;
  session: Session | null;
  loading: boolean;
  signInWithDiscord: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: any }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const generateGuestId = (): string => {
  // Generate a unique ID similar to Discord snowflake IDs
  const timestamp = Date.now().toString();
  const random = Math.random().toString().slice(2, 8);
  return timestamp + random;
};

const getOrCreateGuestUser = (): GuestUser => {
  console.log('🔍 Checking for existing guest user...');
  const existingGuest = localStorage.getItem('guestUser');
  if (existingGuest) {
    console.log('✅ Found existing guest user:', JSON.parse(existingGuest));
    return JSON.parse(existingGuest);
  }
  
  console.log('🆕 Creating new guest user...');
  const guestId = generateGuestId();
  const guestUser: GuestUser = {
    id: guestId,
    display_name: `Guest_${guestId.slice(-6)}`,
    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${guestId}`,
    isGuest: true
  };
  
  console.log('💾 Saving guest user to localStorage:', guestUser);
  localStorage.setItem('guestUser', JSON.stringify(guestUser));
  return guestUser;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | GuestUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (session?.user) {
          setUser(session.user);
        } else {
          // Create guest user if no authenticated user
          setUser(getOrCreateGuestUser());
        }
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setUser(session.user);
      } else {
        // Create guest user if no authenticated user
        setUser(getOrCreateGuestUser());
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithDiscord = async () => {
    // Use environment variable for redirect in production, fallback to window.location.origin for dev
    const redirectUrl =
      import.meta.env.VITE_DISCORD_REDIRECT_URI || `${window.location.origin}/`;
    console.log('[Discord OAuth] Using redirectUrl:', redirectUrl);
    await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: redirectUrl
      }
    });
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signInWithDiscord,
    signInWithEmail,
    signUpWithEmail,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};