import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase/client";
import { useAuth } from "../../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: "actor" | "casting" | "director";
}

export default function ProtectedRoute({ children, requiredUserType }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { user, userType, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Si no hay usuario, redirigir al login
        if (!user) {
          console.log('No hay usuario autenticado');
          navigate("/auth/login");
          return;
        }

        // Si se requiere un tipo específico de usuario
        if (requiredUserType) {
          // Esperar a que se cargue el tipo de usuario
          if (authLoading) {
            return;
          }

          // Verificar si el usuario tiene el tipo requerido
          if (userType !== requiredUserType) {
            console.log(`Usuario es ${userType} pero se requiere ${requiredUserType}`);
            navigate(userType === "casting" ? "/casting/profile" : "/actor/profile");
            return;
          }
        }

        setLoading(false);
      } catch (err) {
        console.warn('Error al verificar acceso:', err);
        navigate("/auth/login");
      }
    };

    checkAccess();
  }, [navigate, requiredUserType, user, userType, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Cargando...</div>
      </div>
    );
  }

  return <>{children}</>;
} 