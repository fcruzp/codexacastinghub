import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase/client";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Alert, AlertDescription } from "../components/ui/alert";

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profile, setProfile] = useState<CastingProfile>({
    id: "",
    company_name: "",
    contact_name: "",
    website: "",
    description: "",
    location_city: "",
    location_country: "",
    updated_at: null
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No hay usuario autenticado");

      const { data, error } = await supabase
        .from("casting_companies")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      if (data) setProfile(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase
        .from("casting_companies")
        .update({
          company_name: profile.company_name,
          contact_name: profile.contact_name,
          website: profile.website === '' ? null : profile.website,
          description: profile.description === '' ? null : profile.description,
          location_city: profile.location_city === '' ? null : profile.location_city,
          location_country: profile.location_country === '' ? null : profile.location_country
        })
        .eq("id", profile.id);

      if (error) throw error;
      setSuccess("Perfil actualizado correctamente");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Cargando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Perfil de Empresa</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
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
              onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contact_name">Nombre del Contacto</Label>
            <Input
              id="contact_name"
              value={profile.contact_name}
              onChange={(e) => setProfile({ ...profile, contact_name: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location_city">Ciudad</Label>
            <Input
              id="location_city"
              value={profile.location_city || ''}
              onChange={(e) => setProfile({ ...profile, location_city: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location_country">País</Label>
            <Input
              id="location_country"
              value={profile.location_country || ''}
              onChange={(e) => setProfile({ ...profile, location_country: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Sitio Web</Label>
            <Input
              id="website"
              type="url"
              value={profile.website || ''}
              onChange={(e) => setProfile({ ...profile, website: e.target.value })}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            value={profile.description || ''}
            onChange={(e) => setProfile({ ...profile, description: e.target.value })}
            rows={4}
          />
        </div>
        
        <Button type="submit" disabled={saving}>
          {saving ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </form>
    </div>
  );
} 