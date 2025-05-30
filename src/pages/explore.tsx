import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Calendar, MapPin, Building2, Clock, Lock, ArrowRight, Home } from "lucide-react";

interface CastingProject {
  id: string;
  company_id: string;
  title: string;
  description: string;
  role_description: string;
  location: string;
  audition_date: string;
  start_date: string;
  end_date: string;
  media_references: string[];
  created_at: string;
  status: "Open Soon" | "Open" | "Closed";
  company_name?: string;
}

interface ActorProfile {
  id: string;
  first_name: string;
  last_name: string;
  stage_name: string;
  profile_image_url: string;
  gender: string;
  ethnicity: string;
  height_cm: number;
  location_city: string;
  location_country: string;
  languages: string[];
  skills: string[];
}

export default function Explore() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"actor" | "casting_agent" | null>(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<CastingProject[]>([]);
  const [actors, setActors] = useState<ActorProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkUserType();

    // Suscribirse a cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        navigate('/page');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const checkUserType = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);
      console.log("Usuario autenticado:", user);

      const { data: userData, error: userDataError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (userDataError) {
        console.error("Error al obtener rol de usuario:", userDataError);
        throw userDataError;
      }

      console.log("Datos del usuario:", userData);
      
      // Validar que el rol de usuario sea uno de los permitidos
      if (!userData || !userData.role) {
        console.error("No se encontró el rol de usuario");
        throw new Error("No se encontró el rol de usuario");
      }

      const role = userData.role.toLowerCase();
      console.log("Rol de usuario:", role);

      if (role !== "actor" && role !== "casting_agent") {
        console.error("Rol de usuario no válido:", role);
        throw new Error(`Rol de usuario no válido: ${role}`);
      }
      
      setUserType(role);

      // Cargar datos según el rol de usuario
      if (role === "actor") {
        loadProjects();
      } else if (role === "casting_agent") {
        loadActors();
      }
    } catch (error) {
      console.error("Error en checkUserType:", error);
      setError(error instanceof Error ? error.message : "Error al cargar el rol de usuario");
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("casting_projects")
        .select(`
          *,
          casting_companies:company_id (name)
        `)
        .order("updated_at", { ascending: false });

      if (error) throw error;

      const formattedProjects = data.map(project => ({
        ...project,
        company_name: project.casting_companies?.name
      }));

      setProjects(formattedProjects);
    } catch (error) {
      console.error("Error loading projects:", error);
      setError(error instanceof Error ? error.message : "Error al cargar proyectos");
    }
  };

  const loadActors = async () => {
    try {
      const { data, error } = await supabase
        .from("actor_profiles")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setActors(data);
    } catch (error) {
      console.error("Error loading actors:", error);
      setError(error instanceof Error ? error.message : "Error al cargar actores");
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredActors = actors.filter(actor => {
    const fullName = `${actor.first_name} ${actor.last_name}`.toLowerCase();
    const stageName = actor.stage_name?.toLowerCase() || "";
    return fullName.includes(searchTerm.toLowerCase()) ||
           stageName.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <Card className="w-full max-w-2xl mx-4 border-0 shadow-xl">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              
              <h1 className="text-3xl font-bold tracking-tight">
                Acceso Restringido
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-lg mx-auto">
                Esta sección es exclusiva para usuarios registrados. Inicia sesión para acceder a todas las funcionalidades de exploración.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/auth/login")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Iniciar Sesión
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate("/page")}
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Volver al Inicio
                  <Home className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!userType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>Error: No se pudo determinar el tipo de usuario.</p>
          <Button onClick={checkUserType} className="mt-4">Intentar de nuevo</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {userType === "actor" ? "Explorar Proyectos" : "Explorar Talentos"}
        </h1>
        <div className="flex gap-4">
          <Input
            placeholder={userType === "actor" ? "Buscar proyectos..." : "Buscar talentos..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          {userType === "casting_agent" && (
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="male">Masculino</SelectItem>
                  <SelectItem value="female">Femenino</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Edad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="18-25">18-25</SelectItem>
                  <SelectItem value="26-35">26-35</SelectItem>
                  <SelectItem value="36-45">36-45</SelectItem>
                  <SelectItem value="46+">46+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {userType === "actor" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  <Badge variant={
                    project.status === "Open" ? "default" :
                    project.status === "Open Soon" ? "secondary" : "destructive"
                  }>
                    {project.status === "Open" ? "Abierto" :
                     project.status === "Open Soon" ? "Próximamente" : "Cerrado"}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Building2 className="w-4 h-4 mr-2" />
                  {project.company_name}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4 line-clamp-3">{project.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {project.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Fecha de Audición: {new Date(project.audition_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Duración: {new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}
                  </div>
                </div>
                <Button 
                  className="w-full mt-4"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  Ver Detalles
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActors.map((actor) => (
            <Card key={actor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    {actor.profile_image_url ? (
                      <img 
                        src={actor.profile_image_url} 
                        alt={`${actor.first_name} ${actor.last_name}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-2xl">
                          {actor.first_name?.[0]}{actor.last_name?.[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      {actor.stage_name || `${actor.first_name} ${actor.last_name}`}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {actor.location_city}, {actor.location_country}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Características</Label>
                    <div className="mt-1 text-sm">
                      <p>Altura: {actor.height_cm}cm</p>
                      <p>Género: {actor.gender}</p>
                      <p>Etnia: {actor.ethnicity}</p>
                    </div>
                  </div>
                  {actor.languages && actor.languages.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Idiomas</Label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {actor.languages.map((lang, index) => (
                          <Badge key={index} variant="secondary">{lang}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {actor.skills && actor.skills.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Habilidades</Label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {actor.skills.map((skill, index) => (
                          <Badge key={index} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <Button 
                    className="w-full"
                    onClick={() => navigate(`/actors/${actor.id}`)}
                  >
                    Ver Perfil Completo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 