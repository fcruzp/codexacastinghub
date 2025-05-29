import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';

interface AuthContextType {
  user: any;
  userType: 'actor' | 'casting' | null;
  userRole: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userType: null,
  userRole: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [userType, setUserType] = useState<'actor' | 'casting' | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkUserType = async (userId: string) => {
    console.log('🔄 AuthContext - Iniciando checkUserType para userId:', userId);
    try {
      // Verificar primero si es casting
      console.log('🔍 AuthContext - Consultando casting_companies...');
      const { data: castingData, error: castingError } = await supabase
        .from("casting_companies")
        .select("id")
        .eq("id", userId)
        .maybeSingle();

      if (castingError) {
        console.warn('⚠️ AuthContext - Error al verificar casting:', castingError);
        return;
      }

      // Si es casting, no necesitamos verificar actor_profiles
      if (castingData) {
        console.log('✅ AuthContext - Usuario es Casting Director');
        setUserType("casting");
        return;
      }

      // Si no es casting, verificar si es actor
      console.log('🔍 AuthContext - Consultando actor_profiles...');
      const { data: actorData, error: actorError } = await supabase
        .from("actor_profiles")
        .select("id")
        .eq("id", userId)
        .maybeSingle();

      if (actorError) {
        console.warn('⚠️ AuthContext - Error al verificar actor:', actorError);
        return;
      }

      if (actorData) {
        console.log('✅ AuthContext - Usuario es Actor');
        setUserType("actor");
      } else {
        console.log('ℹ️ AuthContext - Usuario sin tipo definido');
        setUserType(null);
      }
    } catch (error) {
      console.error("❌ AuthContext - Error general en checkUserType:", error);
    }
  };

  const getUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .single()
        .throwOnError();

      if (error) throw error;
      return data?.role || null;
    } catch (err) {
      console.warn('Error al obtener el rol del usuario:', err);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;

    const initializeAuth = async () => {
      if (!mounted) return;
      
      setLoading(true);
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('Error al obtener la sesión:', error.message);
          return;
        }

        if (session?.user) {
          setUser(session.user);
          const role = await getUserRole(session.user.id);
          setUserRole(role);
          await checkUserType(session.user.id);
        }

        // Suscribirse a cambios de autenticación solo si no hay una suscripción activa
        if (!authSubscription) {
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('🔄 AuthContext - Cambio de estado de autenticación:', event);
            
            if (mounted) {
              if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                if (session?.user) {
                  setUser(session.user);
                  const role = await getUserRole(session.user.id);
                  setUserRole(role);
                  await checkUserType(session.user.id);
                }
              } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setUserRole(null);
                setUserType(null);
              }
            }
          });
          authSubscription = subscription;
        }
      } catch (err) {
        console.warn('❌ AuthContext - Error en la inicialización de autenticación:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userType, userRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 