import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface CastingProfile {
  id: string;
  company_name: string;
  contact_name: string;
  website: string | null;
  description: string | null;
  location_city: string | null;
  location_country: string | null;
  updated_at: string | null;
}

export default function CastingProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profile, setProfile] = useState<CastingProfile | null>(null);

  useEffect(() => {
    checkUserAndLoadProfile();
  }, []);

  const checkUserAndLoadProfile = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) {
        navigate("/auth/login");
        return;
      }

      const { data: userData, error: userDataError } = await supabase
        .from("casting_companies")
        .select("*")
        .eq("id", user.id)
        .single();

      if (userDataError) {
        if (userDataError.code === 'PGRST116') {
          console.warn("No se encontró perfil de empresa para el usuario: ", user.id, ". Inicializando nuevo perfil.");
          setProfile({
            id: user.id,
            company_name: '',
            contact_name: '',
            website: null,
            description: null,
            location_city: null,
            location_country: null,
            updated_at: null
          });
          setError(null);
        } else {
          console.error("Error al cargar perfil de la empresa:", userDataError.message);
          setError(userDataError.message);
          setProfile(null);
        }
      } else if (userData) {
        setProfile(userData);
        setError(null);
      } else {
        console.warn("checkUserAndLoadProfile: No se recibieron datos ni error.");
        setError("Error desconocido al cargar perfil.");
        setProfile(null);
      }
    } catch (err: any) {
      console.error("Error general en checkUserAndLoadProfile:", err.message);
      setError(err.message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updateData = {
        company_name: profile.company_name,
        contact_name: profile.contact_name,
        website: profile.website === '' ? null : profile.website,
        description: profile.description === '' ? null : profile.description,
        location_city: profile.location_city === '' ? null : profile.location_city,
        location_country: profile.location_country === '' ? null : profile.location_country,
        updated_at: new Date().toISOString()
      };

      if (!profile.updated_at) {
        console.log("Intentando insertar nuevo perfil...", updateData);
        const { error: insertError } = await supabase
          .from("casting_companies")
          .insert([{ ...updateData, id: profile.id }]);

        if (insertError) throw insertError;
        setSuccess("Perfil creado exitosamente!");
      } else {
        console.log("Intentando actualizar perfil existente...", updateData);
        const { error: updateError } = await supabase
          .from("casting_companies")
          .update(updateData)
          .eq("id", profile.id);

        if (updateError) throw updateError;
        setSuccess("Perfil actualizado exitosamente!");
      }

      await checkUserAndLoadProfile();
    } catch (err: any) {
      console.error("Error al guardar perfil:", err.message);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Cargando perfil...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>Error: No se pudo cargar el perfil o ocurrió un problema.</p>
          {error && <p className="text-sm">Detalle: {error}</p>}
          <Button onClick={checkUserAndLoadProfile} className="mt-4">Intentar cargar de nuevo</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Perfil de Empresa</CardTitle>
          <CardDescription>
            Actualiza la información de tu empresa de casting
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company_name">Nombre de la Empresa</Label>
                <Input
                  id="company_name"
                  value={profile.company_name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, company_name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact_name">Nombre del Contacto</Label>
                <Input
                  id="contact_name"
                  value={profile.contact_name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, contact_name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location_city">Ciudad</Label>
                <Input
                  id="location_city"
                  value={profile.location_city || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, location_city: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location_country">País</Label>
                <Input
                  id="location_country"
                  value={profile.location_country || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, location_country: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Sitio Web</Label>
                <Input
                  id="website"
                  type="url"
                  value={profile.website || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, website: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={profile.description || ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setProfile({ ...profile, description: e.target.value })}
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={saving}>
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 