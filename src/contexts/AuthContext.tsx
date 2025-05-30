import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';
import { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  userType: 'actor' | 'casting_agent' | null;
  userRole: string | null;
  loading: boolean;
}

const defaultContext: AuthContextType = {
  user: null,
  userType: null,
  userRole: null,
  loading: true,
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<'actor' | 'casting_agent' | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkUserType = async (userId: string) => {
    console.log('🔄 AuthContext - Iniciando checkUserType para userId:', userId);
    try {
      const { data: userData, error: userDataError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (userDataError) {
        console.error("❌ AuthContext - Error al obtener rol de usuario:", userDataError);
        throw userDataError;
      }

      console.log("✅ AuthContext - Datos del usuario:", userData);
      
      if (!userData || !userData.role) {
        console.error("❌ AuthContext - No se encontró el rol de usuario");
        throw new Error("No se encontró el rol de usuario");
      }

      const role = userData.role.toLowerCase();
      console.log("✅ AuthContext - Rol de usuario:", role);

      if (role === "casting_agent") {
        setUserType("casting_agent");
        setUserRole("casting_agent");
      } else if (role === "actor") {
        setUserType("actor");
        setUserRole("actor");
      } else {
        console.error("❌ AuthContext - Rol de usuario no válido:", role);
        setUserType(null);
        setUserRole(null);
      }
    } catch (error) {
      console.error("❌ AuthContext - Error general en checkUserType:", error);
      setUserType(null);
      setUserRole(null);
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