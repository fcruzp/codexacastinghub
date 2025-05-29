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

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userType, setUserType] = useState<"actor" | "casting" | null>(null);

  useEffect(() => {
    console.log("Navbar useEffect: Inicializando listener de autenticación");
    // Verificar el usuario actual
    checkUser();

    // Suscribirse a los cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("onAuthStateChange Event:", event);
      console.log("onAuthStateChange Session:", session);

      if (event === 'SIGNED_IN' && session?.user) {
        console.log("Usuario ha iniciado sesión:", session.user);
        setUser(session.user);
        await checkUserType(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        console.log("Usuario ha cerrado sesión");
        setUser(null);
        setUserType(null);
        // Redirigir a la landing page después de cerrar sesión
        navigate("/page");
      }
    });

    return () => {
      console.log("Navbar useEffect: Limpiando listener de autenticación");
      subscription.unsubscribe();
    };
  }, []);

  const checkUserType = async (userId: string) => {
    try {
      console.log("Verificando tipo de usuario para userId:", userId);
      const { data: actorData } = await supabase
        .from("actor_profiles")
        .select("id")
        .eq("id", userId)
        .single();

      if (actorData) {
        console.log("Tipo de usuario: Actor");
        setUserType("actor");
      } else {
        console.log("Tipo de usuario: Casting Director");
        setUserType("casting");
      }
    } catch (error) {
      console.error("Error checking user type:", error);
    }
  };

  const checkUser = async () => {
    try {
      console.log("Verificando usuario actual...");
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      if (user) {
        console.log("Usuario actual encontrado:", user);
        setUser(user);
        await checkUserType(user.id);
      } else {
        console.log("No hay usuario actual logeado");
        setUser(null);
        setUserType(null);
      }
    } catch (error) {
      console.error("Error checking user:", error);
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
              <Link to="/browse" className="text-sm font-medium hover:text-primary">
                Explorar
              </Link>
              <Link to="/features" className="text-sm font-medium hover:text-primary">
                Funcionalidades
              </Link>
              <Link to="/pricing" className="text-sm font-medium hover:text-primary">
                Planes y Precios
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
                      {userType === "actor" ? "Actor/Actriz" : "Director de Casting"}
                    </p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to={userType === "actor" ? "/actor/profile" : "/casting/profile"}>
                      Mi Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={userType === "actor" ? "/actor/dashboard" : "/casting/dashboard"}>
                      Panel de Control
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
              to="/browse"
              className="block text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Explorar
            </Link>
            <Link
              to="/features"
              className="block text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Funcionalidades
            </Link>
            <Link
              to="/pricing"
              className="block text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Planes y Precios
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