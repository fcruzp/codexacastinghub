import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

interface ActorProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  stage_name: string | null;
  gender: string | null;
  ethnicity: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  eye_color: string | null;
  hair_color: string | null;
  languages: string[] | null;
  skills: string[] | null;
  location_city: string | null;
  location_country: string | null;
  profile_image_url: string | null;
}

interface Filters {
  search: string;
  gender: string;
  minHeight: string;
  maxHeight: string;
  minAge: string;
  maxAge: string;
  location: string;
  skills: string;
  languages: string;
}

export default function ExploreActors() {
  const navigate = useNavigate();
  const [actors, setActors] = useState<ActorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    gender: "",
    minHeight: "",
    maxHeight: "",
    minAge: "",
    maxAge: "",
    location: "",
    skills: "",
    languages: "",
  });

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('Error al verificar sesión:', error.message);
          navigate("/auth/login");
          return;
        }

        if (!session) {
          console.log('No hay sesión activa');
          navigate("/auth/login");
          return;
        }

        // Verificar si el usuario es director
        try {
          const { data: userData, error: userDataError } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .single();

          if (userDataError) {
            console.warn('Error al verificar rol:', userDataError.message);
            navigate("/");
            return;
          }

          if (userData?.role !== "director") {
            console.log('Usuario no es director');
            navigate("/");
            return;
          }

          // Si todo está bien, cargar actores
          await loadActors();
        } catch (err) {
          console.warn('Error al verificar rol:', err);
          navigate("/");
        }
      } catch (err) {
        console.warn('Error en verificación de sesión:', err);
        navigate("/auth/login");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Cambio de estado de autenticación en ExploreActors:', event);
      
      if (event === 'SIGNED_OUT') {
        navigate("/auth/login");
      } else if (event === 'TOKEN_REFRESHED' && session) {
        // Verificar rol nuevamente
        try {
          const { data: userData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .single();

          if (userData?.role !== "director") {
            navigate("/");
          }
        } catch (err) {
          console.warn('Error al verificar rol después de refresh:', err);
          navigate("/");
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const loadActors = async () => {
    try {
      let query = supabase
        .from("actor_profiles")
        .select("*");

      // Aplicar filtros
      if (filters.search) {
        query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,stage_name.ilike.%${filters.search}%`);
      }
      if (filters.gender) {
        query = query.eq("gender", filters.gender);
      }
      if (filters.minHeight) {
        query = query.gte("height_cm", parseInt(filters.minHeight));
      }
      if (filters.maxHeight) {
        query = query.lte("height_cm", parseInt(filters.maxHeight));
      }
      if (filters.location) {
        query = query.or(`location_city.ilike.%${filters.location}%,location_country.ilike.%${filters.location}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setActors(data || []);
    } catch (err) {
      console.error("Error al cargar actores:", err);
    }
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    loadActors();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Explorar Actores</CardTitle>
          <CardDescription>
            Encuentra actores según tus criterios de búsqueda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <Input
                id="search"
                placeholder="Nombre, apellido o nombre artístico"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Género</Label>
              <Select
                value={filters.gender}
                onValueChange={(value) => handleFilterChange("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="male">Masculino</SelectItem>
                  <SelectItem value="female">Femenino</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                placeholder="Ciudad o país"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minHeight">Altura mínima (cm)</Label>
                <Input
                  id="minHeight"
                  type="number"
                  value={filters.minHeight}
                  onChange={(e) => handleFilterChange("minHeight", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxHeight">Altura máxima (cm)</Label>
                <Input
                  id="maxHeight"
                  type="number"
                  value={filters.maxHeight}
                  onChange={(e) => handleFilterChange("maxHeight", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Habilidades</Label>
              <Input
                id="skills"
                placeholder="Separadas por comas"
                value={filters.skills}
                onChange={(e) => handleFilterChange("skills", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="languages">Idiomas</Label>
              <Input
                id="languages"
                placeholder="Separados por comas"
                value={filters.languages}
                onChange={(e) => handleFilterChange("languages", e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6">
            <Button onClick={handleSearch} className="w-full">
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actors.map((actor) => (
          <div key={actor.id} className="actor-card">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {actor.profile_image_url ? (
                    <img
                      src={actor.profile_image_url}
                      alt={`${actor.first_name} ${actor.last_name}`}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-2xl text-gray-400">
                        {actor.first_name?.[0] || "?"}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold">
                      {actor.stage_name || `${actor.first_name} ${actor.last_name}`}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {actor.location_city}, {actor.location_country}
                    </p>
                    {actor.skills && actor.skills.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {actor.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800"
                          >
                            {skill}
                          </span>
                        ))}
                        {actor.skills.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{actor.skills.length - 3} más
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
} 