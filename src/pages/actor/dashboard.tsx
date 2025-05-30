import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

interface Project {
  id: string;
  title: string;
  description: string;
  casting_company: string;
  location: string;
  deadline: string;
  status: string;
}

export default function ActorDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, [user]);

  const loadProjects = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("casting_projects")
        .select("*")
        .eq("status", "open");

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Error loading projects:", error);
      setError("Error al cargar los proyectos");
    } finally {
      setLoading(false);
    }
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
          <Button onClick={loadProjects} className="mt-4">Intentar de nuevo</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Proyectos Disponibles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{project.description}</p>
                <div className="text-sm">
                  <p><strong>Empresa:</strong> {project.casting_company}</p>
                  <p><strong>Ubicación:</strong> {project.location}</p>
                  <p><strong>Fecha límite:</strong> {new Date(project.deadline).toLocaleDateString()}</p>
                </div>
                <Button className="w-full">Aplicar</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No hay proyectos disponibles en este momento</p>
          </div>
        )}
      </div>
    </div>
  );
} 