import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: "actor" | "casting";
}

export default function ProtectedRoute({ children, requiredUserType }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) {
        navigate("/auth/login");
        return;
      }

      if (requiredUserType) {
        const { data: userData, error: userDataError } = await supabase
          .from(requiredUserType === "actor" ? "actor_profiles" : "casting_companies")
          .select("id")
          .eq("id", user.id)
          .single();

        if (userDataError || !userData) {
          navigate("/");
          return;
        }
      }

      setLoading(false);
    } catch (err) {
      navigate("/auth/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Cargando...</div>
      </div>
    );
  }

  return <>{children}</>;
} 