import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase/client";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";

interface ActorProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  stage_name: string | null;
  date_of_birth: string | null;
  gender: string | null;
  ethnicity: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  eye_color: string | null;
  hair_color: string | null;
  languages: string | null;
  skills: string | null;
  biography: string | null;
  location_city: string | null;
  location_country: string | null;
  contact_phone: string | null;
  agent_contact_email: string | null;
  updated_at: string | null;
}

export default function ActorProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profile, setProfile] = useState<ActorProfile | null>(null);

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
        .from("actor_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (userDataError) {
        if (userDataError.code === 'PGRST116') {
          console.warn("No se encontró perfil de actor para el usuario: ", user.id, ". Inicializando nuevo perfil.");
          setProfile({
            id: user.id,
            first_name: '',
            last_name: '',
            stage_name: '',
            date_of_birth: '',
            gender: '',
            ethnicity: '',
            height_cm: null,
            weight_kg: null,
            eye_color: '',
            hair_color: '',
            languages: '',
            skills: '',
            biography: '',
            location_city: '',
            location_country: '',
            contact_phone: '',
            agent_contact_email: '',
            updated_at: null,
          });
          setError(null);
        } else {
          console.error("Error al cargar perfil del actor:", userDataError.message);
          setError(userDataError.message);
          setProfile(null);
        }
      } else if (userData) {
        const loadedProfile: ActorProfile = {
          id: userData.id,
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          stage_name: userData.stage_name || '',
          date_of_birth: userData.date_of_birth || '',
          gender: userData.gender || '',
          ethnicity: userData.ethnicity || '',
          height_cm: userData.height_cm,
          weight_kg: userData.weight_kg,
          eye_color: userData.eye_color || '',
          hair_color: userData.hair_color || '',
          languages: userData.languages || '',
          skills: userData.skills || '',
          biography: userData.biography || '',
          location_city: userData.location_city || '',
          location_country: userData.location_country || '',
          contact_phone: userData.contact_phone || '',
          agent_contact_email: userData.agent_contact_email || '',
          updated_at: userData.updated_at,
        };
        setProfile(loadedProfile);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || profile.id === '') {
      setError("Error: No hay perfil de usuario o ID inválido.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    const updateData = {
      first_name: profile.first_name === '' ? null : profile.first_name,
      last_name: profile.last_name === '' ? null : profile.last_name,
      stage_name: profile.stage_name === '' ? null : profile.stage_name,
      date_of_birth: profile.date_of_birth === '' ? null : profile.date_of_birth,
      gender: profile.gender === '' ? null : profile.gender,
      ethnicity: profile.ethnicity === '' ? null : profile.ethnicity,
      height_cm: profile.height_cm,
      weight_kg: profile.weight_kg,
      eye_color: profile.eye_color === '' ? null : profile.eye_color,
      hair_color: profile.hair_color === '' ? null : profile.hair_color,
      languages: profile.languages ? profile.languages.split(',').map(lang => lang.trim()) : null,
      skills: profile.skills ? profile.skills.split(',').map(skill => skill.trim()) : null,
      biography: profile.biography === '' ? null : profile.biography,
      location_city: profile.location_city === '' ? null : profile.location_city,
      location_country: profile.location_country === '' ? null : profile.location_country,
      contact_phone: profile.contact_phone === '' ? null : profile.contact_phone,
      agent_contact_email: profile.agent_contact_email === '' ? null : profile.agent_contact_email,
    };

    try {
      if (!profile.updated_at) {
        console.log("Intentando insertar nuevo perfil...", updateData);
        const { error: insertError } = await supabase
          .from("actor_profiles")
          .insert([{ ...updateData, id: profile.id }]);

        if (insertError) throw insertError;
        setSuccess("Perfil creado exitosamente!");
      } else {
        console.log("Intentando actualizar perfil existente...", updateData);
        const { error: updateError } = await supabase
          .from("actor_profiles")
          .update(updateData)
          .eq("id", profile.id);

        if (updateError) throw updateError;
        setSuccess("Perfil actualizado exitosamente!");
      }

      checkUserAndLoadProfile();
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    setProfile(prevProfile => {
      if (!prevProfile) return null;

      if (type === 'number') {
        return { ...prevProfile, [id]: value === '' ? null : Number(value) };
      }

      return { ...prevProfile, [id]: value };
    });
  };

  const handleGenderChange = (value: string) => {
    setProfile(prevProfile => {
      if (!prevProfile) return null;
      return { ...prevProfile, gender: value };
    });
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Mi Perfil de Actor</CardTitle>
          <CardDescription>
            Actualiza tu información personal y profesional
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Nombre</Label>
                <Input
                  id="first_name"
                  value={profile.first_name || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Apellido</Label>
                <Input
                  id="last_name"
                  value={profile.last_name || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stage_name">Nombre Artístico</Label>
              <Input
                id="stage_name"
                value={profile.stage_name || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="gender">Género</Label>
                 <Select
                   value={profile.gender || ''}
                   onValueChange={handleGenderChange}
                 >
                   <SelectTrigger>
                     <SelectValue placeholder="Selecciona tu género" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="male">Masculino</SelectItem>
                     <SelectItem value="female">Femenino</SelectItem>
                     <SelectItem value="other">Otro</SelectItem>
                     <SelectItem value="prefer_not_say">Prefiero no decir</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Fecha de Nacimiento</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={profile.date_of_birth || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>

             <div className="space-y-2">
              <Label htmlFor="ethnicity">Etnia</Label>
              <Input
                id="ethnicity"
                value={profile.ethnicity || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height_cm">Altura (cm)</Label>
                <Input
                  id="height_cm"
                  type="number"
                  value={profile.height_cm ?? ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight_kg">Peso (kg)</Label>
                <Input
                  id="weight_kg"
                  type="number"
                  value={profile.weight_kg ?? ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                <Label htmlFor="eye_color">Color de Ojos</Label>
                <Input
                  id="eye_color"
                  value={profile.eye_color || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hair_color">Color de Cabello</Label>
                <Input
                  id="hair_color"
                  value={profile.hair_color || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_phone">Teléfono de Contacto</Label>
              <Input
                id="contact_phone"
                type="tel"
                value={profile.contact_phone || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location_city">Ciudad</Label>
                <Input
                  id="location_city"
                  value={profile.location_city || ''}
                  onChange={handleInputChange}
                />
              </div>
             <div className="space-y-2">
              <Label htmlFor="location_country">País</Label>
              <Input
                id="location_country"
                value={profile.location_country || ''}
                onChange={handleInputChange}
              />
            </div>
           </div>

             <div className="space-y-2">
              <Label htmlFor="agent_contact_email">Email del Agente</Label>
              <Input
                id="agent_contact_email"
                type="email"
                value={profile.agent_contact_email || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="biography">Biografía</Label>
              <Textarea
                id="biography"
                value={profile.biography || ''}
                onChange={handleInputChange as (e: React.ChangeEvent<HTMLTextAreaElement>) => void}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Habilidades (separadas por comas)</Label>
              <Input
                id="skills"
                value={profile.skills || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="languages">Idiomas (separados por comas)</Label>
              <Input
                id="languages"
                value={profile.languages || ''}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 