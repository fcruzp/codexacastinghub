import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Actor {
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

export default function CastingDashboard() {
  const navigate = useNavigate();
  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    gender: '',
    location: '',
    skills: ''
  });

  useEffect(() => {
    checkUserAndLoadActors();
  }, []);

  const checkUserAndLoadActors = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) {
        navigate("/auth/login");
        return;
      }

      const { data: userData, error: userDataError } = await supabase
        .from("casting_companies")
        .select("id")
        .eq("id", user.id)
        .single();

      if (userDataError) {
        if (userDataError.code === 'PGRST116') {
          navigate("/casting/profile");
          return;
        }
        throw userDataError;
      }

      await loadActors();
    } catch (err: any) {
      console.error("Error al verificar usuario:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
        query = query.eq('gender', filters.gender);
      }
      if (filters.location) {
        query = query.or(`location_city.ilike.%${filters.location}%,location_country.ilike.%${filters.location}%`);
      }
      if (filters.skills) {
        query = query.contains('skills', [filters.skills]);
      }

      const { data, error } = await query;

      if (error) throw error;
      setActors(data || []);
    } catch (err: any) {
      console.error("Error al cargar actores:", err.message);
      setError(err.message);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadActors();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <Button onClick={checkUserAndLoadActors} className="mt-4">Intentar de nuevo</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Explorar Actores</h1>
        <Button onClick={() => navigate("/casting/projects/new")}>Crear Nuevo Proyecto</Button>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="search">Buscar</Label>
                <Input
                  id="search"
                  placeholder="Nombre o nombre artístico"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Género</Label>
                <Select
                  value={filters.gender}
                  onValueChange={(value) => handleFilterChange('gender', value)}
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
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills">Habilidades</Label>
                <Input
                  id="skills"
                  placeholder="Buscar por habilidad"
                  value={filters.skills}
                  onChange={(e) => handleFilterChange('skills', e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" className="w-full md:w-auto">Buscar</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actors.map((actor) => (
          <Card key={actor.id}>
            <CardHeader>
              <CardTitle>
                {actor.stage_name || `${actor.first_name} ${actor.last_name}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {actor.profile_image_url && (
                  <div className="aspect-square w-full overflow-hidden rounded-lg">
                    <img
                      src={actor.profile_image_url}
                      alt={`${actor.first_name} ${actor.last_name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="text-sm">
                  <p><strong>Género:</strong> {actor.gender || 'No especificado'}</p>
                  <p><strong>Etnia:</strong> {actor.ethnicity || 'No especificada'}</p>
                  <p><strong>Ubicación:</strong> {actor.location_city}, {actor.location_country}</p>
                  {actor.skills && actor.skills.length > 0 && (
                    <div className="mt-2">
                      <strong>Habilidades:</strong>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {actor.skills.map((skill, index) => (
                          <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <Button 
                  className="w-full"
                  onClick={() => navigate(`/casting/actors/${actor.id}`)}
                >
                  Ver Perfil Completo
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {actors.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No se encontraron actores que coincidan con los criterios de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
} 