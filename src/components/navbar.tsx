import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '../lib/supabase/client';
import { useAuth } from '../contexts/AuthContext';

export function Navbar() {
  const navigate = useNavigate();
  const { user, userType, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/page");
    } catch (error) {
      console.warn('Error al cerrar sesión:', error);
      navigate("/page");
    }
  };

  if (loading) {
    return (
      <nav className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/page" className="text-xl font-bold">
              Casting
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/page" className="text-xl font-bold">
              Casting
            </Link>
            {user && (
              <div className="flex items-center gap-4">
                <Link 
                  to={userType === 'casting_agent' ? "/casting/profile" : "/actor/profile"} 
                  className="text-sm hover:text-primary"
                >
                  Mi Perfil
                </Link>
                {userType === 'casting_agent' && (
                  <Link to="/explore" className="text-sm hover:text-primary">
                    Explorar Actores
                  </Link>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Button variant="ghost" onClick={handleSignOut}>
                Cerrar Sesión
              </Button>
            ) : (
              <Button variant="ghost" onClick={() => navigate("/auth/login")}>
                Iniciar Sesión
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 