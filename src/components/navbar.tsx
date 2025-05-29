import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '../lib/supabase/client';
import { useAuth } from '../contexts/AuthContext';

interface User {
  id: string;
  email?: string;
}

export function Navbar() {
  const navigate = useNavigate();
  const { user, userType, userRole, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
    } catch (error) {
      console.warn('Error al cerrar sesión:', error);
      // Intentar navegar al home incluso si hay error
      navigate("/");
    }
  };

  if (loading) {
    return (
      <nav className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="text-xl font-bold">
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
            <Link to="/" className="text-xl font-bold">
              Casting
            </Link>
            {user && (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="text-sm hover:text-primary">
                  Mi Perfil
                </Link>
                {userRole === 'director' && (
                  <Link to="/explore/actors" className="text-sm hover:text-primary">
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