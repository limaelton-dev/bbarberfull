import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/database.types';

// Tipos de dados

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string, type: 'client' | 'barbershop') => Promise<void>;
  signUp: (email: string, password: string, fullName: string, type: 'client' | 'barbershop') => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
  });

  useEffect(() => {
    // Obtém a sessão inicial ao carregar o componente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState((prev) => ({ ...prev, user: session?.user ?? null }));
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    // Escuta alterações de estado de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setState((prev) => ({ ...prev, user: session?.user ?? null }));
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setState((prev) => ({ ...prev, profile: null, isLoading: false }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        setState((prev) => ({ ...prev, profile: null, isLoading: false }));
        return;
      }

      setState((prev) => ({ ...prev, profile: data, isLoading: false }));
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      setState((prev) => ({ ...prev, profile: null, isLoading: false }));
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    type: 'client' | 'barbershop'
  ) => {
    const {
      data: { user },
      error: signUpError,
    } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError || !user) throw signUpError;

    const { error: profileError } = await supabase.from('profiles').insert({
      id: user.id,
      full_name: fullName,
      type,
    });

    if (profileError) throw profileError;

    // Atualiza manualmente o estado e busca o perfil
    setState((prev) => ({ ...prev, user, isLoading: true }));
    await fetchProfile(user.id);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setState({ user: null, profile: null, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
