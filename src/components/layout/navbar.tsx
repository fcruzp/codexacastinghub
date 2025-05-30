import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../providers/theme-provider";
import { Button } from "../ui/button";
import { Moon, Sun, User, LogOut, Menu, X } from "lucide-react";
import { supabase } from "../../lib/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAuth } from "../../contexts/AuthContext";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { user, userType } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session?.user) {
          await checkUserType(session.user.id);
        } else {
          setUserType(null);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setUserType(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const checkUserType = async (userId: string) => {
    try {
      const { data: userData, error: userDataError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (userDataError) throw userDataError;

      if (!userData || !userData.role) {
        throw new Error("No se encontró el rol de usuario");
      }

      const role = userData.role.toLowerCase();
      
      if (role === "actor") {
        setUserType("actor");
      } else if (role === "casting_agent") {
        setUserType("casting_agent");
      } else {
        setUserType(null);
      }
    } catch (error) {
      console.error("Error checking user type:", error);
      setUserType(null);
    }
  };

  const handleSignOut = async () => {
    console.log("handleSignOut: Iniciando cierre de sesión...");
    try {
      console.log("handleSignOut: Llamando a supabase.auth.signOut()...");
      const { error } = await supabase.auth.signOut().catch(err => {
        console.error("handleSignOut: Error en la promesa de signOut", err);
        return { error: err }; // Devolvemos el error para que el try/catch principal lo maneje también si es necesario
      });

      console.log("handleSignOut: Resultado de signOut", { error });
      if (error) {
        console.error("handleSignOut: Error al cerrar sesión:", error);
        // Opcional: Mostrar un mensaje de error al usuario
      } else {
        console.log("handleSignOut: Llamada a signOut exitosa. Esperando onAuthStateChange...");
        // Supabase.auth.onAuthStateChange manejará la limpieza del usuario y la redirección
      }
    } catch (error) {
      console.error("handleSignOut: Excepción al cerrar sesión:", error);
    }
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo y enlaces principales */}
          <div className="flex items-center">
            <Link to="/page" className="text-xl font-bold">
              CastingApp
            </Link>
            <div className="hidden md:flex items-center space-x-4 ml-8">
              <Link to="/explore" className="text-sm font-medium hover:text-primary">
                Explorar
              </Link>
              <Link to="/about" className="text-sm font-medium hover:text-primary">
                Acerca de
              </Link>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center space-x-4">
            {/* Tema */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            {/* Menú de usuario */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-4 py-2 text-sm">
                    <p className="font-medium">{user.email}</p>
                    <p className="text-muted-foreground">
                      {userType === "actor" ? "Actor/Actriz" : "Agente de Casting"}
                    </p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to={userType === "actor" ? "/actor/profile" : "/casting/profile"}>
                      Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={userType === "actor" ? "/actor/dashboard" : "/casting/dashboard"}>
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/auth/login">
                  <Button variant="ghost">Iniciar Sesión</Button>
                </Link>
                <Link to="/auth/register">
                  <Button>Registrarse</Button>
                </Link>
              </div>
            )}

            {/* Menú móvil */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Menú móvil expandido */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              to="/explore"
              className="block text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Explorar
            </Link>
            <Link
              to="/about"
              className="block text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Acerca de
            </Link>
            {!user && (
              <div className="space-y-2 pt-4">
                <Link to="/auth/login" className="block">
                  <Button variant="ghost" className="w-full">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/auth/register" className="block">
                  <Button className="w-full">Registrarse</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
} 